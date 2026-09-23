import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getAttendee } from '../api/client';
import { BackButton } from '../components/Buttons';

/**
 * Results page shown to an attendee after finishing a presentation.
 *
 * @component
 * @returns {JSX.Element} The results page.
 */
export default function AttendeeResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { presentationId } = useParams();

  const attendeeId = location.state?.attendeeId;

  const { data: attendee, loading, error } = useApi(
    () => attendeeId ? getAttendee(attendeeId) : Promise.resolve(null),
    [attendeeId]
  );

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!attendee) return <p>Attendee not found.</p>;

  return (
    <div className="page-box">
      <div className="page-title text-center h4">You're finished!</div>
      <div>Your responses have been recorded.</div>
      <div className="d-flex gap-2">
        <BackButton to={"/"}>
          Back to home
        </BackButton>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate(`/decks/review/${presentationId}`, { state: { attendeeId } })}
        >
          Review slides
        </button>
      </div>
    </div>
  );
}