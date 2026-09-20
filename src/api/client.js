const BASE_URL = 'https://comp2140-3ea651da.uqcloud.net/api';

/**
 * Makes an authenticated JSON request to the API. Written by DeepSeek AI.
 *
 * @param {string} path - Path relative to the API base URL.
 * @param {Object} [options]
 * @param {string} [options.method='GET']
 * @param {Object} [options.body] - Serialized as JSON if provided.
 * @returns {Promise<any>} Parsed JSON response, or null for 204.
 */
async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? `Request failed: ${response.status}`);
  }

  return payload;
}


export const fetchData = () => request('');
export const getPresentations = () => request('/presentation');
export const getPresentation  = (id) => request(`/presentation/${id}`);
export const createPresentation = (data) => request('/presentation', { method: 'POST', body: data });
export const updatePresentation = (id, data) => request(`/presentation/${id}`, { method: 'PATCH', body: data });
export const deletePresentation = (id) => request(`/presentation/${id}`, { method: 'DELETE' });