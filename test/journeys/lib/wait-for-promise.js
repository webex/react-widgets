/**
 * Blocks control flow until the promise resolves. Throws if the promise rejects
 * @param {Promise} promise
 * @returns {mixed}
 */
export default function waitForPromise(promise) {
  let err, res;

  browser.waitUntil(() => promise
    .then((r) => {
      res = r;

      return true;
    })
    .catch((r) => {
      err = r;

      return true;
    }));
  if (err) {
    throw err;
  }

  return res;
}
