# Quick Reference

## Commands
| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build → dist/ |
| `npm run preview` | Preview production build |

## Components

### FileUpload
- Drag & drop zone or file picker
- Accepts: .pdf, .xlsx, .pptx
- Shows selected files with remove buttons
- Upload button with spinner state

### QuestionBox
- Text input + Ask button
- Disabled while loading
- Shows spinner during API call

### AnswerCard
- Displays the AI-generated answer
- Confidence badge: green (high), yellow (medium), red (low)

### CitationList
- Lists source citations below the answer
- Each citation shows: document name, page/sheet, snippet

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:8000 | Backend API URL |

## API Service (src/services/api.js)
| Function | Calls | Description |
|----------|-------|-------------|
| `uploadDocuments(files)` | POST /upload | Upload files for indexing |
| `askQuestion(question)` | POST /ask | Ask a question |
| `healthCheck()` | GET /health | Check backend status |

## Theme
- Dark indigo palette
- Font: Inter
- Custom Tailwind v4 theme tokens in `src/index.css`
