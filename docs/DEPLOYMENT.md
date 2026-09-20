# Deployment Guide — ActionFlow AI

## 1. Local Development Setup

### Prerequisites
* Node.js v18+ (Node.js 24 recommended)
* npm v9+

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Configure Groq API Key (Optional for live Groq mode; omit for Demo mode)
# Edit .env and set GROQ_API_KEY=gsk_...

# 4. Launch fullstack development servers (Vite on 3000 + Express on 3001)
npm run dev
```

---

## 2. Production Build & Local Production Server

```bash
# 1. Compile TypeScript and build production bundle
npm run build

# 2. Start integrated Node/Express production server
npm run serve
```
*Access application at `http://localhost:3001`.*

---

## 3. Cloud Deployment (Render / Vercel / Railway)

### Option A: Render.com (Full-Stack Node Web Service)
1. Push code repository to GitHub/GitLab.
2. Create a new **Web Service** on Render.
3. Configure build settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run serve`
4. Add Environment Variables in Render Dashboard:
   - `GROQ_API_KEY`: `gsk_your_groq_api_key`
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `PORT`: `3001`

### Option B: Vercel (Frontend + Serverless Functions)
1. Deploy `dist/` static files to Vercel.
2. Move `server/index.ts` API handlers to `/api/*.ts` Vercel Serverless Function routes.

---

## 4. Environment Verification & Health Check
After deployment, verify system health by making a GET request to:
`https://your-deployment-domain.com/api/health`

Expected Response:
```json
{
  "status": "ok",
  "service": "ActionFlow AI API",
  "groqConfigured": true,
  "model": "llama-3.3-70b-versatile"
}
```
