import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAttendee, submitPollResponse, updateAttendee } from '../api/client';
import { useDeck } from '../hooks/useDeck';
import { useApi } from '../hooks/useApi'
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
  const location = useLocation();

  // Get the attendee's ID from router state (placeholder)
  const attendeeId = location.state?.attendeeId;

  const { data: attendee, loading, error } = useApi(
    () => getAttendee(attendeeId),
    [attendeeId]
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!attendee) return <p>Attendee not found.</p>;

  return <AudienceView attendee={attendee} />;
}

/**
 * Slide viewer for a loaded attendee.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.attendee - The loaded attendee.
 * @returns {JSX.Element}
 */
function AudienceView({ attendee }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const attendeeId = attendee.id;
  const attendeeName = attendee.name ?? 'Anonymous';
  const attendeeSlideIndex = attendee.slide_index ?? 0;

  const deck = useDeck(id, attendeeSlideIndex);
  if (deck.status === 'loading') return <p>Loading…</p>;
  if (deck.status === 'error') return <div className="alert alert-danger">{deck.error}</div>;
  if (deck.status === 'not-found') return <p>Presentation not found.</p>;
  const { presentation, slides, currentSlide, currentSlideIndex, setCurrentSlideIndex, currentSlideIsPoll } = deck;

  async function goNext() {
    const next = Math.min(slides.length - 1, currentSlideIndex + 1);
    if (next === currentSlideIndex) return;

    setCurrentSlideIndex(next);

    if (attendeeId) {
      try {
        await updateAttendee(attendeeId, { slide_index: next });
      } catch (err) {
        console.error('Could not persist attendee progress:', err);
      }
    }
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