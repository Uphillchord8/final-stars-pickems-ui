import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Stats() {
  const [lastFirstGoal, setLastFirstGoal]     = useState(null);
  const [lastWinningGoal, setLastWinningGoal] = useState(null);
  const [seasonStats, setSeasonStats]         = useState([]);
  const [isLoading, setLoading]               = useState(true);
  const [error, setError]                     = useState('');

  useEffect(() => {
    api.get('/stats')
      .then(res => {
        setLastFirstGoal(res.data.lastFirstGoal);
        setLastWinningGoal(res.data.lastWinningGoal);
        setSeasonStats(res.data.seasonStats);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load stats.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <p className="text-center">Loading stats…</p>
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

  return (
    <div className="container">
      {/* Last Game */}
      <section className="mb-lg">
        <h2 className="section-title">Last Game</h2>
        <div className="cards-grid">
          {lastFirstGoal && (
            <div className="card text-center">
              <h3 className="mb-sm">First Goal</h3>
              <img
                src={lastFirstGoal.pictureUrl}
                alt={lastFirstGoal.name}
                className="player-pic"
              />
              <p>{lastFirstGoal.name}</p>
              <p>{lastFirstGoal.position}</p>
            </div>
          )}
          {lastWinningGoal && (
            <div className="card text-center">
              <h3 className="mb-sm">Winning Goal</h3>
              <img
                src={lastWinningGoal.pictureUrl}
                alt={lastWinningGoal.name}
                className="player-pic"
              />
              <p>{lastWinningGoal.name}</p>
              <p>{lastWinningGoal.position}</p>
            </div>
          )}
        </div>
      </section>

      {/* Season Stats */}
      <section>
        <h2 className="section-title mb-md">Season Stats</h2>
        <div className="cards-grid">
          {seasonStats.map(player => (
            <div key={player.player_id} className="card text-center">
              <img
                src={player.pictureUrl}
                alt={player.name}
                className="player-pic"
              />
              <h3 className="mb-sm">{player.name}</h3>
              <p>#{player.number} — {player.position}</p>
              <div className="stat-row">
                <span>Goals: {player.goals}</span>
                <span>First Goals: {player.firstGoals}</span>
                <span>GWGs: {player.gwgs}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}