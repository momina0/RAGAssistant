"""
API Routes for the Smart AI Support Assistant
Implements /ingest and /ask endpoints
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import IngestRequest, IngestResponse, ErrorResponse, HealthResponse
from app.core.rag_engine import rag_engine
from app.core.vector_store import vector_store_manager
import logging
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

# Create API router
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify service status.
    
    Returns:
        HealthResponse with service status
    """
    try:
        health_info = rag_engine.health_check()
        return HealthResponse(
            status="healthy",
            message="Service is running",
            vector_store_initialized=health_info["vector_store_initialized"]
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service health check failed")


@router.post("/ingest", response_model=IngestResponse)
async def ingest_content(request: IngestRequest = None, file: UploadFile = File(None)):
    """
    Ingest content endpoint. Accepts either JSON text or file upload.
    
    Args:
        request: JSON request with text content
        file: Uploaded .txt file
        
    Returns:
        IngestResponse with ingestion results
        
    Raises:
        HTTPException: If ingestion fails
    """
    try:
        text_content = None
        
        # Handle file upload
        if file:
            # Validate file type
            if not file.filename.endswith('.txt'):
                raise HTTPException(
                    status_code=400,
                    detail="Only .txt files are supported"
                )
            
            # Read file content
            content = await file.read()
            
            # Validate file size (max 5MB)
            if len(content) > 5 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail="File size exceeds 5MB limit"
                )
            
            try:
                text_content = content.decode('utf-8')
            except UnicodeDecodeError:
                raise HTTPException(
                    status_code=400,
                    detail="File must be valid UTF-8 encoded text"
                )
            
            logger.info(f"Processing uploaded file: {file.filename}")
        
        # Handle JSON text
        elif request and request.text:
            text_content = request.text
            logger.info("Processing text from JSON request")
        
        else:
            raise HTTPException(
                status_code=400,
                detail="Either 'text' field or file upload is required"
            )
        
        # Validate content
        if not text_content or not text_content.strip():
            raise HTTPException(
                status_code=400,
                detail="Content cannot be empty"
            )
        
        # Ingest the content
        result = rag_engine.ingest_text(text_content)
        
        return IngestResponse(
            status=result["status"],
            chunks_created=result["chunks_created"],
            message=result["message"]
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error during content ingestion: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process content: {str(e)}"
        )


async def generate_answer(question: str) -> AsyncGenerator[str, None]:
    """
    Async generator for streaming answer tokens via SSE.
    
    Args:
        question: User's question
        
    Yields:
        SSE-formatted response chunks
    """
    try:
        # Stream tokens from RAG engine
        for token in rag_engine.ask_question(question):
            # Format as SSE event
            yield {
                "event": "message",
                "data": token
            }
        
        # Send completion signal
        yield {
            "event": "message",
            "data": "[DONE]"
        }
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        yield {
            "event": "error",
            "data": str(e)
        }
    except Exception as e:
        logger.error(f"Error generating answer: {str(e)}")
        yield {
            "event": "error",
            "data": "Failed to generate answer. Please try again."
        }


@router.get("/ask")
async def ask_question(question: str = Query(..., min_length=1, description="Question to ask")):
    """
    Ask a question endpoint with Server-Sent Events (SSE) streaming.
    
    Args:
        question: User's question as query parameter
        
    Returns:
        EventSourceResponse with streaming answer
        
    Raises:
        HTTPException: If question is invalid or processing fails
    """
    try:
        # Validate that vector store is initialized
        if not vector_store_manager.is_initialized():
            raise HTTPException(
                status_code=400,
                detail="No content has been ingested yet. Please upload content first."
            )
        
        # Validate question
        if not question or not question.strip():
            raise HTTPException(
                status_code=400,
                detail="Question cannot be empty"
            )
        
        logger.info(f"Received question: '{question[:100]}...'")
        
        # Return SSE stream
        return EventSourceResponse(
            generate_answer(question),
            media_type="text/event-stream"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in ask endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process question: {str(e)}"
        )


@router.post("/clear")
async def clear_vector_store():
    """
    Clear the vector store (useful for testing or reset).
    
    Returns:
        Success message
    """
    try:
        vector_store_manager.clear()
        logger.info("Vector store cleared successfully")
        return {"status": "success", "message": "Vector store cleared"}
    except Exception as e:
        logger.error(f"Error clearing vector store: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear vector store: {str(e)}"
        )
