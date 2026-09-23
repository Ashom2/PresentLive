import { useNavigate, useParams } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import SlideDisplay from '../components/SlideDisplay';
import PollResults from '../components/PollResults';
import AttendanceDisplay from '../components/AttendanceDisplay';

/**
 * Presenter view for a deck.
 *
 * Shows the current slide with its live poll results.
 *
 * @component
 * @returns {JSX.Element} The presenter page.
 */
export default function DeckPresenter() {
  const navigate = useNavigate();
  const { id } = useParams();

  const deck = useDeck(id);
  if (deck.status === 'loading') return <p>Loading...</p>;
  if (deck.status === 'error') return <div className="alert alert-danger">{deck.error}</div>;
  if (deck.status === 'not-found') return <p>Presentation not found.</p>;
  const { presentation, slides, currentSlide, currentSlideIndex, setCurrentSlideIndex, currentSlideIsPoll } = deck;

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Presenter view - {presentation.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          ← Back to presentations
        </button>
      </div>

      {slides.length > 0 ? (
        <SlideDisplay
          markdown={currentSlide.body}
          index={currentSlideIndex}
          total={slides.length}
          onPrev={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
        />
      ) : (
        <p className="text-muted">No slides to present yet.</p>
      )}

      {currentSlideIsPoll && (
        <PollResults slideId={currentSlide.id} intervalMs={3000} showAttendees={true} />
      )}
      
      <AttendanceDisplay 
        presentationId={presentation.id}
      />
    </div>
  );
}