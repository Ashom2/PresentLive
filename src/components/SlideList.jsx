import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddSlideButton, DeleteButton } from './Buttons';
import SectionCard from './SectionCard';

/**
 * Lists a deck's slides with the current one highlighted, drag-and-drop
 * reordering, an add button, and a delete button per slide.
 * Partially written by DeepSeek AI.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.slides - The slides to display.
 * @param {number} props.currentIndex - Index of the currently selected slide.
 * @param {Function} props.onSelect - Called with the index of the clicked slide.
 * @param {Function} props.onDelete - Called with the slide to delete.
 * @param {Function} props.onReorder - Called with the reordered slides array.
 * @param {string} props.presentationId - Id passed through to the add button.
 * @param {Function} props.onAdded - Called after a slide is added.
 * @returns {JSX.Element} The slide list container.
 */
export default function SlideList({
  slides,
  currentIndex,
  onSelect,
  onDelete,
  onReorder,
  presentationId,
  onAdded,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(slides, oldIndex, newIndex));
  }

  return (
    <SectionCard title="Slides" className="mb-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={slides.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="d-flex flex-column gap-1">
            {slides.map((slide, i) => (
              <SortableSlideRow
                key={slide.id ?? i}
                slide={slide}
                index={i}
                isCurrent={i === currentIndex}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <div className="text-center text-muted small">
        drag and drop to re-order slides
      </div>

      <AddSlideButton
        presentationId={presentationId}
        position={slides.length}
        onAdded={onAdded}
      />
    </SectionCard>
  );
}

/**
 * A single draggable slide row.
 * Written by DeepSeek AI.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.slide
 * @param {number} props.index
 * @param {boolean} props.isCurrent
 * @param {Function} props.onSelect
 * @param {Function} props.onDelete
 * @returns {JSX.Element}
 */
function SortableSlideRow({ slide, index, isCurrent, onSelect, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-1 rounded d-flex justify-content-between align-items-center border ${
        isCurrent ? 'border-warning bg-light' : 'border-transparent bg-light'
      }`}
    >
      <span
        {...listeners}
        style={{ cursor: 'grab', flexGrow: 1 }}
        onClick={() => onSelect(index)}
      >
        {index + 1}. {slide.title}
      </span>
      <DeleteButton
        confirmMessage={`Delete "${slide.title}"? This can't be undone.`}
        onDelete={() => onDelete(slide)}
        tooltip="Delete slide"
      />
    </div>
  );
}