# Smart AI Support Assistant - Backend

A FastAPI-based backend for a context-aware AI chatbot using RAG (Retrieval-Augmented Generation) with Groq and FAISS.

## 🚀 Features

- **RAG Pipeline**: Ingest documents and answer questions using retrieved context
- **Groq Integration**: Lightning-fast LLM inference with `llama-3.1-70b-versatile`
- **FAISS Vector Store**: Efficient in-memory similarity search
- **Strict Context Control**: Enforces answers only from provided content
- **SSE Streaming**: Real-time streaming responses for better UX
- **Clean Architecture**: Modular, testable, and maintainable code

## 📋 Prerequisites

- Python 3.9 or higher
- Groq API key ([Get one here](https://console.groq.com))

## 🛠️ Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

## 🚀 Running the Server

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Service is running",
  "vector_store_initialized": true
}
```

### 2. Ingest Content

**Option A: JSON Text**
```http
POST /ingest
Content-Type: application/json

{
  "text": "Your content here..."
}
```

**Option B: File Upload**
```http
POST /ingest
Content-Type: multipart/form-data

file: your_file.txt
```

**Response:**
```json
{
  "status": "success",
  "chunks_created": 15,
  "message": "Content processed successfully"
}
```

### 3. Ask Question (SSE Streaming)

```http
GET /ask?question=What is this about?
```

**Response:** Server-Sent Events stream
```
data: This
data: is
data: about
data: ...
data: [DONE]
```

### 4. Clear Vector Store

```http
POST /clear
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py            # API endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Configuration
│   │   ├── rag_engine.py        # RAG pipeline
│   │   └── vector_store.py      # FAISS manager
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py           # Pydantic models
│   └── utils/
│       ├── __init__.py
│       └── text_processor.py    # Text chunking
├── requirements.txt
├── .env.example
└── README.md
```

## ⚙️ Configuration

All configuration is managed through environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | *Required* |
| `MODEL_NAME` | Groq model to use | `llama-3.1-70b-versatile` |
| `EMBEDDING_MODEL` | Sentence transformer model | `sentence-transformers/all-MiniLM-L6-v2` |
| `CHUNK_SIZE` | Text chunk size | `1000` |
| `CHUNK_OVERLAP` | Chunk overlap | `200` |
| `TOP_K_RESULTS` | Number of chunks to retrieve | `3` |

## 🔒 Strict Context Control

The system uses strict prompt engineering to ensure answers come ONLY from the provided context:

```python
If the context does not contain enough information to answer the question, 
you MUST respond with EXACTLY:
"I don't have enough information to answer that."
```

## 🧪 Testing

### Test Ingestion
```bash
curl -X POST "http://localhost:8000/ingest" \
  -H "Content-Type: application/json" \
  -d '{"text": "The capital of France is Paris. It is known for the Eiffel Tower."}'
```

### Test Question Answering
```bash
curl "http://localhost:8000/ask?question=What%20is%20the%20capital%20of%20France?"
```

### Test Context Boundary
```bash
curl "http://localhost:8000/ask?question=What%20is%20the%20capital%20of%20Germany?"
# Should return: "I don't have enough information to answer that."
```

## 📝 Error Handling

- **400 Bad Request**: Invalid input (empty text, wrong file format)
- **500 Internal Server Error**: Processing errors (Groq API issues, vector store errors)

All errors return structured JSON:
```json
{
  "detail": "Error message"
}
```

## 🔧 Development

### Enable Debug Logging

Set logging level in `main.py`:
```python
logging.basicConfig(level=logging.DEBUG)
```

### Hot Reload

The `--reload` flag enables automatic reload on code changes.

## 📦 Dependencies

Key dependencies:
- **FastAPI**: Modern web framework
- **LangChain**: RAG orchestration
- **Groq**: LLM inference
- **FAISS**: Vector similarity search
- **Sentence Transformers**: Embeddings
- **SSE-Starlette**: Server-Sent Events support

## 🤝 Integration with Frontend

The backend is designed to work with the React frontend:
- CORS enabled for `localhost:5173` (Vite default)
- SSE streaming for real-time responses
- JSON API for easy integration

## 📄 License

MIT License

## 🙋 Support

For issues or questions, please check:
- API documentation at `/docs`
- Logs in the console output
- Configuration in `.env` file
