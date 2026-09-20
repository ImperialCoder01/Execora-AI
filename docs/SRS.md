# Software Requirements Specification (SRS) — ActionFlow AI

## 1. Introduction
This Software Requirements Specification (SRS) documents the functional and non-functional requirements for **ActionFlow AI**, version 0.1.0.

## 2. Functional Requirements

### Ingestion & Processing
* **FR-001 (Text Ingestion)**: The system shall accept plain text input from a text area or dropped `.txt`/`.md` file up to 50KB.
* **FR-002 (AI Analysis Trigger)**: The system shall send ingestion payload to backend `/api/analyze` endpoint.
* **FR-003 (Structured JSON Parsing)**: The system shall parse and validate LLM output against the predefined `AnalysisResult` schema.

### Task & Deadline Extraction
* **FR-004 (Task Extraction)**: The system shall identify task title, assignee, priority (`High`, `Medium`, `Low`, `Unspecified`), deadline, status, and source context.
* **FR-005 (Deadline Tracking)**: The system shall identify scheduled events, dates, times, and quote evidence.
* **FR-006 (Decision Logging)**: The system shall extract explicit decision statements and original text sources.

### Grounded Reasoning & Q&A
* **FR-007 (Strict Grounded Q&A)**: The `/api/chat` endpoint shall answer questions strictly from the provided text and analysis context.
* **FR-008 (Fact vs Recommendation Classification)**: Every answer shall be tagged with `FACT`, `RECOMMENDATION`, `MIXED`, or `UNAVAILABLE`.
* **FR-009 (Uncertainty Handling)**: When information is absent, the system shall state: *"I don't have enough information to determine that from the provided content."*

### UI & Workflow Controls
* **FR-010 (Human Approval Toggle)**: Users shall be able to toggle human approval states for each step in the action plan.
* **FR-011 (Task Status Editing)**: Users shall be able to update task status between `Pending`, `In Progress`, and `Completed`.
* **FR-012 (Demo Mode Fallback)**: When `forceDemo: true` or API key is unconfigured, the system shall return `DEMO_ANALYSIS` without throwing errors.

## 3. Non-Functional Requirements

### Security & Privacy
* **NFR-001 (API Key Security)**: `GROQ_API_KEY` shall never be sent to or rendered in browser context.
* **NFR-002 (Output Sanitization)**: AI string outputs shall be rendered via safe React text nodes to prevent XSS.

### Performance & Availability
* **NFR-003 (Groq Execution Latency)**: Analysis API calls shall complete within 2.0 seconds under normal Groq API conditions.
* **NFR-004 (Offline Resilience)**: Demo Mode shall operate with zero network dependencies.

### Usability & Design
* **NFR-005 (Responsive Layout)**: UI shall render gracefully on desktop, tablet, and mobile screens (minimum 360px width).
* **NFR-006 (Accessibility & Contrast)**: UI text contrast shall meet WCAG AA standards in dark mode.
