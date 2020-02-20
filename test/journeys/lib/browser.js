/**
 * Wrap the desired mochaMethod with `skipInFirefox` to prevent the
 * corresponding test or group of tests from running in Firefox.
 * example:
 * `skipInFirefox(it)('does a thing that does not work in Firefox')`
 * @param {Function} mochaMethod `it` or `describe`
 * @returns {Function} mochaMethod or mochaMethod.skip
 */
export function skipInFirefox(mochaMethod) {
  // If mochaMethod doesn't have a skip method, assume that mochaMethod is
  // already either a .skip or a .only
  if (!mochaMethod.skip) {
    return mochaMethod;
  }

  // Make sure process.env.BROWSER is not undefined and that is equal to `firefox`
  return (!!process.env.BROWSER && process.env.BROWSER === 'firefox')
    ? mochaMethod.skip
    : mochaMethod;
}

/**
 * Wrap the desired mochaMethod with `skipInChrome` to prevent the
 * corresponding test or group of tests from running in Chrome.
 * example:
 * `skipInChrome(it)('does a thing that does not work in Chrome')`
 * @param {Function} mochaMethod `it` or `describe`
 * @returns {Function} mochaMethod or mochaMethod.skip
 */
export function skipInChrome(mochaMethod) {
  // If mochaMethod doesn't have a skip method, assume that mochaMethod is
  // already either a .skip or a .only
  if (!mochaMethod.skip) {
    return mochaMethod;
  }

  // If process.env.BROWSER is not undefined or it's defined and equal to `chrome`
  return (typeof process.env.BROWSER === 'undefined' || process.env.BROWSER === 'chrome')
    ? mochaMethod.skip
    : mochaMethod;
}
