# 🏗️ Architecture Specification — Execora

## 1. System Overview
Execora uses a hybrid architecture combining LLM-based structured extraction with deterministic graph algorithms and connected memory graph indexing.

```
USER INTERFACE (React 19 + TypeScript + Vite)
      │
      ▼
BACKEND API SERVER (Express / Vercel Serverless)
      │
 ┌────┼───────────────────────────┐
 ▼    ▼                           ▼
GROQ COGNEE CLOUD            SUPABASE DB
LLM  MEMORY GRAPH            POSTGRESQL STATE
 │    │                           │
 └────┴─────────────┬─────────────┘
                    ▼
          DETERMINISTIC GRAPH DFS
          & AUDIT ENGINE
                    │
                    ▼
          EXECUTION GRAPH & READINESS
```

## 2. Module Responsibilities
- **Groq LLaMA 3.3 70B**: Unstructured text parsing, risk explanation, grounded Q&A.
- **Cognee Cloud**: Project memory namespace, relationship-aware recall (`/remember`, `/recall`).
- **Deterministic Engine**: Dependency graph construction, cycle detection (DFS), readiness scoring (0-100), delay simulation.
- **Supabase PostgreSQL**: Persistent project state, tasks, dependencies, risks, clarifications, scenarios.

## 3. Data Flow
1. User uploads document or text.
2. Server sends text to Cognee (`/remember`) and Groq extraction prompt simultaneously.
3. Extracted JSON is passed to the Deterministic Engine.
4. Deterministic Engine computes cycle detection, unassigned tasks, resource overload, and readiness score.
5. Score and execution graph rendered in React UI.
6. User answers clarification question -> graph re-audited -> readiness score recalculated in real-time.
