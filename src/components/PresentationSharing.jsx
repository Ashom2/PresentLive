import { useState } from 'react';
import StatusDropdown from './StatusDropdown';
import SectionCard from './SectionCard';

/**
 * Status and sharing controls for a presentation.
 *
 * When the presentation is a draft, everything below the status is hidden
 * and a message explains that it must be published before it can be shared.
 * When published, exposes the presentation code, join link, and edit link,
 * each with a copy button.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.presentation - The presentation.
 * @param {Function} props.onChanged - Called after a successful status change.
 * @returns {JSX.Element}
 */
export default function PresentationSharing({ presentation, onChanged }) {
  const [copied, setCopied] = useState(null);

  const isPublished = presentation.status === 'Published';

  const joinUrl = `${window.location.origin}/decks/view/${presentation.id}`;
  const editUrl = `${window.location.origin}/decks/edit/${presentation.id}`;

  /**
   * Copies text to the clipboard and shows a "Copied!" indicator for 1.5s.
   *
   * @param {string} key - Identifier so we know which field was copied.
   * @param {string} text - The text to copy.
   */
  function handleCopy(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <SectionCard title="Presentation Sharing" className="mb-2">
      <div className="d-flex align-items-center gap-2">
        <label className="fw-semibold" style={{ minWidth: '4rem' }}>Status</label>
        <StatusDropdown
          presentationId={presentation.id}
          status={presentation.status}
          onChanged={onChanged}
        />
      </div>

      {!isPublished ? (
        <div className="text-muted small">
          Publish this presentation to share it with an audience.
        </div>
      ) : (
        <>
          <CopyField
            label="Code"
            value={presentation.id}
            copied={copied === 'code'}
            onCopy={() => handleCopy('code', presentation.id)}
            monospace
          />
          <CopyField
            label="Join link"
            value={joinUrl}
            copied={copied === 'join'}
            onCopy={() => handleCopy('join', joinUrl)}
          />
          <CopyField
            label="Edit link"
            value={editUrl}
            copied={copied === 'edit'}
            onCopy={() => handleCopy('edit', editUrl)}
          />
        </>
      )}
    </SectionCard>
  );
}

/**
 * A labelled read-only field with a copy button.
 *
 * @component
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {boolean} props.copied
 * @param {Function} props.onCopy
 * @param {boolean} [props.monospace=false]
 * @returns {JSX.Element}
 */
function CopyField({ label, value, copied, onCopy, monospace = false }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <label className="fw-semibold" style={{ minWidth: '4rem' }}>{label}</label>
      <div className="input-group input-group-sm">
        <input
          className={`form-control form-control-sm ${monospace ? 'font-monospace' : ''}`}
          value={value}
          readOnly
          onFocus={(e) => e.target.select()}
        />
        <button
          className="btn btn-outline-secondary"
          onClick={onCopy}
          title={`Copy ${label.toLowerCase()}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}