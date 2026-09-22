import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ApiTestButton from '../components/ApiTestButton';
import { createPresentation, getAllPresentations, getAllAttendees } from '../api/client';
import DataTable from '../components/DataTable';
import SectionCard from '../components/SectionCard';

/**
 * Home (landing) page for PresentLive.
 *
 * Shows two cards: one to join a presentation, one to manage your own decks.
 *
 * @component
 * @returns {JSX.Element} The landing page content.
 */
function Admin() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');



  return (
    <div className="page-box">
      <h1 className='text-center'>Admin Page</h1>

      <SectionCard title="Admin buttons" className="mb-2" bodyClassName="">
        <ApiTestButton
          action={() => createPresentation('Test deck')}
          label="Create presentation"
          loadingLabel="Creating..."
        />
        <ApiTestButton
          action={getAllPresentations}
          label="Get presentations"
          loadingLabel="Getting..."
        />
      </SectionCard>

      <SectionCard title="Presentations" className="mb-2" bodyClassName="">
        <DataTable
          title="All Attendees"
          fetcher={getAllAttendees}
          deps={[]}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
          ]}
          rowKey={(row) => row.id}
        />
      </SectionCard>

      <SectionCard title="Attendees" className="mb-2" bodyClassName="">
        <DataTable
          title="All Attendees"
          fetcher={getAllAttendees}
          deps={[]}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
          ]}
          rowKey={(row) => row.id}
        />
      </SectionCard>
    </div>
  );
}

export default Admin;