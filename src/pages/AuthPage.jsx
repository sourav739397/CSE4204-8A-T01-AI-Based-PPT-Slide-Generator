import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Presentation,
  Sparkles,
  Lock,
  Mail,
  User,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Eye,
  EyeOff,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function AuthPage({ initialMode = 'signin' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register, loginAsDemo, resetPassword } = useAuth();

  // Mode: 'signin' | 'signup' | 'forgot'
  const [mode, setMode] = useState(
    location.pathname === '/signup' ? 'signup' : initialMode
  );

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Creator');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Destination after login
  const returnTo = location.state?.from || '/workspace';

  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('signin');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await login(email, password, rememberMe);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        navigate(returnTo, { replace: true });
      } else if (mode === 'signup') {
        await register({ name, email, password, role });
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
        navigate(returnTo, { replace: true });
      } else if (mode === 'forgot') {
        await resetPassword(email, password);
        setSuccessMsg('Your password has been updated! You can now sign in.');
        setTimeout(() => setMode('signin'), 1800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginAsDemo();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
      navigate(returnTo, { replace: true });
    } catch (err) {
      setErrorMsg('Failed to log in as demo user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[320px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Presentation className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              SlideGenius<span className="text-brand-400 font-extrabold ml-1">AI</span>
            </span>
          </Link>

          <h2 className="text-2xl font-bold tracking-tight text-white pt-2">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Free Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-sm text-slate-400">
            {mode === 'signin' && 'Log in to access your presentations and workspace.'}
            {mode === 'signup' && 'Start generating professional AI slide decks in seconds.'}
            {mode === 'forgot' && 'Enter your email and set a new password.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-2xl shadow-black/40 space-y-6">
          {/* Mode Switcher Tabs (Sign In / Sign Up) */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Quick Demo Login Button */}
          {mode === 'signin' && (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 text-xs font-semibold shadow-inner transition-all hover:border-indigo-400 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>⚡ One-Click Instant Demo Login (Alex Rivera)</span>
            </button>
          )}

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            )}

            {/* Role (Sign Up only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Role / Discipline</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                >
                  <option value="Creator">Content Creator / Presenter</option>
                  <option value="Product Lead">Product Manager / Lead</option>
                  <option value="Executive">Executive / Founder</option>
                  <option value="Engineer">Software Engineer / Tech Lead</option>
                  <option value="Educator">Educator / Academic</option>
                  <option value="Student">Student / Researcher</option>
                </select>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mode === 'forgot' ? 'New Password' : 'Password'}</span>
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'forgot' ? 'Enter at least 6 characters' : '••••••••'}
                  minLength={6}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            {mode === 'signin' && (
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Workspace'}
                    {mode === 'signup' && 'Create Account & Continue'}
                    {mode === 'forgot' && 'Reset & Save Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch back link for forgot password */}
          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Safe local authentication</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
