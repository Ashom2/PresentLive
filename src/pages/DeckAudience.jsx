import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';
import PollView from '../components/PollView';

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

  async function handlePollSubmit(optionIndex) {
    await submitPollResponse({
      slide_id: currentSlideData.id,
      attendee_name: displayName,
      option_index: optionIndex,
    });
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
            <PollView
              slide={currentSlideData}
              onSubmit={handlePollSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}

export default DeckAudience;