import { useEffect, useState } from 'react';

/**
 * Runs an async read function on mount and tracks loading/error/data.
 * Written by DeepSeek AI.
 *
 * @param {Function} fetcher - Async function that returns the data.
 * @param {Array} deps - Dependency array; refetches when these change.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Request failed.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { data, loading, error, refetch };
}