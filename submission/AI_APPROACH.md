# AI Approach & Hallucination Prevention — ActionFlow AI

1. **Structured Extraction**: Prompts LLaMA 3.3 70B via Groq API to convert unstructured text into schema-conforming JSON containing tasks, deadlines, decisions, entities, and confidence scores.
2. **Grounding & Evidence**: Every extracted task and decision requires an exact source quote string from the original text.
3. **Fact vs Recommendation Classification**: In Grounded Q&A, answers are tagged as `FACT` (directly quoted), `RECOMMENDATION` (derived action), `MIXED`, or `UNAVAILABLE`.
4. **Uncertainty Boundary**: When requested data is missing, the AI strictly outputs: *"I don't have enough information to determine that from the provided content."*
5. **Human Approval Gate**: Strategic action plans require explicit human button approval before any downstream execution occurs.
