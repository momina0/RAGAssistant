"""
Text Processor - Chunking and text utilities
"""
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings


class TextProcessor:
    def __init__(self):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    def chunk_text(self, text: str) -> List[str]:
        """Split text into chunks"""
        if not text.strip():
            raise ValueError("Empty text")

        # Clean text
        text = " ".join(text.split())
        text = text.replace("\x00", "")

        chunks = self.splitter.split_text(text)
        if not chunks:
            raise ValueError("No chunks created")

        return chunks

    def validate_text(self, text: str, min_length: int = 10) -> bool:
        """Check if text meets minimum length"""
        return len(text.strip()) >= min_length


text_processor = TextProcessor()
