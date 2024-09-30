/**
 * Takes a component and provides the correct name
 * @param {String} C
 * @returns {String}
 */
export function getDisplayName(C) {
  return C.displayName || C.name || 'C';
}

export default {};
