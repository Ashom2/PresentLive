import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSlide } from '../api/client';


/**
 * Button that creates a default slide and refetches the deck.
 *
 * @component
 * @param {Object} props
 * @param {string} props.presentationId - Id of the presentation to add to.
 * @param {number} props.position - Position to assign to the new slide.
 * @param {Function} props.onAdded - Called after creation and refetch.
 * @returns {JSX.Element} The add-slide button.
 */
export function AddSlideButton({ presentationId, position, onAdded }) {
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    setSaving(true);
    try {
      await createSlide(presentationId, position);
      await onAdded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      className="btn btn-outline-secondary mt-2 w-100"
      onClick={handleClick}
      disabled={saving}
    >
      {saving ? 'Adding...' : '+ Add slide'}
    </button>
  );
}

/**
 * Button that runs an async API call and shows the result or error.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.action - Async function to run when clicked.
 * @param {string} [props.label='Fetch data'] - Button label when idle.
 * @param {string} [props.loadingLabel='Loading...'] - Button label while running.
 * @returns {JSX.Element} A button with status feedback.
 */
export function ApiTestButton({ action, label = 'Fetch data', loadingLabel = 'Loading...' }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await action();
      setData(result);
    } catch (err) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="btn btn-sm btn-primary"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? loadingLabel : label}
      </button>

      {error && (
        <div className="alert alert-danger py-2 small mt-2">{error}</div>
      )}

      {data !== null && (
        <pre className="simple-border bg-light small mt-2 p-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

/**
 * Small delete button that stops propagation before firing its handler.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onDelete - Called when the button is clicked.
 * @param {Function} [props.onDeleted] - Called after a successful delete.
 * @param {string} [props.confirmMessage='Delete this item? This cannot be undone.'] - Confirm prompt text.
 * @param {string} [props.tooltip='Delete'] - Tooltip text.
 * @param {React.ReactNode} [props.children='x'] - Body content.
 * @returns {JSX.Element} The delete button.
 */
export function DeleteButton({
  onDelete,
  onDeleted,
  confirmMessage = 'Delete this item? This cannot be undone.',
  tooltip = "Delete",
  children = "x"
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleClick(e) {
    e.stopPropagation();

    if (!window.confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      await onDelete();
      await onDeleted?.();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button className="btn btn-outline-danger py-0 px-2" 
      onClick={handleClick}
      title={tooltip}
      disabled={deleting}
      >
      {deleting ? '...' : children}
    </button>
  );
}

/**
 * Back button that navigates to a given route or back in history.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.to] - Route to navigate to. If omitted, uses browser back.
 * @param {Object} [props.state] - Router state to pass when navigating.
 * @param {Function} [props.onClick] - Optional side effect before navigation.
 * @param {React.ReactNode} [props.children='Back'] - Body content, the text on the button.
 * @returns {JSX.Element} The back button.
 */
export function BackButton({
  to,
  state,
  onClick,
  children = "Back",
}) {
  const navigate = useNavigate();

  function handleClick() {
    // If onClick returns false, treat it as an order to cancel navigation
    if (onClick?.() === false) return;

    if (to) {
      navigate(to, { state });
    } else {
      navigate(-1);
    }
  }

  return (
    <button className="btn btn-outline-secondary" onClick={handleClick}>
      ← {children}
    </button>
  );
}

export function PresentButton({
  presentationId,
  onClick,
  children = "Present",
}) {
const navigate = useNavigate();
  function handleClick() {
    // If onClick returns false, treat it as an order to cancel navigation
    if (onClick?.() === false) return;

    if (presentationId) {
      navigate(`/decks/present/${presentationId}`);
    } else {
      navigate(-1);
    }
  }

  return (
    <button className="btn btn-outline-success" onClick={handleClick}>
      {children}
    </button>
  );
}

export function PreviewButton({
  presentationId,
  onClick,
  children = "Preview",
}) {
const navigate = useNavigate();
  function handleClick() {
    // If onClick returns false, treat it as an order to cancel navigation
    if (onClick?.() === false) return;

    if (presentationId) {
      navigate(`/decks/preview/${presentationId}`);
    } else {
      navigate(-1);
    }
  }

  return (
    <button className="btn btn-outline-secondary" onClick={handleClick}>
      {children}
    </button>
  );
}