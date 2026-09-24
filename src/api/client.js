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

/**
 * Like `request`, but unwraps `{ data }` envelopes. Returns the entity
 * directly, so callers never see the envelope.
 *
 * @param {string} path
 * @param {Object} [options]
 * @returns {Promise<any>}
 */
async function requestEntity(path, options) {
  const payload = await request(path, options);
  return payload?.data ?? payload;
}

/**
 * Like `request`, but unwraps `{ data }` envelopes and asserts the result
 * is an array. Returns [] if the payload isn't an array.
 *
 * @param {string} path
 * @param {Object} [options]
 * @returns {Promise<Array>}
 */
async function requestList(path, options) {
  const payload = await request(path, options);
  return Array.isArray(payload?.data) ? payload.data : [];
}


//TODO delete attendee



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
 * @returns {Promise<Array<Object>>} The presentations.
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
    attendee_ids: [],
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
/**
 * Fetches all attendees for a presentation.
 *
 * @param {string} presentationId - Presentation id.
 * @returns {Promise<Array<Object>>} The presentation's attendees.
 */
export async function getPresentationAttendees(presentationId) {
  const presentation = await getPresentation(presentationId);
  return await Promise.all(
    presentation.attendee_ids.map((attendeeId) => getAttendee(attendeeId))
  );
}
/**
 * Deletes a presentation, its slides, their poll responses, and attendees.
 *
 * Note: does not delete attendees - they remain in the database with
 * a dangling presentation_id.
 *
 * @param {string} id - Presentation id.
 * @returns {Promise<void>}
 */
export async function deletePresentation(id) {
  const presentation = await getPresentation(id);

  // Delete all slides and their poll responses
  await Promise.all(presentation.slides.map(async (slideId) =>
    deleteSlide(slideId, id, false)
  ));

  // Delete all attendees
  await Promise.all(presentation.attendee_ids.map(async (attendeeId) =>
    deleteAttendee(attendeeId)
  ));

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
 * @returns {Promise<Array<Object>>} The slides.
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
    poll: { 
      question: '', 
      options: [],
    },
    response_ids: [],
  };
  const slide = await requestEntity('/slide', { method: 'POST', body: body });

  // Append the slide's id to the presentation's slides array
  const presentation = await getPresentation(presentationId);
  const existingIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  await updatePresentation(presentationId, { slides: [...existingIds, slide.id] });

  return slide;
}
/**
 * Deletes every response attached to a slide's poll.
 *
 * @param {string} slideId - Id of the slide whose responses should be deleted.
 * @param {boolean} [removeSlideRefs=true] - If false, skip removing ids from
 *   the slide's own response_ids (used when the slide is being deleted anyway).
 * @returns {Promise<void>}
 */
export async function deleteSlidePollResponses(slideId, removeSlideRefs=true) {
  const slide = await getSlide(slideId);
  const responseIds = Array.isArray(slide?.response_ids) ? slide?.response_ids : [];
  await Promise.all(responseIds.map((responseId) => 
    deletePollResponseAndReferences(responseId, removeSlideRefs)
  ));
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
  // Delete existing invalidated responses (and references other than those in this slide)
  await deleteSlidePollResponses(slideId, false);

  // Update the poll
  await updateSlide(slideId, {
    poll: {
      question: question,
      options: options,
    },
    response_ids: []
  });
}
/**
 * Deletes a slide, its poll responses, and removes its id from the
 * presentation's slides array.
 *
 * @param {string} slideId - Id of the slide to delete.
 * @param {string} presentationId - Id of the owning presentation.
 * @param {boolean} [removePresentationRefs=true] - If false, skip removing
 *   the slide id from the presentation (used when the presentation itself
 *   is being deleted).
 * @returns {Promise<void>}
 */
export async function deleteSlide(slideId, presentationId, removePresentationRefs=true) {
  // Remove any poll responses and their references the slide owns, and delete the slide
  await deleteSlidePollResponses(slideId, false);
  await request(`/slide/${slideId}`, { method: 'DELETE' });

  // Remove references to the slide's id in the presentation
  if (removePresentationRefs) {
    const presentation = await getPresentation(presentationId);
    const remaining = (Array.isArray(presentation.slides) ? presentation.slides : []).filter(
      (id) => id !== slideId
    );
    await updatePresentation(presentationId, { slides: remaining });
  }
}
/**
 * Returns true if a slide is a poll slide.
 *
 * @param {Object} slide
 * @returns {boolean}
 */
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
 * @returns {Promise<Array<Object>>} The attendees.
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
 * Updates an attendee's slide_index.
 *
 * @param {string} attendeeId
 * @param {number} slideIndex
 * @returns {Promise<Object>} The updated attendee.
 */
export const updateAttendeeSlideIndex = (attendeeId, slideIndex) =>
  updateAttendee(attendeeId, { slide_index: slideIndex });
/**
 * Creates an attendee and appends their id to the presentation's attendees array.
 *
 * @param {string} name
 * @param {Object} presentation - The presentation to join (needs .id and .attendee_ids).
 * @returns {Promise<Object>} The created attendee.
 */
