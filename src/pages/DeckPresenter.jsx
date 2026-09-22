import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';
import PollResults from '../components/PollResults';

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

  const { data: presentation, loading, error } = useApi(
    () => getPresentationAndSlides(id),
    [id]
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!presentation) return <p>Presentation not found.</p>;

  const slides = Array.isArray(presentation.slides) ? presentation.slides : [];
  const safeIndex = slides.length ? Math.min(currentSlide, slides.length - 1) : 0;
  const isPoll = true; //TODO

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
          markdown={slides[safeIndex].body}
          index={safeIndex}
          total={slides.length}
          onPrev={() => setCurrentSlide((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentSlide((i) => Math.min(slides.length - 1, i + 1))}
        />
      ) : (
        <p className="text-muted">No slides to present yet.</p>
      )}

      {isPoll && (
        <PollResults slideId={slides[safeIndex].id} intervalMs={3000} showAttendees={true} />
      )}
    </div>
  );
}

export default DeckPresenter;