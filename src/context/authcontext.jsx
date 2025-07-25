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
  // Initialize user safely from storage, guarding against literal "undefined"
  const [user, setUser] = useState(() => {
    const rawSession = sessionStorage.getItem('user');
    const rawLocal   = localStorage.getItem('user');
    let raw = rawSession || rawLocal;

    if (raw === 'undefined') {
      raw = null;
    }
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Invalid user in storage, clearing it.', raw);
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [isRestoring, setIsRestoring] = useState(true);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState(null);

  // Restore token & Axios header on mount
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

  // Login action
  const login = useCallback(
    async (username, password, remember = false) => {
      setError(null);
      setIsLoading(true);
      try {
        const { data } = await api.post('/auth/login', {
          username,
          password,
          remember
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

  // Signup action
  const signup = useCallback(
    async (username, email, password, remember = false) => {
      setError(null);
      setIsLoading(true);
      try {
        const { data } = await api.post('/auth/signup', {
          username,
          email,
          password,
          remember
        });
        setSession(data.user, data.token, remember);
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

  // Logout action
  const logout = useCallback(() => {
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  // Reset password action
  const resetPassword = useCallback(
    async email => {
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

  // Memoize context value
  const value = useMemo(
    () => ({
      user,
      isRestoring,
      isLoading,
      error,
      login,
      signup,
      logout,
      resetPassword
    }),
    [user, isRestoring, isLoading, error, login, signup, logout, resetPassword]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the auth context
export function useAuth() {
  return useContext(AuthContext);
}