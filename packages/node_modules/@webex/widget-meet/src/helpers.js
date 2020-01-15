
/**
 * Removes a user from a list of users
 * @param {Object} me
 * @param {Array} users
 * @returns {Array}
 */
export function getOtherUsers(me, users) {
  return users.filter((u) => u.id !== me.id);
}

export default {};
