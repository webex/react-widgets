export function prepareStatusResponses(responses) {
  // Convert array of responses to an object
  const processed = {};

  responses.forEach((response) => {
    if (!response.subject) {
      return;
    }
    // Undefined status means we are unable to get presence for that user.
    // Setting to false keeps us from retrying the fetch
    processed[response.subject] = response.status || false;
  });

  return processed;
}

export function prepareSingleStatusResponse(response) {
  const processed = {};

  processed[response.subject] = response;

  return processed;
}
