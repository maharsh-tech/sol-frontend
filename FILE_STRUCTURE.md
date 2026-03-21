# File Structure

```
sol-frontend/
├── .env                        # VITE_API_BASE_URL config
├── .gitignore
├── index.html                  # HTML entry point (Inter font loaded here)
├── package.json
├── vite.config.js              # Vite + React + Tailwind CSS v4 plugins
│
├── public/
│   └── vite.svg                # Favicon
│
├── src/
│   ├── main.jsx                # React DOM render entry point
│   ├── index.css               # Tailwind imports + custom theme tokens
│   ├── App.jsx                 # Main app — state management, layout
│   │
│   ├── components/
│   │   ├── FileUpload.jsx      # Drag & drop upload with file list
│   │   ├── QuestionBox.jsx     # Question input + Ask button
│   │   ├── AnswerCard.jsx      # Answer display with confidence badge
│   │   └── CitationList.jsx    # Source citations list
│   │
│   ├── services/
│   │   └── api.js              # Centralized API calls (upload, ask, health)
│   │
│   └── assets/
│       └── hero.png            # Hero image asset
│
└── dist/                       # Production build output (gitignored)
```
