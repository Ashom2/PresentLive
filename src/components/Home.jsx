import { useNavigate } from 'react-router-dom';

/**
 * Home (landing) page for PresentLive.
 *
 * Shows two cards: one to join a presentation, one to manage your own decks.
 *
 * @component
 * @returns {JSX.Element} The landing page content.
 */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-box">
      <h1 className='mb-4'>Welcome to PresentLive!</h1>
      <p className="text-muted mb-4">Create, share, and present slide decks in the browser.</p>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="simple-border">
            <h6 className="fw-semibold">Join a presentation</h6>
            <p className="small text-muted mb-2">Enter the presentation link or code</p>
            <div className="input-group mb-2">
              <input
                className="form-control form-control-sm"
                placeholder="e.g. presentlive/example-deck"
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate('/audience')}
              >
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="simple-border">
            <h6 className="fw-semibold">Manage presentations</h6>
            <p className="small text-muted mb-2">Edit or present a deck you own</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate('/presentations')}
              >
                My presentations
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate('/editor')}
              >
                + New presentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;