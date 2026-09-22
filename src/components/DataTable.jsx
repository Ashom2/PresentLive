import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import SectionCard from './SectionCard';

/**
 * Fetches and displays tabular data.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.fetcher - Async function that returns an array of rows.
 * @param {Array} props.deps - Dependencies for the fetch (like useApi).
 * @param {Array<{ key, label, linkTo? }>} props.columns - Column definitions.
 * @param {string} props.title - Section card title.
 * @param {Function} [props.rowKey] - Unique key per row. Defaults to index.
 * @returns {JSX.Element} The table panel.
 */
function DataTable({ fetcher, deps = [], columns, title, rowKey }) {
  const navigate = useNavigate();
  const { data, loading, error } = useApi(fetcher, deps);

  if (loading) {
    return <div className="mb-2">Loading...</div>;
  }
  if (error) {
    return (
      <div title={title} className="mb-2">
        <span className="text-danger small">{error}</span>
      </div>
    );
  }

  const rows = Array.isArray(data) ? data : [];

  return (
    <div title={title} className="mb-2">
      {rows.length === 0 ? (
        <div className="p-2 text-muted small">Nothing to show.</div>
      ) : (
        <table className="table table-sm table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={rowKey ? rowKey(row) : i}>
                {columns.map((col) => {
                  const value = row[col.key];
                  const to = col.linkTo?.(row);
                  return (
                    <td key={col.key}>
                      {to ? (
                        <Link to={to} className="btn btn-link p-0 align-baseline">
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;