import { useEffect, useState } from 'react';
import { updateSlide } from '../api/client';

/**
 * Editor for a single slide's title and body.
 *
 * Fields save on blur if their value changed.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.slide - The slide to edit.
 * @param {Function} props.onChanged - Called after a successful save.
 * @returns {JSX.Element} The slide editor form.
 */
function SlideEditor({ slide, onChanged }) {
  const [title, setTitle] = useState(slide.title ?? '');
  const [body, setBody] = useState(slide.body ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(slide.title ?? '');
    setBody(slide.body ?? '');
    setError(null);
  }, [slide.id, slide.title, slide.body]);

  async function save() {
    const nextTitle = title.trim();
    const nextBody = body;

    if (!nextTitle) {
      setError('Slide title cannot be empty.');
      return;
    }
    if (nextTitle === slide.title && nextBody === slide.body) return;

    setSaving(true);
    setError(null);
    try {
      await updateSlide(slide.id, { title: nextTitle, body: nextBody });
      await onChanged();
    } catch (err) {
      setError(err.message ?? 'Could not save slide.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="simple-border mb-2 d-flex flex-column gap-2">
      <div className="d-flex align-items-center gap-2">
        <label className="fw-semibold" style={{ minWidth: '4rem' }}>Title</label>
        <input
          className="form-control form-control-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          disabled={saving}
        />
      </div>

      <div className="d-flex flex-column gap-1">
        <label className="fw-semibold">Body (presentMD)</label>
        <textarea
          className="form-control form-control-sm font-monospace"
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={save}
          disabled={saving}
        />
      </div>

      {error && <div className="alert alert-danger py-2 small mb-0">{error}</div>}
    </div>
  );
}

export default SlideEditor;