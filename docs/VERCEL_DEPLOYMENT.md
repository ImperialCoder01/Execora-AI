# ⚡ Vercel Serverless Deployment Guide
> **Deploying Execora AI on Vercel with Serverless Functions & Edge Capabilities**

---

## 🛠️ Step 1: Link Repository to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → select **Project**.
3. Import your GitHub repository: `ImperialCoder01/Execora-AI`.
4. Vercel will automatically detect **Vite** as the framework preset and `/api/index.ts` as the Serverless API Entrypoint.

---

## 🔑 Step 2: Configure Environment Variables in Vercel

In the Vercel Project Setup screen, expand **Environment Variables** and paste the following keys:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | `your_groq_api_key_here` |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `COGNEE_API_KEY` | `your_cognee_api_key_here` |
| `COGNEE_BASE_URL` | `https://tenant-b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1.aws.cognee.ai` |
| `COGNEE_TENANT_ID` | `b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1` |
| `COGNEE_USER_ID` | `ce41d096-ae42-4af1-84c0-8449e325b33b` |
| `VITE_SUPABASE_URL` | `https://btuucgpelprepadqrcbi.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key_here` |
| `SUPABASE_URL` | `https://btuucgpelprepadqrcbi.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key_here` |
| `SUPABASE_ACCESS_TOKEN` | `your_supabase_access_token_here` |

---

## ⚡ Step 3: Deploy & Verify

1. Click **Deploy**.
2. Vercel will build the React Vite frontend and deploy serverless functions in `api/index.ts`.
3. Your app will be live at `https://execora-ai.vercel.app` (or your custom Vercel domain).
4. Verify backend serverless health by accessing: `https://execora-ai.vercel.app/api/health`.

---

## 📄 Serverless Configuration Summary (`vercel.json`)

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    }
  ]
}
```
All `/api/*` HTTP requests are dynamically routed to `@vercel/node` serverless functions!
