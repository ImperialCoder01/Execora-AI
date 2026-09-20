# 3-Minute Hackathon Demo Script — ActionFlow AI

**Goal**: Deliver a tight, impactful 3-minute pitch and live walk-through to the hackathon jury for AI Day Noida.

---

## ⏱️ Timeline & Script

### 0:00 – 0:20 | Problem Statement & Hook
> *"Good morning judges! Every single day, project teams lose hundreds of hours turning messy meeting notes, Slack syncs, and emails into actual work items. Tasks get dropped, deadlines get missed, and unassigned video or deployment requirements fall through the cracks. Standard AI chatbots just write long text summaries that nobody reads. Today, we built **ActionFlow AI** — an execution assistant that turns messy information into verified, executable work."*

---

### 0:20 – 0:50 | Input & Ingestion (Live Demo)
*(Action: Click "Load Demo Data" button in top right)*
> *"Let's look at a real scenario: our AI Day hackathon sync meeting notes from this morning. Watch as I click 'Load Demo Data'. In less than 1 second, ActionFlow AI ingests the unstructured transcript and passes it through our Groq-powered LLaMA 3.3 70B extraction engine."*

---

### 0:50 – 1:30 | Structured Extraction & Metrics
*(Action: Point to Dashboard metrics and Task Cards)*
> *"Notice what ActionFlow extracted automatically: 6 distinct tasks, 2 strict deadlines, 2 team decisions, and a transparent **94% AI Confidence Score**. Look closely at the tasks: Vishal is assigned to frontend, Sahil to presentation, Rahul to backend API testing. But look at Task 5 — ActionFlow automatically detected an **Unassigned Gap** for the Demo Video, flagging it in red before it damages our submission tomorrow at 6 PM!"*

---

### 1:30 – 2:00 | Prioritized Action Plan & Human Approval
*(Action: Navigate to "Action Plan & Approval" tab)*
> *"Instead of just showing lists, ActionFlow builds a **Prioritized Action Step Sequence**. Step 1 instructs Rahul to fix two unresolved API bugs before today's 4 PM review. Step 2 mandates assigning a video creator. Because we believe in safe AI, we implemented **Human-In-The-Loop Approval**. Users must explicitly grant approval on each action step before downstream execution."*

---

### 2:00 – 2:30 | Grounded Q&A (Zero Hallucination)
*(Action: Click Grounded Q&A tab and click "What should I work on first?")*
> *"Now for Q&A. When I ask 'What should I work on first?', ActionFlow doesn't guess. It analyzes the source quotes and returns a **MIXED FACT & RECOMMENDATION** response, citing exact source quotes: 'Rahul reported two API issues; fix those before the 4 PM review'. If I ask about unmentioned hosting details, it clearly states: 'I don't have enough information to determine that from the provided content.' Zero hallucination guaranteed."*

---

### 2:30 – 2:45 | Today's Plan Export
*(Action: Click "Today's Plan" button)*
> *"With one click on 'Today's Plan', ActionFlow compiles a clean Markdown agenda ready to paste into Jira, Slack, or email, or export as structured JSON."*

---

### 2:45 – 3:00 | Architecture & Closing
> *"Under the hood, ActionFlow uses Node.js, Express, React, and Groq LLaMA 3.3 70B with strict client/server key isolation and offline fallback capability. ActionFlow turns messy text into clear execution. Thank you!"*
