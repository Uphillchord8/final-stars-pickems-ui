import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Leaderboard() {
  const [leaders,  setLeaders]  = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error,    setError]    = useState('');

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

  if (!leaders.length) {
    return (
      <div className="container">
        <h1 className="section-title text-center">Leaderboard</h1>
        <p className="text-center">No picks yet. Be the first to submit!</p>
      </div>
    );
  }

  const podium = leaders.slice(0, 3);
  const rest   = leaders.slice(3);

  return (
    <div className="container">
      <h1 className="section-title text-center">Leaderboard</h1>

      <div className="podium flex-center mb-lg">
        {podium.map((user, idx) => (
          <div key={user.id} className="card text-center">
            <div className="fw-bold text-lg mb-sm">#{idx + 1}</div>
            <img
              src={user.avatarUrl}
              alt={`${user.username} avatar`}
              className="avatar mb-sm"
            />
            <div className="fw-bold">{user.username}</div>
            <div>Points: {user.total_points}</div>
            <div>Last Game: {user.last_game_points}</div>
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
                      src={user.avatarUrl}
                      alt={`${user.username} avatar`}
                      className="avatar-sm mr-sm"
                    />
                    {user.username}
                  </div>
                </td>
                <td className="text-center">{user.total_points}</td>
                <td className="text-center">{user.last_game_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}