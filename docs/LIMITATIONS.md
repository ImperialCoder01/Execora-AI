# Limitations & Tradeoffs — ActionFlow AI

---

## 1. Current Implementation Limitations

### LLM Dependency & Network Availability
* **Limitation**: Real-time extraction relies on the availability and latency of the external Groq API cloud.
* **Mitigation**: Implemented an instant offline Demo Mode (`src/data/demoAnalysis.ts`) that intercepts API network errors and falls back gracefully.

### Input Document Format & Length Limits
* **Limitation**: Ingestion is optimized for plain text (`.txt`/`.md`) up to 50,000 characters. Large PDF parsing runs client-side text extraction.
* **Mitigation**: Document upload feature automatically extracts raw plain text before payload submission. Phase 2 will introduce server-side PDF OCR parsing.

### Memory & Persistence Boundary
* **Limitation**: The MVP operates in transient client React state and server in-memory storage. State resets upon page hard reload.
* **Mitigation**: Included a 1-click **"Today's Plan"** modal allowing users to instantly copy Markdown agendas or export JSON state files to disk.

### Execution Capability Boundary
* **Limitation**: ActionFlow AI MVP suggests and structures execution steps, but does NOT directly call external Jira or Slack APIs to create live tickets.
* **Mitigation**: Added a **Human Approval UI** to demonstrate the exact gate step where automated API calls will execute in Phase 3.

### Context Size Limits
* **Limitation**: Input documents exceeding 128k tokens cannot be processed in a single prompt call without context clipping.
* **Mitigation**: Phase 2 RAG architecture will chunk large documents into 500-token embeddings.

---

## 2. Technical Risk Matrix

| Risk | Severity | Impact | Implemented Mitigation |
| :--- | :---: | :---: | :--- |
| **API Key Leakage** | High | Critical | Server-side Express proxy handles all API keys; `.env` is git-ignored. |
| **Model Hallucination** | High | High | System prompt requires exact source quotes for tasks; Grounded Q&A checks quotes. |
| **JSON Parse Failures** | Medium | Medium | Groq JSON mode + custom runtime sanitizer (`src/utils/validator.ts`). |
| **Network Outage During Demo** | High | High | Offline Demo Mode switchable with 1 click. |
