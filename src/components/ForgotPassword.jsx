import React, { useState } from 'react';
import api from '../utils/api';

export default function ForgotPassword() {
  const [email,    setEmail]    = useState('');
  const [isLoading, setLoading] = useState(false);
  const [message,  setMessage]  = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot', { email });
      setMessage(data.message);
    } catch {
      setError('Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '100vh' }}>
      <div className="card">
        <h2 className="section-title">Forgot Password</h2>

        {message && <p className="text-success mb-md">{message}</p>}
        {error   && <p className="error-message mb-md">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="text-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}