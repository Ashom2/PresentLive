import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { submitPollResponse, updateAttendee } from '../api/client';
import { useDeck } from '../hooks/useDeck';
import PollDisplay from '../components/PollDisplay';
import { BackButton } from '../components/Buttons';
import SlideDisplay from '../components/SlideDisplay';
import PollResults from '../components/PollResults';
import AttendanceDisplay from '../components/AttendanceDisplay';
import { useAttendee } from '../hooks/useAttendee';
import { Navigate } from 'react-router-dom';

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
  const { presentationId } = useParams();
  // Get the attendee's ID from router state (placeholder)
  const attendeeId = location.state?.attendeeId;

  const { attendee, loading, error } = useAttendee(attendeeId);
  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!attendee) return <Navigate to={"/join"} replace state={{ code: presentationId }} />;

  return <DeckView attendee={attendee} mode="Audience" />;
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
  const { presentationId } = useParams();
  // Get the attendee's ID from router state (placeholder)
  const attendeeId = location.state?.attendeeId;

  const { attendee, loading, error } = useAttendee(attendeeId);
  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!attendee) return <Navigate to={"/join"} replace state={{ code: presentationId }} />;

  return <DeckView attendee={attendee} mode="Review" />;
}

/**
 * Presenter view for a deck.
 *
 * @component
 * @returns {JSX.Element}
 */
export function DeckPresenter() {
  return <DeckView mode="Presenter" />;
}


/**
 * Preview view for a deck (read-only, no attendee).
 *
 * @component
 * @returns {JSX.Element}
 */
export function DeckPreview() {
  return <DeckView mode="Preview" />;
}

/**
 * Shared slide viewer for audience, review, presenter, and preview.
 *
 * Behaviour varies by mode:
 * - Audience: forward-only nav, persist slide_index, interactive polls, finish button.
 * - Review: free nav, read-only polls.
 * - Presenter: free nav, poll results shown below slides, attendance shown.
 * - Preview: free nav, read-only polls.
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.attendee] - The loaded attendee (undefined for present/preview).
 * @param {'Audience'|'Review'|'Presenter'|'Preview'} props.mode
 * @returns {JSX.Element}
 */
function DeckView({ attendee, mode }) {
  const navigate = useNavigate();
  const { presentationId } = useParams();

  const attendeeId = attendee?.id;
  const attendeeName = attendee?.name ?? 'Anonymous';
  const attendeeSlideIndex = attendee?.slide_index ?? 0;

  const deck = useDeck(presentationId, attendeeSlideIndex);
  const [index, setIndex] = useState(attendeeSlideIndex);
  if (deck.status === 'loading') return <p>Loading...</p>;
  if (deck.status === 'error') return <div className="alert alert-danger">{deck.error}</div>;
  if (deck.status === 'not-found') return <p>Presentation not found.</p>;

  const { presentation, slides } = deck;
  const currentSlide = slides[index] ?? null;
  const currentSlideIsPoll = currentSlide?.type === 'Poll';


  const isAudience = mode === 'Audience';
  const isPresenter = mode === 'Presenter';
  const showDisplayName = mode === 'Audience' || mode === 'Review';

  const backConfig = {
    Audience: { to: '/', label: 'Exit presentation' },
    Review: { to: `/decks/results/${presentationId}`, label: 'Back to results' },
    Presenter: { to: `/decks/edit/${presentationId}`, label: 'Edit' },
    Preview: { to: `/decks/edit/${presentationId}`, label: 'Edit' },
  }[mode];

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setIndex((i) => Math.min(slides.length - 1, i + 1));
  }

  async function handleIndexChange(next) {
    if (!isAudience) return;
    try {
      await updateAttendee(attendee.id, { slide_index: next });
    } catch (err) {
      console.error('Could not persist attendee progress:', err);
    }
  }

  async function handlePollSubmit(optionIndex) {
    if (!isAudience) return;
    await submitPollResponse(currentSlide, attendeeId, optionIndex);
  }

  /**
   * Marks the attendee as finished and navigates to the results page.
   */
  async function handleFinish() {
    if (!isAudience) return;
    try {
      await updateAttendee(attendee.id, { status: 'Finished' });
    } catch (err) {
      console.error('Could not update attendee status:', err);
    }
    navigate(`/decks/results/${presentationId}`, {
      state: { attendeeId: attendee.id },
    });
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">
        {presentation.title}
      </div>
      <div className="text-center text-muted">
        {mode} mode
      </div>
      <div className="d-flex justify-content-between mb-3">
        <BackButton
          to={backConfig.to}
          state={{ attendeeId: attendeeId }}
        >
          {backConfig.label}
        </BackButton>
        {showDisplayName && (
          <span className="text-muted">Display name: {attendeeName}</span>
        )}
      </div>

      {slides.length === 0 ? (
        <p className="text-muted">No slides in this presentation yet.</p>
      ) : (
        <>
          <SlideDisplay
            title={currentSlide.title}
            markdown={currentSlide.body}
            index={index}
            total={slides.length}
            onPrev={isAudience ? undefined : goPrev}
            onNext={isAudience ? () => { goNext(); handleIndexChange(index + 1); } : goNext}
            onFinish={isAudience ? handleFinish : undefined}
            hidePrev={isAudience}
          />

          {!isPresenter && currentSlideIsPoll && (
            <PollDisplay
              slide={currentSlide}
              attendeeId={attendeeId}
              onSubmit={isAudience ? handlePollSubmit : undefined}
              disabled={!isAudience}
            />
          )}

          {isPresenter && currentSlideIsPoll && (
            <PollResults
              slideId={currentSlide.id}
              intervalMs={3000}
              showAttendees
            />
          )}
        </>
      )}

      {isPresenter && (
        <AttendanceDisplay presentationId={presentation.id} />
      )}
    </div>
  );
}