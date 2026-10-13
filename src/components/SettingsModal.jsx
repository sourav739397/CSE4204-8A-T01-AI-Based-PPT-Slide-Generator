import React, { useState } from 'react';
import { X, Key, Cpu, CheckCircle2, AlertCircle, ExternalLink, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { getSettings, saveSettings, getProjects } from '../services/storageService';

const DEFAULT_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Recommended - Fastest & Free)' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Next-Gen High Performance)' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite (Low Latency)' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash Latest' },
];

export default function SettingsModal({ onClose }) {
  const currentSettings = getSettings();
  const [apiKey, setApiKey] = useState(currentSettings.geminiApiKey || '');
  const [model, setModel] = useState(
    currentSettings.model || 'gemini-3-flash-preview'
  );
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS);
  const [useMockFallback, setUseMockFallback] = useState(currentSettings.useMockFallback !== false);
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [testError, setTestError] = useState('');
  const [testSuccessMsg, setTestSuccessMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveSettings({
      geminiApiKey: apiKey.trim(),
      model,
      useMockFallback,
      autoSave: true
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleTestKey = async () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setTestStatus('error');
      setTestError('Please enter a Google Gemini API Key first.');
      return;
    }

    setTestStatus('testing');
    setTestError('');
    setTestSuccessMsg('');
    try {
      // 1. Discover models supported by this specific API key
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${trimmedKey}`;
      const listRes = await fetch(listUrl);

      if (!listRes.ok) {
        const errJson = await listRes.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `API error (${listRes.status}): Invalid API key or permission denied`);
      }

      const listData = await listRes.json();
      const rawModels = listData.models || [];
      const contentModels = rawModels
        .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''));

      if (contentModels.length > 0) {
        setAvailableModels(
          contentModels.map(mName => ({
            id: mName,
            name: mName.includes('flash') ? `${mName} (Fast & Recommended)` : mName
          }))
        );
      }

      // Pick best active model: current selection if valid, or first flash model, or first available
      let targetModel = model;
      if (!contentModels.includes(targetModel)) {
        targetModel =
          contentModels.find(m => m.includes('2.0-flash') || m.includes('2.5-flash') || m.includes('flash')) ||
          contentModels[0] ||
          'gemini-2.0-flash';
        setModel(targetModel);
      }

      // 2. Test generating content with targetModel
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${trimmedKey}`;
      const res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `API returned status ${res.status}`);
      }

      setTestStatus('success');
      setTestSuccessMsg(`Verified with ${targetModel}!`);
    } catch (err) {
      setTestStatus('error');
      setTestError(err.message || 'Failed to connect to Google Gemini API');
    }
  };

  const handleExportData = () => {
    const projects = getProjects();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `slidegenius_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to reset all local presentations to demo defaults?')) {
      localStorage.removeItem('slidegenius_projects_v1');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & Local Settings</h3>
              <p className="text-xs text-slate-400">Configure free AI options or use built-in offline generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto">
          {/* Gemini API Key Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1 underline underline-offset-2"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Google Gemini offers a 100% free tier (60 requests/min). Your key is stored securely only in your browser&apos;s local storage and never sent to any intermediary server.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testStatus === 'testing'}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {testStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                  </>
                ) : (
                  'Test Connection'
                )}
              </button>

              {testStatus === 'success' && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {testSuccessMsg || 'API Key Verified!'}
                </span>
              )}
              {testStatus === 'error' && (
                <span className="flex items-center gap-1 text-xs text-rose-400 font-medium truncate max-w-xs" title={testError}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {testError}
                </span>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> AI Model
            </label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {availableModels.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Offline Smart Generator Fallback */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <input
              type="checkbox"
              id="mockFallback"
              checked={useMockFallback}
              onChange={e => setUseMockFallback(e.target.checked)}
              className="mt-1 rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor="mockFallback" className="cursor-pointer">
              <span className="text-xs font-semibold text-white block">Offline Fallback Engine</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-relaxed">
                If no API key is provided or the network is unavailable, automatically use the high-quality built-in generative engine.
              </span>
            </label>
          </div>

          {/* Data Backup & Management */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Local Data & Backups
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export All Projects (JSON)
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 border border-rose-800/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset Local Data
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-md shadow-brand-500/25 transition-all"
          >
            {savedSuccess ? 'Settings Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
