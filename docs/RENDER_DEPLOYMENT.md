# 🚀 Render Deployment & UptimeRobot Keep-Alive Guide
> **Deploying Execora AI Backend on Render with 24/7 Zero-Sleep UptimeRobot Pinging**

---

## 🛠️ Step 1: Render Web Service Setup

1. **Push your repository** to GitHub or GitLab.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Web Service**.
4. Connect your GitHub/GitLab repository.
5. Configure the web service settings:

| Setting | Value |
|---|---|
| **Name** | `execora-backend` |
| **Region** | Oregon (or closest region) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free (or Starter) |

---

## 🔑 Step 2: Configure Render Environment Variables

In the Render Web Service dashboard, navigate to **Environment** and add the following keys:

```env
NODE_ENV=production
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

COGNEE_API_KEY=your_cognee_api_key_here
COGNEE_BASE_URL=https://tenant-b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1.aws.cognee.ai
COGNEE_TENANT_ID=b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1
COGNEE_USER_ID=ce41d096-ae42-4af1-84c0-8449e325b33b

VITE_SUPABASE_URL=https://btuucgpelprepadqrcbi.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

SUPABASE_URL=https://btuucgpelprepadqrcbi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
```

---

## ⚡ Step 3: Setting Up UptimeRobot (24/7 Keep-Alive)

Render's free tier puts instances to sleep after 15 minutes of inactivity. Execora includes a dedicated **keep-alive endpoint** specifically optimized for UptimeRobot.

1. Create a free account on [UptimeRobot](https://uptimerobot.com).
2. Click **+ Add New Monitor**.
3. Configure monitor settings:

| Setting | Value |
|---|---|
| **Monitor Type** | `HTTP(s)` |
| **Friendly Name** | `Execora Backend Keep-Alive` |
| **URL (or IP)** | `https://your-app-name.onrender.com/api/keep-alive` |
| **Monitoring Interval** | `Every 5 minutes` (or 10 minutes) |

4. Click **Create Monitor**.

### How Keep-Alive Works:
Every 5 minutes, UptimeRobot sends a lightweight HTTP request to `https://your-app-name.onrender.com/api/keep-alive`.  
Execora returns HTTP 200:
```json
{
  "status": "alive",
  "message": "Execora Backend instance active and responding to UptimeRobot ping",
  "uptimeSeconds": 86400,
  "timestamp": "2026-09-20T14:06:00.000Z"
}
```
This prevents Render from ever sleeping, keeping your API instance **100% active and fast 24/7**!
