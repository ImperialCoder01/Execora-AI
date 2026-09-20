# API Documentation — ActionFlow AI Backend

Base URL: `http://localhost:3001/api`

---

## 1. `GET /api/health`

### Description
Returns backend operational status, Groq API configuration state, and active LLM model.

### Request
* **Method**: `GET`
* **Headers**: None
* **Body**: None

### Response Example (200 OK)
```json
{
  "status": "ok",
  "service": "ActionFlow AI API",
  "groqConfigured": true,
  "model": "llama-3.3-70b-versatile",
  "timestamp": "2026-09-20T12:34:56.789Z"
}
```

---

## 2. `POST /api/analyze`

### Description
Ingests unstructured text, executes Groq LLM structured extraction, validates output schema, and returns structured work specification.

### Request
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body Parameters**:
  - `text` (string, required): Raw meeting notes, email, PRD, or document text.
  - `forceDemo` (boolean, optional): If `true`, returns pre-analyzed demo dataset.

```json
{
  "text": "AI Day hackathon preparation meeting. Vishal will finish the frontend tomorrow...",
  "forceDemo": false
}
```

### Response Example (200 OK)
```json
{
  "summary": "AI Day hackathon preparation meeting outlining critical tasks...",
  "tasks": [
    {
      "id": "task-1",
      "title": "Fix two unresolved API issues in backend",
      "assignee": "Rahul",
      "priority": "High",
      "deadline": "Today before 4 PM Review",
      "status": "In Progress",
      "source": "Rahul mentioned that the API currently has two unresolved issues..."
    }
  ],
  "deadlines": [
    {
      "event": "Team Review Meeting",
      "date": "Today",
      "time": "4:00 PM",
      "source": "There will be a team review at 4 PM today."
    }
  ],
  "decisions": [
    {
      "decision": "Prioritize fixing the two unresolved API issues before final demo",
      "source": "We should prioritize fixing those before the final demo."
    }
  ],
  "entities": [
    { "name": "Vishal", "type": "Person" },
    { "name": "Rahul", "type": "Person" }
  ],
  "actionPlan": [
    {
      "step": 1,
      "action": "Assign Rahul to resolve the 2 known backend API issues",
      "reason": "API stability is a prerequisite for frontend integration",
      "dependency": "Rahul API testing"
    }
  ],
  "missingInformation": [
    {
      "item": "Assignee for Demo Video creation",
      "reason": "Transcript explicitly states nobody has been assigned yet."
    }
  ],
  "confidence": 94,
  "confidenceReason": "High clarity in task ownership; minor gap in video owner.",
  "timestamp": "2026-09-20T12:35:00.000Z",
  "isDemo": false
}
```

### Error Responses
* **400 Bad Request**: `{ "error": "Text content is required for analysis." }`
* **500 Internal Server Error**: `{ "error": "Groq API request failed.", "fallback": { ... } }`

---

## 3. `POST /api/chat`

### Description
Answers user questions bounded strictly to original source text and analysis. Returns classification (`FACT`, `RECOMMENDATION`, `MIXED`, `UNAVAILABLE`) and quote evidence.

### Request
```json
{
  "text": "AI Day hackathon preparation meeting transcript...",
  "analysis": { /* AnalysisResult object */ },
  "question": "What should I work on first?",
  "isDemo": false
}
```

### Response Example (200 OK)
```json
{
  "question": "What should I work on first?",
  "answer": "FACT: Rahul reported two unresolved API issues. RECOMMENDATION: Fix those API issues first before the 4 PM team review.",
  "type": "MIXED",
  "sources": [
    "Rahul mentioned that the API currently has two unresolved issues.",
    "We should prioritize fixing those before the final demo."
  ],
  "isGrounded": true
}
```

---

## 4. `POST /api/action-plan`

### Description
Synthesizes action plan steps and missing information items from analysis payload.

### Request
```json
{
  "analysis": { /* AnalysisResult object */ }
}
```

### Response Example (200 OK)
```json
{
  "success": true,
  "actionPlan": [ /* ActionStep array */ ],
  "missingInformation": [ /* MissingInformationItem array */ ],
  "timestamp": "2026-09-20T12:35:10.000Z"
}
```
