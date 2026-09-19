import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';

/**
 * Join page.
 *
 * Lets an audience member enter a deck code and display name, then joins
 * the deck's audience view if it's open.
 *
 * @component
 * @returns {JSX.Element} The join page.
 */
function Join() {
  const navigate = useNavigate();
  const location = useLocation();

  const [code, setCode] = useState(location.state?.code ?? '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleJoin() {
    setError('');

    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a presentation link or code.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a display name.');
      return;
    }

    const id = trimmed.split('/').filter(Boolean).pop();
    const deck = decks.find((d) => d.id === id);

    if (!deck) {
      setError('No presentation found for that code.');
      return;
    }
    if (!deck.shared) {
      setError('This presentation is not shared yet.');
      return;
    }
    if (deck.closed) {
      setError('This presentation has been closed.');
      return;
    }

    navigate(`/decks/${deck.id}/audience`, { state: { displayName: name.trim() } });
  }

  return (
    <div className="page-box">
      <div className="page-title">Join a presentation</div>
      <p className="text-start text-muted mb-4">
        Enter the presentation link or code you were given, then your display name.
      </p>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Presentation link or code</label>
        <input
          className="form-control form-control-sm"
          placeholder="e.g. intro-comp2140"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Your name</label>
        <input
          className="form-control form-control-sm"
          placeholder="e.g. John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
        />
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <button className="btn btn-sm btn-primary" onClick={handleJoin}>
        Join
      </button>
    </div>
  );
}

export default Join;