"""
Vector Store - FAISS-based document storage and retrieval
"""
from typing import List, Optional
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from app.core.config import settings


class VectorStoreManager:
    def __init__(self):
        self.store: Optional[FAISS] = None
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

    def add_documents(self, chunks: List[str]) -> int:
        """Add text chunks to the vector store"""
        if not chunks:
            raise ValueError("No chunks to add")

        documents = [Document(page_content=chunk) for chunk in chunks]

        if self.store is None:
            self.store = FAISS.from_documents(documents, self.embeddings)
        else:
            self.store.add_documents(documents)

        return len(chunks)

    def search(self, query: str, k: int = None) -> List[Document]:
        """Find similar documents"""
        if self.store is None:
            raise ValueError("No content stored")

        k = k or settings.TOP_K_RESULTS
        return self.store.similarity_search(query, k=k)

    def is_initialized(self) -> bool:
        return self.store is not None

    def clear(self):
        self.store = None


vector_store_manager = VectorStoreManager()
