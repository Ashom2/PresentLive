import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteSlide, deletePresentation, reorderSlides } from '../api/client';
import { useDeck } from '../hooks/useDeck';
import SlideList from '../components/SlideList';
import PresentationMeta from '../components/PresentationMeta';
import PresentationSharing from '../components/PresentationSharing';
import SlideEditor from '../components/SlideEditor'
import { DeleteButton, BackButton, PresentButton, PreviewButton } from '../components/Buttons';

export default function DeckEditor() {
  const navigate = useNavigate();
  const { presentationId } = useParams();
  const [editorDirty, setEditorDirty] = useState(false);
  
  const deck = useDeck(presentationId);
  if (deck.status === 'loading') return <p>Loading...</p>;
  if (deck.status === 'error') return <div className="alert alert-danger">{deck.error}</div>;
  if (deck.status === 'not-found') return <p>Presentation not found.</p>;
  const { presentation, slides, currentSlide, currentSlideIndex, setCurrentSlideIndex, currentSlideIsPoll, refetch } = deck;

  async function handleAdded() {
    const previousLength = slides.length;
    await refetch();
    setCurrentSlideIndex(previousLength);
  }

  async function handleDeleteSlide(slide) {
    try {
      await deleteSlide(slide.id, presentationId);
      await refetch();
      setCurrentSlideIndex((i) => Math.max(0, i - 1));
    } catch (err) {
      console.error('Delete slide failed:', err);
    }
  }

  async function handleReorder(newSlides) {
    try {
      await reorderSlides(newSlides, presentationId);
      await refetch();
    } catch (err) {
      console.error('Could not reorder slides:', err);
    }
  }

  function confirmNavigation() {
    if (!editorDirty) return true;
    return window.confirm('You have unsaved changes. Leave anyway?');
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">
        {presentation.title}
      </div>
      <div className="text-center text-muted">
        Presentation editor
      </div>
      <div className="d-flex justify-content-between mb-3">
        <BackButton to={"/decks"} onClick={() => confirmNavigation()}>
          My presentations
        </BackButton>
        <div className="d-flex gap-1">
          <PreviewButton
            presentationId={presentation.id} 
            onClick={() => confirmNavigation()}
          />
          <PresentButton 
            presentationId={presentation.id} 
            onClick={() => confirmNavigation()} 
          />
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
          <PresentationMeta 
            presentation={presentation} 
            onChanged={refetch} 
          />
          <PresentationSharing 
            presentation={presentation} 
            onChanged={refetch} 
          />
          <SlideList
            slides={slides}
            currentIndex={currentSlideIndex}
            onSelect={(i) => {
              if (i === currentSlideIndex) return;
              if (confirmNavigation()) setCurrentSlideIndex(i);
            }}
            onDelete={handleDeleteSlide}
            onReorder={handleReorder}
            presentationId={presentationId}
            onAdded={handleAdded}
          />
        </div>
        <div className="col-md-8">
          {slides.length > 0 ? (
            <SlideEditor
              key={currentSlide.id}
              slide={currentSlide}
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