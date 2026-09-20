import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decks } from '../data/decks';
import SlideDisplay from '../components/SlideDisplay';

/**
 * Slide editor page.
 *
 * Shows the deck's slides, a poll editor, and a presentMD preview.
 *
 * @component
 * @returns {JSX.Element} The slide editor page.
 */
function DeckEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const deck = decks.find((d) => d.id === id);
  const [currentSlide, setCurrentSlide] = useState(2);
  const slides = [
    { markdown: '## Title\nWelcome to COMP2140' },
    { markdown: '## About Me\n- Name\n- Role\n- Background' },
    { markdown: '## Poll slide!' },
  ];

  if (!deck) return <p>Deck not found.</p>;

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Slide editor - {deck.title}</div>
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
            <button className="btn btn-outline-secondary mt-2 w-100">
              + Add slide
            </button>
          </div>
        </div>
        <div className="col-md-8">
          <div className="fw-semibold mb-2">Slide preview</div>
          <SlideDisplay 
            markdown={slides[currentSlide].markdown} 
            index={currentSlide}
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