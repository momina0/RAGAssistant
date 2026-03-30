"""
RAG (Retrieval-Augmented Generation) Engine
Core logic for ingesting content and answering questions
"""
from typing import Generator, List
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.core.config import settings
from app.core.vector_store import vector_store_manager
from app.utils.text_processor import text_processor
import logging

logger = logging.getLogger(__name__)


class RAGEngine:
    """Main RAG engine for document ingestion and question answering"""
    
    def __init__(self):
        """Initialize the RAG engine"""
        self.llm = None
        self.prompt_template = None
        self._initialize_llm()
        self._initialize_prompt()
    
    def _initialize_llm(self) -> None:
        """Initialize the Groq LLM"""
        try:
            logger.info(f"Initializing Groq LLM with model: {settings.MODEL_NAME}")
            self.llm = ChatGroq(
                groq_api_key=settings.GROQ_API_KEY,
                model_name=settings.MODEL_NAME,
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS,
                streaming=True,  # Enable streaming for SSE
            )
            logger.info("Groq LLM initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq LLM: {str(e)}")
            raise Exception(f"LLM initialization failed: {str(e)}")
    
    def _initialize_prompt(self) -> None:
        """Initialize the strict prompt template"""
        self.prompt_template = PromptTemplate(
            template=settings.strict_prompt_template,
            input_variables=["context", "question"]
        )
        logger.info("Prompt template initialized with strict context-only instructions")
    
    def ingest_text(self, text: str) -> dict:
        """
        Ingest text content: chunk, embed, and store in vector database.
        
        Args:
            text: Raw text content to ingest
            
        Returns:
            Dictionary with ingestion results
            
        Raises:
            ValueError: If text is invalid
            Exception: If ingestion fails
        """
        try:
            # Validate text
            if not text_processor.validate_text_length(text):
                raise ValueError("Text is too short. Please provide at least 10 characters.")
            
            logger.info(f"Starting text ingestion. Text length: {len(text)} characters")
            
            # Chunk the text
            chunks = text_processor.chunk_text(text)
            logger.info(f"Text split into {len(chunks)} chunks")
            
            # Create/update vector store
            chunks_added = vector_store_manager.create_vector_store(chunks)
            
            logger.info(f"Successfully ingested {chunks_added} chunks")
            
            return {
                "status": "success",
                "chunks_created": chunks_added,
                "message": "Content processed successfully"
            }
            
        except ValueError as e:
            logger.error(f"Validation error during ingestion: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error during text ingestion: {str(e)}")
            raise Exception(f"Failed to ingest text: {str(e)}")
    
    def ask_question(self, question: str) -> Generator[str, None, None]:
        """
        Answer a question using RAG (Retrieval-Augmented Generation).
        Streams the response token by token.
        
        Args:
            question: User's question
            
        Yields:
            Response tokens as they are generated
            
        Raises:
            ValueError: If question is invalid or vector store not initialized
            Exception: If answer generation fails
        """
        try:
            # Validate that vector store is initialized
            if not vector_store_manager.is_initialized():
                raise ValueError("No content has been ingested yet. Please upload content first.")
            
            # Validate question
            if not question or not question.strip():
                raise ValueError("Question cannot be empty")
            
            logger.info(f"Processing question: '{question[:100]}...'")
            
            # Preprocess the query for better semantic matching
            enhanced_query = text_processor.preprocess_query(question)
            if enhanced_query != question:
                logger.info(f"Enhanced query: '{enhanced_query[:100]}...'")
            
            # Retrieve relevant documents using enhanced query
            relevant_docs = vector_store_manager.similarity_search(enhanced_query)
            
            if not relevant_docs:
                logger.warning("No relevant documents found for the question")
                yield "I don't have enough information to answer that."
                return
            
            # Prepare context from retrieved documents
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            logger.info(f"Retrieved {len(relevant_docs)} relevant documents")
            
            # Format the prompt
            formatted_prompt = self.prompt_template.format(
                context=context,
                question=question
            )
            
            # Stream the response
            logger.info("Generating streaming response")
            for chunk in self.llm.stream(formatted_prompt):
                if hasattr(chunk, 'content'):
                    yield chunk.content
                else:
                    yield str(chunk)
            
            logger.info("Response generation completed")
            
        except ValueError as e:
            logger.error(f"Validation error during question answering: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error during question answering: {str(e)}")
            raise Exception(f"Failed to generate answer: {str(e)}")
    
    def health_check(self) -> dict:
        """
        Check the health status of the RAG engine.
        
        Returns:
            Dictionary with health information
        """
        return {
            "llm_initialized": self.llm is not None,
            "vector_store_initialized": vector_store_manager.is_initialized(),
            "model": settings.MODEL_NAME,
            "embedding_model": settings.EMBEDDING_MODEL,
        }


# Create a global RAG engine instance
rag_engine = RAGEngine()
