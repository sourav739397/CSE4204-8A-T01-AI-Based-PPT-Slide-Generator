import React from 'react';
import { LayoutTemplate, Columns, Grid3X3, BarChart2, SplitSquareVertical, Flag } from 'lucide-react';

export const SLIDE_LAYOUTS = [
  { id: 'title', label: 'Title Slide', icon: LayoutTemplate, desc: 'Introductory hero slide with main title' },
  { id: 'split-image', label: 'Split Narrative', icon: SplitSquareVertical, desc: 'Bullet points beside a visual image' },
  { id: 'grid-3', label: '3-Card Grid', icon: Grid3X3, desc: 'Three feature cards with tags and details' },
  { id: 'metrics', label: 'Key Metrics', icon: BarChart2, desc: 'Prominent numerical stats and benchmarks' },
  { id: 'two-column', label: 'Two Columns', icon: Columns, desc: 'Comparison or problem vs solution columns' },
  { id: 'thank-you', label: 'Conclusion', icon: Flag, desc: 'Thank you slide with contacts and Q&A' },
];

export default function LayoutSelector({ currentLayout, onSelectLayout }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
      {SLIDE_LAYOUTS.map(layout => {
        const Icon = layout.icon;
        const isActive = currentLayout === layout.id;
        return (
          <button
            key={layout.id}
            type="button"
            onClick={() => onSelectLayout(layout.id)}
            title={layout.desc}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-brand-600/30 border-brand-500 text-brand-300 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{layout.label}</span>
          </button>
        );
      })}
    </div>
  );
}
