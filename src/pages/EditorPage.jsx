import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Play,
  Download,
  Sparkles,
  Palette,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Check,
  CheckCircle2,
  Layers,
  Wand2,
  Save
} from 'lucide-react';
import { getProjectById, saveProject } from '../services/storageService';
import { exportToPptx } from '../services/pptxExportService';
import { getThemeById, SLIDE_THEMES } from '../services/themeService';
import SlideCanvas from '../components/SlideCanvas';
import LayoutSelector from '../components/LayoutSelector';
import InlineAiModal from '../components/InlineAiModal';
import PresentationModal from '../components/PresentationModal';
import confetti from 'canvas-confetti';

export default function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(true);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saving...' | 'Saved'

  useEffect(() => {
    const loaded = getProjectById(projectId);
    if (loaded) {
      setProject(loaded);
    } else {
      navigate('/workspace');
    }
  }, [projectId]);

  if (!project) return null;

  const slides = project.slides || [];
  const activeSlide = slides[activeSlideIndex] || slides[0];
  const activeTheme = getThemeById(project.themeId);

  const updateProjectState = (updatedProject) => {
    setProject(updatedProject);
    setSaveStatus('Saving...');
    saveProject(updatedProject);
    setTimeout(() => setSaveStatus('Saved'), 400);
  };

  const handleUpdateSlide = (updatedSlide) => {
    const nextSlides = [...slides];
    nextSlides[activeSlideIndex] = updatedSlide;
    updateProjectState({
      ...project,
      slides: nextSlides
    });
  };

  const handleSelectLayout = (layoutId) => {
    handleUpdateSlide({
      ...activeSlide,
      layout: layoutId
    });
  };

  const handleSelectTheme = (themeId) => {
    updateProjectState({
      ...project,
      themeId
    });
    setShowThemePicker(false);
  };

  const handleTitleChange = (newTitle) => {
    updateProjectState({
      ...project,
      title: newTitle
    });
  };

  const handleAddSlide = () => {
    const newNo = slides.length + 1;
    const newSlide = {
      id: `slide-${newNo}-${Date.now().toString(36)}`,
      slideNo: newNo,
      layout: 'split-image',
      title: `Slide ${newNo}: New Topic`,
      subtitle: 'Add a concise summary or key takeaway for this slide.',
      badge: 'Perspective',
      bullets: [
        'First foundational insight and operational benchmark',
        'Second actionable initiative driving measurable performance',
        'Third long-term strategic advantage'
      ],
      notes: `Presenter notes for Slide ${newNo}.`,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    };

    const nextSlides = [...slides, newSlide];
    updateProjectState({
      ...project,
      slides: nextSlides
    });
    setActiveSlideIndex(nextSlides.length - 1);
  };

  const handleDeleteSlide = (idx) => {
    if (slides.length <= 1) {
      alert('A presentation must have at least one slide.');
      return;
    }
    const nextSlides = slides
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slideNo: i + 1 }));

    updateProjectState({
      ...project,
      slides: nextSlides
    });
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  const handleDuplicateSlide = (idx) => {
    const target = slides[idx];
    const duplicated = {
      ...target,
      id: `slide-${Date.now().toString(36)}`,
      title: `${target.title} (Copy)`
    };
    const nextSlides = [...slides];
    nextSlides.splice(idx + 1, 0, duplicated);
    const renumbered = nextSlides.map((s, i) => ({ ...s, slideNo: i + 1 }));

    updateProjectState({
      ...project,
      slides: renumbered
    });
    setActiveSlideIndex(idx + 1);
  };

  const handleMoveSlide = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const nextSlides = [...slides];
    const temp = nextSlides[idx];
    nextSlides[idx] = nextSlides[targetIdx];
    nextSlides[targetIdx] = temp;

    const renumbered = nextSlides.map((s, i) => ({ ...s, slideNo: i + 1 }));
    updateProjectState({
      ...project,
      slides: renumbered
    });
    setActiveSlideIndex(targetIdx);
  };

  const handleExportPptx = async () => {
    try {
      setExporting(true);
      await exportToPptx(project);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      alert('Export failed: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950 select-none">
      {/* Top Action Bar */}
      <div className="h-14 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 z-30 shrink-0">
        {/* Left: Back & Editable Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/workspace')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={project.title}
              onChange={e => handleTitleChange(e.target.value)}
              className="px-2 py-1 rounded bg-transparent hover:bg-slate-800/80 focus:bg-slate-950 border border-transparent focus:border-slate-700 text-sm font-bold text-white truncate focus:outline-none transition-colors"
              title="Click to rename presentation"
            />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {saveStatus}
            </span>
          </div>
        </div>

        {/* Center: Layout Selector */}
        <div className="hidden lg:flex items-center">
          <LayoutSelector
            currentLayout={activeSlide.layout}
            onSelectLayout={handleSelectLayout}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden md:inline">{activeTheme.name}</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block">
                  Select Theme
                </span>
                {SLIDE_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      theme.id === project.themeId
                        ? 'bg-brand-600/30 text-brand-300'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{theme.name}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Slide Copilot Button */}
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={() => setShowPresentation(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            title="Present Fullscreen"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Present</span>
          </button>

          {/* Export PPTX Button */}
          <button
            onClick={handleExportPptx}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            title="Download real editable .PPTX file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Exporting...' : 'Export .PPTX'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Left Sidebar + Center Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Slide Thumbnails Sidebar */}
        <div className="w-48 sm:w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" /> Slides ({slides.length})
            </span>
            <button
              onClick={handleAddSlide}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-400 border border-slate-700 transition-colors"
              title="Add New Slide"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {slides.map((s, idx) => {
              const isSelected = idx === activeSlideIndex;
              return (
                <div
                  key={s.id || idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 bg-brand-950/40 ring-2 ring-brand-500/40 shadow-md shadow-brand-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold truncate max-w-[80px]">
                      {s.layout}
                    </span>
                  </div>

                  {/* Thumbnail Card Content preview */}
                  <div
                    className="w-full aspect-video rounded-lg p-2 flex flex-col justify-between overflow-hidden text-[9px] border border-white/5"
                    style={{ background: activeTheme.colors.gradient || activeTheme.colors.background }}
                  >
                    <div className="font-bold line-clamp-1" style={{ color: activeTheme.colors.textPrimary }}>
                      {s.title}
                    </div>
                    <div className="line-clamp-1 opacity-70" style={{ color: activeTheme.colors.textSecondary }}>
                      {s.subtitle}
                    </div>
                  </div>

                  {/* Slide Quick Controls (Visible on hover or selection) */}
                  {isSelected && (
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 text-slate-400">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={e => {
                            e.stopPropagation();
                            handleMoveSlide(idx, -1);
                          }}
                          className="p-1 rounded hover:bg-slate-800 hover:text-white disabled:opacity-20"
                          title="Move Slide Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === slides.length - 1}
                          onClick={e => {
                            e.stopPropagation();
                            handleMoveSlide(idx, 1);
                          }}
                          className="p-1 rounded hover:bg-slate-800 hover:text-white disabled:opacity-20"
                          title="Move Slide Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleDuplicateSlide(idx);
                          }}
                          className="p-1 rounded hover:bg-slate-800 hover:text-white"
                          title="Duplicate Slide"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-1 rounded hover:bg-rose-900/30 text-slate-500 hover:text-rose-400"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Canvas & Slide Stage */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative">
          {/* Mobile/Tablet Layout Switcher Bar */}
          <div className="lg:hidden p-2 bg-slate-900/80 border-b border-slate-800 overflow-x-auto">
            <LayoutSelector
              currentLayout={activeSlide.layout}
              onSelectLayout={handleSelectLayout}
            />
          </div>

          {/* 16:9 Canvas Stage */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-800 bg-slate-900 relative">
              <SlideCanvas
                slide={activeSlide}
                themeId={project.themeId}
                readOnly={false}
                onUpdateSlide={handleUpdateSlide}
              />
            </div>
          </div>

          {/* Speaker Notes Drawer (Collapsible) */}
          <div className="border-t border-slate-800 bg-slate-900/95 shrink-0 transition-all">
            <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/80 text-xs text-slate-400">
              <button
                onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                className="flex items-center gap-1.5 font-bold hover:text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                <span>Presenter Speaker Notes</span>
              </button>
              <span className="text-[11px] text-slate-500">Included automatically in .PPTX export</span>
            </div>

            {showNotesDrawer && (
              <div className="p-3 px-4">
                <textarea
                  rows={2}
                  value={activeSlide.notes || ''}
                  onChange={e => handleUpdateSlide({ ...activeSlide, notes: e.target.value })}
                  placeholder="Type notes and talking points for this slide..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Inline Copilot Modal */}
      {showAiModal && (
        <InlineAiModal
          slide={activeSlide}
          theme={activeTheme}
          onUpdateSlide={handleUpdateSlide}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Fullscreen Presentation Mode Modal */}
      {showPresentation && (
        <PresentationModal
          project={project}
          initialSlideIndex={activeSlideIndex}
          onClose={() => setShowPresentation(false)}
        />
      )}
    </div>
  );
}
