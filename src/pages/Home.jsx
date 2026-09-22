import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionCard from '../components/SectionCard';

/**
 * Home (landing) page for PresentLive.
 *
 * Shows two cards: one to join a presentation, one to manage your own decks.
 *
 * @component
 * @returns {JSX.Element} The landing page content.
 */
export default function Home() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  function handleJoin() {
    navigate('/join', { state: { code: code.trim() } });
  }

  return (
    <div className="page-box">
      <h1 className='text-center'>Welcome to PresentLive!</h1>
      <p className="text-center text-muted">Create, share, and present slide decks in the browser.</p>
      <div className="row g-3">
        <div className="col-md-6">
          <SectionCard title="Join a presentation" className="mb-2">
            <div className="text-muted mb-2">Enter the presentation link or code</div>
            <div className="input-group mb-2">
              <input
                className="form-control"
                placeholder="e.g. presentlive/example-deck"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
              <button
                className="btn btn-primary"
                onClick={handleJoin}
              >
                Join
              </button>
            </div>
          </SectionCard>
        </div>
        <div className="col-md-6">
          <SectionCard title="Manage presentations" className="mb-2">
            <div className="text-muted mb-2">Edit or present a deck you own</div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/decks')}
              >
                My presentations
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate('decks/create')}
              >
                + New presentation
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}