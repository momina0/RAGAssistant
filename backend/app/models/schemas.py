"""
Pydantic models for request and response validation
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional


class IngestRequest(BaseModel):
    """Request model for ingesting text content"""
    text: str = Field(..., min_length=1, description="Text content to ingest")
    
    @field_validator('text')
    @classmethod
    def validate_text(cls, v: str) -> str:
        """Validate that text is not empty or just whitespace"""
        if not v.strip():
            raise ValueError("Text content cannot be empty or just whitespace")
        return v.strip()


class IngestResponse(BaseModel):
    """Response model for successful ingestion"""
    status: str = Field(default="success")
    chunks_created: int = Field(..., ge=0, description="Number of chunks created")
    message: str = Field(default="Content processed successfully")


class AskRequest(BaseModel):
    """Request model for asking questions"""
    question: str = Field(..., min_length=1, description="Question to ask")
    
    @field_validator('question')
    @classmethod
    def validate_question(cls, v: str) -> str:
        """Validate that question is not empty or just whitespace"""
        if not v.strip():
            raise ValueError("Question cannot be empty or just whitespace")
        return v.strip()


class ErrorResponse(BaseModel):
    """Response model for errors"""
    status: str = Field(default="error")
    message: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(default="healthy")
    message: str = Field(default="Service is running")
    vector_store_initialized: bool = Field(..., description="Whether vector store has content")
