# Changelog — ActionFlow AI

All notable changes to ActionFlow AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-09-20

### Added — Initial Hackathon MVP Release
* **Full-Stack Architecture**: React 19 + TypeScript + Vite + Express backend server.
* **Groq LLaMA 3.3 70B Integration**: Structured JSON extraction for tasks, deadlines, decisions, assignees, and priorities.
* **Grounded Document Q&A**: Strict zero-hallucination Q&A with `FACT`, `RECOMMENDATION`, `MIXED`, and `UNAVAILABLE` classification.
* **Information Gap Detection**: Automatic identification of unassigned tasks and missing deadlines.
* **Prioritized Action Plan**: Sequential step execution path with Human-in-the-Loop approval buttons.
* **Offline Demo Mode**: Built-in hackathon prep dataset (`src/data/demoAnalysis.ts`) for zero-dependency presentations.
* **Today's Plan Synthesizer**: Modal summarizing daily agenda with 1-click Markdown copy and JSON download.
* **Security Layer**: Complete client/server API key separation and runtime JSON Schema sanitization.
* **Documentation Package**: 20 comprehensive technical markdown documents and submission package.
