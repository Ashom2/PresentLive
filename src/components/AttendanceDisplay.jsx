import { useApi } from '../hooks/useApi';
import { getPresentationAttendees } from '../api/client';
import SectionCard from './SectionCard';
import DataTable from './DataTable';

/**
 * Displays attendance for a presentation.
 *
 * @component
 * @param {Object} props
 * @param {string} props.presentationId - Id of the presentation.
 * @returns {JSX.Element} The attendance panel.
 */
export default function AttendanceDisplay({ presentationId }) {
  const { data: attendees, loading, error } = useApi(
    () => getPresentationAttendees(presentationId),
    [presentationId]
  );

  if (loading) {
    return <SectionCard title="Attendance" className="mb-2">Loading…</SectionCard>;
  }
  if (error) {
    return (
      <SectionCard title="Attendance" className="mb-2">
        <span className="text-danger small">{error}</span>
      </SectionCard>
    );
  }

  const rows = Array.isArray(attendees) ? attendees : [];

  const columns = [
    {
      key: 'name',
      label: 'Name',
      linkTo: (row) => `/attendees/${row.id}`,
    },
    { key: 'status', label: 'Status' },
  ];

  return (
    <SectionCard title="Attendance" className="mb-2" bodyClassName="">
      {rows.length === 0 ? (
        <div className="p-2 text-muted small">No attendees yet.</div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
        />
      )}
    </SectionCard>
  );
}