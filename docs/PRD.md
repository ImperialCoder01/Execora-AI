# 📄 Product Requirements Document (PRD) — Execora
> **Execora: AI Execution Readiness Engine**

## 1. Vision & Purpose
Execora is designed for fast-moving engineering teams and hackathon participants who need to determine if project plans can actually be executed without failure. Unlike task extraction tools that produce passive lists, Execora computes a deterministic graph readiness score, detects cycles and workload bottlenecks, asks high-impact clarification questions, and simulates delay risks.

## 2. Target Users
- Hackathon teams & Solo developers needing rapid execution validation.
- Project managers & Engineering leads managing multi-task dependencies.
- Technical founders needing risk visibility before demo deadlines.

## 3. Core Capabilities
1. **Unstructured Data Ingestion**: Parse PDF, DOCX, TXT, MD, CSV, JSON, LOG files.
2. **Groq LLaMA 3.3 70B Extraction**: Structured JSON extraction for tasks, deadlines, people, requirements, and risks.
3. **Cognee Connected Memory**: Cross-document semantic graph indexing and memory recall.
4. **Deterministic Graph Audit**: DFS cycle detection, critical path calculation, and resource concentration auditor.
5. **Explainable Readiness Score (0-100)**: Transparent 4-tier score formula with penalty details.
6. **Interactive Clarification Loop**: Answer open gaps inline and dynamically recalculate graph scores.
7. **What-If Delay Simulator**: Delay propagation engine with mitigation recommendations.
8. **Grounded Q&A Chatbot**: Grounded responses with explicit source evidence links.
9. **Zero-Risk Demo Mode**: Preloaded dataset ensuring 100% presentation uptime.

## 4. Non-Functional Requirements
- **Performance**: Sub-1.5 second graph audit calculations; sub-3 second Groq LLM response times.
- **Reliability**: 100% local fallback mode if Groq, Cognee, or Supabase are offline.
- **Security**: Server-side isolation of all secret API keys (`GROQ_API_KEY`, `COGNEE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
