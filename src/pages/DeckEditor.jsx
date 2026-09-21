import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides, deleteSlide } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';
import SlideList from '../components/SlideList';

function DeckEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: presentation, loading, error, refetch } = useApi(
    () => getPresentationAndSlides(id),
    [id]
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!presentation) return <p>Presentation not found.</p>;

  const slides = Array.isArray(presentation.slides) ? presentation.slides : [];
  const safeIndex = slides.length ? Math.min(currentSlide, slides.length - 1) : 0;

  async function handleAdded() {
    const previousLength = slides.length;
    await refetch();
    setCurrentSlide(previousLength);
  }

  async function handleDeleteSlide(slide) {
    if (!window.confirm(`Delete "${slide.title}"? This can't be undone.`)) {
      return;
    }

    try {
      await deleteSlide(slide.id, id);
      await refetch();
      setCurrentSlide((i) => Math.max(0, i - 1));
    } catch (err) {
      console.error('Delete slide failed:', err);
    }
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Slide editor - {presentation.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/decks')}
        >
          ← Back to presentations
        </button>
        <div className="d-flex gap-1">
          <button className="btn btn-outline-primary">Save</button>
          <button
            className="btn btn-outline-success"
            onClick={() => navigate(`/decks/${presentation.id}/presenter`)}
          >
            Present
          </button>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <SlideList
            slides={slides}
            currentIndex={safeIndex}
            onSelect={setCurrentSlide}
            onDelete={handleDeleteSlide}
            presentationId={id}
            onAdded={handleAdded}
          />
        </div>
        <div className="col-md-8">
          <div className="fw-semibold mb-2">Slide preview</div>
          {slides.length > 0 ? (
            <SlideDisplay
              markdown={slides[safeIndex].body}
              index={safeIndex}
              total={slides.length}
              onPrev={() => setCurrentSlide((i) => Math.max(0, i - 1))}
              onNext={() => setCurrentSlide((i) => Math.min(slides.length - 1, i + 1))}
            />
          ) : (
            <p className="text-muted">No slides yet. Add one to get started.</p>
          )}
          <div className="fw-semibold mb-2">Poll preview</div>
          <div className="simple-border mb-2">
            <label className="fw-semibold">Question</label>
            <input
              className="form-control mb-2"
              value="How familiar are you with JavaScript?"
              readOnly
            />
            <label className="fw-semibold">Options</label>
            <div className="small">
              <div>• Not familiar</div>
              <div>• Beginner</div>
              <div>• Intermediate</div>
              <div>• Advanced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckEditor;