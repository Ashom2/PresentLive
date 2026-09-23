import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { submitPollResponse } from '../api/client';
import { useDeck } from '../hooks/useDeck';
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
export default function DeckAudience() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const attendeeName = location.state?.attendeeName ?? 'Anonymous';
  const attendeeId = location.state?.attendeeId;

  const deck = useDeck(id);
  if (deck.status === 'loading') return <p>Loading...</p>;
  if (deck.status === 'error') return <div className="alert alert-danger">{deck.error}</div>;
  if (deck.status === 'not-found') return <p>Presentation not found.</p>;
  const { presentation, slides, currentSlide, currentSlideIndex, setCurrentSlideIndex, currentSlideIsPoll } = deck;

  function goPrev() {
    setCurrentSlideIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1));
  }

  async function handlePollSubmit(optionIndex) {
    await submitPollResponse(
      currentSlide.id,
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
            markdown={currentSlide.body}
            index={currentSlideIndex}
            total={slides.length}
            onPrev={goPrev}
            onNext={goNext}
          />

          {currentSlideIsPoll && (
            <PollDisplay
              slide={currentSlide}
              onSubmit={handlePollSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}