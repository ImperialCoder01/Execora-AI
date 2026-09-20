# 🚀 Execora — AI Execution Readiness Engine
> **"From Information to Execution."**  
> *AI Day Noida — Problem Statement 02: Artificial Intelligence — AI Agent for Real-World Productivity.*

---

## 🌟 Live Production Links

- 🌐 **Primary Production Deployment (Render)**: [https://execora-ai.onrender.com](https://execora-ai.onrender.com)
- ⚡ **Serverless Deployment (Vercel)**: [https://execora-ai.vercel.app](https://execora-ai.vercel.app)
- 📡 **UptimeRobot Keep-Alive Endpoint**: `https://execora-ai.onrender.com/api/keep-alive`
- 🐙 **GitHub Repository**: [https://github.com/ImperialCoder01/Execora-AI](https://github.com/ImperialCoder01/Execora-AI)

---

## 🎯 What is Execora?

Most AI productivity tools tell you **what needs to be done**.  
**Execora checks whether the work can actually be executed.**

Execora is a production-grade **Execution Readiness Engine** built to bridge the critical gap between messy project text and real-world execution. Instead of relying on LLM guesswork for graph algorithms and readiness calculations, Execora combines:

1. **Groq LLaMA 3.3 70B**: High-speed structured information extraction, risk explanation, and grounded Q&A.
2. **Cognee Cloud**: Connected project-memory layer for semantic knowledge graph indexing and cross-document context retrieval.
3. **Supabase PostgreSQL**: Enterprise-grade application state, project records, audit history, and execution plans.
4. **Deterministic Audit Engine**: Explicit TypeScript graph algorithms (DFS cycle detection, resource concentration analysis, readiness score calculation, topological critical path traversal).

---

## 🛠️ Full Technical Stack & Architecture

### 🎨 Frontend Layer
- **Framework**: [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6.4](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **UI Components & Icons**: [Lucide React](https://lucide.dev/) (Modern UI icons)
- **Class Merging Utilities**: `clsx` + `tailwind-merge`

### ⚙️ Backend API & Serverless Layer
- **Runtime**: [Node.js v24](https://nodejs.org/)
- **Web Framework**: [Express 4.21](https://expressjs.com/)
- **Server Execution**: `tsx` (TypeScript Execute daemon)
- **Serverless Adapter**: `@vercel/node` for Vercel Serverless Functions (`api/index.ts`)
- **Middleware**: `cors`, `dotenv`

### 📄 Universal Document Parsing Engine
- **PDF Parser**: `pdf-parse` (Native server-side PDF text extraction)
- **Word Document Parser**: `mammoth` (.docx to plain text conversion)
- **Text & Data Formats**: Built-in support for TXT, Markdown, CSV, JSON, and LOG files

### 🧠 AI Reasoning & Language Models
- **AI SDK**: [`groq-sdk`](https://github.com/groq/groq-sdk-js)
- **Primary LLM Model**: `llama-3.3-70b-versatile` via Groq Cloud API
- **AI Capabilities**: Structured JSON extraction, risk explanation reasoning, grounded Q&A

### 🕸️ Connected Memory Layer (Cognee Cloud)
- **Knowledge Graph Storage**: [Cognee Cloud API](https://cognee.ai)
- **Memory API Endpoints**: `/remember` (ingest context) and `/recall` (semantic search & retrieval)
- **Resilience**: `CogneeMemoryProvider` with automatic local in-memory fallback store

### 🗄️ Database & Application State
- **Database Engine**: [Supabase PostgreSQL](https://supabase.com/)
- **Database SDK**: `@supabase/supabase-js` v2.49
- **Management API**: Direct SQL schema migration execution via Supabase Management API
- **Tables**: `projects`, `sources`, `analyses`, `tasks`, `dependencies`, `risks`, `clarifications`, `execution_plans`, `scenarios`, `source_evidence`

### 📐 Deterministic Audit & Graph Engine
- **Custom Algorithms**:
  - Depth-First Search (DFS) cycle detection (`detectCycles`)
  - Topological sort critical path traversal (`findCriticalPath`)
  - Workload concentration auditor (`findResourceConflicts`)
  - Unassigned task detector (`findUnassignedTasks`)
  - What-If delay propagation engine (`runWhatIfSimulation`)
- **Readiness Score Formula**: Explainable 0–100 score calculation with transparent penalty logging

### ☁️ Cloud Infrastructure & Hosting
- **Primary Backend Host**: [Render Web Services](https://render.yaml) (`env: node`, `buildCommand: npm install && npm run build`, `startCommand: npm run start`)
- **Serverless Host**: [Vercel](https://vercel.com/) (`vercel.json` rewrites to `/api/index.ts`)
- **24/7 Keep-Alive Monitor**: [UptimeRobot](https://uptimerobot.com/) pinging `/api/keep-alive` every 5 minutes

### 🎨 Brand & Vector Asset Pipeline
- **Vector Graphics**: Custom SVG definitions for logo, app icon, social preview banner
- **Image Processing**: `sharp` (Dynamic import with graceful fallback for headless build environments)

---

## 🏛️ System Data Flow Diagram

```
                      USER INTERFACE
              (React 19 + TypeScript + Vite)
                            │
                            ▼
                     EXECORA SIDEBAR & UI
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
        RENDER WEB BACKEND           VERCEL VITE
     (Express API on Port 10000)   (Serverless Functions)
               │                         │
      ┌────────┼─────────────────────────┘
      ▼        ▼                         ▼
    GROQ    COGNEE                 DETERMINISTIC
   AI LLM   MEMORY                GRAPH DFS ENGINE
      │        │                         │
      └────────┴────────────┬────────────┘
                            ▼
                     EXECUTION GRAPH
                            │
                     AUDIT ENGINE
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
           RISKS      CLARIFICATIONS   READINESS
             │              │              │
             └──────────────┴──────────────┘
                            ▼
                     EXECUTION PLAN
                            │
                   WHAT-IF SIMULATOR
```

---

## 🔑 Environment Variables Configuration

Configure these keys in your local `.env` or cloud dashboard (Render / Vercel):

```env
# Groq LLM API
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Cognee Cloud Memory Integration
COGNEE_API_KEY=your_cognee_api_key_here
COGNEE_BASE_URL=https://tenant-b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1.aws.cognee.ai
COGNEE_TENANT_ID=b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1
COGNEE_USER_ID=ce41d096-ae42-4af1-84c0-8449e325b33b

# Supabase Client (Frontend)
VITE_SUPABASE_URL=https://btuucgpelprepadqrcbi.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Admin (Backend Server)
SUPABASE_URL=https://btuucgpelprepadqrcbi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here

PORT=10000
```

---

## 🚦 Local Development & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Frontend + Backend)
npm run dev

# 3. Test build compilation
npm run build

# 4. Start production server locally
npm run serve
```

---

## 🎬 3-Minute Hackathon Live Demo Flow

1. **Open Live App**: Go to [https://execora-ai.onrender.com](https://execora-ai.onrender.com) (or click "Launch Demo").
2. **Review Readiness**: Observe initial score **62** (`READY WITH WARNINGS`) and transparent penalty breakdown.
3. **Inspect Execution Graph**: View the 6-step dependency chain (`API Fix` → `API Test` → `Deployment` → `Screenshots` → `Presentation` → `Demo`).
4. **Answer Clarification**: Answer *"Who owns the demo video?"* with *"Vishal"*. Watch readiness animate from **62** to **82**.
5. **Run What-If Simulation**: Simulate *"Rahul delayed by 1 hour"*. See affected downstream tasks and re-calculated readiness.
6. **Grounded Q&A**: Ask *"What is blocking execution?"*. Receive evidence-backed answer citing exact meeting lines.

---

## 📜 Documentation Index

All detailed technical specifications are available in the [`/docs`](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs) directory:
- [PRD.md](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs/PRD.md): Product Requirements Document
- [ARCHITECTURE.md](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs/ARCHITECTURE.md): System Architecture Specification
- [HACKATHON_ALIGNMENT.md](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs/HACKATHON_ALIGNMENT.md): Alignment with Problem Statement 02
- [RENDER_DEPLOYMENT.md](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs/RENDER_DEPLOYMENT.md): Render + UptimeRobot Setup Guide
- [VERCEL_DEPLOYMENT.md](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs/VERCEL_DEPLOYMENT.md): Vercel Serverless Setup Guide
- [JURY_QA.md](file:///d:/LOQ/Documents/AI%20DAY%20Paytm/docs/JURY_QA.md): Comprehensive Jury Defense Q&A
