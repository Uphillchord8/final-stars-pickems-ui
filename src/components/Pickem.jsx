import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/authcontext';

export default function Pickem() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [selected, setSelected] = useState({}); 

  useEffect(() => {
    api.get('/games')
      .then(res => setGames(res.data))
      .catch(console.error);

    api.get('/picks')
      .then(res => setPicks(res.data))
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
    const game = games.find(g => String(g._id) === String(gameId)); // ✅ fix comparison
    const gamePk = game?.gamePk || null;

    if (!gamePk) {
      alert('GamePk is missing. Cannot submit pick.');
      return;
    }

    await api.post('/picks', {
      gamePk,
      firstGoalPlayerId: pick.firstGoal,
      gwGoalPlayerId: pick.gwGoal
    });

    alert('Pick submitted!');
  } catch {
    alert('Could not submit pick');
  }
};

  const now = new Date();
  const cutoff = new Date('2025-10-09T00:00:00Z');
  const sorted = [...games].sort((a, b) => new Date(a.gameTime) - new Date(b.gameTime));
  const upcoming = sorted.filter(g => new Date(g.gameTime) >= now);
  const past = sorted.filter(g => new Date(g.gameTime) < now && new Date(g.gameTime) >= cutoff);
  const nextGame = upcoming.shift();

  const getUserPick = gameId => picks.find(p => p.gameId === gameId);
  const getPoints = (pick, game) => {
    if (!pick || !game) return 0;
    const correctFirst = pick.firstGoalPlayerId === game.firstGoalPlayerId;
    const correctGWG = pick.gwGoalPlayerId === game.gwGoalPlayerId;
    return correctFirst && correctGWG ? 3 : (correctFirst || correctGWG ? 1 : 0);
  };

  const renderCard = (game, isPast = false) => {
    const gameTime = new Date(game.gameTime);
    const msUntilStart = gameTime - now;
    const locked = msUntilStart < 5 * 60 * 1000;

    const dateStr = gameTime.toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: '2-digit'
    });
    const timeStr = gameTime.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'America/Chicago'
    }).replace(/(\d+:\d+)(.*)/, '$1$2');

    const userPick = getUserPick(game._id);
    const points = getPoints(userPick, game);

    const cardStyle = isPast && points > 0
      ? { border: `2px solid ${points === 3 ? 'gold' : 'green'}` }
      : {};

    return (
      <div key={game._id} className="card mb-md" style={cardStyle}>
        <div className="flex-center mb-sm" style={{ gap: 'var(--sp-md)' }}>
          {['away', 'home'].map(side => {
            const logoUrl = game[`${side}Logo`];
            const team = game[`${side}Team`];
            return (
              <div key={side} className="flex-column flex-center">
                {logoUrl
                  ? <img src={logoUrl} alt={`${team} logo`} className="team-pic"
                         onError={e => e.currentTarget.style.display = 'none'} />
                  : <div className="player-pic"></div>
                }
                <span className="text-sm fw-bold">{team}</span>
              </div>
            );
          })}
        </div>

        <p className="text-center mb-sm">
          {dateStr} {timeStr} CT
        </p>

        {isPast ? (
          <div>
            <p><strong>First Goal:</strong>{' '}
              {game.players.find(p => String(p._id) === String(game.firstGoalPlayerId))?.name || '—'}
            </p>
            <p><strong>GWG:</strong>{' '}
              {game.players.find(p => String(p._id) === String(game.gwGoalPlayerId))?.name || '—'}
            </p>
            {userPick && (
              <>
                <p><strong>Your Pick – First Goal:</strong>{' '}
                  {game.players.find(p => String(p._id) === String(userPick.firstGoalPlayerId))?.name || '—'}
                </p>
                <p><strong>Your Pick – GWG:</strong>{' '}
                  {game.players.find(p => String(p._id) === String(userPick.gwGoalPlayerId))?.name || '—'}
                </p>
                <p><strong>Points Earned:</strong> {points}</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex-center mb-sm" style={{ gap: 'var(--sp-md)' }}>
              {['firstGoal', 'gwGoal'].map(field => (
                <div key={field} style={{ flex: 1 }}>
                  <label htmlFor={`${field}-${game._id}`}>
                    {field === 'firstGoal' ? 'First Goal' : 'Game Winning Goal'}
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
      <div className="cards-grid">
        {past.length > 0 && (
          <div className="past-column">
            <h2 className="section-title">Past Games</h2>
            {past.map(g => renderCard(g, true))}
          </div>
        )}

        {nextGame && (
          <div className="next-column">
            <h2 className="section-title">Next Game</h2>
            {renderCard(nextGame)}
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="upcoming-column">
            <h2 className="section-title">Upcoming Games</h2>
            {upcoming.map(g => renderCard(g))}
          </div>
        )}
      </div>
    </div>
  );
}