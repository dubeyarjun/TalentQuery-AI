# TalentQuery AI - Local RAG Application

TalentQuery AI is a high-performance, private, and fully offline Retrieval-Augmented Generation (RAG) application. It allows users to upload PDF documents and interact with them using local Large Language Models (LLMs) via Ollama.

## 🚀 Features

- **Private & Local**: Your documents never leave your machine. Everything is processed locally.
- **Real-time Streaming**: Instant response generation using a streaming architecture for a "live" chat experience.
- **Premium UI/UX**: Modern dark-mode interface with glassmorphism, smooth animations, and a violet-themed aesthetic.
- **Advanced RAG Pipeline**: Uses FAISS for efficient vector search and LangChain for orchestral RAG logic.
- **Secured Access**: Integrated API Key authentication for development and production.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Orchestration**: [LangChain](https://www.langchain.com/)
- **Vector Database**: [FAISS (Facebook AI Similarity Search)](https://github.com/facebookresearch/faiss)
- **Embeddings**: HuggingFace `all-MiniLM-L6-v2`
- **LLM Engine**: [Ollama](https://ollama.com/)

### Frontend
- **Framework**: [React](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Communication**: Fetch API (Streaming) & Axios

---

## 📂 Project Structure

```text
local-rag-project/
├── backend/                # FastAPI Application
│   ├── main.py             # Entry point, Middleware & API Key logic
│   ├── requirements.txt    # Python dependencies
│   ├── routers/            
│   │   └── api.py          # PDF Upload & /ask endpoints
│   ├── services/           
│   │   └── rag_service.py  # PDF loading, Chunking, Indexing & RAG logic
│   └── temp_uploads/       # Temporary folder for PDF processing
│
├── frontend/               # React Application (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main state management & streaming logic
│   │   ├── components/
│   │   │   ├── Sidebar.jsx # File upload, API Key & Status UI
│   │   │   └── ChatArea.jsx# Premium message bubbles & scroll logic
│   │   ├── index.css       # Custom animations & glassmorphism styles
│   │   └── main.jsx        # React root
│   ├── tailwind.config.js  # Custom violet/slate theme tokens
│   └── package.json        # Node.js dependencies
│
└── run_dev.ps1             # PowerShell script to start both servers
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Ollama**: [Download here](https://ollama.com/download)

### 2. Ollama Configuration
Pull the required models:
```bash
ollama pull llama3
ollama pull tinyllama
```
*Note: `tinyllama` is the default for low-resource environments, while `llama3` provides superior accuracy.*

### 3. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

---

## 🏃 Running the Application

You can use the provided PowerShell script to start both the backend and frontend simultaneously:

```powershell
.\run_dev.ps1
```

Or start them manually:
- **Backend**: `cd backend && uvicorn main:app --reload` (Runs on `http://localhost:8000`)
- **Frontend**: `cd frontend && npm run dev` (Runs on `http://localhost:5173`)

---

## 🔒 Security
The application includes a development API Key by default. You can configure this in `backend/main.py` or via environment variables.

- **Default Key**: `my-secret-dev-key`
- **Header**: `X-API-Key`
