import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';

/**
 * New deck page.
 *
 * Lets the user enter a title and either start blank or upload a .md file.
 * On submit, creates a deck and navigates to the editor.
 *
 * @component
 * @returns {JSX.Element} The new deck page.
 */
function DeckCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('blank'); // 'blank' | 'upload'
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  function handleCreate() {
    setError('');

    if (!title.trim()) {
      setError('Please enter a presentation title.');
      return;
    }
    if (mode === 'upload' && !file) {
      setError('Please choose a .md file to upload.');
      return;
    }

    // Mock: build an id from the title. In a real app this would come
    // from the server, and the file's contents would become the slides.
    const id = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (decks.some((d) => d.id === id)) {
      setError('A presentation with that title already exists.');
      return;
    }

    const newDeck = {
      id,
      title: title.trim(),
      author: 'You',
      status: 'Draft',
      shared: false,
      closed: false,
    };

    // Mock: push into the in-memory list so the editor can find it.
    // In a real app this would be a POST to your API.
    decks.push(newDeck);

    navigate(`/decks/${id}/editor`);
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">New presentation</div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Presentation title</label>
        <input
          className="form-control"
          placeholder="e.g. The Industrial Revolution and its Consequences"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
      </div>

      <div className="mb-3">
        <div className="fw-semibold mb-2">Starting point</div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="mode"
            id="mode-blank"
            checked={mode === 'blank'}
            onChange={() => setMode('blank')}
          />
          <label className="form-check-label" htmlFor="mode-blank">
            Start blank
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="mode"
            id="mode-upload"
            checked={mode === 'upload'}
            onChange={() => setMode('upload')}
          />
          <label className="form-check-label" htmlFor="mode-upload">
            Upload a .md file
          </label>
        </div>

        {mode === 'upload' && (
          <input
            className="form-control"
            type="file"
            accept=".md,text/markdown"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        )}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleCreate}>
          Create presentation
        </button>
      </div>
    </div>
  );
}

export default DeckCreate;