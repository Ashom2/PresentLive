import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPresentation, generateDeck, createSlideFromTemplate } from '../api/client';

/**
 * New deck page.
 *
 * Lets the user enter a title and start blank, upload a .md file, or generate
 * a deck with AI from a topic. On submit, creates a deck and navigates to the editor.
 *
 * @component
 * @returns {JSX.Element} The new deck page.
 */
export default function DeckCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('blank'); // 'blank' | 'upload' | 'ai'
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiIncludePolls, setAiIncludePolls] = useState(false);
  const [generating, setGenerating] = useState(false);

  const busy = saving || generating;
  const isAi = mode === 'ai';

  async function handleCreate() {
    setError('');

    // Title is only required when we're not generating it with AI.
    if (!isAi && !title.trim()) {
      setError('Please enter a presentation title.');
      return;
    }
    if (mode === 'upload' && !file) {
      setError('Please choose a .md file to upload.');
      return;
    }
    if (isAi && !aiTopic.trim()) {
      setError('Please enter a topic for the AI to generate from.');
      return;
    }

    if (isAi) {
      setGenerating(true);
      try {
        const generated = await generateDeck(aiTopic.trim(), aiIncludePolls);
        const deck = await createPresentation(generated.title, 'AI');
        for (let i = 0; i < generated.slides.length; i++) {
          await createSlideFromTemplate(deck.id, generated.slides[i], i);
        }
        navigate(`/decks/edit/${deck.id}`);
      } catch (err) {
        setError(err.message ?? 'Could not generate the presentation.');
      } finally {
        setGenerating(false);
      }
      return;
    }

    setSaving(true);
    try {
      const deck = await createPresentation(title.trim());
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
        <div className="fw-semibold mb-2">Starting point</div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="mode"
            id="mode-blank"
            checked={mode === 'blank'}
            onChange={() => setMode('blank')}
            disabled={busy}
          />
          <label className="form-check-label" htmlFor="mode-blank">
            Start blank
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="mode"
            id="mode-upload"
            checked={mode === 'upload'}
            onChange={() => setMode('upload')}
            disabled={busy}
          />
          <label className="form-check-label" htmlFor="mode-upload">
            Upload a .md file
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="mode"
            id="mode-ai"
            checked={mode === 'ai'}
            onChange={() => setMode('ai')}
            disabled={busy}
          />
          <label className="form-check-label" htmlFor="mode-ai">
            Generate with AI
          </label>
        </div>
      </div>

      {/* Mode-specific inputs */}
      {mode === 'blank' && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Presentation title</label>
          <input
            className="form-control"
            placeholder="e.g. The Industrial Revolution and its Consequences"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            disabled={busy}
          />
        </div>
      )}

      {mode === 'upload' && (
        <>
          <div className="mb-3">
            <label className="form-label fw-semibold">Presentation title</label>
            <input
              className="form-control"
              placeholder="e.g. The Industrial Revolution and its Consequences"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Markdown file</label>
            <input
              className="form-control"
              type="file"
              accept=".md,text/markdown"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={busy}
            />
          </div>
        </>
      )}

      {isAi && (
        <>
          <div className="mb-3">
            <label className="form-label fw-semibold">Topic</label>
            <input
              className="form-control"
              placeholder="e.g. Introduction to React hooks"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              disabled={generating}
            />
            <div className="form-text">
              The AI will generate a title and slides for this topic.
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="ai-polls"
              checked={aiIncludePolls}
              onChange={(e) => setAiIncludePolls(e.target.checked)}
              disabled={generating}
            />
            <label className="form-check-label" htmlFor="ai-polls">
              Generate poll slides
            </label>
          </div>
        </>
      )}

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={busy}
        >
          {generating
            ? 'Generating…'
            : saving
            ? 'Creating…'
            : isAi
            ? 'Generate presentation'
            : 'Create presentation'}
        </button>
      </div>
    </div>
  );
}