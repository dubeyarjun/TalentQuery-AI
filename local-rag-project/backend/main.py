import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from routers import api

# Load env variables (if any)
API_KEY = os.environ.get("API_KEY", "my-secret-dev-key") # Defaults for development
API_KEY_NAME = "X-API-Key"

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key_header: str = Depends(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid API Key",
    )

app = FastAPI(
    title="Local RAG API",
    description="Offline RAG application using FAISS, LangChain, and Ollama",
    version="1.0.0"
)

# CORS middleware for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router, and protect its endpoints with the API key dependency
app.include_router(
    api.router,
    prefix="/api",
    dependencies=[Depends(get_api_key)]
)

@app.get("/health", tags=["Health"])
async def health_check():
    """Returns the health status of the application."""
    return {"status": "healthy"}
