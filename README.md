# CSE4204-8A-T01-AI-Based-PPT-Slide-Generator
### SlideGenius AI — 100% Free & Open-Source AI Presentation Generator

> An AI-powered presentation slide deck generator built for the **CSE4204/CSE4104** course. Inspired by modern SaaS presentation generators, re-architected to be **100% open-source, free, and executable on your local machine** with zero required paid cloud subscriptions.

---

## 🌟 Key Highlights

- **100% Free & Open Source**: Zero Clerk paywalls, zero Firebase quota limits, zero ImageKit watermarks.
- **Dual-Mode AI Engine**: Supports direct **Google Gemini API** (free tier 60 req/min) AND a smart **offline/local generative engine** that works without any internet or API keys.
- **Native .PPTX Export**: Exports real, editable Microsoft PowerPoint `.pptx` files with OpenXML shapes, formatted text boxes, background fills, and speaker notes via `pptxgenjs`.
- **8 Curated Designer Themes**: Professional Blue, Minimal Clean, Modern Gradient, Elegant Dark, Creative Pastel, Startup Pitch, Cyberpunk Neon, and Nature Emerald.
- **Interactive 16:9 Canvas Editor**: In-place text editing, layout switcher (Title, Split Narrative, 3-Card Grid, Metrics, Two-Column, Conclusion), slide reordering, and duplicate/delete.
- **AI Slide Copilot**: Inline slide refinement assistant to make bullets punchier, add quantitative metrics, rephrase tone, or adjust structure.
- **Fullscreen Presentation Mode**: In-browser slideshow with keyboard navigation (`ArrowRight`, `ArrowLeft`, `Space`, `Esc`), live timer, and collapsible speaker notes prompter.
- **Step-by-Step Educational Curriculum**: 12 detailed chapters in the [`learnings/`](learnings/) folder covering everything from architecture to code implementation.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6
- **Styling**: Tailwind CSS, Lucide Icons, PostCSS
- **Routing**: React Router DOM v6
- **Exporting**: PptxGenJS (client-side OpenXML PPTX generator)
- **AI Integration**: Google Gemini 1.5/2.0 Flash REST API + heuristic fallback engine
- **Storage**: Browser LocalStorage & JSON export/import

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have Node.js (v18 or v20+) and npm installed.
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### 4. (Optional) Enter Google Gemini API Key
Click on the **Settings icon** in the top navigation bar to enter your free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey). If left empty, the app will automatically use the built-in generative engine.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 📚 Step-by-Step Learnings Curriculum

Explore the comprehensive learning guides located in the [`learnings/`](learnings/) directory:
1. [01. Architecture Overview](learnings/01-architecture-overview.md)
2. [02. Project Setup & Tech Stack](learnings/02-project-setup-and-tech-stack.md)
3. [03. Routing & Navigation](learnings/03-routing-and-navigation.md)
4. [04. Workspace & Dashboard](learnings/04-workspace-and-dashboard.md)
5. [05. AI Outline Generation](learnings/05-ai-outline-generation.md)
6. [06. Theme & Design Systems](learnings/06-theme-and-design-system.md)
7. [07. Slide Generation Engine](learnings/07-slide-generation-engine.md)
8. [08. Canvas Editor & Inline AI](learnings/08-canvas-editor-and-inline-ai.md)
9. [09. Presentation Mode](learnings/09-presentation-mode-and-keyboard-controls.md)
10. [10. PPTX Export Implementation](learnings/10-pptx-export-implementation.md)
11. [11. Local Storage & State Management](learnings/11-local-storage-and-state-management.md)
12. [12. How to Run Locally](learnings/12-how-to-run-locally.md)

---

## 📝 Course Assignment Verification: Week 8 AI Integration

- **AI Content Generation**: Generates complete multi-slide outlines, detailed slide content, bullet points, and speaker notes based on user topics.
- **Intelligent Prompt Engineering**: Strict JSON schemas with markdown delimiter cleaning preventing parse failures.
- **Robust Error Handling**: Dual-mode architecture ensures graceful degradation: if Gemini encounters rate limits or network issues, the client-side generator immediately takes over without crashing.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).