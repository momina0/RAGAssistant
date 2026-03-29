"""
Smart AI Support Assistant - FastAPI Application
Main entry point for the backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Smart AI Support Assistant",
    description="A context-aware AI chatbot with RAG capabilities using Groq and FAISS",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="", tags=["RAG"])


@app.on_event("startup")
async def startup_event():
    """
    Application startup event.
    Validates configuration and initializes components.
    """
    logger.info("=" * 60)
    logger.info("Starting Smart AI Support Assistant")
    logger.info("=" * 60)
    
    try:
        # Validate settings
        settings.validate()
        logger.info("✓ Configuration validated")
        logger.info(f"✓ Model: {settings.MODEL_NAME}")
        logger.info(f"✓ Embedding Model: {settings.EMBEDDING_MODEL}")
        logger.info(f"✓ Chunk Size: {settings.CHUNK_SIZE}")
        logger.info(f"✓ Top-K Results: {settings.TOP_K_RESULTS}")
        
        # Log CORS origins
        logger.info(f"✓ CORS enabled for: {', '.join(settings.ALLOWED_ORIGINS)}")
        
        logger.info("=" * 60)
        logger.info("🚀 Application started successfully!")
        logger.info(f"📚 API docs available at: http://{settings.HOST}:{settings.PORT}/docs")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {str(e)}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event.
    Cleanup resources if needed.
    """
    logger.info("Shutting down Smart AI Support Assistant")


@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Smart AI Support Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "ingest": "/ingest (POST)",
            "ask": "/ask?question=<your_question> (GET)",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level="info"
    )
