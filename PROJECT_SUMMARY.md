# Project Summary

## What is This?
The frontend for CompanyOS Feature 1 — Knowledge Brain. A React SPA that connects to the Knowledge Brain backend API.

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
- **No routing** — single-page layout (upload + ask on one screen)
- **Centralized API** — all fetch calls in `src/services/api.js`
- **Configurable base URL** — via `VITE_API_BASE_URL` env var
- **Dark theme** — indigo/purple palette for hackathon demo impact
- **Tailwind v4** — using `@tailwindcss/vite` plugin, custom `@theme` tokens
- **No external state** — simple enough for useState, no Redux/Zustand needed
