/**
 * TODO list:
 * upload content from md file
 * 
 * edit permission?
 * better colour scheme https://design-system.uq.edu.au/storybook-html/index.html?path=/story/introduction-overview--overview
 * link to info/data pages for each:
 *    presentation
 *    attendee (done)
 *    slide
 *    poll response
 * 
 * SlideNavBar component
 * 
 * get rid of currentSlide?.type === 'Poll' in deckview 
 * make results page real, and navigable by presentation owner
 * 
 * PresentMD display (currently its just raw text)
 * Ask to confirm when attendees go to next slide before answering poll
 *  
 * proper session handling with tokens
 *    users should only have access to presentations they created
 * have some way of handling updated presentations other than deleting all attendees and responses
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiTestButton } from '../components/Buttons';
import { createPresentation, getAllPresentations, getAllSlides, getAllAttendees, getAllPollResponses } from '../api/client';
import { FetchedDataTable } from '../components/DataTable';
import SectionCard from '../components/SectionCard';

/**
 * Home (landing) page for PresentLive.
 *
 * Shows two cards: one to join a presentation, one to manage your own decks.
 *
 * @component
 * @returns {JSX.Element} The landing page content.
 */
export default function Admin() {
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
        <FetchedDataTable
          title="All presentations"
          fetcher={getAllPresentations}
          deps={[]}
          columns={[
            { key: 'id', label: 'ID', linkTo: (row) => `/decks/edit/${row.id}`},
            { key: 'title', label: 'Title' },
            { key: 'author', label: 'Author' },
            { key: 'status', label: 'Status' },
            // { key: 'slides', label: 'Slides' },
            // { key: 'attendees', label: 'Attendees' },
          ]}
          rowKey={(row) => row.id}
        />
      </SectionCard>

      <SectionCard title="Slides" className="mb-2" bodyClassName="">
        <FetchedDataTable
          title="All slides"
          fetcher={getAllSlides}
          deps={[]}
          columns={[
            { key: 'id', label: 'ID', linkTo: (row) => `/slide/${row.id}` },
            { key: 'title', label: 'Title' },
            { key: 'type', label: 'Type' },
            { key: 'position', label: 'Position' },
          ]}
          rowKey={(row) => row.id}
        />
      </SectionCard>

      <SectionCard title="Attendees" className="mb-2" bodyClassName="">
        <FetchedDataTable
          title="All attendees"
          fetcher={getAllAttendees}
          deps={[]}
          columns={[
            { key: 'id', label: 'ID', linkTo: (row) => `/attendee/${row.id}`},
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
          ]}
          rowKey={(row) => row.id}
        />
      </SectionCard>

      <SectionCard title="Poll Responses" className="mb-2" bodyClassName="">
        <FetchedDataTable
          title="All poll responses"
          fetcher={getAllPollResponses}
          deps={[]}
          columns={[
            { key: 'id', label: 'ID', linkTo: (row) => `/poll_response/${row.id}`},
            { key: 'attendee_id', label: 'Attendee ID' },
            { key: 'option_index', label: 'Option Index' },
          ]}
          rowKey={(row) => row.id}
        />
      </SectionCard>
    </div>
  );
}