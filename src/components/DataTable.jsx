import { useNavigate } from 'react-router-dom';

/**
 * Generic table for displaying tabular data.
 *
 * @component
 * @param {Object} props
 * @param {Array<{ key: string, label: string, linkTo?: (row) => string }>} props.columns
 *   Column definitions. If `linkTo` is provided, the cell renders as a clickable link.
 * @param {Array<Object>} props.rows - Row data.
 * @param {Function} [props.rowKey] - Returns a unique key for a row. Defaults to index.
 * @returns {JSX.Element} The table.
 */
function DataTable({ columns, rows, rowKey }) {
  const navigate = useNavigate();

  return (
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
                    <button
                      className="btn btn-link p-0 align-baseline"
                      onClick={() => navigate(to)}
                    >
                      {value}
                    </button>
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
  );
}

export default DataTable;