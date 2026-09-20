# Execora Brand Style Guide & Design System

> **Execora — From information to execution.**

---

## 1. Brand Identity & Vision

* **Brand Name**: Execora
* **Tagline**: From information to execution.
* **Mission**: Turn unstructured information into executable work with AI.
* **Personality**: Modern, intelligent, trustworthy, minimal, premium, innovative, global, tech-forward.
* **Industry**: AI Productivity & Execution Infrastructure.
* **Target Audience**: Software engineers, product leads, students, professionals, high-performing teams, organizations.

---

## 2. Color Palette & Design Tokens

| Token Name | Hex Code | Purpose / Usage |
| :--- | :---: | :--- |
| **Primary Blue** | `#0EA5E9` | Main brand color, active highlights, primary buttons |
| **Indigo** | `#6366F1` | Secondary brand accent, gradient transitions, focus states |
| **Cyan** | `#22D3EE` | Highlight accents, top gradient stop, status badges |
| **Light** | `#F8FAFC` | Primary text in dark mode, light background elements |
| **Muted** | `#94A3B8` | Subtitles, body secondary text, disabled borders |
| **Dark Background**| `#0B1220` | Main canvas background color |
| **Dark Card** | `#0F172A` | Card containers, modals, table headers |
| **Dark Border** | `#1E293B` | Subtle card borders and dividers |

---

## 3. Typography Rules

* **Primary Font**: `Inter`, `system-ui`, `-apple-system`, `sans-serif`
* **Monospace Font**: `JetBrains Mono`, `Fira Code`, `monospace` (for code snippets, timestamps, metrics)
* **Font Weights**:
  - `Regular (400)`: Body text and descriptions
  - `Medium (500)`: Button labels, taglines, table cells
  - `SemiBold (600)`: Component titles, status pills, filter tabs
  - `Bold (700 / 800)`: Main headings, brand wordmark, metrics

---

## 4. Logo Usage Guidelines

### Do's ✅
- Maintain aspect ratio for horizontal (`logo.png`) and vertical (`logo-vertical.png`) versions.
- Use on dark backgrounds (`#0B1220`, `#0F172A`) for maximum contrast and gradient glow.
- Provide clear space around the logo equivalent to at least 50% of the mark width.

### Don'ts ❌
- Do not stretch, skew, or rotate the logo mark.
- Do not change the cyan-to-indigo gradient colors (`#22D3EE` → `#0EA5E9` → `#6366F1`).
- Do not add heavy drop shadows or decorative filters around the text wordmark.

---

## 5. Asset Directory

All assets are located in `public/brand/`:
- `logo.png` / `logo.svg` — Primary horizontal logo
- `icon.png` / `icon.svg` — Standalone logo mark
- `logo-vertical.png` / `logo-vertical.svg` — Stacked vertical logo
- `favicon.ico` / `favicon.png` — Web browser favicon
- `app-icon.png` / `app-icon.svg` — 512x512 rounded application icon
- `social-preview.png` / `social-preview.svg` — OpenGraph social media preview banner
