# RAG Assistant

A simple AI chatbot that answers questions based on content you provide. Upload text or a file, then ask questions about it.

## Tech Stack

**Frontend**

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**

- Python 3.9+
- FastAPI
- LangChain
- FAISS (vector store)
- Groq API (LLM)
- Sentence Transformers (embeddings)

## Setup Instructions

### Backend

```bash
cd backend


python -m venv venv
venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt

# add your groq api key to .env file
# GROQ_API_KEY=your_key_here

# run the server
python -m uvicorn app.main:app --reload --port 8000
```

Backend runs at http://localhost:8000

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at http://localhost:5173

## Assumptions

- Users will upload text content in English
- Only .txt files are supported for upload (max 5MB)
- The AI will only answer based on the uploaded content, not general knowledge
- Groq API key is required for the LLM to work
- Both frontend and backend need to be running for the app to work
- Vector store is in-memory, so uploaded content is lost when backend restarts
