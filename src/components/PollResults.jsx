import { useEffect } from 'react';
import SectionCard from './SectionCard';
import { useApi } from '../hooks/useApi';
import { getPollResults } from '../api/client';
import { DataTable } from './DataTable';

/**
 * Fetches and displays a poll slide's live results as a horizontal bar chart,
 * with an optional list of attendee responses.
 * Partially written by DeepSeek AI.
 *
 * @component
 * @param {Object} props
 * @param {string} props.slideId - Id of the poll slide.
 * @param {string} [props.title='Slide Poll Results'] - Section header title.
 * @param {number} [props.intervalMs] - If set, refetch every N milliseconds.
 * @param {boolean} [props.showAttendees=false] - Show each response with its attendee name.
 * @returns {JSX.Element} The poll results panel.
 */
export default function PollResults({
  slideId,
  title = 'Slide Poll Results',
  intervalMs,
  showAttendees = false,
}) {
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
  const max = Math.max(1, ...counts);   // avoid divide-by-zero, floor at 1

  const responseColumns = [
    { key: 'name', label: 'Name' },
    { key: 'answer', label: 'Answer' },
  ];

  const responseRows = responses.map((r) => ({
    name: r.attendeeName,
    answer: options[r.optionIndex] ?? '-',
  }));

  return (
    <SectionCard title={title} className="mb-2">
      <div className="small text-muted mb-2">
        {total} {total === 1 ? 'response' : 'responses'}
      </div>

      {total > 0 ? (
        <div className="d-flex flex-column gap-2">
          {options.map((opt, i) => {
            const count = counts[i] ?? 0;
            const pct = total ? Math.round((count / total) * 100) : 0;
            const widthPct = (count / max) * 100;
            return (
              <div key={i}>
                <div className="d-flex justify-content-between">
                  <span className="text-truncate me-2">{opt}</span>
                  <span className="text-muted">{count} · {pct}%</span>
                </div>
                <div className="progress" style={{ height: '14px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${widthPct}%` }}
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={max}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (<></>)}

      {showAttendees && responses.length > 0 && (
        <div className="border-top pt-2 mt-2 d-flex flex-column gap-1">
          <div className="fw-bold">Results by attendee</div>
          <DataTable
            columns={responseColumns}
            rows={responseRows}
            rowKey={(row) => row.id}
          />
        </div>
      )}
    </SectionCard>
  );
}