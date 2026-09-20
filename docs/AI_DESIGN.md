# AI System Design — ActionFlow AI

## 1. AI Objective
The core objective of ActionFlow AI is to transform unstructured natural language (meeting syncs, PRDs, emails) into deterministic, schema-enforced JSON work specifications while guaranteeing zero hallucination during Q&A.

## 2. Model Selection & Rationale
* **Provider**: Groq API
* **Selected Model**: `llama-3.3-70b-versatile` (Fallback: `llama3-70b-8192` / `mixtral-8x7b-32768`)
* **Why Groq & LLaMA 3.3 70B**:
  - **Ultra-Low Latency**: Groq Llama 3.3 70B generates structured JSON responses in <1.2 seconds, crucial for real-time hackathon interaction.
  - **Native JSON Mode**: Supports `response_format: { type: "json_object" }` ensuring valid JSON syntax.
  - **Reasoning Capacity**: 70B parameter density provides high accuracy in complex entity and dependency extraction.

## 3. Prompt Architecture & Structured Extraction

### Extraction System Prompt Design
The extraction system prompt enforces 5 key constraints:
1. **Schema Compliance**: Forces output to mirror the `AnalysisResult` JSON object strictly.
2. **Grounding Constraint**: Extracted tasks, deadlines, and decisions must include exact quote `source` strings from original text.
3. **Null Handling**: Missing assignees or deadlines must be explicitly marked as `"Unassigned"` or `"Unspecified"`.
4. **Information Gap Detection**: Explicitly list ambiguous statements or missing dependencies in `missingInformation`.
5. **Confidence Rating**: Calculate a 0-100 confidence score based on explicit document clarity.

```typescript
// System Prompt snippet used in server/groqService.ts
const systemPrompt = `You are ActionFlow AI, an elite AI execution assistant for productivity.
Your job is to analyze unstructured information and extract precise structured data...
CRITICAL HALLUCINATION & GROUNDING RULES:
1. NEVER invent facts, assignees, deadlines, or decisions not present in text.
2. If deadline or assignee is missing, label as "Unspecified" or "Unassigned".
3. Identify missing/ambiguous information in "missingInformation".
4. Calculate a realistic confidence score (0-100) and justify it.
...`;
```

## 4. Grounded Q&A Architecture

The Grounded Q&A engine receives:
- **Original Source Text**
- **Structured Extraction Analysis**
- **User Question**

### Fact vs Recommendation Classification
The LLM classifies its response into one of 4 categories:
- **`FACT`**: Direct information explicitly stated in the source text.
- **`RECOMMENDATION`**: Logical next step derived from task dependencies.
- **`MIXED`**: Combination of stated fact and recommended action.
- **`UNAVAILABLE`**: Explicit statement that information is missing from context.

### Uncertainty & Missing Information Standard Sentence
When requested information is absent, the system is strictly instructed to return:
> *"I don't have enough information to determine that from the provided content."*

## 5. Confidence Calculation Logic
Confidence is computed dynamically based on 4 metrics:
1. **Assignee Completeness**: % of tasks with named assignees (+25 max).
2. **Deadline Precision**: Presence of explicit dates vs relative expressions (+25 max).
3. **Source Quote Density**: Ability to ground every task in source quotes (+25 max).
4. **Ambiguity Penalty**: Penalty for high count of unresolved gaps (-10 per major gap).

## 6. Failure & Rate Limit Handling
* **API Failure Graceful Degradation**: If Groq API returns a network error, rate limit (HTTP 429), or invalid JSON, the server intercepts the exception and returns `isDemo: true` fallback data.
* **Client UI Safety**: The React client handles backend failures cleanly without breaking page layout.

## 7. Future AI Roadmap Architecture

### Phase 2: Vector RAG Architecture
For documents exceeding context windows (>128k tokens):
- **Chunking**: Recursive character text splitting (500 token chunks with 50 overlap).
- **Embeddings**: Fast local or API embeddings (`text-embedding-3-small`).
- **Vector DB**: Pinecone or Qdrant for semantic similarity search.

### Phase 3: Agentic Tool Execution
- **Function Calling**: Equip LLM with tools (`create_jira_issue`, `send_slack_message`, `create_calendar_event`).
- **Human Approval Gate**: Require human confirmation in ActionFlow UI before tool invocation.
