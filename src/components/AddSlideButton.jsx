import { useState } from 'react';
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
export default function AddSlideButton({ presentationId, position, onAdded }) {
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