export async function createAttendee(name, presentation) { 
  // Create the attendee entity
  const body = {
    name: name,
    status: "Viewing",
    slide_index: 0,
    presentation_id: presentation.id,
    response_ids: [],
  }
  const attendee = await requestEntity('/attendee', { method: 'POST', body: body });

  // Append the attendee's id to the presentation's attendees array
  const existingIds = Array.isArray(presentation.attendee_ids) ? presentation.attendee_ids : [];
  await updatePresentation(presentation.id, { attendee_ids: [...existingIds, attendee.id] });

  return attendee;
}
/**
 * Deletes an attendee.
 *
 * Note: does not remove the attendee's id from the presentation's
 * attendee_ids, nor delete their poll responses. Callers are responsible
 * for cleaning those up.
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
 * @returns {Promise<Array<Object>>} The responses.
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
 * Records an attendee's answer to a poll and appends the new response id
 * to both the slide's and the attendee's response_ids arrays.
 *
 * @param {Object} slide - The poll slide. Must include id, poll, and response_ids.
 * @param {string} attendeeId
 * @param {number} optionIndex
 * @returns {Promise<Object>} The created poll response.
 */
export async function submitPollResponse(slide, attendeeId, optionIndex) {
  // Create the poll_response entity
  const response = await requestEntity('/poll_response', { method: 'POST', body: {
    attendee_id: attendeeId,
    option_index: optionIndex,
    slide_id: slide.id,
    poll: slide.poll,
  }});

  // Append the poll_response's id to the slides's responses array
  const slideResponseIds = Array.isArray(slide.response_ids) ? slide.response_ids : [];
  await updateSlide(slide.id, {
    response_ids: [...slideResponseIds, response.id] 
  });

  // Append the poll_response's id to the attendees's responses array
  const attendee = await getAttendee(attendeeId);
  const attendeeResponseIds = Array.isArray(attendee.response_ids) ? attendee.response_ids : [];
  await updateAttendee(attendeeId, {
    response_ids: [...attendeeResponseIds, response.id] 
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
  const responseIds = Array.isArray(slide?.response_ids) ? slide?.response_ids : [];

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
/**
 * Deletes a poll response and removes its id from the owning slide
 * and attendee's response_ids arrays.
 *
 * @param {string} responseId - Id of the response to delete.
 * @param {boolean} [removeSlideRefs=true] - If false, skip removing the id
 *   from the slide's response_ids.
 * @param {boolean} [removeAttendeeRefs=true] - If false, skip removing the id
 *   from the attendee's response_ids.
 * @returns {Promise<void>}
 */
export async function deletePollResponseAndReferences(responseId, removeSlideRefs=true, removeAttendeeRefs=true) {
  const response  = await getPollResponse(responseId);
  const slideId = response.slide_id;
  const attendeeId = response.attendee_id;

  // Remove from the slide's response_ids.
  if (removeSlideRefs) {
    const slide = await getSlide(slideId);
    const slideRemainingIds = (Array.isArray(slide.response_ids) ? slide.response_ids : [])
      .filter((rid) => rid !== responseId);
    await updateSlide(slideId, { response_ids: slideRemainingIds });
  }

  // Remove from the attendee's response_ids.
  if (removeAttendeeRefs) {
    const attendee = await getAttendee(attendeeId);
    const attendeeRemainingIds = (Array.isArray(attendee.response_ids) ? attendee.response_ids : [])
      .filter((rid) => rid !== responseId);
    await updateAttendee(attendeeId, { response_ids: attendeeRemainingIds });
  }

  // Delete the response itself.
  await deletePollResponse(responseId);
}






// Other functions --------------------------------------------------------
/**
 * Fetches a presentation and its slides as separate values.
 *
 * @param {string} id - Presentation id.
 * @returns {Promise<{ presentation: Object, slides: Array<Object> }>}
 */
export async function getPresentationAndSlides(id) {
  const presentation = await getPresentation(id);
  const slideIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  const slides = await Promise.all(slideIds.map((slideId) => getSlide(slideId)));
  return { presentation, slides };
}

/**
 * Searches a slide for a response that belongs to an attendee.
 * 
 * @param {Object} slide - The poll slide.
 * @param {Object} attendee - The attendee to look for.
 * @returns {Promise<Object|undefined>} The attendee's response, if any.
 */
export async function getSlideResponse(slide, attendee) {
  const responseIds = Array.isArray(slide?.response_ids) ? slide?.response_ids : [];
  
  if (!attendee?.id || responseIds.length === 0) return undefined;
  
  const all = await Promise.all(responseIds.map((responseId) => getPollResponse(responseId)));
  const todo = all.find((response) => response?.attendee_id === attendee.id);
  return todo;
}

/**
 * Fetches an attendee, their presentation, and every poll response
 * they submitted across the presentation's slides.
 *
 * @param {string} attendeeId
 * @returns {Promise<{ attendee: Object, presentation: Object, responses: Array<Object> }>}
 */
export async function getAttendeeAndPresentation(attendeeId) {
  const attendee = await getAttendee(attendeeId);
  const presentation = await getPresentation(attendee.presentation_id);

  const slideIds = Array.isArray(presentation.slides) ? presentation.slides : [];
  const slides = await Promise.all(slideIds.map((slideId) => getSlide(slideId)));

  const allResponses = await Promise.all(slides.map((slide) => getSlideResponse(slide, attendee)));
  const responses = allResponses.filter(Boolean);

  return { attendee, presentation, responses }
}
