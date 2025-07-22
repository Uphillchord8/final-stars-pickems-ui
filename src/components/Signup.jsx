// src/components/Signup.jsx

import React, { useRef, useState } from 'react';
import { Link, useNavigate }       from 'react-router-dom';
import { useAuth }                 from '../context/authcontext';

export default function Signup() {
  const emailRef       = useRef();
  const passwordRef    = useRef();
  const passwordConfirmRef = useRef();
  const { signup }     = useAuth();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate       = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create Your Account</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="avatar-section">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="file-input"
            />
            <label htmlFor="avatar" className="avatar-preview">
              {/* preview logic here */}
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" ref={emailRef} className="form-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" ref={passwordRef} className="form-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="password-confirm" className="form-label">Confirm Password</label>
            <input id="password-confirm" type="password" ref={passwordConfirmRef} className="form-input" required />
          </div>
          <button disabled={loading} className="button">
            Sign Up
          </button>
        </form>
      </div>
      <div className="footer-text">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}