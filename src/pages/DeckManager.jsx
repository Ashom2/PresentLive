import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi'
import { getPresentations, deletePresentation } from '../api/client';
import DeleteButton from '../components/DeleteButton';

/**
 * Manage presentations page.
 *
 * Lists the user's presentations with edit and present actions.
 *
 * @component
 * @returns {JSX.Element} The manage presentations page.
 */
function PresentationManager() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi(getPresentations);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const presentations = data?.data ?? [];

  async function handleDeletePresentation(presentation) {
    if (!window.confirm(`Delete "${presentation.title}"? This can't be undone.`)) return;

    try {
      await deletePresentation(presentation.id);
      await refetch();
    } catch (err) {
      console.error('Delete presentation failed:', err);
    }
  }

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
        {presentations.map((presentation, i) => (
          <div key={i} className="simple-border d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-semibold">{presentation.title}</span>
              <span className={`badge ${presentation.status === 'Published' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                {presentation.status}
              </span>
            </div>
            <div className="d-flex gap-1">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/decks/edit/${presentation.id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-success"
                onClick={() => navigate(`/decks/present/${presentation.id}`)}
              >
                Present
              </button>
              <DeleteButton
                onDelete={() => handleDeletePresentation(presentation)}
                tooltip="Delete presentation"
              >
                Delete
              </DeleteButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PresentationManager;