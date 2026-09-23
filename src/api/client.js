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

async function requestEntity(path, options) {
  const payload = await request(path, options);
  return payload?.data ?? payload;
}

async function requestList(path, options) {
  const payload = await request(path, options);
  return Array.isArray(payload?.data) ? payload.data : [];
}



// Presentations --------------------------------------------------------
/**
 * Fetches a single presentation by id.
 *
 * @param {string} id - Presentation id.
 * @returns {Promise<Object>} The presentation.
 */
export const getPresentation = (id) => requestEntity(`/presentation/${id}`);
/**
 * Fetches every presentation.
 *
 * @returns {Promise<Object>} The presentations.
 */
export const getAllPresentations = () => requestList("/presentation");
/**
 * Updates a presentation's fields.
 *
 * @param {string} id - Id of the presentation to update.
 * @param {Object} data - Fields to update (e.g. { title, author }).
 * @returns {Promise<Object>} The updated presentation.
 */
export const updatePresentation = (id, data) => request(`/presentation/${id}`, { method: 'PATCH', body: data });
/**
 * Creates a new presentation.
 *
 * @param {string} title
 * @param {string} [author='Unknown']
 * @returns {Promise<Object>} The created presentation, with its server-assigned id.
 */
export const createPresentation = (title, author="Unknown") => {
  const body = {
    title: title.trim(),
    author: author,
    status: 'Draft',
    slides: [],
    attendees: [],
  };
  return requestEntity('/presentation', { method: 'POST', body: body });
};
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
 *poll belonging to a slide, along wit
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
/**
 * Fetches all attendees for a presentation.
 *
 * @param {string} presentationId - Presentation id.
 * @returns {Promise<Array<Object>>} The presentation's attendees.
 */
export async function getPresentationAttendees(presentationId) {
  const presentation = await getPresentation(presentationId);
  return await Promise.all(
    presentation.attendees.map((attendeeId) => getAttendee(attendeeId))
  );
}
/**
 * Deletes a presentation and all of its slides.
 *
 * @param {string} id - Presentation id.
 * @returns {Promise<void>}
 */
export async function deletePresentation(id) {
  const presentation = await getPresentation(id);
  // Delete all slides and their poll responses
  await Promise.all(presentation.slides.map((slideId) => deleteSlideHelper(slideId)));
  // Delete the presentation
  await request(`/presentation/${id}`, { method: 'DELETE' });
}



// Slides --------------------------------------------------------
/**
 * Fetches a single slide by id.
 *
 * @param {string} id - Slide id.
 * @returns {Promise<Object>} The slide.
 */
export const getSlide = (id) => requestEntity(`/slide/${id}`);
/**
 * Fetches every slide.
 *
 * @returns {Promise<Object>} The slides.
 */
export const getAllSlides = () => requestList("/slide");
/**
 * Updates a slide's fields.
 *
 * @param {string} id - Id of the slide to update.
 * @param {Object} data - Fields to update (e.g. { title, body }).
 * @returns {Promise<Object>} The updated slide.
 */
export const updateSlide = (id, data) => request(`/slide/${id}`, { method: 'PATCH', body: data });
/**
 * Creates a slide and appends it to the presentation's slides array.
 *
 * @param {string} presentationId - Id of the presentation.
 * @param {number} position - Position of the slide in the presentation.
 * @returns {Promise<Object>} The created slide, including its id.
 */
export async function createSlide(presentationId, position) {
  // Create the slide entity
  const body = {
    title: 'New slide',
    body: '## New slide\nBody text here.',
    type: 'Content',
    position: position,
    poll: { question: '', options: [], responses: [] },
  };
  const slide = await requestEntity('/slide', { method: 'POST', body: body });

  // Append the slide's id to the presentation's slides array
  const presentation = await getPresentation(presentationId);
  const existingIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  await updatePresentation(presentationId, { slides: [...existingIds, slide.id] });

  return slide;
}
/**
 * Deletes all responses belonging to a poll.
 * 
 * @param {string} slideId - Id of the slide's poll to delete
 * @returns {Promise<void>}
 */
export async function deleteSlidePollResponses(slideId) {
  const slide = await getSlide(slideId);
  const responseIds = Array.isArray(slide?.poll?.responses) ? slide.poll.responses : [];
  await Promise.all(responseIds.map((rid) => deletePollResponse(rid)));
}
/**
 * Replaces a slide's poll question and options, deleting any existing responses.
 *
 * @param {string} slideId
 * @param {string} question
 * @param {string[]} options
 * @returns {Promise<void>}
 */
export async function updateSlidePoll(slideId, question, options) {
  // Delete existing invalidated responses
  await deleteSlidePollResponses(slideId);
  // Update the poll
  await updateSlide(slideId, {
    poll: {
      question: question,
      options: options,
      responses: [],
    }
  });
}
/**
 * Deletes a slide and it's responses without removing it's references in the presentation.
 * 
 * @param {string} slideId 
 * @returns {Promise<void>}
 */
async function deleteSlideHelper(slideId) {
  await deleteSlidePollResponses(slideId);
  await request(`/slide/${slideId}`, { method: 'DELETE' });
}
/**
 * Deletes a slide, its poll responses, and removes its id from the
 * presentation's slides array.
 *
 * @param {string} slideId - Id of the slide to delete.
 * @param {string} presentationId - Id of the owning presentation.
 * @returns {Promise<void>}
 */
