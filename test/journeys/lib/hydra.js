import {base64} from '@ciscospark/common';

export function constructHydraId(type, id) {
  return base64.encode(`ciscospark://us/${type.toUpperCase()}/${id}`);
}

/**
 * Deconstructs a hydra id and provides the uuid
 *
 * @export
 * @param {String} id
 * @returns {String}
 */
export function deconstructHydraId(id) {
  const payload = base64.decode(id).split('/');

  return {
    id: payload.pop(),
    type: payload.pop()
  };
}

export default {
  constructHydraId,
  deconstructHydraId
};
