"""
Configuration management using environment variables
"""
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables"""
    
    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Model Configuration
    MODEL_NAME: str = os.getenv("MODEL_NAME", "llama-3.1-70b-versatile")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    
    # Chunking Configuration
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))
    
    # Retrieval Configuration
    TOP_K_RESULTS: int = int(os.getenv("TOP_K_RESULTS", "3"))
    
    # LLM Configuration
    TEMPERATURE: float = 0.1  # Low temperature for more focused responses
    MAX_TOKENS: int = 500
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS Configuration
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    def validate(self) -> None:
        """Validate that required settings are present"""
        if not self.GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is not set. Please add it to your .env file."
            )
    
    @property
    def strict_prompt_template(self) -> str:
        """
        Returns the strict prompt template that enforces context-only responses.
        This is critical for ensuring the model doesn't use external knowledge.
        """
        return """You are a helpful AI assistant. Answer the question based ONLY on the following context.

If the context does not contain enough information to answer the question, you MUST respond with EXACTLY:
"I don't have enough information to answer that."

Do NOT use any external knowledge. Do NOT make assumptions. Do NOT guess.

Context:
{context}

Question: {question}

Answer:"""


# Create a global settings instance
settings = Settings()