export async function deleteSlide(slideId, presentationId) {
  // Remove any poll responses the slide owns, and delete the slide
  await deleteSlideHelper(slideId);

  // Remove references to the slide's id in the presentation
  const presentation = await getPresentation(presentationId);
  const remaining = (Array.isArray(presentation.slides) ? presentation.slides : []).filter(
    (id) => id !== slideId
  );
  await updatePresentation(presentationId, { slides: remaining });
}

export function isPoll(slide) {
  return slide.type === "Poll";
}


// Attendees --------------------------------------------------------
/**
 * Fetches a single attendee by id.
 *
 * @param {string} id - Attendee id.
 * @returns {Promise<Object>} The attendee.
 */
export const getAttendee = (id) => requestEntity(`/attendee/${id}`);
/**
 * Fetches every attendee.
 *
 * @returns {Promise<Object>} The attendees.
 */
export const getAllAttendees = () => requestList("/attendee");
/**
 * Updates an attendee's fields.
 *
 * @param {string} id - Id of the attendee to update.
 * @param {Object} data - Fields to update (e.g. { name, status }).
 * @returns {Promise<Object>} The updated attendee.
 */
export const updateAttendee = (id, data) => request(`/attendee/${id}`, { method: 'PATCH', body: data });
/**
 * Creates an attendee and appends their id to the presentation's attendees array.
 *
 * @param {string} name
 * @param {Object} presentation - The presentation to join (needs .id and .attendees).
 * @returns {Promise<Object>} The created attendee.
 */
export async function createAttendee(name, presentation) { 
  // Create the attendee entity
  const body = {
    name: name,
    status: "Viewing",
  }
  const attendee = await requestEntity('/attendee', { method: 'POST', body: body });

  // Append the attendee's id to the presentation's attendees array
  const existingIds = Array.isArray(presentation.attendees) ? presentation.attendees : [];
  await updatePresentation(presentation.id, { attendees: [...existingIds, attendee.id] });

  return attendee;
}
/**
 * Deletes an attendee.
 *
 * @param {string} id - Attendee id.
 * @returns {Promise<void>}
 */
export const deleteAttendee = (id) => request(`/attendee/${id}`, { method: 'DELETE' });



// Poll responses --------------------------------------------------------
/**
 * Fetches a single poll response by id.
 *
 * @param {string} id - Poll response id.
 * @returns {Promise<Object>} The poll response.
 */
export const getPollResponse = (id) => requestEntity(`/poll_response/${id}`);
/**
 * Fetches every poll response.
 *
 * @returns {Promise<Object>} The responses.
 */
export const getAllPollResponses = () => requestList("/poll_response");
/**
 * Updates a poll response's fields.
 *
 * @param {string} id - Id of the poll response to update.
 * @param {Object} data - Fields to update (e.g. { attendee_id, option_index }).
 * @returns {Promise<Object>} The updated poll response.
 */
export const updatePollResponse = (id, data) => request(`/poll_response/${id}`, { method: 'PATCH', body: data });
/**
 * Records an attendee's answer and appends the response id to the slide's poll.
 *
 * @param {string} slideId
 * @param {string} attendeeId
 * @param {number} optionIndex
 * @returns {Promise<Object>} The created poll response.
 */
export async function submitPollResponse(slideId, attendeeId, optionIndex) {
  // Create the poll_response entity
  const response = await requestEntity('/poll_response', { method: 'POST', body: {
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
/**
 * Fetches a poll slide's results, aggregated by option, with attendee names.
 *
 * @param {string} slideId
 * @returns {Promise<{ options: string[], counts: number[], total: number, responses: Array<{ attendeeId, attendeeName, optionIndex }> }>}
 */
export async function getPollResults(slideId) {
  const slide = await getSlide(slideId);

  const options = Array.isArray(slide?.poll?.options) ? slide.poll.options : [];
  const responseIds = Array.isArray(slide?.poll?.responses) ? slide.poll.responses : [];

  // Build the response list with names
  const responses = await Promise.all(
    responseIds.map(async (responseId) => {
      const response = await getPollResponse(responseId);
      const attendee = await getAttendee(response.attendee_id);
      return {
        attendeeId: response.attendee_id,
        attendeeName: attendee.name,
        optionIndex: response.option_index,
      };
    })
  );

  // Aggregate counts per option
  const counts = options.map((_, i) =>
    responses.filter((r) => r.optionIndex === i).length
  );

  return { 
    options, 
    counts, 
    total: responses.length,
    responses 
  };
}
/**
 * Deletes a poll response.
 *
 * @param {string} id - Poll response id.
 * @returns {Promise<void>}
 */
export const deletePollResponse = (id) => request(`/poll_response/${id}`, { method: 'DELETE' });



// Other functions --------------------------------------------------------
/**
 * Fetches a presentation with its slides populated.
 *
 * @param {string} id
 * @returns {Promise<Object>} The presentation with `slides: Array<Object>`.
 */
export async function getPresentationAndSlides(id) {
  const presentation = await getPresentation(id);
  const slideIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  const slides = await Promise.all(slideIds.map((slideId) => getSlide(slideId)));
  return { presentation, slides };
}