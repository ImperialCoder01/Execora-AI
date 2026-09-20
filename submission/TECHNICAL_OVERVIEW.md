# Technical Architecture Overview — ActionFlow AI

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons.
* **Backend API**: Node.js, Express.js running on Port 3001.
* **AI Provider**: Groq SDK using `llama-3.3-70b-versatile` in native JSON mode (`response_format: { type: "json_object" }`).
* **Validation Layer**: Custom runtime TypeScript sanitizer (`src/utils/validator.ts`) enforcing strict JSON typing and null safety.
* **Security Isolation**: `GROQ_API_KEY` is strictly managed server-side; keys are never exposed to browser context or client JS bundles.
* **Offline Resilience**: Express server falls back to pre-analyzed `DEMO_ANALYSIS` if API key is unconfigured or Groq API fails.
