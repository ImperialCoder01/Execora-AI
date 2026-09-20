# 🏛️ Jury Defense Q&A — Execora

### Q1: Why not just use ChatGPT or Claude?
**Answer**: Generic LLMs list tasks passively. They cannot reliably calculate graph properties, detect cycles deterministically, or explain readiness scores. Execora uses Groq for language understanding, but offloads graph cycle detection, workload concentration analysis, and readiness formulas to deterministic TypeScript algorithms.

### Q2: What is Cognee's role in Execora?
**Answer**: Cognee provides connected project memory. Rather than treating every document as isolated text, Cognee builds a persistent semantic graph across documents, allowing Execora to recall cross-document dependencies and answer complex relationship queries.

### Q3: How is the Estimated Execution Readiness score calculated?
**Answer**: We start with a baseline score of 100 and apply explainable penalties:
- Circular dependency: -25
- Unassigned critical task: -15
- Resource overload: -10
- Critical unresolved blocker: -20
- Deadline ambiguity: -5
Scores 90-100 are `READY`, 60-89 are `READY WITH WARNINGS`, and 0-59 are `BLOCKED`.

### Q4: How do you prevent AI hallucination?
**Answer**: Every extracted item is tagged with a certainty rating: `EXPLICIT` (directly stated), `INFERRED` (derived), or `UNKNOWN` (missing). If the source text does not mention an owner or duration, Execora explicitly tags it as unknown rather than inventing data.

### Q5: What happens if Groq, Cognee, or Supabase are offline?
**Answer**: Execora features a 100% offline Demo Mode and local in-memory fallback providers. If external cloud services fail or time out, Execora seamlessly switches to local memory and deterministic graph execution without crashing or displaying blank screens.
