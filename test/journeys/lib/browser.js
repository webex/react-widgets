/* global: browser */
function inFirefox() {
  return browser.desiredCapabilities.browserName === 'firefox';
}

function inChrome() {
  return browser.desiredCapabilities.browserName === 'chrome';
}

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

  return inFirefox() ? mochaMethod.skip : mochaMethod;
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

  return inChrome() ? mochaMethod.skip : mochaMethod;
}
