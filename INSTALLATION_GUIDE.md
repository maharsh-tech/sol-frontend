# Installation Guide

## System Requirements
- Node.js 18 or higher
- npm (comes with Node.js)
- Backend server running (see sol-backend)

## Step-by-Step Installation

### 1. Install Dependencies
```bash
cd sol-frontend
npm install
```

### 2. Configure Environment
Edit `.env` if needed:
```
VITE_API_BASE_URL=http://localhost:8000
```
Change the URL only if your backend runs on a different host/port.

### 3. Start Development Server
```bash
npm run dev
```
Opens at http://localhost:5173

### 4. Build for Production (optional)
```bash
npm run build
```
Output goes to `dist/` folder.

### 5. Preview Production Build (optional)
```bash
npm run preview
```

## Troubleshooting
- **Blank page**: Check browser console for errors
- **API errors**: Ensure backend is running at the URL in `.env`
- **CORS errors**: Backend must have CORS enabled (it does by default)
- **Styles missing**: Make sure Tailwind CSS v4 + `@tailwindcss/vite` are installed
