"""
RAG Engine - Core question answering logic
"""
from typing import Generator
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from app.core.config import settings
from app.core.vector_store import vector_store_manager
from app.utils.text_processor import text_processor


class RAGEngine:
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            streaming=True,
        )
        self.prompt = PromptTemplate(
            template=settings.prompt_template,
            input_variables=["context", "question"]
        )

    def ingest_text(self, text: str) -> dict:
        """Process and store text content"""
        if not text_processor.validate_text(text):
            raise ValueError("Text too short (min 10 characters)")

        chunks = text_processor.chunk_text(text)
        chunks_added = vector_store_manager.add_documents(chunks)

        return {
            "status": "success",
            "chunks_created": chunks_added,
            "message": "Content processed"
        }

    def ask_question(self, question: str) -> Generator[str, None, None]:
        """Answer question using RAG with streaming"""
        if not vector_store_manager.is_initialized():
            raise ValueError("No content uploaded")

        if not question.strip():
            raise ValueError("Question cannot be empty")

        # Find relevant documents
        docs = vector_store_manager.search(question)
        if not docs:
            yield "I don't have enough information to answer that."
            return

        # Build context and prompt
        context = "\n\n".join([doc.page_content for doc in docs])
        prompt = self.prompt.format(context=context, question=question)

        # Stream response
        for chunk in self.llm.stream(prompt):
            if hasattr(chunk, 'content'):
                yield chunk.content

    def health_check(self) -> dict:
        return {
            "vector_store_initialized": vector_store_manager.is_initialized()
        }


rag_engine = RAGEngine()
