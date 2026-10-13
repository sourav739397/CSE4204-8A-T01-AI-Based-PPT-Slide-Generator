import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Presentation, Sparkles, Settings, Github, Heart, Layers } from 'lucide-react';
import { getSettings } from '../services/storageService';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setHasApiKey(Boolean(s?.geminiApiKey?.trim()));
  }, [showSettings]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/workspace', label: 'Workspace' },
    { to: '/free-features', label: '100% Free & Open Source' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Presentation className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                SlideGenius<span className="text-brand-400 font-extrabold ml-1">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                100% Free & Open Source
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* AI Status & Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-xs"
              title="AI & API Settings"
            >
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-brand-400'}`} />
              <span className="hidden sm:inline">{hasApiKey ? 'Gemini API' : 'Smart AI (Free)'}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* GitHub Repo */}
            <a
              href="https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Workspace CTA Button */}
            <Link
              to="/workspace"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
