"""
Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Models
    MODEL_NAME: str = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

    # Chunking
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))

    # Retrieval
    TOP_K_RESULTS: int = int(os.getenv("TOP_K_RESULTS", "5"))

    # LLM
    TEMPERATURE: float = 0.1
    MAX_TOKENS: int = 500

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    def validate(self):
        if not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not set in .env file")

    @property
    def prompt_template(self) -> str:
        return """Answer based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:"""


settings = Settings()
