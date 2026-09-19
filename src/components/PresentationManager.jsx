import { useNavigate } from 'react-router-dom';

/**
 * Manage presentations page.
 *
 * Lists the user's decks with edit and present actions.
 *
 * @component
 * @returns {JSX.Element} The manage presentations page.
 */
function PresentationManager({ decks }) {
  const navigate = useNavigate();

  return (
    <div className="page-box">
      <div className="page-title">My presentations</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate('/editor')}
        >
          + New presentation
        </button>
      </div>
      <div className="d-flex flex-column gap-2">
        {decks.map((d, i) => (
          <div key={i} className="simple-border d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-semibold">{d.title}</span>
              <span className="badge bg-light text-dark border ms-2">{d.status}</span>
            </div>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate('/editor')}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => navigate('/audience')}
              >
                Present
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PresentationManager;