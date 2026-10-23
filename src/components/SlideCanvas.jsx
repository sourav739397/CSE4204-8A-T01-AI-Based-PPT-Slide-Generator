import React from 'react';
import { getThemeById } from '../services/themeService';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Compass,
  Flag,
  Image as ImageIcon,
  Trash2,
  Wand2
} from 'lucide-react';

export default function SlideCanvas({
  slide,
  themeId,
  readOnly = false,
  onUpdateSlide,
  onOpenImageModal
}) {
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
      {/* Background Image Layer if enabled */}
      {slide.image && slide.imagePosition === 'background' && (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div
            className="absolute inset-0 z-0 bg-slate-950/85 backdrop-blur-[1px]"
          />
        </>
      )}

      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 z-10"
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

        {/* Right side: Image Action Button & Slide Number */}
        <div className="flex items-center gap-2">
          {!readOnly && onOpenImageModal && (
            slide.image ? (
              <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={onOpenImageModal}
                  className="flex items-center gap-1 text-[11px] font-semibold text-brand-300 hover:text-white transition-colors"
                  title="Edit, Replace or Regenerate Slide Image"
                >
                  <ImageIcon className="w-3 h-3 text-brand-400" />
                  <span>Image Active</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Remove image from this slide?')) {
                      onUpdateSlide({ ...slide, image: '' });
                    }
                  }}
                  className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenImageModal}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-xs"
                title="Add, Upload, or Generate AI Image"
              >
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>+ Add / AI Image</span>
              </button>
            )
          )}

          <div className="text-[11px] font-mono opacity-60">
            Slide {slide.slideNo}
          </div>
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
              {slide.image ? (
                <div
                  className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border shadow-lg relative group cursor-pointer"
                  style={{ borderColor: colors.border }}
                  onClick={!readOnly && onOpenImageModal ? onOpenImageModal : undefined}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Hover Quick Action Buttons */}
                  {!readOnly && onOpenImageModal && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImageModal();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1 transition-transform hover:scale-105"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Change / AI</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateSlide({ ...slide, image: '' });
                        }}
                        className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-md transition-transform hover:scale-105"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                      Key Visual
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={!readOnly && onOpenImageModal ? onOpenImageModal : undefined}
                  className="w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-center p-4 cursor-pointer hover:border-brand-500 hover:bg-brand-500/5 transition-all group"
                  style={{ borderColor: colors.border }}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">No Image Selected</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Click to generate with AI or add image</span>
                  </div>
                </div>
              )}
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
