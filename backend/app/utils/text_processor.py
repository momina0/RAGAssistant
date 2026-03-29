"""
Text processing utilities for chunking and preprocessing
"""
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings


class TextProcessor:
    """Handles text chunking and preprocessing"""
    
    def __init__(self):
        """Initialize the text processor with configured chunk settings"""
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
            is_separator_regex=False,
        )
    
    def chunk_text(self, text: str) -> List[str]:
        """
        Split text into chunks for embedding and retrieval.
        
        Args:
            text: The input text to chunk
            
        Returns:
            List of text chunks
            
        Raises:
            ValueError: If text is empty or invalid
        """
        if not text or not text.strip():
            raise ValueError("Cannot chunk empty text")
        
        # Clean the text
        cleaned_text = self._clean_text(text)
        
        # Split into chunks
        chunks = self.text_splitter.split_text(cleaned_text)
        
        if not chunks:
            raise ValueError("Text chunking resulted in no chunks")
        
        return chunks
    
    def _clean_text(self, text: str) -> str:
        """
        Clean and normalize text before chunking.
        
        Args:
            text: Raw input text
            
        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = " ".join(text.split())
        
        # Remove any null characters
        text = text.replace("\x00", "")
        
        # Normalize line endings
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        
        return text.strip()
    
    def validate_text_length(self, text: str, min_length: int = 10) -> bool:
        """
        Validate that text meets minimum length requirements.
        
        Args:
            text: Text to validate
            min_length: Minimum required length
            
        Returns:
            True if valid, False otherwise
        """
        return len(text.strip()) >= min_length


# Create a global text processor instance
text_processor = TextProcessor()
