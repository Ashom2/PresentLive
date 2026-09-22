import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPresentation } from '../api/client';

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
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setError('');

    if (!title.trim()) {
      setError('Please enter a presentation title.');
      return;
    }
    if (mode === 'upload' && !file) {
      setError('Please choose a .md file to upload.');
      return;
    }

    setSaving(true);
    try {
      const created = await createPresentation({
        title: title.trim(),
        author: 'You',
        status: 'Draft',
        slides: [],
        attendees: [],
      });

      const deck = created?.data ?? created;
      navigate(`/decks/edit/${deck.id}`);
    } catch (err) {
      setError(err.message ?? 'Could not create the presentation.');
    } finally {
      setSaving(false);
    }
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
          disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
          />
        )}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={saving}
        >
          {saving ? 'Creating...' : 'Create presentation'}
        </button>
      </div>
    </div>
  );
}

export default DeckCreate;