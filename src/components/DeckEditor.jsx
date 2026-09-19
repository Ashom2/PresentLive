import { useNavigate, useParams } from 'react-router-dom';
import { decks } from '../data/decks';

/**
 * Slide editor page.
 *
 * Shows the deck's slides, a poll editor, and a presentMD preview.
 *
 * @component
 * @returns {JSX.Element} The slide editor page.
 */
function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const deck = decks.find((d) => d.id === id);

  if (!deck) return <p>Deck not found.</p>;

  return (
    <div className="page-box">
      <div className="page-title">Slide editor - {deck.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          ← Back to presentations
        </button>
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-primary">Save</button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => navigate(`/decks/${deck.id}/presenter`)}
          >
            Present
          </button>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="simple-border">
            <div className="fw-semibold mb-2">Slides</div>
            <div className="d-flex flex-column gap-1 small">
              <div className="p-1 bg-light rounded">
                1. Title <span className="badge bg-secondary">Content</span>
              </div>
              <div className="p-1 bg-light rounded">
                2. About Me <span className="badge bg-secondary">Content</span>
              </div>
              <div className="p-1 bg-light rounded border border-warning">
                3. Poll: Experience <span className="badge bg-warning text-dark">Poll</span>
              </div>
            </div>
            <button className="btn btn-sm btn-outline-secondary mt-2 w-100">
              + Add slide
            </button>
          </div>
        </div>
        <div className="col-md-8">
          <div className="simple-border mb-2">
            <label className="small fw-semibold">Question</label>
            <input
              className="form-control form-control-sm mb-2"
              value="How familiar are you with JavaScript?"
              readOnly
            />
            <label className="small fw-semibold">Options</label>
            <div className="small">
              <div>• Not familiar</div>
              <div>• Beginner</div>
              <div>• Intermediate</div>
              <div>• Advanced</div>
            </div>
          </div>
          <div className="simple-border bg-light">
            <div className="small text-muted mb-1">presentMD preview</div>
            <div>
              <span className="text-secondary">##</span> How familiar are you with JavaScript?
            </div>
            <div>
              <span className="text-secondary">- [ ]</span> Not familiar
            </div>
            <div>
              <span className="text-secondary">- [ ]</span> Beginner
            </div>
            <div>
              <span className="text-secondary">- [ ]</span> Intermediate
            </div>
            <div>
              <span className="text-secondary">- [ ]</span> Advanced
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;