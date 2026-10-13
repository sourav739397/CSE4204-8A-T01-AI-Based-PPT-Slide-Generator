import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  Download,
  Github,
  Heart,
  Presentation,
  Key
} from 'lucide-react';

export default function FreeFeaturesPage() {
  const comparison = [
    {
      feature: 'User Authentication',
      tutorial: 'Clerk SaaS (Free tier quotas, paid upgrade prompts)',
      ours: 'Client-Side Instant Access (Zero sign-up friction, 100% private)',
    },
    {
      feature: 'Database & State Storage',
      tutorial: 'Firebase Firestore (Cloud setup required, read/write limits)',
      ours: 'Local Persistence + JSON Export (Instant, runs offline, zero server cost)',
    },
    {
      feature: 'AI Slide Generation',
      tutorial: 'Firebase Genkit Cloud (Requires Google Cloud billing account)',
      ours: 'Gemini API Free Tier (60 req/min) + Smart Offline Local Engine',
    },
    {
      feature: 'Visual Assets & Imagery',
      tutorial: 'ImageKit SaaS (Limited monthly bandwidth & credits)',
      ours: 'Open High-Resolution Royalty-Free Imagery & Lucide Vector Icons',
    },
    {
      feature: 'PowerPoint Export (.pptx)',
      tutorial: 'HTML screenshots / basic print preview',
      ours: 'Native PptxGenJS (Editable shapes, formatted text boxes & speaker notes)',
    },
    {
      feature: 'Watermarks & Branding',
      tutorial: 'Watermarks on free tiers unless upgraded',
      ours: 'Zero watermarks. Clean, professional export decks forever',
    },
    {
      feature: 'Monthly Cost',
      tutorial: '$19 – $49 / month for full SaaS stack',
      ours: '$0.00 / month — 100% Free & Open Source (MIT License)',
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Free & Open Source Forever
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          All Features Unlocked. Zero Paywalls.
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          How our open-source architecture gives you full PowerPoint presentation generation capabilities without expensive SaaS dependencies.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-4 font-bold uppercase tracking-wider text-xs">Capability</th>
              <th className="pb-4 font-bold uppercase tracking-wider text-xs text-rose-400">Tutorial / Cloud SaaS Stack</th>
              <th className="pb-4 font-bold uppercase tracking-wider text-xs text-emerald-400">SlideGenius AI (This Project)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {comparison.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 font-semibold text-white">{row.feature}</td>
                <td className="py-4 text-slate-400 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{row.tutorial}</span>
                </td>
                <td className="py-4 text-emerald-300 font-medium">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{row.ours}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Open Source Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Zap className="w-6 h-6 text-brand-400" />
          <h3 className="text-base font-bold text-white">Instant Local Execution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Runs with a simple <code className="text-brand-300">npm run dev</code> command. No Firebase console configuration or external database provisioning needed.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Key className="w-6 h-6 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Your Key, Your Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provide your free Google Gemini API key or use the built-in generative engine. Your prompts and slides stay private in your browser.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Download className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Real PPTX Presentation Decks</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download standard PowerPoint files that can be edited in Microsoft Office, Apple Keynote, or Google Slides anytime.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-brand-500/30 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Start Generating Presentations Now</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Explore the workspace, try out themes, test the AI copilot, and download your slides.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/workspace"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/25 transition-all"
          >
            Launch Workspace
          </Link>
          <a
            href="https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2"
          >
            <Github className="w-4 h-4" /> View GitHub Repo
          </a>
        </div>
      </div>
    </div>
  );
}
