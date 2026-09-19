import { useNavigate, useParams } from 'react-router-dom';
import { decks } from '../data/decks';

/**
 * Presenter view for a deck.
 *
 * Shows the current slide with its live poll results.
 *
 * @component
 * @returns {JSX.Element} The presenter page.
 */
function DeckPresenter() {
  const navigate = useNavigate();
  const { id } = useParams();
  const deck = decks.find((d) => d.id === id);

  if (!deck) return <p>Deck not found.</p>;

  const options = ['Not familiar', 'Beginner', 'Intermediate', 'Advanced'];
  const counts = [2, 5, 8, 3];
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className="page-box">
      <div className="page-title h4">Presenter view - {deck.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          ← Back to presentations
        </button>
        <span className="small text-muted">Slide 3 of 4</span>
      </div>

      <div className="simple-border mb-3">
        <h6 className="fw-semibold">How familiar are you with JavaScript?</h6>
        <div className="small text-muted">
          Audience answers on their own devices. You see results below.
        </div>
      </div>

      <div className="simple-border">
        <div className="fw-semibold mb-2">Live results · {total} responses</div>
        <div className="d-flex align-items-end gap-2" style={{ height: '70px' }}>
          {counts.map((c, i) => (
            <div key={i} className="d-flex flex-column align-items-center">
              <div className="bar" style={{ height: `${(c / total) * 60}px` }}></div>
              <span className="small mt-1">{options[i].substring(0, 3)}</span>
              <span className="small fw-bold">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeckPresenter;