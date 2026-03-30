"""
API Routes
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import IngestRequest, IngestResponse, HealthResponse
from app.core.rag_engine import rag_engine
from app.core.vector_store import vector_store_manager
from typing import AsyncGenerator

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check service health"""
    return HealthResponse(
        status="healthy",
        message="Service is running",
        vector_store_initialized=vector_store_manager.is_initialized()
    )


@router.post("/ingest", response_model=IngestResponse)
async def ingest_content(request: IngestRequest = None, file: UploadFile = File(None)):
    """Ingest text or file content"""
    text_content = None

    # Handle file upload
    if file:
        if not file.filename.endswith('.txt'):
            raise HTTPException(status_code=400, detail="Only .txt files supported")

        content = await file.read()
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File exceeds 5MB limit")

        try:
            text_content = content.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be UTF-8 encoded")

    # Handle text input
    elif request and request.text:
        text_content = request.text

    else:
        raise HTTPException(status_code=400, detail="Provide text or file")

    if not text_content or not text_content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")

    # Process content
    try:
        result = rag_engine.ingest_text(text_content)
        return IngestResponse(
            status=result["status"],
            chunks_created=result["chunks_created"],
            message=result["message"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def generate_answer(question: str) -> AsyncGenerator[str, None]:
    """Stream answer tokens"""
    try:
        for token in rag_engine.ask_question(question):
            yield {"event": "message", "data": token}
        yield {"event": "message", "data": "[DONE]"}
    except Exception as e:
        yield {"event": "error", "data": str(e)}


@router.get("/ask")
async def ask_question(question: str = Query(..., min_length=1)):
    """Ask a question with streaming response"""
    if not vector_store_manager.is_initialized():
        raise HTTPException(status_code=400, detail="No content uploaded yet")

    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    return EventSourceResponse(generate_answer(question))


@router.post("/clear")
async def clear_vector_store():
    """Clear all stored content"""
    vector_store_manager.clear()
    return {"status": "success", "message": "Content cleared"}
