import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPresentation, createAttendee } from '../api/client';

/**
 * Join page.
 *
 * Lets an audience member enter a presentation code and display name, then joins
 * the presentation's audience view if it's open.
 *
 * @component
 * @returns {JSX.Element} The join page.
 */
function Join() {
  const navigate = useNavigate();
  const location = useLocation();

  const [code, setCode] = useState(location.state?.code ?? '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  //TODO since there are multiple client functions here can we move this
  //function to client?
  async function handleJoin() {
    setError('');

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError('Please enter a presentation link or code.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a display name.');
      return;
    }

    // Accept bare ids or paths like /present/abc or /edit/abc.
    const id = trimmedCode.split('/').filter(Boolean).pop();

    setChecking(true);
    try {
      const response = await getPresentation(id);
      const presentation = response?.data ?? response;

      if (!presentation) {
        setError('No presentation found for that code.');
        return;
      }
      if (presentation.status != "Published") {
        setError('This presentation is not published.');
        return;
      }

      console.log("presentation found");

      const attendee = await createAttendee(name.trim(), presentation);

      navigate(`/decks/view/${presentation.id}`, {
        state: { attendeeName: attendee.name, attendeeId: attendee.id }
      });
    } catch (err) {
      // getPresentation throws on 404, network failure, etc.
      setError('No presentation found for that code.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="page-box">
      <div className="page-title text-center h4">Join a presentation</div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Presentation link or code</label>
        <input
          className="form-control"
          placeholder="e.g. intro-comp2140"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Display name</label>
        <input
          className="form-control"
          placeholder="e.g. John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
        />
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <button
        className="btn btn-primary"
        onClick={handleJoin}
        disabled={checking}
      >
        {checking ? 'Checking...' : 'Join'}
      </button>
    </div>
  );
}

export default Join;