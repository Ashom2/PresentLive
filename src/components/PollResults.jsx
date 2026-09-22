import { useEffect } from 'react';
import SectionCard from './SectionCard';
import { useApi } from '../hooks/useApi';
import { getPollResults } from '../api/client';

/**
 * Fetches and displays a poll slide's live results as a bar chart,
 * with an optional list of attendee responses.
 *
 * @component
 * @param {Object} props
 * @param {string} props.slideId - Id of the poll slide.
 * @param {string} [props.title='Live results'] - Section header title.
 * @param {number} [props.intervalMs] - If set, refetch every N milliseconds.
 * @param {boolean} [props.showAttendees=false] - Show each response with its attendee name.
 * @returns {JSX.Element} The poll results panel.
 */
export default function PollResults({ slideId, title = 'Slide Poll Results', intervalMs, showAttendees = false }) {
  const { data: results, loading, error, refetch } = useApi(
    () => getPollResults(slideId),
    [slideId]
  );

  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(refetch, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, slideId]);

  if (loading && !results) {
    return <SectionCard title={title} className="mb-2">Loading...</SectionCard>;
  }
  if (error && !results) {
    return (
      <SectionCard title={title} className="mb-2">
        <span className="text-danger small">{error}</span>
      </SectionCard>
    );
  }
  if (!results) return null;

  const { options, counts, total, responses } = results;

  return (
    <SectionCard title={title} className="mb-2">
      <div className="small text-muted">
        {total} {total === 1 ? 'response' : 'responses'}
      </div>

      <div className="d-flex align-items-end gap-2" style={{ height: '70px' }}>
        {counts.map((c, i) => (
          <div key={i} className="d-flex flex-column align-items-center">
            <div
              className="bar"
              style={{ height: `${total ? (c / total) * 60 : 0}px` }}
            ></div>
            <span className="small mt-1">{options[i]?.substring(0, 3) ?? '—'}</span>
            <span className="small fw-bold">{c}</span>
          </div>
        ))}
      </div>

      {showAttendees && responses.length > 0 && (
        <div className="border-top pt-2 mt-2 d-flex flex-column gap-1">
          <div className="fw-semibold">Attendees</div>
          {responses.map((r, i) => (
            <div key={i} className="small d-flex justify-content-between">
              <span className="text-muted">{r.attendeeName}</span>
              <span>{options[r.optionIndex] ?? '—'}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}