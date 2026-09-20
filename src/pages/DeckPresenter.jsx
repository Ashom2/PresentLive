import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decks } from '../data/decks';
import SlideDisplay from '../components/SlideDisplay';

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

  const [currentSlide, setCurrentSlide] = useState(2);

  if (!deck) return <p>Deck not found.</p>;

  const slides = [
    { markdown: '## Title\nWelcome to COMP2140' },
    { markdown: '## About Me\n- Name\n- Role\n- Background' },
    {
      markdown:
        '## How familiar are you with JavaScript?\n- [ ] Not familiar\n- [ ] Beginner\n- [ ] Intermediate\n- [ ] Advanced',
    },
    { markdown: '## Tools\n- VS Code\n- Node.js\n- Git' },
  ];

  const options = ['Not familiar', 'Beginner', 'Intermediate', 'Advanced'];
  const counts = [2, 5, 8, 3];
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Presenter view — {deck.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          ← Back to presentations
        </button>
      </div>

      <SlideDisplay
        markdown={slides[currentSlide].markdown}
        index={currentSlide}
        total={slides.length}
        onPrev={() => setCurrentSlide((i) => Math.max(0, i - 1))}
        onNext={() => setCurrentSlide((i) => Math.min(slides.length - 1, i + 1))}
      />

      <div className="simple-border mt-3">
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