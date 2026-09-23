import { useEffect, useState } from 'react';
import { updateSlide, updateSlidePoll } from '../api/client';
import SectionCard from './SectionCard';
import DeleteButton from './DeleteButton';

/**
 * Editor for a single slide. Edits are held locally and applied
 * when the user clicks Apply changes.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.slide - The slide to edit.
 * @param {Function} props.onChanged - Called after a successful save.
 * @param {Function} [props.onDirtyChange] - Notifies parent when dirty state changes.
 * @returns {JSX.Element} The slide editor form.
 */
export default function SlideEditor({ slide, onChanged, onDirtyChange }) {
  const [title, setTitle] = useState(slide.title ?? '');
  const [body, setBody] = useState(slide.body ?? '');
  const [isPoll, setIsPoll] = useState(slide.type === 'Poll');
  const [question, setQuestion] = useState(slide.poll?.question ?? '');
  const [options, setOptions] = useState(
    Array.isArray(slide.poll?.options) ? slide.poll.options : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(slide.title ?? '');
    setBody(slide.body ?? '');
    setIsPoll(slide.type === 'Poll');
    setQuestion(slide.poll?.question ?? '');
    setOptions(Array.isArray(slide.poll?.options) ? slide.poll.options : []);
    setError(null);
  }, [slide.id]);

  const titleChanged = title !== (slide.title ?? '');
  const bodyChanged = body !== (slide.body ?? '');
  const pollTypeChanged = isPoll !== (slide.type === 'Poll');
  const questionChanged = question !== (slide.poll?.question ?? '');
  const optionsChanged = JSON.stringify(options) !== JSON.stringify(slide.poll?.options ?? []);

  const pollChanged = pollTypeChanged || questionChanged || optionsChanged;

  const dirty = titleChanged || bodyChanged || pollChanged;

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  async function handleApply() {
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!trimmedTitle) {
      setError('Slide title cannot be empty.');
      return;
    }
    if (isPoll && !trimmedQuestion) {
      setError('Poll question cannot be empty.');
      return;
    }
    if (isPoll && trimmedOptions.length < 1) {
      setError('A poll needs at least one option.');
      return;
    }

    setSaving(true);
    try {
      // Save title/body/type
      if (titleChanged || bodyChanged || pollTypeChanged) {
        await updateSlide(slide.id, {
          title: trimmedTitle,
          body,
          type: isPoll ? 'Poll' : 'Content',
        });
      }

      // Only change poll if the questions or options are changed
      if (isPoll && (questionChanged || optionsChanged)) {
        await updateSlidePoll(slide.id, trimmedQuestion, trimmedOptions);
      }

      await onChanged();
      onDirtyChange?.(false);
    } catch (err) {
      setError(err.message ?? 'Could not save slide.');
    } finally {
      setSaving(false);
    }
  }

  function handleOptionChange(index, value) {
    setOptions((opts) => opts.map((o, i) => (i === index ? value : o)));
  }

  function handleAddOption() {
    setOptions((opts) => [...opts, '']);
  }

  function handleRemoveOption(index) {
    setOptions((opts) => opts.filter((_, i) => i !== index));
  }

  return (
    <SectionCard title="Edit Slide" className="mb-2">
      <div className="d-flex align-items-center gap-2">
        <label className="fw-semibold" style={{ minWidth: '4rem' }}>Title</label>
        <input
          className="form-control form-control-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          disabled={saving}
        />
      </div>

      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id={`poll-toggle-${slide.id}`}
          checked={isPoll}
          onChange={(e) => setIsPoll(e.target.checked)}
          disabled={saving}
        />
        <label className="form-check-label fw-semibold" htmlFor={`poll-toggle-${slide.id}`}>
          Poll slide
        </label>
      </div>

      {isPoll && (
        <div className="d-flex flex-column gap-2 border-top pt-2">
          <div className="d-flex flex-column gap-1">
            <label className="fw-semibold">Question</label>
            <input
              className="form-control form-control-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="d-flex flex-column gap-1">
            <label className="fw-semibold">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="d-flex align-items-center gap-1">
                <input
                  className="form-control form-control-sm"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  disabled={saving}
                  placeholder={`Option ${i + 1}`}
                />
                <DeleteButton 
                  onDelete={() => {handleRemoveOption(i)}}
                  tooltip="Remove option"
                />
              </div>
            ))}
            <button
              className="btn btn-sm btn-outline-secondary align-self-start"
              onClick={handleAddOption}
              disabled={saving}
            >
              + Add option
            </button>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger py-2 small mb-0">{error}</div>}

      <div className="d-flex align-items-center justify-content-between border-top pt-2">
        <span className="small text-muted">
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleApply}
          disabled={saving || !dirty}
        >
          {saving ? 'Saving...' : 'Apply changes'}
        </button>
      </div>
    </SectionCard>
  );
}