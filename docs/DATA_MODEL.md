# Data Model Specification — ActionFlow AI

## Storage Architecture Note
> **MVP Persistence Note**: ActionFlow AI MVP uses in-memory and client-side React state. It does NOT require a persistent relational or document database. Data is processed dynamically in memory upon user request.

---

## 1. Type Schema Definitions

### `PriorityLevel`
```typescript
type PriorityLevel = 'High' | 'Medium' | 'Low' | 'Unspecified';
```

### `TaskStatus`
```typescript
type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Unspecified';
```

### `TaskItem`
Represents an action item extracted from unstructured text.
```typescript
interface TaskItem {
  id: string;          // Unique task identifier (e.g., "task-1")
  title: string;       // Actionable task title
  assignee: string;    // Person, team name, or "Unassigned"
  priority: PriorityLevel;
  deadline: string;    // Extracted date/time or "Unspecified"
  status: TaskStatus;  // Task progress state
  source: string;      // Direct quote from original text
}
```

### `DeadlineItem`
Represents a scheduled event or milestone.
```typescript
interface DeadlineItem {
  event: string;       // Event or submission name
  date: string;        // Extracted date (e.g., "Tomorrow")
  time: string;        // Extracted time (e.g., "6:00 PM")
  source: string;      // Source text quote
}
```

### `DecisionItem`
Represents a confirmed team decision.
```typescript
interface DecisionItem {
  decision: string;    // Agreed decision statement
  source: string;      // Source text quote
}
```

### `EntityItem`
Represents named people, teams, tools, or dates mentioned in content.
```typescript
interface EntityItem {
  name: string;
  type: 'Person' | 'Team' | 'Tool' | 'Date' | 'Other';
}
```

### `ActionStep`
Represents a step in the prioritized execution plan.
```typescript
interface ActionStep {
  step: number;        // Step sequence number (1, 2, 3...)
  action: string;      // Concrete action instruction
  reason: string;      // Rationale for step placement
  dependency: string;  // Prerequisite task or step
}
```

### `MissingInformationItem`
Represents an unassigned task, missing date, or unresolved issue.
```typescript
interface MissingInformationItem {
  item: string;        // Missing or ambiguous detail
  reason: string;      // Why this gap impacts execution
}
```

### `AnalysisResult`
The complete root JSON structure returned by the AI extraction engine.
```typescript
interface AnalysisResult {
  summary: string;
  tasks: TaskItem[];
  deadlines: DeadlineItem[];
  decisions: DecisionItem[];
  entities: EntityItem[];
  actionPlan: ActionStep[];
  missingInformation: MissingInformationItem[];
  confidence: number;            // 0 - 100
  confidenceReason: string;
  timestamp?: string;
  isDemo?: boolean;
}
```

### `GroundedQAResponse`
```typescript
interface GroundedQAResponse {
  question: string;
  answer: string;
  type: 'FACT' | 'RECOMMENDATION' | 'MIXED' | 'UNAVAILABLE';
  sources: string[];
  isGrounded: boolean;
}
```

---

## 2. Example Complete JSON Payload

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
      "decision": "Prioritize fixing two unresolved API issues before final demo",
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
      "reason": "API stability is required for frontend integration",
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
  "timestamp": "2026-09-20T12:00:00.000Z",
  "isDemo": true
}
```
