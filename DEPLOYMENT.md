# Deployment Guide

## Recommended setup

- Frontend: Vercel
- Backend: Render Web Service

This split is the easiest option for a beginner because:
- Vercel is very smooth for Next.js projects.
- Render has a straightforward Flask web service flow.
- Both work well with GitHub-based deploys.

## What changed in the code

- The backend now exposes `POST /api/chat`.
- The backend also exposes `GET /api/health` for health checks.
- CORS is controlled by `CORS_ALLOWED_ORIGINS`.
- The frontend reads `NEXT_PUBLIC_API_BASE_URL`.
- The chat UI now sends JSON instead of query strings.
- `gunicorn` was added for production startup.

## Local development

### Frontend

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
```

Run:

```bash
npm run dev
```

### Backend

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Run:

```bash
backend\.venv\Scripts\python.exe backend\app.py
```

## Render backend deployment

### Option A: Dashboard setup

1. Push this repo to GitHub.
2. In Render, create a new Web Service.
3. Connect your GitHub repository.
4. Set the service root directory to `backend`.
5. Use these commands:

```text
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

6. Add these environment variables in Render:

```text
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-2.5-flash
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

7. Deploy the service.
8. After deploy finishes, open:

```text
https://your-render-service.onrender.com/api/health
```

You should see a JSON response with `ok: true`.

### Option B: Blueprint

If you want Render to read settings from the repo automatically, use the included `render.yaml`.

## Vercel frontend deployment

1. Import the GitHub repository into Vercel.
2. Keep the project root as the repository root.
3. Add this environment variable in Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://your-render-service.onrender.com
```

4. Deploy the project.

After the Vercel deploy completes, the frontend will call:

```text
https://your-render-service.onrender.com/api/chat
```

## Order of deployment

1. Deploy the backend on Render first.
2. Copy the Render service URL.
3. Add that URL to Vercel as `NEXT_PUBLIC_API_BASE_URL`.
4. Redeploy the frontend on Vercel.
5. Update Render `CORS_ALLOWED_ORIGINS` to your real Vercel domain if needed.

## Railway alternative

Railway is also workable, but for a beginner it is a little less obvious than:
- Vercel for the frontend
- Render for the Flask backend

If you choose Railway for the backend, the same app structure still works. You would still need:
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `CORS_ALLOWED_ORIGINS`

And your frontend would still use:
- `NEXT_PUBLIC_API_BASE_URL`

## Important note about profile content

The chatbot answer quality depends on `backend/profile.txt`.
If that file contains broken text, the deployed chatbot will answer poorly even if deployment succeeds.
