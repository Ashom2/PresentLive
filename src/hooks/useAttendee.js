import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAttendee } from '../api/client';
import { useApi } from './useApi';

/**
 * Loads the attendee referenced by router state.
 *
 * Returns a `shouldRedirect` flag when the attendee is missing, so the
 * caller can render a <Navigate> element instead of an effect.
 *
 * @returns {{ attendee, loading, error, shouldRedirect, redirectTo }}
 */
export function useAttendee() {
  const location = useLocation();
  const { presentationId } = useParams();
  // Get the attendee's ID from router state (placeholder)
  const attendeeId = location.state?.attendeeId;

  const { data: attendee, loading, error } = useApi(
    () => (attendeeId ? getAttendee(attendeeId) : Promise.resolve(null)),
    [attendeeId]
  );

  const shouldRedirect = !loading && !error && !attendee;

  return {
    attendee,
    loading,
    error,
    shouldRedirect,
    redirectTo: '/join',
    redirectState: { code: presentationId },
  };
}