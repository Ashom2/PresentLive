import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentationAndSlides, deleteSlide, deletePresentation } from '../api/client';
import { useApi } from '../hooks/useApi';
import SlideList from '../components/SlideList';
import PresentationMeta from '../components/PresentationMeta';
import SlideEditor from '../components/SlideEditor'
import DeleteButton from '../components/DeleteButton';

export default function DeckEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editorDirty, setEditorDirty] = useState(false);

  const { data: presentation, loading, error, refetch } = useApi(
    () => getPresentationAndSlides(id),
    [id]
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <p>Loading...</p>;
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

  function confirmNavigation() {
    if (!editorDirty) return true;
    return window.confirm('You have unsaved changes. Leave anyway?');
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Slide editor - {presentation.title}</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => { if (confirmNavigation()) navigate('/decks'); }}
        >
          ← Back to presentations
        </button>
        <div className="d-flex gap-1">
          <button
            className="btn btn-outline-success"
            onClick={() => { if (confirmNavigation()) navigate(`/decks/present/${presentation.id}`); }}
          >
            Present
          </button>
          <DeleteButton
            confirmMessage={`Delete "${presentation.title}"? This cannot be undone.`}
            onDelete={() => deletePresentation(presentation.id)}
            onDeleted={() => navigate('/decks')}
            tooltip="Delete presentation"
          >
            Delete
          </DeleteButton>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <PresentationMeta presentation={presentation} onChanged={refetch} />
          <SlideList
            slides={slides}
            currentIndex={safeIndex}
            onSelect={(i) => {
              if (i === safeIndex) return;
              if (confirmNavigation()) setCurrentSlide(i);
            }}
            onDelete={handleDeleteSlide}
            presentationId={id}
            onAdded={handleAdded}
          />
        </div>
        <div className="col-md-8">
          {slides.length > 0 ? (
            <SlideEditor
              key={slides[safeIndex].id}
              slide={slides[safeIndex]}
              onChanged={refetch}
              onDirtyChange={setEditorDirty}
            />
          ) : (
            <p className="text-muted">No slides yet. Add one to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}