import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Key,
  Layers,
  Sparkles,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Download,
  Trash2,
  Briefcase,
  FileText,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects, getUserStats, getAllRawProjects } from '../services/storageService';
import confetti from 'canvas-confetti';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // User stats
  const [stats, setStats] = useState({ totalProjects: 0, totalSlides: 0, lastActive: null });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    setName(user.name || '');
    setRole(user.role || 'Creator');
    setBio(user.bio || '');
    setAvatar(user.avatar || '');

    const userStats = getUserStats(user.id);
    setStats(userStats);
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess('');
    try {
      await updateProfile({ name, role, bio, avatar });
      setSaveSuccess('Profile saved successfully!');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters long.');
      return;
    }

    setSavingPwd(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPwdSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(''), 3000);
    } catch (err) {
      setPwdError(err.message || 'Failed to change password.');
    } finally {
      setSavingPwd(false);
    }
  };

  const handleExportBackup = () => {
    const userProjects = getProjects(user.id);
    const blob = new Blob([JSON.stringify(userProjects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slidegenius-backup-${user.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (user.name || 'User')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative group shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-500/50 shadow-xl shadow-brand-500/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-brand-500/25 border-2 border-white/20">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white" title="Active">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* User Details */}
          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user.email}</span>
                  <span className="text-slate-600">•</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {user.role || 'Creator'}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0">
                <Link
                  to="/workspace"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  My Workspace
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-xl">
              {user.bio || 'Creating compelling, AI-enhanced slide presentations with SlideGenius.'}
            </p>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Presentations Created
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {stats.totalProjects}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Total Slides Designed
            </span>
            <span className="text-2xl font-black text-brand-400 mt-1 block">
              {stats.totalSlides}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              AI Plan & Tier
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Free Community Edition</span>
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form & Security Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
            <User className="w-4 h-4 text-brand-400" />
            <h2 className="text-base font-bold text-white">Edit Profile Details</h2>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Professional Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Data Scientist"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Avatar Image URL (Optional)</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Short Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your team or collaborators about yourself..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Security & Password</h2>
          </div>

          {pwdError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{pwdSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingPwd}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{savingPwd ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>

          {/* Backup Data Section */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Data Ownership & Portability</span>
            <p className="text-[11px] text-slate-500">
              Download all your presentations, slide layouts, and outlines in standard JSON format.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Export All My Presentations (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
