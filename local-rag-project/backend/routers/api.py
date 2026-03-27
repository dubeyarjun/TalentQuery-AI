import os
import shutil
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from services import rag_service

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    # Ensure temporary upload directory exists
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    # Save Uploaded File
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Extract, chunk, and create embeddings
        num_chunks = rag_service.process_and_index_pdf(file_path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
            
    return {
        "message": "PDF securely uploaded and processed",
        "chunks_generated": num_chunks,
        "filename": file.filename
    }

from fastapi.responses import StreamingResponse

@router.post("/ask")
async def ask_question(request: QueryRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        return StreamingResponse(
            rag_service.answer_query_stream(request.query),
            media_type="text/plain"
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")
