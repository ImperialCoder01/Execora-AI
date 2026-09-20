import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AnalysisResult } from '../types';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  groqApiKey?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  userGroqKey: string;
  setUserGroqKey: (key: string) => void;
  isLoading: boolean;
  loginAsDemoAdmin: () => void;
  loginAsDemoUser: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signupWithEmail: (email: string, pass: string, role?: UserRole) => Promise<{ error?: string }>;
  logout: () => void;
  savedAnalyses: AnalysisResult[];
  saveAnalysisToHistory: (analysis: AnalysisResult) => void;
  deleteAnalysisFromHistory: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('execora_user');
    if (cached) {
      try { return JSON.parse(cached); } catch { return null; }
    }
    return {
      id: 'demo-admin-id',
      email: 'admin@execora.ai',
      role: 'admin',
      groqApiKey: localStorage.getItem('execora_groq_key') || ''
    };
  });

  const [userGroqKey, setUserGroqKeyState] = useState<string>(() => {
    return localStorage.getItem('execora_groq_key') || '';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>(() => {
    const cached = localStorage.getItem('execora_history');
    if (cached) {
      try { return JSON.parse(cached); } catch { return []; }
    }
    return [];
  });

  const setUserGroqKey = (key: string) => {
    setUserGroqKeyState(key);
    localStorage.setItem('execora_groq_key', key);
    if (user) {
      const updated = { ...user, groqApiKey: key };
      setUser(updated);
      localStorage.setItem('execora_user', JSON.stringify(updated));
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser: UserProfile = {
      id: 'demo-admin-id',
      email: 'admin@execora.ai',
      role: 'admin',
      groqApiKey: userGroqKey
    };
    setUser(adminUser);
    localStorage.setItem('execora_user', JSON.stringify(adminUser));
  };

  const loginAsDemoUser = () => {
    const standardUser: UserProfile = {
      id: 'demo-user-id',
      email: 'dev@execora.ai',
      role: 'user',
      groqApiKey: userGroqKey
    };
    setUser(standardUser);
    localStorage.setItem('execora_user', JSON.stringify(standardUser));
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      setIsLoading(false);
      if (error) return { error: error.message };
      if (data.user) {
        const role = email.includes('admin') ? 'admin' : 'user';
        const profile: UserProfile = { id: data.user.id, email: data.user.email || email, role };
        setUser(profile);
        localStorage.setItem('execora_user', JSON.stringify(profile));
      }
      return {};
    } else {
      setIsLoading(false);
      const role: UserRole = email.includes('admin') ? 'admin' : 'user';
      const profile: UserProfile = { id: `user-${Date.now()}`, email, role, groqApiKey: userGroqKey };
      setUser(profile);
      localStorage.setItem('execora_user', JSON.stringify(profile));
      return {};
    }
  };

  const signupWithEmail = async (email: string, pass: string, role: UserRole = 'user') => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password: pass });
      setIsLoading(false);
      if (error) return { error: error.message };
      if (data.user) {
        const profile: UserProfile = { id: data.user.id, email: data.user.email || email, role };
        setUser(profile);
        localStorage.setItem('execora_user', JSON.stringify(profile));
      }
      return {};
    } else {
      setIsLoading(false);
      const profile: UserProfile = { id: `user-${Date.now()}`, email, role, groqApiKey: userGroqKey };
      setUser(profile);
      localStorage.setItem('execora_user', JSON.stringify(profile));
      return {};
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('execora_user');
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
  };

  const saveAnalysisToHistory = (analysis: AnalysisResult) => {
    setSavedAnalyses((prev) => {
      const filtered = prev.filter((a) => a.timestamp !== analysis.timestamp);
      const updated = [analysis, ...filtered].slice(0, 20);
      localStorage.setItem('execora_history', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAnalysisFromHistory = (timestamp: string) => {
    setSavedAnalyses((prev) => {
      const updated = prev.filter((a) => a.timestamp !== timestamp);
      localStorage.setItem('execora_history', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'user',
        userGroqKey,
        setUserGroqKey,
        isLoading,
        loginAsDemoAdmin,
        loginAsDemoUser,
        loginWithEmail,
        signupWithEmail,
        logout,
        savedAnalyses,
        saveAnalysisToHistory,
        deleteAnalysisFromHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
