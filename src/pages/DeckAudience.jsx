import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides, submitPollResponse } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';
import PollDisplay from '../components/PollDisplay';

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

  const attendeeName = location.state?.attendeeName ?? 'Anonymous';
  const attendeeId = location.state?.attendeeId;

  const { data: presentation, loading, error } = useApi(
    () => getPresentationAndSlides(id),
    [id]
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!presentation) return <p>Presentation not found.</p>;

  const slides = Array.isArray(presentation.slides) ? presentation.slides : [];
  const safeIndex = slides.length ? Math.min(currentSlide, slides.length - 1) : 0;
  const currentSlideData = slides[safeIndex];
  const isPoll = currentSlideData?.type === 'Poll';

  function goPrev() {
    setCurrentSlide((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setCurrentSlide((i) => Math.min(slides.length - 1, i + 1));
  }

  async function handlePollSubmit(optionIndex) {
    await submitPollResponse(
      currentSlideData.id,
      attendeeId,
      optionIndex
    );
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
        <span className="text-muted">Display name: {attendeeName}</span>
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
            <PollDisplay
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