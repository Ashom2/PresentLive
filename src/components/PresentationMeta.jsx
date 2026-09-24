import { useEffect, useState } from 'react';
import StatusDropdown from './StatusDropdown';
import { updatePresentationTitle, updatePresentationAuthor } from '../api/client';
import SectionCard from './SectionCard';

/**
 * Editable title, author, and status for a presentation.
 *
 * Fields save on blur if their value changed.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.presentation - The presentation to edit.
 * @param {Function} props.onChanged - Called after any successful save.
 * @returns {JSX.Element} The metadata editor.
 */
export default function PresentationMeta({ presentation, onChanged }) {
  const [title, setTitle] = useState(presentation.title ?? '');
  const [author, setAuthor] = useState(presentation.author ?? '');
  const [savingTitle, setSavingTitle] = useState(false);
  const [savingAuthor, setSavingAuthor] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keep local state in sync if the deck is refetched with new values.
  useEffect(() => {
    setTitle(presentation.title ?? '');
    setAuthor(presentation.author ?? '');
  }, [presentation.id, presentation.title, presentation.author]);

  async function saveTitle() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle === presentation.title) return;

    setSavingTitle(true);
    try {
      await updatePresentationTitle(presentation.id, trimmedTitle);
      await onChanged();
    } finally {
      setSavingTitle(false);
    }
  }

  async function saveAuthor() {
    const trimmedAuthor = author.trim();
    if (!trimmedAuthor || trimmedAuthor === presentation.author) return;

    setSavingAuthor(true);
    try {
      await updatePresentationAuthor(presentation.id, trimmedAuthor);
      await onChanged();
    } finally {
      setSavingAuthor(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(presentation.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <SectionCard title="Presentation Meta" className="mb-2">
      <div className="d-flex align-items-center gap-2">
        <label className="fw-semibold" style={{ minWidth: '4rem' }}>Title</label>
        <input
          className="form-control form-control-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          disabled={savingTitle}
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        <label className="fw-semibold" style={{ minWidth: '4rem' }}>Author</label>
        <input
          className="form-control form-control-sm"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onBlur={saveAuthor}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          disabled={savingAuthor}
        />
      </div>
    </SectionCard>
  );
}