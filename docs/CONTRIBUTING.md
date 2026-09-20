# Contributing Guide — ActionFlow AI

Thank you for your interest in contributing to **ActionFlow AI**! Although created for the AI Day Noida Hackathon, contributions and community improvements are welcome.

---

## 1. Local Setup Instructions

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/actionflow-ai.git
   cd actionflow-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Local Environment**:
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY in .env if testing live AI inference
   ```

4. **Start Local Development Environment**:
   ```bash
   npm run dev
   ```

---

## 2. Code Style & Standards

* **TypeScript Strictness**: All code must pass `npm run typecheck` (`tsc --noEmit`) without errors.
* **Component Architecture**: Keep UI components modular in `src/components/`. UI components must remain decoupled from raw API keys.
* **Security Discipline**: Never commit raw API keys or `.env` files. Ensure `.gitignore` is strictly obeyed.

---

## 3. Pull Request Guidelines

1. Create a feature branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes cleanly: `git commit -m 'feat: add amazing feature'`.
3. Verify production build: `npm run build`.
4. Open a Pull Request with a clear explanation of changes.
