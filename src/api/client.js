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


// Presentations --------------------------------------------------------
export const getPresentation  = (id) => request(`/presentation/${id}`);
/**
 * Updates a presentation's fields.
 *
 * @param {string} id - Id of the presentation to update.
 * @param {Object} patch - Fields to update (e.g. { title, author }).
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentation = (id, data) => request(`/presentation/${id}`, { method: 'PATCH', body: data });

//TODO
const createPresentation = (data) => request('/presentation', { method: 'POST', body: data });
//TODO need to delete slides, attendees
const deletePresentation = (id) => request(`/presentation/${id}`, { method: 'DELETE' });

/**
 * Updates a presentation's title.
 *
 * @param {string} id - Presentation id.
 * @param {string} title - The new title.
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentationTitle = (id, title) =>
  updatePresentation(id, { title: title });

/**
 * Updates a presentation's author.
 *
 * @param {string} id - Presentation id.
 * @param {string} author - The new author.
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentationAuthor = (id, author) =>
  updatePresentation(id, { author: author });

/**
 * Updates a presentation's status.
 *
 * @param {string} id - Presentation id.
 * @param {string} status - 'Draft' or 'Published'.
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentationStatus = (id, status) =>
  updatePresentation(id, { status: status });



// Slides --------------------------------------------------------
export const getSlide = (id) => request(`/slide/${id}`);
/**
 * Updates a slide's fields.
 *
 * @param {string} id - Id of the slide to update.
 * @param {Object} patch - Fields to update (e.g. { title, body }).
 * @returns {Promise<Object>} The updated slide.
 */
export const updateSlide = (id, data) => request(`/slide/${id}`, { method: 'PATCH', body: data });
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
export async function createSlide(presentationId, position) {
  // Create the slide entity
  const body = {
    presentation_id: presentationId,
    title: 'New slide',
    body: '## New slide\nBody text here.',
    type: 'Content',
    position: position,
    poll: { question: '', options: [], responses: [] },
  };
  const slide = await request('/slide', { method: 'POST', body: body });

  // Append the slide's id to the presentation's slides array
  const presentation = await getPresentation(presentationId);
  const existingIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  await updatePresentation(presentationId, { slides: [...existingIds, slide.id] });

  return slide;
}
/**
 * Deletes a slide and removes its id from the presentation's slides array.
 *
 * @param {string} slideId - Id of the slide to delete.
 * @param {string} presentationId - Id of the owning presentation.
 * @returns {Promise<void>}
 */
export async function deleteSlide(slideId, presentationId) {
  await request(`/slide/${slideId}`, { method: 'DELETE' });

  const presentation = await getPresentation(presentationId);
  const remaining = (Array.isArray(presentation.slides) ? presentation.slides : []).filter(
    (id) => id !== slideId
  );

  await updatePresentation(presentationId, { slides: remaining });
}



// Attendees --------------------------------------------------------
export const getAttendee = (id) => request(`/attendee/${id}`);
/**
 * Updates an attendee's fields.
 *
 * @param {string} id - Id of the attendee to update.
 * @param {Object} patch - Fields to update (e.g. { name, status }).
 * @returns {Promise<Object>} The updated attendee.
 */
export const updateAttendee = (id, data) => request(`/attendee/${id}`, { method: 'PATCH', body: data });

export async function createAttendee(name, presentation) { 
  // Create the attendee entity
  const body = {
    name: name,
    status: "Viewing",
  }
  const created = await request('/attendee', { method: 'POST', body: body });

  // Append the attendee's id to the presentation's attendees array
  const existingIds = Array.isArray(presentation.attendees) ? presentation.attendees : [];
  await updatePresentation(presentation.id, { attendees: [...existingIds, created.id] });

  return created;
}
//TODO
//delete attendee
//TODO would this require deleting their responses too?
export const deleteAttendee = (id) => request(`/attendee/${id}`, { method: 'DELETE' });



// Poll responses --------------------------------------------------------
export const getPollResponse = (id) => request(`/poll_response/${id}`);
/**
 * Updates a poll response's fields.
 *
 * @param {string} id - Id of the poll response to update.
 * @param {Object} patch - Fields to update (e.g. { attendee_id, option_index }).
 * @returns {Promise<Object>} The updated poll response.
 */
export const updatePollResponse = (id, data) => request(`/poll_response/${id}`, { method: 'PATCH', body: data });

export async function submitPollResponse(slideId, attendeeId, optionIndex) {
  // Create the poll_response entity
  const response = await request('/poll_response', { method: 'POST', body: {
    attendee_id: attendeeId,
    option_index: optionIndex,
  }});

  // Append the poll_response's id to the slides's responses array within the poll JSON field
  const slide = await getSlide(slideId);
  const existingPoll = slide.poll;
  const existingIds = Array.isArray(existingPoll.responses) ? existingPoll.responses : [];
  await updateSlide(slideId, {
    poll: {
      ...existingPoll,
      responses: [...existingIds, response.id] 
    }
  });

  return response;
}

export async function getPollResults(slideId) {
  const slide = await getSlide(slideId);

  const options = Array.isArray(slide?.poll?.options) ? slide.poll.options : [];
  const responseIds = Array.isArray(slide?.poll?.responses) ? slide.poll.responses : [];

  // Fetch each poll response entity.
  const responseEntities = await Promise.all(
    responseIds.map((rid) => request(`/poll_response/${rid}`))
  );

  // Fetch each attendee, deduplicated by id.
  const attendeeIds = [...new Set(responseEntities.map((r) => r?.attendee_id).filter(Boolean))];
  const attendeeEntities = await Promise.all(
    attendeeIds.map((aid) => request(`/attendee/${aid}`))
  );
  const attendeeById = Object.fromEntries(
    attendeeEntities.map((a) => [a.id, a])
  );

  // Build the response list with names.
  const responses = responseEntities.map((r) => ({
    attendeeId: r.attendee_id,
    attendeeName: attendeeById[r.attendee_id].name,
    optionIndex: r.option_index,
  }));

  // Aggregate counts per option.
  const counts = options.map((_, i) =>
    responses.filter((r) => r.optionIndex === i).length
  );

  return {
    options,
    counts,
    total: responses.length,
    responses,
  };
}

export const deletePollResponse = (id) => request(`/poll_response/${id}`, { method: 'DELETE' });



// Other functions --------------------------------------------------------
export const getPresentationAndSlides = async (id) => {
  const presentation = await getPresentation(id);

  const slideIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  const slides = await Promise.all(slideIds.map((slideId) => getSlide(slideId)));

  return { ...presentation, slides };
};

//TODO delete / update poll
//should remove ALL poll responses from that poll
