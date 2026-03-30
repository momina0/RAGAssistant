"""
FAISS Vector Store Manager
Handles in-memory vector storage and retrieval using FAISS
"""
from typing import List, Optional
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class VectorStoreManager:
    """Manages FAISS vector store for document embeddings"""
    
    def __init__(self):
        """Initialize the vector store manager"""
        self.vector_store: Optional[FAISS] = None
        self.embeddings = None
        self._initialize_embeddings()
    
    def _initialize_embeddings(self) -> None:
        """Initialize the embedding model"""
        try:
            logger.info(f"Initializing embeddings with model: {settings.EMBEDDING_MODEL}")
            self.embeddings = HuggingFaceEmbeddings(
                model_name=settings.EMBEDDING_MODEL,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            logger.info("Embeddings initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize embeddings: {str(e)}")
            raise
    
    def create_vector_store(self, chunks: List[str]) -> int:
        """
        Create or update the vector store with new chunks.
        
        Args:
            chunks: List of text chunks to embed and store
            
        Returns:
            Number of chunks added to the vector store
            
        Raises:
            ValueError: If chunks are empty or invalid
            Exception: If vector store creation fails
        """
        if not chunks:
            raise ValueError("Cannot create vector store with empty chunks")
        
        try:
            # Convert chunks to Document objects
            documents = [Document(page_content=chunk) for chunk in chunks]
            
            if self.vector_store is None:
                # Create new vector store
                logger.info(f"Creating new vector store with {len(documents)} documents")
                self.vector_store = FAISS.from_documents(
                    documents=documents,
                    embedding=self.embeddings
                )
            else:
                # Add to existing vector store
                logger.info(f"Adding {len(documents)} documents to existing vector store")
                self.vector_store.add_documents(documents)
            
            logger.info(f"Vector store updated with {len(chunks)} chunks")
            return len(chunks)
            
        except Exception as e:
            logger.error(f"Failed to create/update vector store: {str(e)}")
            raise Exception(f"Vector store operation failed: {str(e)}")
    
    def similarity_search(self, query: str, k: int = None) -> List[Document]:
        """
        Search for similar documents in the vector store.
        
        Args:
            query: The search query
            k: Number of results to return (defaults to settings.TOP_K_RESULTS)
            
        Returns:
            List of similar documents
            
        Raises:
            ValueError: If vector store is not initialized or query is empty
        """
        if self.vector_store is None:
            raise ValueError("Vector store is not initialized. Please ingest content first.")
        
        if not query or not query.strip():
            raise ValueError("Query cannot be empty")
        
        k = k or settings.TOP_K_RESULTS
        
        try:
            logger.info(f"Searching for similar documents with query: '{query[:50]}...'")
            
            # Use similarity_search_with_score to see match quality
            results_with_scores = self.vector_store.similarity_search_with_score(query, k=k)
            
            # Log the scores for debugging
            for i, (doc, score) in enumerate(results_with_scores):
                logger.info(f"  Result {i+1}: Score={score:.4f}, Content preview: {doc.page_content[:100]}...")
            
            # Extract just the documents (without scores)
            results = [doc for doc, score in results_with_scores]
            logger.info(f"Found {len(results)} similar documents")
            return results
        except Exception as e:
            logger.error(f"Similarity search failed: {str(e)}")
            raise Exception(f"Search operation failed: {str(e)}")
    
    def is_initialized(self) -> bool:
        """Check if the vector store has been initialized with content"""
        return self.vector_store is not None
    
    def clear(self) -> None:
        """Clear the vector store (useful for testing or reset)"""
        logger.info("Clearing vector store")
        self.vector_store = None
    
    def get_store_info(self) -> dict:
        """Get information about the current vector store"""
        return {
            "initialized": self.is_initialized(),
            "embedding_model": settings.EMBEDDING_MODEL,
        }


# Create a global vector store manager instance
vector_store_manager = VectorStoreManager()
