// src/context/authcontext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import api from '../utils/api';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isRestoring: true,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  resetPassword: async () => {}
});

export const AuthProvider = ({ children }) => {
  // Initialize user from storage
  const [user, setUser] = useState(() => {
    const rawSession = sessionStorage.getItem('user');
    const rawLocal   = localStorage.getItem('user');
    let raw = rawSession || rawLocal;
    if (raw === 'undefined') raw = null;
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [isRestoring, setIsRestoring] = useState(true);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState(null);

  // Restore token on mount
  useEffect(() => {
    const token =
      sessionStorage.getItem('token') ||
      localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    setIsRestoring(false);
  }, []);

  // Shared session setter
  const setSession = useCallback((userData, token, remember) => {
    setUser(userData);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const store   = remember ? localStorage : sessionStorage;
    const cleanup = remember ? sessionStorage : localStorage;

    store.setItem('token', token);
    store.setItem('user', JSON.stringify(userData));
    cleanup.removeItem('token');
    cleanup.removeItem('user');
  }, []);

  // Login
  const login = useCallback(
    async (username, password, remember = false) => {
      setError(null);
      setIsLoading(true);
      try {
        const { data } = await api.post('/auth/login', {
          username, password, remember
        });
        setSession(data.user, data.token, remember);
        return data.user;
      } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setSession]
  );

  // Signup (supports both JSON and FormData)
  const signup = useCallback(
    async (...args) => {
      setError(null);
      setIsLoading(true);
      try {
        let response;
        if (args[0] instanceof FormData) {
          // FormData path (with avatar)
          response = await api.post(
            '/auth/signup',
            args[0],
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        } else {
          // Legacy JSON path
          const [username, email, password, remember = false] = args;
          response = await api.post('/auth/signup', {
            username, email, password, remember
          });
        }

        const { data } = response;
        const rememberFlag = args[3] ?? false;
        setSession(data.user, data.token, rememberFlag);
        return data.user;
      } catch (err) {
        setError(err.response?.data?.error || 'Signup failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setSession]
  );

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  // Reset password
  const resetPassword = useCallback(
    async (email) => {
      setError(null);
      setIsLoading(true);
      try {
        await api.post('/auth/reset-password', { email });
      } catch (err) {
        setError(err.response?.data?.error || 'Reset password failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Context value
  const value = useMemo(() => ({
    user,
    setUser,
    isRestoring,
    isLoading,
    error,
    login,
    signup,
    logout,
    resetPassword
  }), [user, isRestoring, isLoading, error, login, signup, logout, resetPassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export function useAuth() {
  return useContext(AuthContext);
}