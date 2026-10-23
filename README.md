# CSE4204-8A-T01-AI-Based-PPT-Slide-Generator
### SlideGenius AI — Full AI Presentation Platform with Authentication & Vercel Deployment

> An AI-powered presentation slide deck generator built for the **CSE4204/CSE4104** course. Built with modern React 18, Vite, Tailwind CSS, multi-user authentication, client-side OpenXML `.pptx` export, and pre-configured for **instant one-click deployment on Vercel**.

---

## 🌟 Key Features

- **🔐 Multi-User Authentication**:
  - Full **Sign In** and **Sign Up** system with salted SHA-256 password hashing.
  - **⚡ One-Click Instant Demo Login**: Instant access as Alex Rivera (Product Lead) for evaluation.
  - User-scoped workspaces: Each user has their own private presentation slide decks and automatically generated onboarding presentations.
  - User Profile & Settings: Change display name, role, custom avatar, change password, and export full JSON data backups.
- **☁️ 100% Vercel-Ready**:
  - `vercel.json` included with single-page app (SPA) rewrites for direct routing to `/workspace`, `/login`, `/profile`, `/editor`, etc. without 404 errors.
  - Automatic `VITE_GEMINI_API_KEY` environment variable pickup.
  - Optimized Vite build with rollup manual chunks (`vendor`, `pptx`, `icons`).
- **🤖 Dual-Mode AI Engine**:
  - Google Gemini AI REST API integration (supports `gemini-3-flash-preview`, `gemini-2.0-flash`, etc.) with zero-config fallback.
  - Heuristic generative AI engine that works without any internet or API keys.
- **📑 Native .PPTX Export**:
  - Exports real, editable Microsoft PowerPoint `.pptx` presentations with vector shapes, custom theme colors, structured card grids, and speaker notes via `pptxgenjs`.
- **🎨 8 Curated Designer Themes**:
  - Modern Gradient, Professional Blue, Minimal Clean, Elegant Dark, Creative Pastel, Startup Pitch, Cyberpunk Neon, and Nature Emerald.
- **🖥️ 16:9 Interactive Canvas Editor**:
  - In-place slide editing, layout switching (Title, Split Image, 3-Card Grid, Metrics, Two-Column, Conclusion), slide reordering, duplicating, and deleting.
- **✨ AI Slide Copilot**:
  - Inline prompt assistant to rewrite bullets, add metrics, shift tone, or simplify text on any active slide.
- **📽️ Fullscreen Presenter Mode**:
  - Slide presentation with keyboard shortcuts (`ArrowRight`, `ArrowLeft`, `Space`, `Esc`), timer, and presenter notes drawer.

---

## 🚀 How to Deploy on Vercel

This repository is fully configured for deployment on [Vercel](https://vercel.com).

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push your repository to **GitHub** (e.g. `sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator`).
2. Log into [Vercel](https://vercel.com) and click **"Add New..."** → **"Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. *(Optional)* In **Environment Variables**, add:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   *(If not added, users can still enter their own key in Settings, or use the built-in Smart AI engine for free).*
6. Click **Deploy**. Your site will be live on `https://your-project.vercel.app` in under 1 minute!

### Method 2: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy to production
vercel --prod
```

### Why Vercel Deployment Works Out-of-the-Box:
- **`vercel.json`**: Configured with SPA rewrite rules (`/(.*)` → `/index.html`) so refreshing routes like `/workspace` or `/profile` never throws a 404 error.
- **Cache Headers**: Static assets under `/assets/` are automatically served with long-term immutable cache headers.
- **Code Splitting**: Rollup `manualChunks` in `vite.config.js` keeps all bundle sizes under optimal limits.

---

## 🔑 Authentication & Demo Accounts

Anyone can sign up with their own account, or use the pre-configured demo account:

### Instant Demo Login:
- On the `/login` page, simply click **"⚡ One-Click Instant Demo Login"**
- Or manually sign in with:
  - **Email**: `demo@slidegenius.ai`
  - **Password**: `Password123!`

### Creating a New Account:
- Navigate to `/signup`
- Enter **Full Name**, **Role**, **Email**, and a **Password** (min 6 characters)
- A personalized starter presentation is automatically generated and added to your new workspace!

---

## 🛠️ Local Development

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)

### 2. Installation
```bash
git clone https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator.git
cd CSE4204-8A-T01-AI-Based-PPT-Slide-Generator
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── vercel.json               # Vercel SPA routing and cache headers
├── vite.config.js            # Vite build configuration with manual chunks
├── tailwind.config.js        # Theme colors and typography
├── package.json
├── src/
│   ├── App.jsx               # App routing and AuthProvider
│   ├── main.jsx              # React DOM entrypoint
│   ├── index.css             # Tailwind CSS directives
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context & state provider
│   ├── services/
│   │   ├── authService.js    # User accounts, hashing, session management
│   │   ├── storageService.js # LocalStorage & user-scoped presentations
│   │   ├── aiService.js      # Gemini API + heuristic slide generator
│   │   ├── pptxExportService.js # Microsoft PowerPoint .PPTX generation
│   │   └── themeService.js   # 8 presentation design systems
│   ├── pages/
│   │   ├── LandingPage.jsx   # Homepage with feature showcases
│   │   ├── AuthPage.jsx      # Sign In, Sign Up, and Password Reset
│   │   ├── ProfilePage.jsx   # User profile, statistics, security
│   │   ├── WorkspacePage.jsx # User presentations dashboard
│   │   ├── OutlinePage.jsx   # AI outline generator and editor
│   │   ├── EditorPage.jsx    # Interactive slide editor & copilot
│   │   └── FreeFeaturesPage.jsx # Open-source feature breakdown
│   └── components/
│       ├── Navbar.jsx        # Navbar with user dropdown and auth state
│       ├── Footer.jsx        # Footer links
│       ├── SlideCanvas.jsx   # Real-time 16:9 canvas renderer
│       ├── SettingsModal.jsx # Gemini API key configuration
│       ├── LayoutSelector.jsx# Slide layout template selector
│       ├── ThemeSelector.jsx # Designer color palettes
│       ├── InlineAiModal.jsx # Inline AI assistant dialog
│       └── PresentationModal.jsx # Slideshow presenter mode
└── learnings/                # Educational documentation chapters
```

---

## 📝 Course Assignment Verification: Week 8 AI Integration

- **Authentication & User Management**: Multi-user registration, secure password hashing, and user-scoped presentation workspaces.
- **End-to-End AI Generation**: Topic → Structured Outline → Multi-Slide Presentation Deck → PPTX Export.
- **Production Deployment**: Validated production build with zero errors and turnkey Vercel configuration.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).