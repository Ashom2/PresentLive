import { getAttendee } from '../api/client';
import { useApi } from './useApi';

/**
 * Loads the attendee referenced by router state.
 * 
 * @param {string} props.attendeeId - Id of the attendee.
 * @returns {{ attendee, loading, error, shouldRedirect, redirectTo }}
 */
export function useAttendee(attendeeId) {
  const { data: attendee, loading, error } = useApi(
    () => (attendeeId ? getAttendee(attendeeId) : Promise.resolve(null)),
    [attendeeId]
  );

  return {
    attendee,
    loading,
    error,
  };
}