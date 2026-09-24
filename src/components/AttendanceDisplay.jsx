import { getPresentationAttendees } from '../api/client';
import SectionCard from './SectionCard';
import { FetchedDataTable } from './DataTable';

/**
 * Displays attendance for a presentation.
 *
 * @component
 * @param {Object} props
 * @param {string} props.presentationId - Id of the presentation.
 * @param {number} [props.intervalMs] - If set, refetch every N milliseconds.
 * @returns {JSX.Element} The attendance panel.
 */
export default function AttendanceDisplay({ presentationId, intervalMs }) {
  return (
    <SectionCard title="Presentation Attendance" className="mb-2" bodyClassName="">
      <FetchedDataTable
        title="Presentation attendees"
        fetcher={() => getPresentationAttendees(presentationId)}
        deps={[presentationId]}
        intervalMs={3000}
        columns={[
          { key: 'name', label: 'Name', linkTo: (row) => `/attendee/${row.id}` },
          { key: 'status', label: 'Status' },
          { key: 'slide_index', label: 'Slide Index'},
        ]}
        rowKey={(row) => row.id}
      />
    </SectionCard>
  );
}