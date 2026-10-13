import React, { useState } from 'react';
import { Sparkles, X, Wand2, Check, ArrowRight, Loader2 } from 'lucide-react';
import { editSlideWithAi } from '../services/aiService';

const QUICK_PROMPTS = [
  'Make bullet points punchier and more concise',
  'Add 3 measurable quantitative metrics',
  'Change layout to 3 feature cards',
  'Refine tone to executive and professional',
  'Add insightful presenter tips to speaker notes',
  'Enhance title and subtitle for higher impact',
];

export default function InlineAiModal({ slide, theme, onUpdateSlide, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecuteAi = async (instructionToUse) => {
    const text = instructionToUse || prompt;
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    try {
      const updatedSlide = await editSlideWithAi(slide, text, theme);
      onUpdateSlide(updatedSlide);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to edit slide with AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Slide Copilot</h3>
              <p className="text-xs text-slate-400">Refine, summarize, expand or restyle Slide #{slide.slideNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Quick Enhancements
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExecuteAi(qp)}
                  disabled={loading}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-slate-700 transition-all text-left disabled:opacity-50"
                >
                  ✨ {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Or specify custom instructions
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Convert this slide into a comparative matrix highlighting cost vs performance..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleExecuteAi()}
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Refining with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply AI Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
