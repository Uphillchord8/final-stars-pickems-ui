// src/components/Profile.jsx

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/authcontext';

const API = process.env.REACT_APP_API_URL;  
// e.g. "https://dallas-stars-pickems-27161.nodechef.com"

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // 1) avatarPreview now resets whenever user.avatarUrl changes
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatarUrl || '/assets/default-avatar.png'
  );
  useEffect(() => {
    setAvatarPreview(user.avatarUrl || '/assets/default-avatar.png');
  }, [user.avatarUrl]);

  // 2) Players and defaults state
  const [firstGoalPlayers, setFirstGoalPlayers] = useState([]);
  const [gwgPlayers, setGwgPlayers]             = useState([]);
  const [defaultFirstGoal, setDefaultFirstGoal] = useState(user.defaultFirstGoal || '');
  const [defaultGWG, setDefaultGWG]             = useState(user.defaultGWG || '');

  // 3) Load all players once
  useEffect(() => {
    api.get('/players')
      .then(res => {
        setFirstGoalPlayers(res.data);
        setGwgPlayers(res.data);
      })
      .catch(console.error);
  }, []);

  // 4) Persist defaultFirstGoal
  useEffect(() => {
    if (!defaultFirstGoal) return;
    api.post('/user/defaults', { defaultFirstGoal })
      .then(res => {
        const updated = { ...user, defaultFirstGoal: res.data.defaultFirstGoal };
        setUser(updated);
        sessionStorage.setItem('user', JSON.stringify(updated));
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(console.error);
  }, [defaultFirstGoal, user, setUser]);

  // 5) Persist defaultGWG
  useEffect(() => {
    if (!defaultGWG) return;
    api.post('/user/defaults', { defaultGWG })
      .then(res => {
        const updated = { ...user, defaultGWG: res.data.defaultGWG };
        setUser(updated);
        sessionStorage.setItem('user', JSON.stringify(updated));
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(console.error);
  }, [defaultGWG, user, setUser]);

  // 6) Upload & preview avatar
  const handleUpload = e => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) return;

    // show a local preview immediately
    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('avatar', file);

    api.post('/user/avatar', formData)
      .then(res => {
        const updated = { ...user, avatarUrl: res.data.avatarUrl };
        setUser(updated);
        sessionStorage.setItem('user', JSON.stringify(updated));
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(console.error);
  };

  // Helper to build a full URL for the avatar
  const getAvatarSrc = urlPath => {
    if (!urlPath) return '/assets/default-avatar.png';
    if (urlPath.startsWith('http')) return urlPath;
    return `${API}${urlPath}`;
  };

  // Compute the final src for the <img>
  const avatarSrc = getAvatarSrc(avatarPreview);

  return (
    <div className="container mb-lg">
      <div className="card">
        <h2 className="section-title">Your Profile</h2>

        <div className="flex-center mb-md">
          <img
            src={avatarSrc}
            alt="User avatar"
            className="avatar"
          />
        </div>

        <div className="flex-center mb-md">
          <label className="upload-wrapper">
            <span className="upload-text">Change Avatar</span>
            <input
              type="file"
              accept="image/*"
              className="upload-input"
              onChange={handleUpload}
            />
          </label>
        </div>

        <p className="text-center mb-md"> {user.username} </p>

        <div className="mb-md">
          <label className="form-label">Default First Goal</label>
          <select
            className="select-input"
            value={defaultFirstGoal}
            onChange={e => setDefaultFirstGoal(e.target.value)}
          >
            <option value="">Select Player</option>
            {firstGoalPlayers.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-md">
          <label className="form-label">Default GWG</label>
          <select
            className="select-input"
            value={defaultGWG}
            onChange={e => setDefaultGWG(e.target.value)}
          >
            <option value="">Select Player</option>
            {gwgPlayers.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}