# Smart AI Support Assistant - Frontend

A beautiful, Ghibli-themed React frontend for the Smart AI Support Assistant with Server-Sent Events (SSE) streaming for real-time responses.

## 🎨 Features

- **Ghibli-Inspired Design**: Soft watercolor aesthetics with pastel colors
- **Cat-Themed Elements**: Playful UI with cat ears, paw prints, and soot sprites
- **Two Main Pages**:
  - **Knowledge Input**: Upload/paste content for the AI
  - **Chat Interface**: Ask questions with real-time streaming responses
- **SSE Streaming**: Character-by-character typing effect for AI responses
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **React Router**: Clean navigation between pages

## 📋 Prerequisites

- Node.js 18+ or higher
- npm or yarn
- Backend API running on `http://localhost:8000`

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)

If your backend is running on a different URL, create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

## 🚀 Building for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── KnowledgeInput.jsx    # Upload page
│   │   ├── ChatInterface.jsx     # Chat page with SSE
│   │   ├── ChatMessage.jsx       # Message bubbles
│   │   ├── LoadingSpinner.jsx    # Soot sprite loader
│   │   └── Navigation.jsx        # Header navigation
│   ├── services/
│   │   └── api.js                # Backend API client
│   ├── styles/
│   │   └── ghibli.css            # Custom Ghibli styles
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Color Palette (Ghibli Theme)

```javascript
{
  cream: '#FFF8E7',      // Soft background
  mint: '#B8E6D5',       // AI message bubbles
  sky: '#A8D8F0',        // User message bubbles
  peach: '#FFD4B8',      // Accents
  lavender: '#D4C4E0',   // User avatar bg
  sage: '#C8D5B9',       // Primary buttons
  forest: '#8FBC8F',     // Hover states
  rose: '#FFB6C1',       // Highlights
}
```

### Typography

- **Font**: Quicksand (from Google Fonts)
- **Headings**: Bold, gradient text
- **Body**: Regular weight, easy to read

### Components

#### Custom Button Classes
- `.btn-primary` - Main action buttons
- `.btn-secondary` - Secondary buttons
- `.card` - Rounded containers with soft shadows
- `.input-field` - Form inputs with Ghibli styling

#### Animations
- `float` - Gentle up/down floating
- `pulse-soft` - Soft pulsing effect
- `shimmer` - Loading shimmer
- `typing-indicator` - Three-dot bounce
- `soot-bounce` - Soot sprite loading

## 📡 API Integration

The frontend communicates with the backend via:

### REST Endpoints
- `POST /ingest` - Upload content
- `GET /health` - Check backend status

### Server-Sent Events (SSE)
- `GET /ask?question=...` - Streaming responses

### API Service (`services/api.js`)

```javascript
import { ingestText, ingestFile, askQuestion } from './services/api';

// Ingest text
await ingestText("Your content here");

// Ingest file
await ingestFile(fileObject);

// Ask question with streaming
askQuestion(
  "What is this about?",
  (token) => console.log(token),      // Each token
  () => console.log("Done"),          // Complete
  (err) => console.error(err)         // Error
);
```

## 🐱 Ghibli-Themed Elements

### Cat Ears on AI Messages
```css
.cat-ear::before {
  /* Creates triangle ear shape */
  border-bottom: 12px solid currentColor;
}
```

### Soot Sprite Loader
- Bouncing black circle with white eyes
- Cute loading animation

### Paw Print Button Icon
- 🐾 emoji decoration on buttons
- Playful interaction feedback

### Watercolor Backgrounds
- Multi-layer radial gradients
- Soft, dreamy aesthetic
- Animated floating effect

## 🧪 Testing

### Test Knowledge Input Page
1. Navigate to `http://localhost:5173/`
2. Paste sample text or upload a `.txt` file
3. Click "Process Content"
4. Verify success message and chunk count

### Test Chat Interface
1. Navigate to `http://localhost:5173/chat`
2. Ask a question related to uploaded content
3. Verify streaming typing effect works
4. Ask unrelated question → Should get "I don't have enough information"

### Test Responsive Design
- Desktop: Full layout with side-by-side elements
- Tablet: Adjusted spacing and sizing
- Mobile: Single-column layout, touch-friendly buttons

## ⚙️ Configuration

### Tailwind Config (`tailwind.config.js`)
Custom Ghibli colors, fonts, and animations

### Vite Config (`vite.config.js`)
Development server settings (port 5173)

### PostCSS Config (`postcss.config.js`)
Tailwind and Autoprefixer setup

## 🎯 Key Features Implementation

### 1. SSE Streaming with Typing Effect
```javascript
// In ChatInterface.jsx
askQuestion(
  question,
  (token) => {
    // Append each token to current message
    currentStreamRef.current += token;
    updateMessage();
  },
  () => setIsStreaming(false),
  (err) => handleError(err)
);
```

### 2. File Upload with Drag & Drop
- Visual feedback on drag over
- File type validation (.txt only)
- File size limit (5MB)

### 3. Auto-Scroll on New Messages
```javascript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

### 4. Context-Only Enforcement
- Backend enforces strict prompt
- Frontend displays "I don't have enough information" when appropriate

## 🔧 Troubleshooting

### Backend Connection Issues
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure `.env` has correct `VITE_API_URL`

### SSE Not Working
- Check if EventSource is supported in browser
- Verify backend SSE endpoint is working
- Look for network errors in DevTools

### Styling Issues
- Clear browser cache
- Rebuild Tailwind: `npm run dev`
- Check if Google Fonts loaded (Quicksand)

## 📦 Dependencies

### Production
- **react**: ^18.3.1 - UI library
- **react-dom**: ^18.3.1 - DOM rendering
- **react-router-dom**: ^6.26.0 - Routing
- **axios**: ^1.7.2 - HTTP client

### Development
- **vite**: ^5.3.1 - Build tool
- **tailwindcss**: ^3.4.4 - Utility CSS
- **@vitejs/plugin-react**: ^4.3.1 - React plugin

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`

## 📄 License

MIT License

## 🎨 Design Credits

Inspired by Studio Ghibli's soft watercolor aesthetics and whimsical character design. All emojis and icons are standard Unicode characters.

---

**Enjoy your beautiful Ghibli-themed AI assistant! 🐱✨**
