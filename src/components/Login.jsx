// src/components/Login.jsx

import React, { useRef, useState } from 'react';
import { Link, useNavigate }          from 'react-router-dom';
import { useAuth }                    from '../context/authcontext';

export default function Login() {
  const emailRef    = useRef();
  const passwordRef = useRef();
  const { login }   = useAuth();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="vh-100"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="card glass-card p-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="title">Log In</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="form gap-lg">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            Log In
          </button>
        </form>

        <div className="footer-text" style={{ marginTop: '1rem' }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="footer-text" style={{ marginTop: '0.5rem' }}>
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}