import { useState } from 'react';

/**
 * Button that runs an async API call and shows the result or error.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.action - Async function to run when clicked.
 * @param {string} [props.label='Fetch data'] - Button label when idle.
 * @param {string} [props.loadingLabel='Loading…'] - Button label while running.
 * @returns {JSX.Element} A button with status feedback.
 */
function ApiTestButton({ action, label = 'Fetch data', loadingLabel = 'Loading…' }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await action();
      setData(result);
    } catch (err) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="btn btn-sm btn-primary"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? loadingLabel : label}
      </button>

      {error && (
        <div className="alert alert-danger py-2 small mt-2">{error}</div>
      )}

      {data !== null && (
        <pre className="simple-border bg-light small mt-2 p-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default ApiTestButton;