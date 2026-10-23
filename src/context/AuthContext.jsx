import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentSession,
  loginUser,
  registerUser,
  loginAsDemo as serviceLoginDemo,
  logoutUser,
  updateUserProfile,
  changeUserPassword,
  resetPassword as serviceResetPassword
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = getCurrentSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const loggedInUser = await loginUser(email, password, rememberMe);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (details) => {
    const registeredUser = await registerUser(details);
    setUser(registeredUser);
    return registeredUser;
  };

  const loginAsDemo = async () => {
    const demo = await serviceLoginDemo();
    setUser(demo);
    return demo;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');
    const updated = updateUserProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user) throw new Error('Not authenticated');
    return await changeUserPassword(user.id, oldPassword, newPassword);
  };

  const resetPassword = async (email, newPassword) => {
    return await serviceResetPassword(email, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        changePassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
