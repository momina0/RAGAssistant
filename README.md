# 🐱 Smart AI Support Assistant

A beautiful, context-aware AI chatbot with RAG (Retrieval-Augmented Generation) capabilities. Features a playful Ghibli-themed UI with watercolor aesthetics and cat-themed elements, powered by Groq's lightning-fast LLM inference.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-FF6B6B?style=for-the-badge)

## ✨ Features

### 🎨 Frontend
- **Ghibli-Inspired Design**: Soft watercolor backgrounds, pastel colors, and whimsical animations
- **Cat-Themed Elements**: Paw prints, cat ears on AI messages, and soot sprite loading animations
- **Two Main Pages**:
  - **Knowledge Input Page**: Upload/paste content with drag-and-drop support
  - **Chat Interface**: Ask questions with real-time streaming responses
- **SSE Streaming**: Character-by-character typing effect for immersive UX
- **Fully Responsive**: Beautiful on desktop, tablet, and mobile

### ⚡ Backend
- **RAG Pipeline**: LangChain orchestration for document retrieval and generation
- **FAISS Vector Store**: Fast in-memory similarity search
- **Groq Integration**: Lightning-fast inference with `llama-3.1-70b-versatile`
- **Strict Context Control**: Enforces answers ONLY from provided content
- **Server-Sent Events**: Real-time streaming responses
- **Clean Architecture**: Modular, testable, and maintainable code

### 🎯 Core Capabilities
- Upload text or `.txt` files
- Automatic chunking and embedding (1000 chars, 200 overlap)
- Semantic search with top-3 retrieval
- Context-only responses (no hallucination)
- Returns exact message when context insufficient

## 📋 Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 18 or higher
- **Groq API Key**: [Get one here](https://console.groq.com)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd RAGAssistant
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

## 🎮 Usage

### Step 1: Upload Knowledge
1. Navigate to http://localhost:5173
2. **Option A**: Paste your text content in the textarea
3. **Option B**: Upload a `.txt` file (drag-and-drop supported)
4. Click "Process Content" button
5. Wait for confirmation (e.g., "15 chunks created")

### Step 2: Ask Questions
1. Click "Go to Chat" or navigate to the Chat page
2. Type your question in the input field
3. Press Enter or click "Send"
4. Watch the AI response stream in real-time with typing effect
5. Ask follow-up questions!

### Testing Context Boundaries
- **Relevant question**: "What is this document about?" → Gets accurate answer
- **Unrelated question**: "What's the weather today?" → Returns "I don't have enough information to answer that."

## 🏗️ Project Structure

```
RAGAssistant/
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── api/routes.py             # /ingest, /ask endpoints
│   │   ├── core/
│   │   │   ├── config.py             # Environment config
│   │   │   ├── rag_engine.py         # RAG pipeline
│   │   │   └── vector_store.py       # FAISS manager
│   │   ├── models/schemas.py         # Pydantic models
│   │   └── utils/text_processor.py   # Text chunking
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── KnowledgeInput.jsx    # Upload page
│   │   │   ├── ChatInterface.jsx     # Chat page
│   │   │   ├── ChatMessage.jsx       # Message bubbles
│   │   │   ├── LoadingSpinner.jsx    # Soot sprite loader
│   │   │   └── Navigation.jsx        # Header nav
│   │   ├── services/api.js           # Backend API client
│   │   ├── styles/ghibli.css         # Custom Ghibli styles
│   │   ├── App.jsx                   # Main app + routing
│   │   └── index.css                 # Tailwind + global styles
│   ├── package.json
│   ├── tailwind.config.js            # Ghibli color palette
│   └── README.md
│
├── .gitignore
└── README.md                         # This file
```

## 🔧 Configuration

### Backend Environment Variables (`.env`)

```env
GROQ_API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.1-70b-versatile
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RESULTS=3
```

### Frontend Environment Variables (optional)

```env
VITE_API_URL=http://localhost:8000
```

## 📡 API Endpoints

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check + vector store status |
| `/ingest` | POST | Upload text/file for processing |
| `/ask?question=...` | GET | Ask question (SSE streaming) |
| `/clear` | POST | Clear vector store |
| `/docs` | GET | Interactive API documentation |

### Example cURL Commands

```bash
# Health check
curl http://localhost:8000/health

# Ingest text
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"text": "Your content here"}'

# Ask question (SSE stream)
curl "http://localhost:8000/ask?question=What%20is%20this%20about?"
```

## 🎨 Design System

### Ghibli Color Palette

```javascript
{
  cream: '#FFF8E7',      // Background
  mint: '#B8E6D5',       // AI messages
  sky: '#A8D8F0',        // User messages
  peach: '#FFD4B8',      // Accents
  lavender: '#D4C4E0',   // Highlights
  sage: '#C8D5B9',       // Buttons
  forest: '#8FBC8F',     // Hover states
}
```

### Key Visual Elements

- **Watercolor Backgrounds**: Multi-layer radial gradients
- **Cat Ear Bubbles**: Triangle pseudo-elements on AI messages
- **Soot Sprite Loader**: Bouncing animation with eyes
- **Paw Print Icons**: 🐾 on buttons
- **Soft Shadows**: Multi-layer box shadows for depth
- **Float Animations**: Gentle up/down movements

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Test ingestion
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"text": "Paris is the capital of France."}'

