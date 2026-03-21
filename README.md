# Knowledge Brain — Frontend

React + Vite + Tailwind CSS v4 frontend for the Knowledge Brain RAG document Q&A system. Upload documents, ask questions, and get cited answers.

## Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (dark indigo theme)
- **Font**: Inter (Google Fonts)
- **API**: Fetch-based service layer

## Quick Start
```bash
npm install
npm run dev
```

Requires the backend running at `http://localhost:8000` (configurable via `.env`).

## Features
- Drag & drop file upload (PDF, Excel, PowerPoint)
- Natural language question input
- Answer display with confidence badge (high/medium/low)
- Citation list with document name, page/slide, and text snippet
- Loading and error states

## Documentation
See `DOCUMENTATION_INDEX.md` for the full list of docs.
