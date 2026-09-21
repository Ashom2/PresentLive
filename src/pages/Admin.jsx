import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiTestButton from '../components/ApiTestButton';
import { fetchData, createPresentation, getPresentations } from '../api/client';

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
      <ApiTestButton 
        action={fetchData}
        label="Fetch data"
        loadingLabel="Creating..."
      />
      <ApiTestButton
        action={() => createPresentation({ 
            title: 'Test deck', 
            author: "unknown",
            status: "Draft",
        })}
        label="Create presentation"
        loadingLabel="Creating…"
      />
      <ApiTestButton 
        action={getPresentations}
        label="Get presentations"
        loadingLabel="Getting..."
      />
    </div>
  );
}

export default Admin;