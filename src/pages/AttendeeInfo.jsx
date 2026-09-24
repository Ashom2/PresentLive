import { useParams, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi';
import { getAttendeeAndPresentation } from '../api/client';
import { DataTable } from '../components/DataTable';

export default function AttendeeInfo() {
  const { attendeeId } = useParams();

  const { data, loading, error, refetch } = useApi(
    () => (attendeeId ? getAttendeeAndPresentation(attendeeId) : Promise.resolve(null)),
    [attendeeId]
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div className="alert alert-danger">Attendee not found.</div>;
  const { attendee, presentation, responses } = data;

  const isFinished = attendee.status === "Finished";

  const responseColumns = [
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer' },
  ];

  const responseRows = responses.map((r) => ({
    id: r.id,
    question: r.poll?.question ?? '—',
    answer: r.poll?.options?.[r.option_index] ?? '—',
  }));

  return (
    <div className="page-box">
      <div className="page-title text-center h4">
        Attendee info
      </div>

      <div className="d-flex flex-column gap-1 mb-3">
        <div>
          <span className="fw-semibold me-2">Name</span>
          <span>{attendee.name}</span>
        </div>
        <div>
          <span className="fw-semibold me-2">Attendee of</span>
          <Link to={`/decks/edit/${presentation.id}`}>{presentation.title}</Link>
        </div>
        <div>
          <span className="fw-semibold me-2">Status</span>
          <span>{attendee.status}</span>
        </div>
        {!isFinished && (
          <div>
            <span className="fw-semibold me-2">Slide index</span>
            <span>{attendee.slide_index}</span>
          </div>
        )}
      </div>

      <div className="fw-semibold mb-2">Poll responses</div>
      {responseRows.length === 0 ? (
        <div className="text-muted small">No responses recorded.</div>
      ) : (
        <DataTable
          columns={responseColumns}
          rows={responseRows}
          rowKey={(row) => row.id}
        />
      )}
    </div>
  );
}