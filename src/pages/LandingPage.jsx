import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Presentation,
  Download,
  Wand2,
  Palette,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  Github,
  Layers,
  FileText,
  Sliders
} from 'lucide-react';
import SlideCanvas from '../components/SlideCanvas';
import { getProjects } from '../services/storageService';

const SAMPLE_SLIDE = {
  id: 'hero-demo-slide',
  slideNo: 1,
  layout: 'split-image',
  title: 'Generative AI in Modern Enterprise',
  subtitle: 'Unlocking 10x Team Productivity and Autonomous Decision Intelligence',
  badge: 'Strategic Vision 2026',
  bullets: [
    'Automating slide structure and complex narrative generation',
    'Preserving corporate brand fidelity with custom palettes',
    'Exporting to native editable .PPTX formats with zero cloud lock-in'
  ],
  notes: 'Presenter notes: Introduce the transformative potential of client-side AI presentations.',
  image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80'
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [topicInput, setTopicInput] = useState('');
  const [activeTheme, setActiveTheme] = useState('modern-gradient');

  const handleStart = (e) => {
    e.preventDefault();
    const topic = topicInput.trim() || 'Next-Generation Artificial Intelligence';
    navigate(`/workspace?initialTopic=${encodeURIComponent(topic)}`);
  };

  const sampleTopics = [
    'Startup Seed Pitch Deck',
    'AI in Modern Healthcare',
    'Renewable Energy Transition',
    'Microservices Architecture'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">100% Open Source & Free</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Zero Subscriptions Required</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Generate Professional{' '}
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                PowerPoint Slides
              </span>{' '}
              with AI in Seconds
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Transform ideas into polished presentation decks. Features AI outlines, 8 designer themes, inline AI editing, and native <strong>.PPTX export</strong> that runs completely on your local machine.
            </p>

            {/* Topic Input Bar */}
            <form onSubmit={handleStart} className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
                <input
                  type="text"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  placeholder="Enter any presentation topic (e.g. Future of Quantum Computing)..."
                  className="w-full px-4 py-3 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-brand-500/30 flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Topic Pills */}
              <div className="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs text-slate-400">
                <span className="text-slate-500 font-medium">Try topic:</span>
                {sampleTopics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setTopicInput(topic);
                      navigate(`/workspace?initialTopic=${encodeURIComponent(topic)}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Interactive Slide Preview Section */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="p-3 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl shadow-black/80 backdrop-blur-xl">
              {/* Fake Window Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 text-xs text-slate-400 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-500">Live Slide Preview (16:9 Canvas)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">Theme Preview:</span>
                  {['modern-gradient', 'professional-blue', 'elegant-dark', 'startup-pitch'].map(tId => (
                    <button
                      key={tId}
                      onClick={() => setActiveTheme(tId)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                        activeTheme === tId
                          ? 'bg-brand-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tId.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 16:9 Slide Canvas Preview */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-slate-800">
                <SlideCanvas
                  slide={SAMPLE_SLIDE}
                  themeId={activeTheme}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-400 mb-2">
              End-to-End Presentation Suite
            </h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Everything You Need to Create World-Class Slides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Outline Generation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter a single prompt or topic. The AI instantly generates a structured, multi-slide agenda complete with topics, bullet points, and speaker notes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">8 Designer Color Themes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from corporate blue, luxury dark, vibrant gradient, or minimal light. Every theme adapts typography, card backgrounds, and accent colors automatically.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Native .PPTX Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export real, fully editable PowerPoint presentations directly to your computer. Open and tweak them in Microsoft PowerPoint, Keynote, or Google Slides.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Inline AI Slide Copilot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select any slide and ask AI to summarize, add metrics, rephrase tone, or restructure layouts with instant live updates.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Presentation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Fullscreen Presenter Mode</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Present directly from your browser. Includes keyboard arrow navigation, presentation timer, and private speaker notes prompter.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Free & Open Source</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No credit card, no Clerk paywalls, no Firebase usage quotas. Runs completely locally on your machine with offline AI support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-400 mb-2">How It Works</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">From Topic to Slide Deck in 4 Simple Steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Enter Your Topic', desc: 'Type what you want to present on. Select desired number of slides.' },
              { step: '02', title: 'Review Outline', desc: 'AI structures your presentation. Add, delete, or edit slide topics as needed.' },
              { step: '03', title: 'Choose Design Theme', desc: 'Pick from 8 modern themes tailored for business, tech, or creative pitches.' },
              { step: '04', title: 'Edit & Export .PPTX', desc: 'Tweak text directly, ask AI for inline enhancements, and download your presentation.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative">
                <span className="text-3xl font-black text-brand-500/40 font-mono">{item.step}</span>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-slate-900 border border-brand-500/30 text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold text-white">Ready to create your next presentation?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Start generating for free right now. No sign up or API key required to test out the generator.
            </p>
            <button
              onClick={() => navigate('/workspace')}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/30 inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Go to Workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
