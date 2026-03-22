# Project Summary

## What is This?
The frontend for AskOrg AI. A React SPA that connects to the backend API, featuring **Feature 1: Knowledge Brain** and **Feature 2: Meeting Intelligence**.

## What it Does
1. Users drag & drop or browse to upload documents
2. System shows upload confirmation with chunk count
3. Users type natural language questions
4. System displays the AI answer with confidence level
5. Citations are shown below with document name, page, and snippet

## Architecture
- **Framework**: React 19 with Vite bundler
- **Styling**: Tailwind CSS v4 with custom dark theme
- **API Layer**: Single `api.js` module — all backend calls centralized
- **State**: React useState hooks in App.jsx (no external state library)

## Key Design Decisions
- **UI Architecture** — Two-tab single-page layout (Knowledge Brain & Meeting Intelligence).
- **Design System** — "Obsidian Intelligence" visual language featuring premium glassmorphism, dynamic glowing orbs, and deep editorial styling.
- **Centralized API** — Modular fetch calls in `services/api.js` and `services/meetingApi.js`.
- **No external state** — Relying purely on React hooks (`useState`, `useRef`).
