import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi'
import { getAllPresentations, deletePresentation } from '../api/client';
import { DeleteButton, BackButton } from '../components/Buttons';

/**
 * Manage presentations page.
 *
 * Lists the user's presentations with edit and present actions.
 *
 * @component
 * @returns {JSX.Element} The manage presentations page.
 */
export default function PresentationManager() {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useApi(getAllPresentations);
  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <p>Presentations not found.</p>;
  const presentations = data;

  return (
    <div className="page-box">
      <div className="page-title text-center h4">My presentations</div>
      <div className="d-flex justify-content-between mb-3">
        <BackButton to={"/"}>
          Home
        </BackButton>
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
                onDelete={() => deletePresentation(presentation.id)}
                onDeleted={refetch}
                confirmMessage={`Delete "${presentation.title}"? This cannot be undone.`}
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