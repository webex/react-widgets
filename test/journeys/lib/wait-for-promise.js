/**
 * Blocks control flow until the promise resolves. Throws if the promise rejects
 * @param {Promise} promise
 * @param {String} message to output on failure
 * @returns {mixed}
 */
export default function waitForPromise(promise, message) {
  let err, res;
  browser.waitUntil(() => promise
    .then((r) => {
      res = r;
      return true;
    })
    .catch((r) => {
      err = r;
      return true;
    }), 15000, `timeout waiting for promise: ${message}`);
  if (err) {
    throw err;
  }

  return res;
}
