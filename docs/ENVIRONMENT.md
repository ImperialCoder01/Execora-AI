# Environment Variable Specification — ActionFlow AI

This document describes all environment variables used by ActionFlow AI.

---

## 🔑 Environment Variables

| Variable Name | Required | Default Value | Description | Safety Level |
| :--- | :---: | :--- | :--- | :---: |
| `GROQ_API_KEY` | Optional | *None (Triggers Demo Mode)* | Groq API Key obtained from https://console.groq.com | **SECRET** (Server-only) |
| `GROQ_MODEL` | Optional | `llama-3.3-70b-versatile` | Groq LLaMA model identifier. Supported options: `llama-3.3-70b-versatile`, `llama3-70b-8192`, `mixtral-8x7b-32768`. | Public Config |
| `PORT` | Optional | `3001` | Port on which Express backend server listens. | Public Config |

---

## 🔒 Security Requirements

1. **Server Isolation**: `GROQ_API_KEY` must strictly exist inside `.env` or system environment variables. It must NEVER be prefixed with `VITE_` or exposed to Vite client build bundles.
2. **Git Exclusion**: `.env` is listed in `.gitignore`. Do NOT commit secrets to Git repositories.
3. **Fallback Safety**: If `GROQ_API_KEY` is undefined or empty, ActionFlow AI automatically operates in Demo Mode without throwing uncaught exceptions.
