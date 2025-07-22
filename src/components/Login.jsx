// src/components/Login.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link }          from 'react-router-dom';
import { AuthContext }                from '../context/authcontext';
import heroCartoon                    from '../assets/hero-cartoon.png';

export default function Login() {
  const { login, isLoading, error } = useContext(AuthContext);
  const [username, setUsername]      = useState('');
  const [password, setPassword]      = useState('');
  const [remember, setRemember]      = useState(false);
  const navigate                     = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(username, password, remember);
      navigate('/');
    } catch {
      // error surfaced via AuthContext.error
    }
  };

  return (
    <div className="container flex-center vh-100">
      <div className="card glass-card p-lg" style={{ maxWidth: 900 }}>
        <div className="flex-center mb-md gap-lg">
          <img
            src={heroCartoon}
            alt="Team Mascot"
            style={{ maxWidth: '90%', height: 'auto' }}
          />
        </div>

        <h1 className="section-title">Welcome back!</h1>
        <p className="text-center mb-md">
          Sign in to make your picks and climb the leaderboard.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="text-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-md">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="text-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div
            className="flex-center mb-md"
            style={{ justifyContent: 'space-between', width: '100%' }}
          >
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />{' '}
              Remember me
            </label>
            <Link to="/forgot-password" className="btn-outline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="error-message mb-md">{error}</p>
          )}

          <button
            type="submit"
            className="button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-md">
          Don’t have an account?{' '}
          <Link to="/signup" className="btn-outline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}