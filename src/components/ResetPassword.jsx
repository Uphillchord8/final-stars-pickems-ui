import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ResetPassword() {
  const [search]   = useSearchParams();
  const navigate   = useNavigate();
  const token      = search.get('token');
  const userId     = search.get('id');

  const [password, setPassword]   = useState('');
  const [confirm,  setConfirm]    = useState('');
  const [isLoading, setLoading]   = useState(false);
  const [error,    setError]      = useState('');
  const [message,  setMessage]    = useState('');

  useEffect(() => {
    if (!token || !userId) {
      setError('Invalid or expired reset link.');
    }
  }, [token, userId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords must match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset', {
        userId,
        token,
        newPassword: password
      });
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // Early error (no token or userId)
  if (error && !message) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="container flex-center" style={{ minHeight: '100vh' }}>
      <div className="card">
        <h2 className="section-title">Reset Password</h2>

        {message ? (
          <p className="text-success mb-md">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-md">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                className="text-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-md">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                className="text-input"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="button"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}