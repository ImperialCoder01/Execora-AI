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

## ⚡ Key Features & Differentiators

- **0–100 Estimated Execution Readiness Score**: Explainable score computed deterministically with transparent penalty items.
- **Interactive Clarification Loop**: Identifies high-impact ambiguity gaps. Answering questions dynamically updates the graph and recalculates readiness (e.g. `62% BLOCKED` → `82% READY WITH WARNINGS`).
- **What-If Delay Simulator**: Simulates delay propagation (e.g., *"What if Rahul is delayed by 1 hour?"*), calculating affected tasks, impacted people, critical path shifts, and automated mitigations.
- **Universal Document Ingestion**: Native server-side parsing for PDF, DOCX, TXT, MD, CSV, JSON, and LOG files.
- **Grounded Q&A Engine**: Direct chat grounded in retrieved Cognee memories and source evidence, strictly enforcing `EXPLICIT`, `INFERRED`, and `UNKNOWN` certainty tiers.
- **100% Offline Demo Mode**: Zero-risk live presentations with preloaded hackathon scenario dataset even if external APIs are unreachable.

---

## 🏛️ System Architecture

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

## 🔑 Environment Variables

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
