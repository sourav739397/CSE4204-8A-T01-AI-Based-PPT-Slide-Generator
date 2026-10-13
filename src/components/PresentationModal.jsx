import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';
import SlideCanvas from './SlideCanvas';

export default function PresentationModal({ project, initialSlideIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const slides = project.slides || [];
  const activeSlide = slides[currentIndex] || slides[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="h-14 px-6 bg-black/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white z-20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
            {project.title}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-mono">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Elapsed Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              showNotes
                ? 'bg-brand-600/30 border-brand-500 text-brand-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          {/* Close / Exit Fullscreen */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Exit Presentation (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 bg-slate-950">
        <div className="w-full max-w-5xl aspect-video relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
          <SlideCanvas
            slide={activeSlide}
            themeId={project.themeId}
            readOnly={true}
          />
        </div>

        {/* Left Navigation Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            title="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Navigation Arrow */}
        {currentIndex < slides.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            title="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div className="h-40 bg-slate-900 border-t border-slate-800 p-4 px-8 overflow-y-auto z-20 text-slate-200">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Presenter Speaker Notes:
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {activeSlide.notes || 'No notes provided for this slide.'}
            </p>
          </div>
        </div>
      )}

      {/* Slide Progress Bar */}
      <div className="h-1 bg-white/10 w-full">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
