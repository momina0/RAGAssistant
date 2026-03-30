"""
Pydantic schemas for API requests/responses
"""
from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    text: str = Field(..., min_length=1)


class IngestResponse(BaseModel):
    status: str = "success"
    chunks_created: int
    message: str = "Content processed"


class HealthResponse(BaseModel):
    status: str = "healthy"
    message: str = "Service is running"
    vector_store_initialized: bool
