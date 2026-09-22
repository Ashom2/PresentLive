import { useState } from 'react';

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
export default function DeleteButton({
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
    <button className="btn btn-sm btn-outline-danger py-0 px-2" 
      onClick={handleClick}
      title={tooltip}
      disabled={deleting}
      >
      {deleting ? '...' : children}
    </button>
  );
}