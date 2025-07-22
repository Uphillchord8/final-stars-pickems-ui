// src/components/Signup.jsx

import React, { useRef, useState } from 'react';
import { Link, useNavigate }       from 'react-router-dom';
import { useAuth }                 from '../context/authcontext';

export default function Signup() {
  const usernameRef           = useRef();
  const emailRef              = useRef();
  const passwordRef           = useRef();
  const passwordConfirmRef    = useRef();
  const fileInputRef          = useRef();
  const { signup }            = useAuth();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate              = useNavigate();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const username = usernameRef.current.value;
    const email    = emailRef.current.value;
    const pwd      = passwordRef.current.value;
    const confirm  = passwordConfirmRef.current.value;

    if (pwd !== confirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      // Pass username, email, password to your signup API
      await signup(username, email, pwd);
      navigate('/');
    } catch {
      setError('Failed to create an account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex-center vh-100">
      <div className="card p-lg signup-card">
        <h2 className="title">Create Your Account</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="avatar-section">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="file-input"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <label htmlFor="avatar" className="avatar-preview">
              {preview
                ? <img
                    src={preview}
                    alt="Avatar Preview"
                    className="avatar-preview-img"
                  />
                : 'Upload Avatar'}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              ref={usernameRef}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-confirm" className="form-label">
              Confirm Password
            </label>
            <input
              id="password-confirm"
              type="password"
              ref={passwordConfirmRef}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>

        <div className="footer-text mt-md">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}