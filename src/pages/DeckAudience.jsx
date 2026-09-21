import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';

/**
 * Audience view for a deck.
 *
 * Lets an attendee step through slides and answer poll slides.
 *
 * @component
 * @returns {JSX.Element} The audience page.
 */
function DeckAudience() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const displayName = location.state?.displayName ?? 'Anonymous';

  const { data: presentation, loading, error } = useApi(
    () => getPresentationAndSlides(id),
    [id]
  );

  const [selected, setSelected] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!presentation) return <p>Presentation not found.</p>;

  const slides = Array.isArray(presentation.slides) ? presentation.slides : [];
  const safeIndex = slides.length ? Math.min(currentSlide, slides.length - 1) : 0;
  const currentSlideData = slides[safeIndex];
  const isPoll = currentSlideData?.type === 'Poll';
  const options =
    isPoll && Array.isArray(currentSlideData?.poll?.options)
      ? currentSlideData.poll.options
      : [];

  function goPrev() {
    setSelected(null);
    setCurrentSlide((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setSelected(null);
    setCurrentSlide((i) => Math.min(slides.length - 1, i + 1));
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Audience view - {presentation.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}
        >
          ← Exit presentation
        </button>
        <span className="text-muted">Display name: {displayName}</span>
      </div>

      {slides.length === 0 ? (
        <p className="text-muted">No slides in this presentation yet.</p>
      ) : (
        <>
          <SlideDisplay
            markdown={currentSlideData.body}
            index={safeIndex}
            total={slides.length}
            onPrev={goPrev}
            onNext={goNext}
          />

          {isPoll && (
            <div className="simple-border mt-3">
              <div className="fw-semibold mb-2">
                {currentSlideData.poll?.question || currentSlideData.title}
              </div>
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
          )}
        </>
      )}
    </div>
  );
}

export default DeckAudience;