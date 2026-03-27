import os
import logging
from typing import Generator
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Basic vector store reference for our simple RAG app
vector_store = None

# We use SentenceTransformers from HuggingFace for fast local embeddings (all-MiniLM-L6-v2)
# Cache the embeddings model to avoid reloading
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Switch to available model 'tinyllama' to fix immediate 404 error.
# Suggest user 'ollama pull llama3' for higher quality answers.
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "tinyllama") 
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

# Global LLM instance to avoid re-initializing
llm_instance = None

def get_llm():
    global llm_instance
    if llm_instance is None:
        logger.info(f"Connecting to Ollama model '{OLLAMA_MODEL}' at {OLLAMA_URL}")
        llm_instance = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_URL)
    return llm_instance

def process_and_index_pdf(file_path: str) -> int:
    global vector_store
    
    logger.info(f"Loading PDF from {file_path}")
    # 1. Load PDF Document
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    # 2. Split into smaller chunks - Optimized for better context
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        length_function=len
    )
    chunks = text_splitter.split_documents(docs)
    logger.info(f"Generated {len(chunks)} chunks.")

    # 3. Create or update FAISS Vector Database
    if vector_store is None:
        logger.info("Initializing new FAISS db")
        vector_store = FAISS.from_documents(chunks, embeddings)
    else:
        logger.info("Adding chunks to existing FAISS db")
        vector_store.add_documents(chunks)
        
    return len(chunks)

def answer_query_stream(query: str) -> Generator[str, None, None]:
    global vector_store
    
    if vector_store is None:
        yield "Error: No PDF uploaded yet. Please upload a document first."
        return

    llm = get_llm()

    # Retrieve top chunks for context - k=4 for better coverage
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    relevant_docs = retriever.invoke(query)
    
    context = "\n\n".join([doc.page_content for doc in relevant_docs])

    # Improved Prompt for better correctness and focus
    template = """
    <DOCUMENTS>
    {context}
    </DOCUMENTS>
    
    Above is the document context. Answer the question below based ONLY on this context. 
    If the answer is NOT in the context, say: "I apologize, but this information is not present in the uploaded document." 
    Provide a concise and accurate answer.
    
    Question: {query}
    
    Answer:"""
    
    prompt = PromptTemplate(template=template, input_variables=["context", "query"])
    formatted_prompt = prompt.format(context=context, query=query)
    
    logger.info("Generating streaming response from Ollama")
    try:
        for chunk in llm.stream(formatted_prompt):
            yield chunk
    except Exception as e:
        logger.error(f"Ollama stream error: {e}")
        yield f"Error generating answer: {str(e)}"

# Keep old function for compatibility if needed, but point it to the stream
def answer_query(query: str) -> str:
    return "".join(list(answer_query_stream(query)))

