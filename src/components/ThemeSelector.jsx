import React from 'react';
import { SLIDE_THEMES } from '../services/themeService';
import { Check, Sparkles } from 'lucide-react';

export default function ThemeSelector({ selectedThemeId, onSelectTheme }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" /> Choose Presentation Theme
        </label>
        <span className="text-xs text-slate-400">8 Curated Color Systems</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SLIDE_THEMES.map(theme => {
          const isSelected = theme.id === selectedThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group flex flex-col justify-between h-28 ${
                isSelected
                  ? 'border-brand-500 bg-brand-950/30 ring-2 ring-brand-500/50 shadow-lg shadow-brand-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Color Swatch Preview Bar */}
              <div
                className="w-full h-8 rounded-lg mb-2 flex items-center justify-between px-2 shadow-inner"
                style={{ background: theme.colors.gradient }}
              >
                <div className="flex gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-white block truncate">
                  {theme.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {theme.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