# Test relevant question
curl "http://localhost:8000/ask?question=What%20is%20the%20capital%20of%20France?"

# Test context boundary (should return "I don't have enough information")
curl "http://localhost:8000/ask?question=What%20is%20the%20capital%20of%20Germany?"
```

### Frontend Tests

1. **Upload Page**: Test text paste, file upload, drag-and-drop
2. **Chat Page**: Test streaming, typing effect, error handling
3. **Responsive**: Test on mobile, tablet, desktop sizes
4. **Navigation**: Test routing between pages

## 🔒 Security

- Backend validates all inputs with Pydantic
- File type restrictions (.txt only)
- File size limits (5MB max)
- CORS configured for localhost only
- No sensitive data in responses
- Environment variables for secrets

## 🚀 Production Deployment

### Backend (FastAPI)

Deploy to platforms like:
- **Heroku**: Add `Procfile` with `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Railway**: Automatically detects Python and FastAPI
- **DigitalOcean**: Use App Platform with `uvicorn` command

### Frontend (React)

Deploy to platforms like:
- **Vercel**: Connect repo, set build command `npm run build`, output dir `dist`
- **Netlify**: Same as Vercel
- **GitHub Pages**: Build and deploy `dist/` folder

**Important**: Update `VITE_API_URL` to your production backend URL!

## 📦 Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangChain**: RAG orchestration
- **Groq**: LLM inference (llama-3.1-70b-versatile)
- **FAISS**: Vector similarity search
- **Sentence Transformers**: Embeddings (all-MiniLM-L6-v2)
- **SSE-Starlette**: Server-Sent Events

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client
- **EventSource**: SSE client

## 🎯 Key Implementation Details

### Strict Prompt Engineering

```python
"""
You are a helpful AI assistant. Answer the question based ONLY on the following context.

If the context does not contain enough information to answer the question, 
you MUST respond with EXACTLY:
"I don't have enough information to answer that."

Do NOT use any external knowledge. Do NOT make assumptions.

Context: {context}
Question: {question}
"""
```

### SSE Streaming Implementation

**Backend**:
```python
async def generate_answer(question):
    for token in rag_engine.ask_question(question):
        yield {"event": "message", "data": token}
    yield {"event": "message", "data": "[DONE]"}
```

**Frontend**:
```javascript
const eventSource = new EventSource(`/ask?question=${question}`);
eventSource.onmessage = (event) => {
  if (event.data === '[DONE]') {
    eventSource.close();
  } else {
    appendToken(event.data);
  }
};
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Backend Issues

**"GROQ_API_KEY is not set"**
- Make sure `.env` file exists in `backend/` directory
- Verify `GROQ_API_KEY=your_key_here` is set

**"Failed to initialize embeddings"**
- First run downloads the embedding model (~90MB)
- Check internet connection
- Wait for download to complete

### Frontend Issues

**"Backend service is unavailable"**
- Ensure backend is running on http://localhost:8000
- Check backend terminal for errors
- Verify CORS settings in `backend/app/core/config.py`

**SSE not streaming**
- Check browser console for errors
- Verify EventSource is supported (all modern browsers)
- Check network tab for streaming response

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes!

## 🙏 Acknowledgments

- **Studio Ghibli**: Design inspiration
- **Groq**: Lightning-fast LLM inference
- **LangChain**: Excellent RAG framework
- **FastAPI**: Beautiful Python web framework
- **React**: Powerful UI library

---

## 📸 Screenshots

### Knowledge Input Page
- Soft watercolor background
- Text paste area with rounded corners
- Drag-and-drop file upload zone
- Paw print process button
- Success message with chunk count

### Chat Interface
- Cat emoji avatar for AI
- User avatar (person icon)
- AI messages with cat ear bubbles (mint green)
- User messages with rounded bubbles (sky blue)
- Real-time streaming with typing effect
- Soot sprite loading animation
- Auto-scrolling message list

---

**Made with 💚 and lots of ✨ Ghibli magic**

For detailed documentation, see:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
