import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentation } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';

/**
 * Slide editor page.
 *
 * Fetches the presentation by id and shows its slides.
 *
 * @component
 * @returns {JSX.Element} The slide editor page.
 */
function DeckEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: deck, loading, error } = useApi(
    () => getPresentation(id),
    [id]
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!deck) return <p>Deck not found.</p>;

  // Mock slides until the API returns real ones.
  const slides = [
    { markdown: '## Title\nWelcome to COMP2140' },
    { markdown: '## About Me\n- Name\n- Role\n- Background' },
    { markdown: '## Poll slide!' },
  ];

  const safeIndex = Math.min(currentSlide, slides.length - 1);

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Slide editor — {deck.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          ← Back to presentations
        </button>
        <div className="d-flex gap-1">
          <button className="btn btn-outline-primary">Save</button>
          <button
            className="btn btn-outline-success"
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
            <div className="d-flex flex-column gap-1">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`p-1 rounded ${i === safeIndex ? 'border border-warning bg-light' : 'bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurrentSlide(i)}
                >
                  {i + 1}. {slides[i].markdown.split('\n')[0].replace(/^##\s*/, '')}
                </div>
              ))}
            </div>
            <button className="btn btn-outline-secondary mt-2 w-100">
              + Add slide
            </button>
          </div>
        </div>
        <div className="col-md-8">
          <div className="fw-semibold mb-2">Slide preview</div>
          <SlideDisplay
            markdown={slides[safeIndex].markdown}
            index={safeIndex}
            total={slides.length}
            onPrev={() => setCurrentSlide((i) => Math.max(0, i - 1))}
            onNext={() => setCurrentSlide((i) => Math.min(slides.length - 1, i + 1))}
          />
          <div className="fw-semibold mb-2">Poll preview</div>
          <div className="simple-border mb-2">
            <label className="fw-semibold">Question</label>
            <input
              className="form-control mb-2"
              value="How familiar are you with JavaScript?"
              readOnly
            />
            <label className="fw-semibold">Options</label>
            <div className="small">
              <div>• Not familiar</div>
              <div>• Beginner</div>
              <div>• Intermediate</div>
              <div>• Advanced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckEditor;