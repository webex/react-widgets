import {constructHydraId as _constructHydraId, deconstructHydraId} from '@webex/common';

/**
 * Constructs a hydra id for a given uuid and type
 *
 * @export
 * @param {string} type one of PEOPLE, TEAM, ROOM
 * @param {any} id
 * @param {string} cluster
 * @returns {string}
 */
export function constructHydraId(type, id, cluster) {
  return id ? _constructHydraId(type, id, cluster) : '';
}

/**
 * Deconstructs a hydra id and provides the uuid
 *
 * @export
 * @param {String} id
 * @returns {object} hydra
 * @returns {String} hydra.id
 * @returns {String} hydra.type
 * @returns {String} hydra.cluster
 */
export {deconstructHydraId};

export const hydraTypes = {
  ATTACHMENT_ACTION: 'ATTACHMENT_ACTION',
  CONTENT: 'CONTENT',
  MEMBERSHIP: 'MEMBERSHIP',
  MESSAGE: 'MESSAGE',
  ORGANIZATION: 'ORGANIZATION',
  PEOPLE: 'PEOPLE',
  ROOM: 'ROOM',
  TEAM: 'TEAM'
};

/**
 * Tests if a string is a UUID
 * @param {String} string
 * @returns {Boolean}
 */
export function isUuid(string) {
  const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegExp.test(string);
}


/**
 * Takes a Conversation URL and returns the Uuid
 * @param {String} convoUrl
 * @returns {String|Boolean}
 */
export function getConvoIdFromUrl(convoUrl) {
  const id = convoUrl.split('/').pop();

  if (isUuid(id)) {
    return id;
  }

  return false;
}

/**
 * @typedef {object} DeconstructedId
 * @param {string} [id] - id of the object destructed
 * @param {string} [cluster] - cluster location of the object destructed
 * @param {string} [type] - type of object destructed
 */
/**
 * Validates a id as a UUID or a hydra encoded UUID
 * @param {String} id
 * @returns {DeconstructedId} empty object if not a valid input
 */
export function validateAndDecodeId(id) {
  if (!(id && id.length)) {
    return {};
  }

  if (isUuid(id)) {
    return {
      id
    };
  }

  // Check for base 64 encoding
  try {
    const idParts = deconstructHydraId(id);

    if (isUuid(idParts.id)) {
      return idParts;
    }
  }
  catch (e) {
    if (e.name !== 'InvalidCharacterError') {
      throw e;
    }
  }

  return {};
}
