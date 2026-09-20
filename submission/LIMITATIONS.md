# Limitations Summary — ActionFlow AI

* **Document Context Size**: Inputs are bounded to 50,000 characters per analysis (Vector RAG chunking planned for Phase 2).
* **Transient Storage**: MVP utilizes React state and in-memory server processing without a persistent database (PostgreSQL database planned for Phase 2).
* **Human Approval Scope**: Action plan steps recommend downstream actions, but do not directly create live Jira/Slack tickets without user authorization (Tool execution planned for Phase 3).
