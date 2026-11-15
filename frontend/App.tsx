import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import AuthContainer from './components/forms/AuthContainer';
import MainApp from './components/MainApp';
import { supabase } from './services/supabase';
import Loader from './components/Loader';
import { User } from '@supabase/supabase-js';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import ResetPasswordForm from './components/ResetPasswordForm';
import AuthCallback from './pages/auth/callback';
import { useAuth } from './context/AuthContext';
import { useSessionHeartbeat } from './src/hooks/useSessionHeartbeat';

const App: React.FC = () => {
  const { session, user, loading } = useAuth();
  const { signOut: clerkSignOut } = useClerk();
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  useSessionHeartbeat();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await clerkSignOut();
    } catch {
      // ignore
    }
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const handleAvatarUpdate = useCallback((newAvatarUrl: string) => {
    setCurrentUser(prevUser => (prevUser ? { ...prevUser, user_metadata: { ...prevUser.user_metadata, avatar_url: newAvatarUrl } } : prevUser));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader text="Loading session..." />
      </div>
    );
  }

  const effectiveUser = currentUser || user;
  const isAuthenticated = Boolean(session || effectiveUser);

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/login/*"
            element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup/*"
            element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/reset-password"
            element={<ResetPasswordForm />}
          />
          <Route
            path="/auth/callback"
            element={<AuthCallback />}
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <MainApp
                  user={effectiveUser!}
                  onLogout={handleLogout}
                  onAvatarUpdate={handleAvatarUpdate}
                />
              }
            />
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
