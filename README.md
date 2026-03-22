# AskOrg AI — Frontend

React + Vite + Tailwind CSS frontend for AskOrg AI. Features two core modules: **Knowledge Brain** (RAG document Q&A) and **Meeting Intelligence** (Audio transcription & AI meeting analysis).

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
**Knowledge Brain:**
- Drag & drop file upload (PDF, Excel, PowerPoint)
- Natural language question input with RAG-powered cited answers

**Meeting Intelligence:**
- Audio file upload (Deepgram transcription) & raw transcript pasting
- Executive summaries, action item extraction, and key decisions
- Slack integration to post meeting briefs directly to channels

**Design:**
- Built using the "Obsidian Intelligence" design system (Dark mode, Glassmorphism, tailored typography).

## Documentation
See `DOCUMENTATION_INDEX.md` for the full list of docs.
