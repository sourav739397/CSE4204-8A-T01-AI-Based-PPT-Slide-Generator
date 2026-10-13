import React from 'react';
import { getThemeById } from '../services/themeService';
import { Sparkles, CheckCircle2, TrendingUp, Compass, Flag, Image as ImageIcon } from 'lucide-react';

export default function SlideCanvas({ slide, themeId, readOnly = false, onUpdateSlide }) {
  if (!slide) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-sm">
        No slide selected
      </div>
    );
  }

  const theme = getThemeById(themeId);
  const colors = theme.colors;

  const handleTextChange = (field, value) => {
    if (readOnly || !onUpdateSlide) return;
    onUpdateSlide({
      ...slide,
      [field]: value
    });
  };

  const handleBulletChange = (idx, value) => {
    if (readOnly || !onUpdateSlide) return;
    const nextBullets = [...(slide.bullets || [])];
    nextBullets[idx] = value;
    onUpdateSlide({
      ...slide,
      bullets: nextBullets
    });
  };

  const handleCardChange = (idx, field, value) => {
    if (readOnly || !onUpdateSlide) return;
    const nextCards = [...(slide.cards || [])];
    nextCards[idx] = { ...nextCards[idx], [field]: value };
    onUpdateSlide({
      ...slide,
      cards: nextCards
    });
  };

  const handleMetricChange = (idx, field, value) => {
    if (readOnly || !onUpdateSlide) return;
    const nextMetrics = [...(slide.metrics || [])];
    nextMetrics[idx] = { ...nextMetrics[idx], [field]: value };
    onUpdateSlide({
      ...slide,
      metrics: nextMetrics
    });
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-text"
      style={{
        background: colors.gradient || colors.background,
        color: colors.textPrimary,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: colors.primary }}
      />

      {/* Slide Top Header Bar */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2.5">
          {slide.badge && (
            <span
              contentEditable={!readOnly}
              suppressContentEditableWarning={true}
              onBlur={e => handleTextChange('badge', e.currentTarget.textContent)}
              className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border transition-all"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.accent,
              }}
            >
              {slide.badge}
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono opacity-60">
          Slide {slide.slideNo}
        </div>
      </div>

      {/* Main Slide Body based on Layout */}
      <div className="flex-1 flex flex-col justify-center z-10 my-auto">
        {slide.layout === 'title' && (
          <div className="space-y-4 max-w-3xl">
            <h1
              contentEditable={!readOnly}
              suppressContentEditableWarning={true}
              onBlur={e => handleTextChange('title', e.currentTarget.textContent)}
              className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ color: colors.textPrimary }}
            >
              {slide.title}
            </h1>

            <p
              contentEditable={!readOnly}
              suppressContentEditableWarning={true}
              onBlur={e => handleTextChange('subtitle', e.currentTarget.textContent)}
              className="text-sm sm:text-lg leading-relaxed font-normal"
              style={{ color: colors.textSecondary }}
            >
              {slide.subtitle}
            </p>

            {slide.bullets && slide.bullets.length > 0 && (
              <div className="pt-4 space-y-2 border-t" style={{ borderColor: colors.border }}>
                {slide.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <span
                      contentEditable={!readOnly}
                      suppressContentEditableWarning={true}
                      onBlur={e => handleBulletChange(idx, e.currentTarget.textContent)}
                      style={{ color: colors.textPrimary }}
                    >
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {slide.layout === 'split-image' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-full">
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2
                  contentEditable={!readOnly}
                  suppressContentEditableWarning={true}
                  onBlur={e => handleTextChange('title', e.currentTarget.textContent)}
                  className="text-xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: colors.textPrimary }}
                >
                  {slide.title}
                </h2>
                <p
                  contentEditable={!readOnly}
                  suppressContentEditableWarning={true}
                  onBlur={e => handleTextChange('subtitle', e.currentTarget.textContent)}
                  className="text-xs sm:text-sm mt-1"
                  style={{ color: colors.textSecondary }}
                >
                  {slide.subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {(slide.bullets || []).map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border transition-all"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${colors.primary}25`, color: colors.accent }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span
                      contentEditable={!readOnly}
                      suppressContentEditableWarning={true}
                      onBlur={e => handleBulletChange(idx, e.currentTarget.textContent)}
                      className="text-xs sm:text-sm leading-relaxed"
                      style={{ color: colors.textPrimary }}
                    >
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 h-full flex items-center justify-center">
              <div
                className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border shadow-lg relative group"
                style={{ borderColor: colors.border }}
              >
                <img
                  src={slide.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                    Key Visual
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {slide.layout === 'grid-3' && (
          <div className="space-y-4">
            <div>
              <h2
                contentEditable={!readOnly}
                suppressContentEditableWarning={true}
                onBlur={e => handleTextChange('title', e.currentTarget.textContent)}
                className="text-xl sm:text-3xl font-bold tracking-tight"
                style={{ color: colors.textPrimary }}
              >
                {slide.title}
              </h2>
              <p
                contentEditable={!readOnly}
                suppressContentEditableWarning={true}
                onBlur={e => handleTextChange('subtitle', e.currentTarget.textContent)}
                className="text-xs sm:text-sm mt-1"
                style={{ color: colors.textSecondary }}
              >
                {slide.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {(slide.cards || []).slice(0, 3).map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border flex flex-col justify-between transition-all"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  <div>
                    <span
                      contentEditable={!readOnly}
                      suppressContentEditableWarning={true}
                      onBlur={e => handleCardChange(idx, 'tag', e.currentTarget.textContent)}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${colors.primary}30`, color: colors.accent }}
                    >
                      {card.tag || `Pillar ${idx + 1}`}
                    </span>
                    <h3
                      contentEditable={!readOnly}
                      suppressContentEditableWarning={true}
                      onBlur={e => handleCardChange(idx, 'title', e.currentTarget.textContent)}
                      className="text-sm sm:text-base font-bold mt-2"
                      style={{ color: colors.textPrimary }}
                    >
                      {card.title}
                    </h3>
                    <p
                      contentEditable={!readOnly}
                      suppressContentEditableWarning={true}
                      onBlur={e => handleCardChange(idx, 'desc', e.currentTarget.textContent)}
                      className="text-xs leading-relaxed mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.layout === 'metrics' && (
          <div className="space-y-6">
            <div>
              <h2
                contentEditable={!readOnly}
                suppressContentEditableWarning={true}
                onBlur={e => handleTextChange('title', e.currentTarget.textContent)}
                className="text-xl sm:text-3xl font-bold tracking-tight"
                style={{ color: colors.textPrimary }}
              >
                {slide.title}
              </h2>
              <p
                contentEditable={!readOnly}
                suppressContentEditableWarning={true}
                onBlur={e => handleTextChange('subtitle', e.currentTarget.textContent)}
                className="text-xs sm:text-sm mt-1"
                style={{ color: colors.textSecondary }}
              >
                {slide.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(slide.metrics || []).slice(0, 3).map((metric, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border text-center flex flex-col justify-center items-center shadow-xs"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning={true}
                    onBlur={e => handleMetricChange(idx, 'value', e.currentTarget.textContent)}
                    className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-1"
                    style={{ color: colors.accent }}
                  >
                    {metric.value}
                  </div>
                  <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning={true}
                    onBlur={e => handleMetricChange(idx, 'label', e.currentTarget.textContent)}
                    className="text-xs sm:text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {metric.label}
                  </div>
                  {metric.subtext && (
                    <div
                      contentEditable={!readOnly}
                      suppressContentEditableWarning={true}
                      onBlur={e => handleMetricChange(idx, 'subtext', e.currentTarget.textContent)}
                      className="text-[11px] mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {metric.subtext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.layout === 'two-column' && (
          <div className="space-y-4">
            <div>
              <h2
                contentEditable={!readOnly}
                suppressContentEditableWarning={true}
                onBlur={e => handleTextChange('title', e.currentTarget.textContent)}
                className="text-xl sm:text-3xl font-bold tracking-tight"
                style={{ color: colors.textPrimary }}
              >
                {slide.title}
              </h2>
              <p
                contentEditable={!readOnly}
                suppressContentEditableWarning={true}
                onBlur={e => handleTextChange('subtitle', e.currentTarget.textContent)}
                className="text-xs sm:text-sm mt-1"
                style={{ color: colors.textSecondary }}
              >
                {slide.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Col 1 */}
              <div
                className="p-4 rounded-2xl border"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <h3
                  contentEditable={!readOnly}
                  suppressContentEditableWarning={true}
                  onBlur={e => handleTextChange('col1Title', e.currentTarget.textContent)}
                  className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                  style={{ color: colors.accent }}
                >
                  {slide.col1Title || 'Core Focus Area'}
                </h3>
                <div className="space-y-2">
                  {(slide.col1Points || []).map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span style={{ color: colors.textPrimary }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2 */}
              <div
                className="p-4 rounded-2xl border"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <h3
                  contentEditable={!readOnly}
                  suppressContentEditableWarning={true}
                  onBlur={e => handleTextChange('col2Title', e.currentTarget.textContent)}
                  className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                  style={{ color: colors.accent }}
                >
                  {slide.col2Title || 'Strategic Execution'}
                </h3>
                <div className="space-y-2">
                  {(slide.col2Points || []).map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <span style={{ color: colors.textPrimary }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {slide.layout === 'thank-you' && (
          <div className="text-center space-y-4 max-w-2xl mx-auto py-6">
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${colors.primary}30`, color: colors.accent }}
            >
              <Flag className="w-6 h-6" />
            </div>

            <h1
              contentEditable={!readOnly}
              suppressContentEditableWarning={true}
              onBlur={e => handleTextChange('title', e.currentTarget.textContent)}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight"
              style={{ color: colors.accent }}
            >
              {slide.title}
            </h1>

            <p
              contentEditable={!readOnly}
              suppressContentEditableWarning={true}
              onBlur={e => handleTextChange('subtitle', e.currentTarget.textContent)}
              className="text-sm sm:text-base"
              style={{ color: colors.textSecondary }}
            >
              {slide.subtitle}
            </p>

            {(slide.bullets || []).length > 0 && (
              <div className="pt-4 space-y-1.5 text-xs sm:text-sm opacity-80">
                {slide.bullets.map((b, idx) => (
                  <div
                    key={idx}
                    contentEditable={!readOnly}
                    suppressContentEditableWarning={true}
                    onBlur={e => handleBulletChange(idx, e.currentTarget.textContent)}
                  >
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide Bottom Bar */}
      <div
        className="flex items-center justify-between text-[11px] pt-3 border-t z-10"
        style={{ borderColor: colors.border, color: colors.textSecondary }}
      >
        <span className="truncate max-w-xs">{slide.title}</span>
        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
          SlideGenius AI (Open Source)
        </span>
      </div>
    </div>
  );
}
