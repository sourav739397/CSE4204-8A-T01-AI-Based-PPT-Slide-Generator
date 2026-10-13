import React from 'react';
import { Link } from 'react-router-dom';
import { Presentation, Heart, Shield, Code, Sparkles, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/40 flex items-center justify-center">
                <Presentation className="w-4 h-4 text-brand-400" />
              </div>
              <span className="font-bold text-white tracking-tight">SlideGenius AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-source, free AI presentation slide generator. Built for students, educators, professionals, and developers.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                MIT License
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[11px] font-medium border border-indigo-500/20">
                Zero Cloud Lock-in
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/workspace" className="hover:text-white transition-colors">Workspace & Generator</Link></li>
              <li><Link to="/free-features" className="hover:text-white transition-colors">100% Free vs Paid SaaS</Link></li>
              <li><a href="https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Source Code on GitHub</a></li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-brand-400" /> One-Click AI Outlines</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-brand-400" /> 8 Modern Design Themes</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-brand-400" /> Inline AI Slide Editor</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-brand-400" /> Native .PPTX Export</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-brand-400" /> Fullscreen Presentation Mode</li>
            </ul>
          </div>

          {/* Col 4: Educational & Open Source */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Course & Learning</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Built for CSE4204 Course with comprehensive architectural guides located in the <code className="text-brand-300">learnings/</code> repository folder.
            </p>
            <a
              href="https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" /> Read Documentation Guides &rarr;
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SlideGenius AI — Built with open source technologies. Free forever.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
