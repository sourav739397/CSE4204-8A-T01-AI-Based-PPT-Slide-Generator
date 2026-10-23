import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Presentation,
  Sparkles,
  Settings,
  Github,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Shield,
  Zap,
  LogIn
} from 'lucide-react';
import { getSettings } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const s = getSettings();
    setHasApiKey(Boolean(s?.geminiApiKey?.trim()));
  }, [showSettings]);

  // Click outside listener for user dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/workspace', label: 'Workspace' },
    { to: '/free-features', label: '100% Free & Open' },
  ];

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Presentation className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                SlideGenius<span className="text-brand-400 font-extrabold ml-1">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Free & Open Source
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Status & Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-xs"
              title="AI & API Settings"
            >
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-brand-400'}`} />
              <span className="hidden sm:inline">{hasApiKey ? 'Gemini API' : 'Smart AI (Free)'}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* GitHub Repo */}
            <a
              href="https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* User Auth Section */}
            {isAuthenticated && user ? (
              /* User Menu Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-all"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover border border-brand-500/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                      {initials}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 p-2 z-50 backdrop-blur-xl animate-scaleIn">
                    {/* User Info Header */}
                    <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                      <div className="flex items-center gap-2.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover border border-brand-500/50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {initials}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {user.role || 'Creator'}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-0.5">
                      <Link
                        to="/workspace"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-brand-400" />
                        <span>My Workspace</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-400" />
                        <span>Profile & Settings</span>
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowSettings(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>AI Engine Config</span>
                      </button>

                      <div className="border-t border-slate-800/80 my-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Sign In & Sign Up buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-850 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Up Free</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
