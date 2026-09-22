/**
 * Small delete button that stops propagation before firing its handler.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onDelete - Called when the button is clicked.
 * @param {string} [props.tooltip='Delete'] - Tooltip text.
 * @param {React.ReactNode} [props.children='x'] - Body content.
 * @returns {JSX.Element} The delete button.
 */
export default function DeleteButton({
  onDelete,
  tooltip = "Delete",
  children = "x"
}) {
  return (
    <button className="btn btn-sm btn-outline-danger py-0 px-2" 
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      title={tooltip}
      >
      {children}
    </button>
  );
}