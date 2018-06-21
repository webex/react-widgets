export const ADD_ERROR = 'errors/ADD_ERROR';
export const REMOVE_ERROR = 'errors/REMOVE_ERROR';
export const RESET_ERRORS = 'errors/RESET_ERRORS';

/**
 * Creates an error to track
 * @param {Object} error
 * @param {String} error.actionTitle
 * @param {String} error.id
 * @param {String} error.displayTitle
 * @param {String} error.displaySubtitle
 * @param {Function} error.onAction
 * @param {Boolean} error.temporary
 * @param {String} error.code
 * @returns {Object}
 */
export function addError(error) {
  return {
    type: ADD_ERROR,
    payload: {
      error
    }
  };
}

/**
 * Removes an error with the given id
 *
 * @export
 * @param {string} errorId
 * @returns {object}
 */
export function removeError(errorId) {
  return {
    type: REMOVE_ERROR,
    payload: {
      errorId
    }
  };
}

/**
 * Resets errors back to the initial state
 *
 * @export
 * @returns {object}
 */
export function resetErrors() {
  return {
    type: RESET_ERRORS
  };
}
