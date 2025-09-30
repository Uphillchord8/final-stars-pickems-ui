import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const API = process.env.REACT_APP_API_URL || '';

function getAvatarSrc(urlPath) {
  if (!urlPath) return '/assets/default-avatar.png';
  if (urlPath.startsWith('http')) return urlPath;
  return `${API}${urlPath}`;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/leaderboard');
        setLeaders(data);
      } catch {
        setError('Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <p className="text-center">Loading leaderboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Always render the page even if all points are zero or array is empty
  const podium = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  const hasAnyPoints = leaders.some(u => (u.total_points || 0) > 0);

  return (
    <div className="container">
      <h1 className="section-title text-center">Leaderboard</h1>

      {!hasAnyPoints && (
        <p className="text-center mb-md">No completed picks yet. Users are listed with zero points.</p>
      )}

      <div className="podium flex-center mb-lg">
        {podium.map((user, idx) => (
          <div key={user.id} className="card text-center">
            <div className="fw-bold text-lg mb-sm">#{idx + 1}</div>
            <img
              src={getAvatarSrc(user.avatarUrl)}
              alt={`${user.username} avatar`}
              className="avatar mb-sm"
            />
            <div className="fw-bold">{user.username}</div>
            <div>Points: {user.total_points ?? 0}</div>
            <div>Last Game: {user.last_game_points ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Points</th>
              <th>Last Game</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((user, idx) => (
              <tr key={user.id}>
                <td className="text-center">{idx + 4}</td>
                <td>
                  <div className="userCell flex-center">
                    <img
                      src={getAvatarSrc(user.avatarUrl)}
                      alt={`${user.username} avatar`}
                      className="avatar-sm mr-sm"
                    />
                    {user.username}
                  </div>
                </td>
                <td className="text-center">{user.total_points ?? 0}</td>
                <td className="text-center">{user.last_game_points ?? 0}</td>
              </tr>
            ))}

            {/* If there are no additional users, render a helpful row */}
            {rest.length === 0 && leaders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}