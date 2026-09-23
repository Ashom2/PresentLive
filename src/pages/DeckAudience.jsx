import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAttendee, submitPollResponse, updateAttendee } from '../api/client';
import { useDeck } from '../hooks/useDeck';
import { useApi } from '../hooks/useApi'
import SlideDisplay from '../components/SlideDisplay';
import PollDisplay from '../components/PollDisplay';
import { BackButton } from '../components/Buttons';

/**
 * Audience view for a deck.
 *
 * Loads the attendee first, then mounts the slide viewer once their
 * starting position is known. Attendees step forward only, and poll
 * answers lock once submitted.
 *
 * @component
 * @returns {JSX.Element} The audience page.
 */
export function DeckAudience() {
  const location = useLocation();
  const navigate = useNavigate();
  const { presentationId } = useParams();

  // Get the attendee's ID from router state (placeholder)
  const attendeeId = location.state?.attendeeId;

  const { data: attendee, loading, error } = useApi(
    () => attendeeId ? getAttendee(attendeeId) : Promise.resolve(null),
    [attendeeId]
  );

  useEffect(() => {
    if (!loading && !attendee) {
      navigate('/join', { state: { code: presentationId } });
    }
  }, [loading, attendee, navigate, presentationId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!attendee) return <p>Attendee not found.</p>;

  return (
    <DeckViewer
      attendee={attendee}
      mode="audience"
    />
  );
}

/**
 * Review view for a deck.
 *
 * Lets a finished attendee browse back and forth through slides.
 * Polls are shown read-only.
 *
 * @component
 * @returns {JSX.Element} The review page.
 */
export function DeckReview() {

  const location = useLocation();
  const navigate = useNavigate();
  const { presentationId } = useParams();

  // Get the attendee's ID from router state (placeholder)
  const attendeeId = location.state?.attendeeId;

  const { data: attendee, loading, error } = useApi(
    () => attendeeId ? getAttendee(attendeeId) : Promise.resolve(null),
    [attendeeId]
  );

  useEffect(() => {
    if (!loading && !attendee) {
      navigate('/join', { state: { code: presentationId } });
    }
  }, [loading, attendee, navigate, presentationId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!attendee) return <p>Attendee not found.</p>;

  return (
    <DeckViewer
      attendee={attendee}
      mode="review"
    />
  );
}

/**
 * Slide viewer shared by the audience and review views.
 *
 * In 'audience' mode, navigation is forward-only and poll answers are
 * submitted. In 'review' mode, navigation is free and polls are read-only.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.attendee - The loaded attendee.
 * @param {'audience'|'review'} props.mode - Which behaviour to use.
 * @returns {JSX.Element}
 */
function DeckViewer({ attendee, mode }) {
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

  const isAudience = mode === 'audience';

  function goPrev() {
    setCurrentSlideIndex((i) => Math.max(0, i - 1));
  }

  async function goNext() {
    const next = Math.min(slides.length - 1, currentSlideIndex + 1);
    if (next === currentSlideIndex) return;

    setCurrentSlideIndex(next);

    if (!isAudience) return;

    if (attendeeId) {
      try {
        await updateAttendee(attendeeId, { slide_index: next });
      } catch (err) {
        console.error('Could not persist attendee progress:', err);
      }
    }
  }

  async function handlePollSubmit(optionIndex) {
    if (!isAudience) return;
    await submitPollResponse(
      currentSlide.id,
      attendeeId,
      optionIndex
    );
  }

  /**
   * Marks the attendee as finished and navigates to the results page.
   */
  async function handleFinish() {
    if (!isAudience) return;

    try {
      await updateAttendee(attendee.id, { status: 'Finished' });
    } catch (err) {
      // Don't block navigation on the status update failing — the attendee
      // has already seen every slide. Log and continue.
      console.error('Could not update attendee status:', err);
    }

    navigate(`/decks/results/${id}`, {
      state: { attendeeId: attendee.id },
    });
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">
        {isAudience ? 'Audience view' : 'Review'} - {presentation.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <BackButton
          to={
            isAudience ? '/' : `/decks/results/${id}`
          }
          state={{ attendeeId: attendee.id }}
        >
          {isAudience ? 'Exit presentation' : 'Back to results'}
        </BackButton>
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
            onPrev={isAudience ? undefined : goPrev}
            onNext={goNext}
            onFinish={isAudience ? handleFinish : undefined}
          />

          {currentSlideIsPoll && (
            <PollDisplay
              slide={currentSlide}
              attendeeId={attendee.id} //TODO
              onSubmit={handlePollSubmit}
              readOnly={!isAudience}//TODO
            />
          )}
        </>
      )}
    </div>
  );
}