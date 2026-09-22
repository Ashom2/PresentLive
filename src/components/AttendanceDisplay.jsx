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
  return (
    <SectionCard title="Presentation Attendance" className="mb-2" bodyClassName="">
      <DataTable
        title="Presentation attendees"
        fetcher={() => getPresentationAttendees(presentationId)}
        deps={[presentationId]}
        columns={[
          { key: 'name', label: 'Name', linkTo: (row) => `/attendees/${row.id}`, },
          { key: 'status', label: 'Status' },
        ]}
        rowKey={(row) => row.id}
      />
    </SectionCard>
  );
}