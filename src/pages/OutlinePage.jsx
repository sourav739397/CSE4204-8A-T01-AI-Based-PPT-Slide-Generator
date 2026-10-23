import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Layers,
  Palette,
  Wand2
} from 'lucide-react';
import { generateOutline, generateSlidesFromOutline } from '../services/aiService';
import { getProjectById, saveProject } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import ThemeSelector from '../components/ThemeSelector';
import confetti from 'canvas-confetti';

export default function OutlinePage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const topicFromQuery = searchParams.get('topic') || '';
  const slidesCountFromQuery = Number(searchParams.get('slides') || 5);

  const [topic, setTopic] = useState(topicFromQuery);
  const [outline, setOutline] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState('modern-gradient');
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const existing = getProjectById(projectId);
    if (existing && existing.outline && existing.outline.length > 0) {
      setTopic(existing.topic || existing.title);
      setOutline(existing.outline);
      if (existing.themeId) setSelectedThemeId(existing.themeId);
    } else if (topicFromQuery) {
      loadInitialOutline(topicFromQuery, slidesCountFromQuery);
    } else {
      loadInitialOutline('Strategic AI Transformation', 5);
    }
  }, [projectId]);

  const loadInitialOutline = async (targetTopic, count) => {
    setGeneratingOutline(true);
    try {
      const generated = await generateOutline(targetTopic, count);
      setOutline(generated);
    } catch (err) {
      console.error('Failed to generate initial outline:', err);
    } finally {
      setGeneratingOutline(false);
    }
  };

  const handleUpdateItem = (index, field, value) => {
    const next = [...outline];
    next[index] = { ...next[index], [field]: value };
    setOutline(next);
  };

  const handleAddSlide = () => {
    const newSlideNo = outline.length + 1;
    setOutline([
      ...outline,
      {
        slideNo: newSlideNo,
        slidePoint: `Key Perspective ${newSlideNo}`,
        outline: 'Detailed analysis and strategic discussion for this topic.'
      }
    ]);
  };

  const handleDeleteSlide = (index) => {
    if (outline.length <= 2) {
      alert('Presentations must contain at least 2 slides.');
      return;
    }
    const filtered = outline.filter((_, idx) => idx !== index).map((s, idx) => ({
      ...s,
      slideNo: idx + 1
    }));
    setOutline(filtered);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= outline.length) return;
    const next = [...outline];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setOutline(next.map((s, idx) => ({ ...s, slideNo: idx + 1 })));
  };

  const handleGenerateSlides = async () => {
    if (!outline || outline.length === 0) return;

    setGeneratingSlides(true);
    setProgressPercent(10);
    setProgressMsg('Analyzing outline and color system...');

    try {
      // Simulate stepped progress
      const progressTimer = setInterval(() => {
        setProgressPercent(p => {
          if (p >= 85) return p;
          return p + 15;
        });
      }, 500);

      setProgressMsg('Generating slide layouts, cards, and metrics...');
      const slides = await generateSlidesFromOutline(outline, topic, selectedThemeId);

      clearInterval(progressTimer);
      setProgressPercent(100);
      setProgressMsg('Finalizing slide presentation...');

      // Save project to storage
      const existing = getProjectById(projectId);
      const projectData = {
        id: projectId,
        title: topic || outline[0]?.slidePoint || 'Presentation',
        topic,
        themeId: selectedThemeId,
        outline,
        slides,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      saveProject(projectData, user?.id);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        navigate(`/project/${projectId}/editor`);
      }, 400);
    } catch (err) {
      alert('Error generating slides: ' + (err.message || 'Unknown error'));
      setGeneratingSlides(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/workspace')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>

        <div className="text-xs text-slate-400">
          Step <span className="font-bold text-white">1</span> of 2: Outline & Style
        </div>
      </div>

      {/* Main Title & Topic */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5" /> AI Presentation Outline
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Review & Refine Slide Outlines
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Topic: <span className="text-slate-200 font-semibold">&ldquo;{topic}&rdquo;</span>
        </p>
      </div>

      {/* Slide Outlines List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            Slide Agenda ({outline.length} Slides)
          </h2>
          <button
            type="button"
            onClick={handleAddSlide}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400" /> Add Slide
          </button>
        </div>

        {generatingOutline ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">Generating intelligent outline with AI...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {outline.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center gap-4 group"
              >
                {/* Slide Number Badge */}
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-brand-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  #{item.slideNo}
                </div>

                {/* Editable Slide Title & Outline Text */}
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={item.slidePoint}
                    onChange={e => handleUpdateItem(idx, 'slidePoint', e.target.value)}
                    placeholder="Slide Title"
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-brand-500 focus:bg-slate-950 transition-colors"
                  />
                  <textarea
                    rows={2}
                    value={item.outline}
                    onChange={e => handleUpdateItem(idx, 'outline', e.target.value)}
                    placeholder="Description of points covered in this slide..."
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 focus:outline-none focus:border-brand-500 focus:bg-slate-950 transition-colors"
                  />
                </div>

                {/* Move & Delete Actions */}
                <div className="flex items-center sm:flex-col gap-1 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === outline.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(idx)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme Selector Section */}
      <div className="pt-4 border-t border-slate-800">
        <ThemeSelector
          selectedThemeId={selectedThemeId}
          onSelectTheme={setSelectedThemeId}
        />
      </div>

      {/* Slide Generation Loading Overlay / State */}
      {generatingSlides && (
        <div className="p-6 rounded-2xl bg-brand-950/30 border border-brand-500/40 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> {progressMsg}
            </span>
            <span className="font-mono text-brand-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => loadInitialOutline(topic, outline.length)}
          disabled={generatingOutline || generatingSlides}
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 transition-colors disabled:opacity-50"
        >
          Regenerate Outline
        </button>

        <button
          type="button"
          onClick={handleGenerateSlides}
          disabled={generatingOutline || generatingSlides}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generatingSlides ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Deck...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Complete Presentation ({outline.length} Slides)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
