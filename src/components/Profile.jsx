// src/components/Profile.jsx

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/authcontext';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [avatarPreview, setAvatarPreview]         = useState(user.avatarUrl || '/assets/default-avatar.png');
  const [firstGoalPlayers, setFirstGoalPlayers] = useState([]);
  const [gwgPlayers, setGwgPlayers]             = useState([]);
  const [defaultFirstGoal, setDefaultFirstGoal] = useState(user.defaultFirstGoal || '');
  const [defaultGWG, setDefaultGWG]             = useState(user.defaultGWG || '');

  // 1) Load players list
  useEffect(() => {
    api.get('/players')
      .then(res => {
        setFirstGoalPlayers(res.data);
        setGwgPlayers(res.data);
      })
      .catch(console.error);
  }, []);

  // 2) Persist defaultFirstGoal
  useEffect(() => {
    if (!defaultFirstGoal) return;
    api.post('/user/defaults', { defaultFirstGoal })
      .then(res => {
        const updated = { ...user, defaultFirstGoal: res.data.defaultFirstGoal };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(console.error);
  }, [defaultFirstGoal, user, setUser]);

  // 3) Persist defaultGWG
  useEffect(() => {
    if (!defaultGWG) return;
    api.post('/user/defaults', { defaultGWG })
      .then(res => {
        const updated = { ...user, defaultGWG: res.data.defaultGWG };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(console.error);
  }, [defaultGWG, user, setUser]);

  // 4) Upload & preview avatar
  const handleUpload = e => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) return;

    // show a local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // prepare FormData
    const formData = new FormData();
    formData.append('avatar', file);

    api.post('/user/avatar', formData)
      .then(res => {
        const updated = { ...user, avatarUrl: res.data.avatarUrl };
        setUser(updated);

        // Persist into whichever storage AuthContext reads from
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(updated));
        } else {
          localStorage.setItem('user', JSON.stringify(updated));
        }
      })
      .catch(console.error);
  };

  return (
    <div className="container mb-lg">
      <div className="card">
        <h2 className="section-title">Your Profile</h2>

        <div className="flex-center mb-md">
          <img
            src={avatarPreview}
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

        <p className="text-center mb-md">@{user.username}</p>

        <div className="mb-md">
          <label className="form-label">Default First Goal</label>
          <select
            className="select-input"
            value={defaultFirstGoal}
            onChange={e => setDefaultFirstGoal(e.target.value)}
          >
            <option value="">Select Player</option>
            {firstGoalPlayers.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
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
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}