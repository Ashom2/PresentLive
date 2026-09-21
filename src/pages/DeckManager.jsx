import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi'
import { getPresentations } from '../api/client';

/**
 * Manage presentations page.
 *
 * Lists the user's decks with edit and present actions.
 *
 * @component
 * @returns {JSX.Element} The manage presentations page.
 */
function PresentationManager() {
  const navigate = useNavigate();
  const { data, loading, error } = useApi(getPresentations);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const decks = data?.data ?? [];

  return (
    <div className="page-box">
      <div className="page-title text-center h4">My presentations</div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}
        >
          ← Home
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/decks/create')}
        >
          + New presentation
        </button>
      </div>
      <div className="d-flex flex-column gap-2">
        {decks.map((deck, i) => (
          <div key={i} className="simple-border d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-semibold">{deck.title}</span>
              <span className={`badge ${deck.status === 'Published' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                {deck.status}
              </span> 
            </div>
            <div className="d-flex gap-1">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/decks/${deck.id}/editor`)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-success"
                onClick={() => navigate(`/decks/${deck.id}/presenter`)}
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