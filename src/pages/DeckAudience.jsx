import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decks } from '../data/decks';

/**
 * Audience view for a deck.
 *
 * Lets an attendee answer the current poll. Answers can't be changed.
 *
 * @component
 * @returns {JSX.Element} The audience page.
 */
function DeckAudience() {
  const navigate = useNavigate();
  const { id } = useParams();
  const deck = decks.find((d) => d.id === id);

  const [selected, setSelected] = useState(null);

  if (!deck) return <p>Deck not found.</p>;

  const options = ['Not familiar', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Audience view — {deck.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}
        >
          ← Exit presentation
        </button>
        <span className="text-muted">Slide 3 of 4 · Display name: Anonymous</span>
      </div>

      <div className="simple-border mb-3">
        <div className="fw-semibold">How familiar are you with JavaScript?</div>
        {options.map((opt, i) => (
          <div key={i} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="poll"
              id={`opt${i}`}
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
            <label className="form-check-label" htmlFor={`opt${i}`}>
              {opt}
            </label>
          </div>
        ))}
        <button
          className="btn btn-primary mt-2"
          disabled={selected === null}
        >
          Submit answer
        </button>
        {selected !== null && (
          <span className="ms-2 text-success">submitted (cannot change)</span>
        )}
      </div>

      <div className="simple-border">
        <div className="fw-semibold mb-2">Live results</div>
        <div className="text-muted">
          Results will appear here after you submit.
        </div>
      </div>
    </div>
  );
}

export default DeckAudience;