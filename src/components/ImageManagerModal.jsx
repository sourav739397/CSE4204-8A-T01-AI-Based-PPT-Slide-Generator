import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Search,
  Link as LinkIcon,
  Upload,
  Trash2,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Layers,
  Wand2,
  ExternalLink,
  Sliders
} from 'lucide-react';

// Curated royalty-free visual assets by category
const CURATED_STOCKS = [
  { id: 'tech-1', category: 'Technology', label: 'Circuit Board & AI', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80' },
  { id: 'tech-2', category: 'Technology', label: 'Cyber Matrix Code', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80' },
  { id: 'tech-3', category: 'Technology', label: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80' },
  { id: 'code-1', category: 'Coding', label: 'Code Editor Screens', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80' },
  { id: 'code-2', category: 'Coding', label: 'Developer Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80' },
  { id: 'code-3', category: 'Coding', label: 'Competitive Programming', url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1000&auto=format&fit=crop&q=80' },
  { id: 'biz-1', category: 'Business', label: 'Financial Growth Chart', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80' },
  { id: 'biz-2', category: 'Business', label: 'Executive Boardroom', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80' },
  { id: 'biz-3', category: 'Business', label: 'Global Strategy Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80' },
  { id: 'health-1', category: 'Healthcare', label: 'Medical Research Lab', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80' },
  { id: 'health-2', category: 'Healthcare', label: 'Doctor Diagnostics', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1000&auto=format&fit=crop&q=80' },
  { id: 'health-3', category: 'Healthcare', label: 'Stethoscope & Clinical Data', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1000&auto=format&fit=crop&q=80' },
  { id: 'startup-1', category: 'Startup', label: 'Idea Launch Rocket', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&auto=format&fit=crop&q=80' },
  { id: 'startup-2', category: 'Startup', label: 'Product Innovation Brainstorm', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80' },
  { id: 'abstract-1', category: 'Abstract', label: 'Deep Blue Nebula', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80' },
  { id: 'abstract-2', category: 'Abstract', label: 'Fluid Gradient Mesh', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
  { id: 'nature-1', category: 'Nature', label: 'Sustainable Green Canopy', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1000&auto=format&fit=crop&q=80' },
  { id: 'nature-2', category: 'Nature', label: 'Wind Turbine Clean Energy', url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1000&auto=format&fit=crop&q=80' }
];

const AI_STYLES = [
  { id: 'realistic', label: 'Photorealistic', promptSuffix: 'photorealistic, cinematic lighting, ultra-detailed 8k, professional photography' },
  { id: '3d-render', label: '3D Render', promptSuffix: 'octane 3D render, glowing ambient reflections, smooth geometric surfaces, unreal engine 5' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', promptSuffix: 'dark cyberpunk aesthetic, neon cyan and amber glow, futuristic digital matrix' },
  { id: 'minimal-vector', label: 'Clean Vector', promptSuffix: 'minimalist clean vector art, modern tech graphic, flat vibrant colors' },
  { id: 'corporate', label: 'Corporate Modern', promptSuffix: 'executive business photography, high-contrast, clean professional presentation visual' }
];

export default function ImageManagerModal({ slide, onClose, onSaveImage, onRemoveImage }) {
  // Tabs: 'generate' | 'stock' | 'url' | 'upload'
  const [activeTab, setActiveTab] = useState('generate');

  // Selected or previewed image
  const [currentUrl, setCurrentUrl] = useState(slide.image || '');
  const [imagePosition, setImagePosition] = useState(slide.imagePosition || 'card'); // 'card' | 'background'

  // AI Generator state
  const defaultPrompt = `${slide.title || 'Technology Innovation'} - ${slide.subtitle || 'presentation visual'}`;
  const [aiPrompt, setAiPrompt] = useState(defaultPrompt);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [genSeed, setGenSeed] = useState(() => Math.floor(Math.random() * 100000));

  // Stock library search & filter
  const [stockSearch, setStockSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Custom URL input
  const [customInputUrl, setCustomInputUrl] = useState(slide.image || '');
  const [urlError, setUrlError] = useState(false);

  // Upload file state
  const [uploadPreview, setUploadPreview] = useState('');

  // Auto-generate preview on open if empty
  useEffect(() => {
    if (!slide.image) {
      handleTriggerAiGenerate();
    }
  }, []);

  const handleTriggerAiGenerate = () => {
    setGenerating(true);
    const styleObj = AI_STYLES.find(s => s.id === selectedStyle);
    const fullPrompt = `${aiPrompt.trim()}, ${styleObj?.promptSuffix || ''}`;
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    setGenSeed(newSeed);

    // Free, high quality Pollinations AI image generator endpoint
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1200&height=800&nologo=true&seed=${newSeed}`;

    // Preload image in memory
    const img = new Image();
    img.onload = () => {
      setGeneratedUrl(url);
      setCurrentUrl(url);
      setGenerating(false);
    };
    img.onerror = () => {
      // Fallback to high quality curated stock if network fails
      const fallback = CURATED_STOCKS[Math.floor(Math.random() * CURATED_STOCKS.length)].url;
      setGeneratedUrl(fallback);
      setCurrentUrl(fallback);
      setGenerating(false);
    };
    img.src = url;
  };

  const handleSelectStock = (url) => {
    setCurrentUrl(url);
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    setCurrentUrl(customInputUrl.trim());
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setUploadPreview(dataUrl);
        setCurrentUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!currentUrl) {
      onRemoveImage();
    } else {
      onSaveImage(currentUrl, imagePosition);
    }
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('Remove image from this slide?')) {
      onRemoveImage();
      onClose();
    }
  };

  // Filter stocks
  const categories = ['All', 'Technology', 'Coding', 'Business', 'Healthcare', 'Startup', 'Nature', 'Abstract'];
  const filteredStocks = CURATED_STOCKS.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !stockSearch.trim() ||
      item.label.toLowerCase().includes(stockSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(stockSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manage Slide Image</span>
                <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Slide {slide.slideNo}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Add, generate with AI, replace, or customize placement</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/30 overflow-x-auto">
          {[
            { id: 'generate', label: 'Generate with AI', icon: Sparkles },
            { id: 'stock', label: 'Stock Library', icon: Search },
            { id: 'url', label: 'Image URL', icon: LinkIcon },
            { id: 'upload', label: 'Upload File', icon: Upload }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-brand-500 text-brand-400 bg-brand-500/10 rounded-t-lg'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: AI GENERATOR */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>AI Prompt Description</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe what image you want to generate..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerAiGenerate}
                    disabled={generating}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                    <span>{generating ? 'Generating...' : 'Generate AI Image'}</span>
                  </button>
                </div>
              </div>

              {/* Style Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400">Visual Art Style</label>
                <div className="flex flex-wrap gap-2">
                  {AI_STYLES.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setSelectedStyle(style.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedStyle === style.id
                          ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center group">
                {generating ? (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono animate-pulse">Synthesizing AI visual...</span>
                  </div>
                ) : currentUrl ? (
                  <>
                    <img
                      src={currentUrl}
                      alt="AI Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready to Apply
                      </span>
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 rounded-md bg-black/60 text-slate-300 hover:text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View Full
                      </a>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-500">Click Generate AI Image to create visual</span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STOCK LIBRARY */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              {/* Category Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search stock photography (e.g. tech, coding, health)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of stock thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {filteredStocks.map(stock => {
                  const isSelected = currentUrl === stock.url;
                  return (
                    <div
                      key={stock.id}
                      onClick={() => handleSelectStock(stock.url)}
                      className={`group relative h-28 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-500 ring-2 ring-brand-500 shadow-md'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={stock.url}
                        alt={stock.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2 text-left">
                        <span className="text-[10px] font-semibold text-white truncate block">
                          {stock.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyCustomUrl} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-brand-400" />
                  <span>Direct Web Image URL</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shrink-0"
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Preview */}
              {customInputUrl && (
                <div className="w-full h-52 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                  <img
                    src={customInputUrl}
                    alt="Custom Preview"
                    onError={() => setUrlError(true)}
                    onLoad={() => setUrlError(false)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </form>
          )}

          {/* TAB 4: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-slate-700 hover:border-brand-500 bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all p-4 text-center">
                <Upload className="w-8 h-8 text-brand-400 mb-2" />
                <span className="text-xs font-bold text-white">Click or drag image to upload</span>
                <span className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, WebP, SVG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadPreview && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Uploaded File Preview</span>
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                    <img
                      src={uploadPreview}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placement / Display Mode Option */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Slide Placement Mode</span>
            </span>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setImagePosition('card')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  imagePosition === 'card'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">Side / Layout Visual</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Displays in split column or dedicated image container.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setImagePosition('background')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  imagePosition === 'background'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">Slide Background</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Covers full slide with a smooth dark contrast overlay.
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div>
            {slide.image && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Image</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Slide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
