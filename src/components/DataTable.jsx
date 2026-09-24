import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

/**
 * Renders tabular data.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Section card title.
 * @param {Array<{ key: string, label: string, linkTo?: (row: Object) => string }>} props.columns
 *   Column definitions. If `linkTo` is present, the cell renders as a link.
 * @param {Array<Object>} props.rows - Row data.
 * @param {Function} [props.rowKey] - Returns a unique key for a row. Defaults to index.
 * @param {string} [props.emptyMessage='Nothing to show.'] - Message when there are no rows.
 * @returns {JSX.Element}
 */
export function DataTable({ title, columns, rows, rowKey, emptyMessage = 'Nothing to show.' }) {
  if (!rows || rows.length === 0) {
    return <div className="p-2 text-muted small">{emptyMessage}</div>;
  }

  return (
    <div title={title} className="mb-2">
      <div className="table-responsive">
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
                      {to ? <Link to={to}>{value}</Link> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



/**
 * Fetches rows and displays them in a table panel.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Section card title.
 * @param {Function} props.fetcher - Async function that returns an array of rows.
 * @param {Array} [props.deps=[]] - Dependencies for the fetch.
 * @param {Array} props.columns - Column definitions (see DataTable).
 * @param {Function} [props.rowKey] - Unique key per row. Defaults to index.
 * @param {string} [props.emptyMessage] - Message when there are no rows.
 * @returns {JSX.Element}
 */
export function FetchedDataTable({
  title,
  fetcher,
  deps = [],
  intervalMs,
  columns,
  rowKey,
  emptyMessage,
}) {
  const { data, loading, error, refetch } = useApi(fetcher, deps);

  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(refetch, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  if (loading && !data) {
    return <div title={title} className="mb-2">
      Loading...
    </div>;
  }
  if (error && !data) {
    return (
      <div title={title} className="mb-2">
        <span className="text-danger small">{error}</span>
      </div>
    );
  }

  const rows = Array.isArray(data) ? data : [];

  return (
    <DataTable
      title={title}
      columns={columns}
      rows={rows}
      rowKey={rowKey}
      emptyMessage={emptyMessage}
    />
  );
}