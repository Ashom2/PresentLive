import AddSlideButton from './AddSlideButton';
import SectionCard from './SectionCard';
import DeleteButton from './DeleteButton'

/**
 * Lists a deck's slides with the current one highlighted, an add button,
 * and a delete button per slide.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.slides - The slides to display.
 * @param {number} props.currentIndex - Index of the currently selected slide.
 * @param {Function} props.onSelect - Called with the index of the clicked slide.
 * @param {Function} props.onDelete - Called with the slide to delete.
 * @param {string} props.presentationId - Id passed through to the add button.
 * @param {Function} props.onAdded - Called after a slide is added.
 * @returns {JSX.Element} The slide list container.
 */
export default function SlideList({ slides, currentIndex, onSelect, onDelete, presentationId, onAdded }) {
  return (
    <SectionCard title="Slides" className="mb-2">
      <div className="d-flex flex-column gap-1">
        {slides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            className={`p-1 rounded d-flex justify-content-between align-items-center border ${i === currentIndex ? 'border-warning bg-light' : 'border-transparent bg-light'}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(i)}
          >
            <span>{i + 1}. {slide.title}</span>
            <DeleteButton 
              onDelete={() => onDelete(slide)}
              tooltip="Delete slide"
            />
          </div>
        ))}
      </div>
      <AddSlideButton
        presentationId={presentationId}
        position={slides.length}
        onAdded={onAdded}
      />
    </SectionCard>
  );
}