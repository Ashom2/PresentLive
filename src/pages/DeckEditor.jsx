import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideDisplay from '../components/SlideDisplay';
import AddSlideButton from '../components/AddSlideButton';

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

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Slide editor — {presentation.title}</div>
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
          <div className="simple-border">
            <div className="fw-semibold mb-2">Slides</div>
            <div className="d-flex flex-column gap-1">
              {slides.map((slide, i) => (
                <div
                  key={slide.id ?? i}
                  className={`p-1 rounded ${i === safeIndex ? 'border border-warning bg-light' : 'bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurrentSlide(i)}
                >
                  {i + 1}. {slide.title}
                </div>
              ))}
            </div>
            <AddSlideButton
              presentationId={id}
              position={slides.length}
              onAdded={handleAdded}
            />
          </div>
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