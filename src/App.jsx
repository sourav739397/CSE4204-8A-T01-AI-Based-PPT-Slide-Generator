import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import OutlinePage from './pages/OutlinePage';
import EditorPage from './pages/EditorPage';
import FreeFeaturesPage from './pages/FreeFeaturesPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage initialMode="signin" />} />
              <Route path="/signup" element={<AuthPage initialMode="signup" />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/project/:projectId/outline" element={<OutlinePage />} />
              <Route path="/project/:projectId/editor" element={<EditorPage />} />
              <Route path="/free-features" element={<FreeFeaturesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
