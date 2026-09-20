# Problem & Solution — ActionFlow AI

## 1. Problem Statement
Every team loses valuable productivity turning raw meeting transcripts, emails, and sync notes into structured work. Tasks get lost, deadlines are missed, and unassigned work items (like demo video creation or deployment tasks) fall through the cracks. Conventional AI chatbots generate paragraphs of summary text that still require manual human effort to translate into tasks.

## 2. Solution Overview
**ActionFlow AI** automates this conversion pipeline:
1. **Ingest**: Ingests messy text or plain text documents (.txt/.md).
2. **Extract**: Executes Groq-powered schema-enforced JSON extraction to identify tasks, assignees, priorities, deadlines, and decisions with exact source quotes.
3. **Detect Gaps**: Automatically flags unassigned items and missing deadlines.
4. **Prioritize**: Generates a sequential step-by-step Action Plan with Human-in-the-Loop approval gates.
5. **Grounded Q&A**: Provides a chat assistant strictly bounded to source text, classifying responses into `FACT` vs `RECOMMENDATION` with zero hallucination.
