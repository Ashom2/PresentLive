const BASE_URL = 'https://comp2140-3ea651da.uqcloud.net/api';

/**
 * Makes an authenticated JSON request to the API.
 * Written by DeepSeek AI.
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
    const detail = payload?.details?.join(', ');
    throw new Error(detail ?? payload?.error ?? `Request failed: ${response.status}`);
  }

  return payload;
}


export const fetchData = () => request('');
export const getPresentations = () => request('/presentation');
export const getPresentation  = (id) => request(`/presentation/${id}`);
export const createPresentation = (data) => request('/presentation', { method: 'POST', body: data });
export const updatePresentation = (id, data) => request(`/presentation/${id}`, { method: 'PATCH', body: data });
export const deletePresentation = (id) => request(`/presentation/${id}`, { method: 'DELETE' });



/**
 * Updates a presentation's title.
 *
 * @param {string} id - Presentation id.
 * @param {string} title - The new title.
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentationTitle = (id, title) =>
  request(`/presentation/${id}`, { method: 'PATCH', body: { title } });

/**
 * Updates a presentation's author.
 *
 * @param {string} id - Presentation id.
 * @param {string} author - The new author.
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentationAuthor = (id, author) =>
  request(`/presentation/${id}`, { method: 'PATCH', body: { author } });

/**
 * Updates a presentation's status.
 *
 * @param {string} id - Presentation id.
 * @param {string} status - 'Draft' or 'Published'.
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentationStatus = (id, status) =>
  request(`/presentation/${id}`, { method: 'PATCH', body: { status } });



export const getSlide = (id) => request(`/slide/${id}`);

/**
 * Creates a slide and appends it to the presentation's slides array.
 *
 * @param {Object} slide
 * @param {string} slide.presentation_id
 * @param {string} slide.title
 * @param {string} slide.body
 * @param {string} slide.type - 'Content' or 'Poll'.
 * @param {number} slide.position
 * @param {Object} slide.poll - { question, options }.
 * @returns {Promise<Object>} The created slide, including its id.
 */
export async function createSlide(slide) {
  // Create the slide entity
  const created = await request('/slide', { method: 'POST', body: slide });

  // Append the slide's id to the presentation's slides array
  const presentation = await request(`/presentation/${slide.presentation_id}`);
  const existingIds = Array.isArray(presentation.slides) ? presentation.slides : [];

  await request(`/presentation/${slide.presentation_id}`, {
    method: 'PATCH',
    body: { slides: [...existingIds, created.id] },
  });

  return created;
}

export const getPresentationAndSlides = async (id) => {
  const response = await request(`/presentation/${id}`);
  const presentation = response?.data ?? response;

  const slideIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  const slides = await Promise.all(slideIds.map((sid) => getSlide(sid)));

  return { ...presentation, slides };
};

/**
 * Updates a slide's fields.
 *
 * @param {string} slideId - Id of the slide to update.
 * @param {Object} patch - Fields to update (e.g. { title, body }).
 * @returns {Promise<Object>} The updated slide.
 */
export const updateSlide = (slideId, patch) =>
  request(`/slide/${slideId}`, {
    method: 'PATCH',
    body: patch,
  });

/**
 * Deletes a slide and removes its id from the presentation's slides array.
 *
 * @param {string} slideId - Id of the slide to delete.
 * @param {string} presentationId - Id of the owning presentation.
 * @returns {Promise<void>}
 */
export async function deleteSlide(slideId, presentationId) {
  await request(`/slide/${slideId}`, { method: 'DELETE' });

  const response = await request(`/presentation/${presentationId}`);
  const deck = response?.data ?? response;
  const remaining = (Array.isArray(deck.slides) ? deck.slides : []).filter(
    (sid) => sid !== slideId
  );

  await request(`/presentation/${presentationId}`, {
    method: 'PATCH',
    body: { slides: remaining },
  });
}