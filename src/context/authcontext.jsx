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
  isRestoring: true,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  resetPassword: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState(null);

  // Restore session on mount
  useEffect(() => {
    const token      = sessionStorage.getItem('token')
                      || localStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user')
                      || localStorage.getItem('user');

    if (token && storedUser) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }
    setIsRestoring(false);
  }, []);

  // Shared: set session in context, axios, and storage
  const setSession = useCallback((userData, token, remember) => {
    setUser(userData);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const setter  = remember ? localStorage : sessionStorage;
    const clearer = remember ? sessionStorage : localStorage;

    setter.setItem('token', token);
    setter.setItem('user', JSON.stringify(userData));

    clearer.removeItem('token');
    clearer.removeItem('user');
  }, []);

  const login = useCallback(async (username, password, remember = false) => {
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password, remember });
      setSession(data.user, data.token, remember);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const signup = useCallback(async (username, email, password, remember = false) => {
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { username, email, password, remember });
      setSession(data.user, data.token, remember);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const logout = useCallback(() => {
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  const resetPassword = useCallback(async (email) => {
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
  }, []);

  // Memoize context value
  const value = useMemo(() => ({
    user,
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

// This hook lets your components access auth state & methods:
export function useAuth() {
  return useContext(AuthContext);
}