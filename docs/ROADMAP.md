# Product Roadmap — ActionFlow AI

---

## 🟢 MVP (Phase 1 — Current Implemented System)
* **Core Ingestion**: Text area input & plain text file drop (`.txt`/`.md`).
* **Structured Extraction**: Tasks, deadlines, decisions, assignees, priorities, and confidence score.
* **Grounded Q&A**: Fact vs Recommendation classification with source quote citations.
* **Prioritized Action Plan**: Step-by-step resolution sequence with Human-in-the-Loop approval buttons.
* **Information Gap Detection**: Automatic identification of unassigned tasks and missing dates.
* **Demo Mode**: Full offline fallback dataset guaranteeing zero-downtime presentations.

---

## 🟡 Phase 2 (Near-Term Expansion — 1 to 3 Months)
* **Persistent Workspaces**: Multi-tenant PostgreSQL database storing project history and user sessions.
* **Document Ingestion Service**: Server-side parsing for PDF, DOCX, and XLSX files.
* **Vector RAG Engine**: Qdrant / Pinecone integration for multi-document semantic search over >100k token archives.
* **Team Collaboration**: Shared workspace boards, real-time task status sync via WebSockets.
* **Integrations (Read-Only)**: Import threads directly from Slack channels and Gmail threads.

---

## 🔵 Phase 3 (Enterprise & Agentic Automation — 3 to 6 Months)
* **Agentic Tool Execution**: Function calling tools to automatically create Jira tickets, Slack reminders, and Google Calendar events upon human approval.
* **Multi-Agent Workflows**: Specialized sub-agents (e.g., Code Reviewer Agent, QA Verification Agent, Scheduling Agent).
* **Enterprise Controls**: Custom self-hosted Groq/LLaMA hardware deployment, SSO (SAML/Okta), SOC2 compliance logging.
* **Executive Analytics**: Team velocity metrics, unassigned bottleneck trends, and project risk scoring.
