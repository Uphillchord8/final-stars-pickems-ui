import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';

export default function Pickem() {
  const [games, setGames]       = useState([]);
  const [selected, setSelected] = useState({});

  // Fetch games once
  useEffect(() => {
    api.get('/games')
      .then(res => setGames(res.data))
      .catch(console.error);
  }, []);

  const handleSelect = (gameId, field, value) => {
    setSelected(prev => ({
      ...prev,
      [gameId]: { ...prev[gameId], [field]: value }
    }));
  };

  const handleSubmit = async gameId => {
    try {
      const pick = selected[gameId] || {};
      await api.post('/picks', {
        gameId,
        firstGoalPlayerId: pick.firstGoal,
        gwGoalPlayerId:    pick.gwGoal
      });
      alert('Pick submitted!');
    } catch {
      alert('Could not submit pick');
    }
  };

  const now      = new Date();
  const sorted   = [...games].sort((a,b) => new Date(a.gameTime) - new Date(b.gameTime));
  const upcoming = sorted.filter(g => new Date(g.gameTime) >= now);
  const past     = sorted.filter(g => new Date(g.gameTime) <  now);
  const nextGame = upcoming.shift();

  const renderCard = (game, isPast = false) => {
    const gameTime     = new Date(game.gameTime);
    const msUntilStart = gameTime - now;
    const locked       = msUntilStart < 5 * 60 * 1000;

    const dateStr = gameTime.toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: '2-digit'
    });
    const timeStr = gameTime.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Chicago'
    }).replace(/(\d+:\d+)(.*)/, '$1$2');

    return (
      <div key={game._id} className="card mb-md">
        <div className="flex-center mb-sm">
          <img src={game.homeLogo} alt="" className="avatar-sm" />
          <span className="fw-bold text-lg mx-sm">vs</span>
          <img src={game.awayLogo} alt="" className="avatar-sm" />
        </div>

        <p className="text-center mb-sm">{dateStr} {timeStr} CT</p>

        {isPast ? (
          <div>
            <p><strong>First Goal:</strong>{' '}
              {game.players.find(p=>p._id===game.firstGoalPlayerId)?.name || '—'}
            </p>
            <p><strong>GWG:</strong>{' '}
              {game.players.find(p=>p._id===game.gwGoalPlayerId)?.name || '—'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-center mb-sm" style={{ gap: 'var(--sp-md)' }}>
              {['firstGoal','gwGoal'].map(field => (
                <div key={field} style={{ flex: 1 }}>
                  <label htmlFor={`${field}-${game._id}`}>
                    {field==='firstGoal' ? 'First Goal' : 'Game Winning Goal'}
                  </label>
                  <select
                    id={`${field}-${game._id}`}
                    className="select-input"
                    value={selected[game._id]?.[field] || ''}
                    onChange={e => handleSelect(game._id, field, e.target.value)}
                    disabled={locked}
                  >
                    <option value="">{locked ? '—' : 'Select Player'}</option>
                    {game.players.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              className="button w-full"
              onClick={() => handleSubmit(game._id)}
              disabled={locked}
            >
              Submit Pick
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="picks-grid">
        {past.length > 0 && (
          <div className="past-column">
            <h2 className="section-title">Past Games</h2>
            {past.map(game => renderCard(game, true))}
          </div>
        )}

        {nextGame && (
          <div>
            <h2 className="section-title">Next Game</h2>
            {renderCard(nextGame)}
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            <h2 className="section-title">Upcoming Games</h2>
            {upcoming.map(game => renderCard(game))}
          </div>
        )}
      </div>
    </div>
  );
}