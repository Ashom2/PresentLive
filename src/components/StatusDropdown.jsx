import { useState } from 'react';
import { updatePresentationStatus } from '../api/client';

/**
 * Dropdown that changes a presentation's status.
 *
 * @component
 * @param {Object} props
 * @param {string} props.presentationId - Id of the presentation.
 * @param {string} props.status - Current status ('Draft' or 'Published').
 * @param {Function} props.onChanged - Called after a successful update.
 * @returns {JSX.Element} The status dropdown.
 */
function StatusDropdown({ presentationId, status, onChanged }) {
  const [saving, setSaving] = useState(false);

  async function handleChange(e) {
    const next = e.target.value;
    if (next === status) return;

    setSaving(true);
    try {
      await updatePresentationStatus(presentationId, next);
      await onChanged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      className={`form-select form-select-sm ${status === 'Published' ? 'text-success' : 'text-secondary'}`}
      style={{ width: 'auto' }}
      value={status}
      onChange={handleChange}
      disabled={saving}
      title="Presentation status"
    >
      <option value="Draft">Draft</option>
      <option value="Published">Published</option>
    </select>
  );
}

export default StatusDropdown;