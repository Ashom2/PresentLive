export async function fetchData() {
  const response = await fetch('https://comp2140-3ea651da.uqcloud.net/api', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
}

/**
 * Creates a new presentation on the server.
 *
 * @param {Object} presentation - The presentation fields (title, description, presenterName, status).
 * @returns {Promise<Object>} The created presentation, including its server-assigned id.
 */
export async function createPresentation(presentation) {
  const response = await fetch('https://comp2140-3ea651da.uqcloud.net/api/presentation', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(presentation),
  });

  if (!response.ok) {
    throw new Error(`Create failed: ${response.status}`);
  }

  return response.json();
}

export async function getPresentations() {
  const response = await fetch('https://comp2140-3ea651da.uqcloud.net/api/presentation', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Create failed: ${response.status}`);
  }

  return response.json();
}