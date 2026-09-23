/**
 * Renders the raw presentMD of a slide with navigation buttons and a slide counter.
 *
 * @component
 * @param {Object} props
 * @param {string} props.markdown - The presentMD source for the slide.
 * @param {number} props.index - Zero-based index of the current slide.
 * @param {number} props.total - Total number of slides.
 * @param {Function} props.onPrev - Called when the previous button is clicked.
 * @param {Function} props.onNext - Called when the next button is clicked.
 * @returns {JSX.Element} The slide preview container with navigation.
 */
export default function SlideDisplay({ markdown, index, total, onPrev, onNext }) {
  return (
    <div className="simple-border bg-light p-0 mb-2" style={{ height: "500px" }}>
      <div className="bg-secondary bg-opacity-10 border-top d-flex justify-content-between align-items-center p-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onPrev}
          disabled={index === 0}
        >
          ← Previous
        </button>
        <span className="fw-semibold text-secondary">
          Slide {index + 1} of {total}
        </span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onNext}
          disabled={index === total - 1}
        >
          Next →
        </button>
      </div>

      <div className="p-3">
        {markdown.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}