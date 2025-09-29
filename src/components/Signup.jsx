// src/components/Signup.jsx
import React, { useRef, useState } from 'react';
import { Link, useNavigate }       from 'react-router-dom';
import { useAuth }                 from '../context/authcontext';

export default function Signup() {
  const usernameRef        = useRef();
  const emailRef           = useRef();
  const passwordRef        = useRef();
  const passwordConfirmRef = useRef();
  const fileInputRef       = useRef();
  const { signup }         = useAuth();
  const [error, setError]  = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate           = useNavigate();

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
    const username = usernameRef.current.value.trim();
    const email    = emailRef.current.value.trim();
    const pwd      = passwordRef.current.value;
    const confirm  = passwordConfirmRef.current.value;

    if (pwd !== confirm) {
      return setError('Passwords do not match');
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email',    email);
    formData.append('password', pwd);
    if (fileInputRef.current.files[0]) {
      formData.append('avatar', fileInputRef.current.files[0]);
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData);
      navigate('/');
    } catch {
      setError('Failed to create an account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mb-lg">
      <div className="card">
        <h2 className="section-title">Create Your Account</h2>

        {error && <div className="error-message mb-md">{error}</div>}

        <form onSubmit={handleSubmit} className="input">
	  <div className="avatar-section mb-md">
	    <label htmlFor="avatar" className="upload-wrapper">
    	  {preview ? (
        	<img
        	  src={preview}
          	alt="Avatar Preview"
          	className="player-pic"
       	 />
     	 ) : (
     	   <span className="upload-text">Upload Avatar</span>
    	  )}
    	  <input
        	type="file"
        	id="avatar"
        	accept="image/*"
        	className="upload-input"    // visually hidden via CSS
        	ref={fileInputRef}
        	onChange={handleFileChange}
     	 />
    		</label>
 	 </div>



       <div className="form-group">
            <label htmlFor="username" className="input">Username</label>
            <input
              id="username"
              type="text"
              ref={usernameRef}
              className="form-input"
              placeholder="StarsFan123"
              required
            />
         </div>

       <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              className="form-input"
              placeholder="you@example.com"
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
              placeholder="••••••••"
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
              placeholder="••••••••"
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

        <div className="footer-text text-center mt-md">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}