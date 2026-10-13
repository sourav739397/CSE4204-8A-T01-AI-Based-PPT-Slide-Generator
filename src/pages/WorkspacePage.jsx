import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Presentation,
  Plus,
  Search,
  Play,
  Download,
  Copy,
  Trash2,
  Calendar,
  Layers,
  Wand2,
  FileCode,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { getProjects, saveProject, deleteProject, duplicateProject } from '../services/storageService';
import { exportToPptx } from '../services/pptxExportService';
import { getThemeById } from '../services/themeService';
import PresentationModal from '../components/PresentationModal';
import confetti from 'canvas-confetti';

const PRESET_TOPICS = [
  'Artificial Intelligence in Healthcare',
  'Seed Round Startup Pitch Deck',
  'Quarterly Product & Marketing Strategy',
  'Cybersecurity Best Practices for 2026',
  'Introduction to Quantum Computing',
  'Sustainable Green Energy Solutions'
];

export default function WorkspacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [presentingProject, setPresentingProject] = useState(null);
  const [exportingId, setExportingId] = useState(null);

  useEffect(() => {
    setProjects(getProjects());
    const initialTopic = searchParams.get('initialTopic');
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [searchParams]);

  const handleCreateOutline = (e) => {
    e.preventDefault();
    const cleanTopic = topic.trim() || 'Modern Strategic Innovation';
    const projectId = 'proj-' + Date.now().toString(36);
    navigate(`/project/${projectId}/outline?topic=${encodeURIComponent(cleanTopic)}&slides=${slideCount}`);
  };

  const handleExport = async (e, proj) => {
    e.stopPropagation();
    try {
      setExportingId(proj.id);
      await exportToPptx(proj);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert(err.message || 'Failed to export PPTX');
    } finally {
      setExportingId(null);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this presentation?')) {
      const updated = deleteProject(id);
      setProjects(updated);
    }
  };

  const handleDuplicate = (e, id) => {
    e.stopPropagation();
    const dup = duplicateProject(id);
    if (dup) {
      setProjects(getProjects());
    }
  };

  const filteredProjects = projects.filter(p =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.topic || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSlides = projects.reduce((acc, p) => acc + (p.slides?.length || 0), 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Presentation className="w-7 h-7 text-brand-400" />
            Presentation Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, customize, and export AI-generated PowerPoint slide decks. 100% free and client-side.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Decks</span>
            <span className="text-lg font-extrabold text-white font-mono">{projects.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Slides</span>
            <span className="text-lg font-extrabold text-brand-400 font-mono">{totalSlides}</span>
          </div>
        </div>
      </div>

      {/* Generator Prompt Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-brand-950/30 border border-brand-500/20 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Wand2 className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white">Create New Presentation with AI</h2>
          </div>

          <form onSubmit={handleCreateOutline} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="What presentation would you like to generate today?"
                className="flex-1 px-4 py-3 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />

              <div className="flex items-center gap-2">
                <select
                  value={slideCount}
                  onChange={e => setSlideCount(Number(e.target.value))}
                  className="px-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  title="Target slide count"
                >
                  <option value={4}>4 Slides (Executive)</option>
                  <option value={5}>5 Slides (Standard)</option>
                  <option value={6}>6 Slides (Comprehensive)</option>
                  <option value={8}>8 Slides (Deep Dive)</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-brand-500/25 flex items-center gap-2 whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Outline</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Ideas */}
            <div className="flex items-center flex-wrap gap-1.5 pt-1 text-xs">
              <span className="text-slate-500 text-[11px] font-medium mr-1">Inspirations:</span>
              {PRESET_TOPICS.map(pt => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setTopic(pt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-brand-300 border border-slate-800 transition-colors"
                >
                  {pt}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Projects List Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">My Presentations</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredProjects.length}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search presentations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Presentation Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 space-y-3">
            <Presentation className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No presentations found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map(project => {
              const theme = getThemeById(project.themeId);
              const firstSlide = project.slides?.[0];

              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}/editor`)}
                  className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/5 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Miniature Slide Banner */}
                  <div
                    className="h-36 w-full p-4 relative flex flex-col justify-between border-b border-slate-800/80 transition-transform group-hover:scale-[1.01]"
                    style={{ background: theme.colors.gradient || theme.colors.background }}
                  >
                    <div className="flex items-center justify-between z-10">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ backgroundColor: theme.colors.surface, color: theme.colors.accent }}
                      >
                        {theme.name}
                      </span>
                      <span className="text-[11px] font-mono opacity-80" style={{ color: theme.colors.textSecondary }}>
                        {project.slides?.length || 0} Slides
                      </span>
                    </div>

                    <div className="z-10">
                      <h3
                        className="text-sm font-bold line-clamp-2"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {firstSlide?.title || project.title}
                      </h3>
                      <p
                        className="text-[11px] line-clamp-1 mt-0.5"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {firstSlide?.subtitle || project.topic}
                      </p>
                    </div>

                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  </div>

                  {/* Card Info & Actions Footer */}
                  <div className="p-4 space-y-3 bg-slate-900">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
                        {project.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400 font-medium">Free & Editable</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setPresentingProject(project);
                          }}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Present Fullscreen"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={e => handleExport(e, project)}
                          disabled={exportingId === project.id}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                          title="Export PowerPoint (.pptx)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={e => handleDuplicate(e, project.id)}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Duplicate Deck"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={e => handleDelete(e, project.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete Deck"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/project/${project.id}/editor`}
                          className="px-3 py-1.5 rounded-lg bg-brand-600/30 hover:bg-brand-600/50 text-brand-300 border border-brand-500/40 text-xs font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Presentation Modal */}
      {presentingProject && (
        <PresentationModal
          project={presentingProject}
          onClose={() => setPresentingProject(null)}
        />
      )}
    </div>
  );
}
