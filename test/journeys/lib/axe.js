/**
 * aXe-core is an accessibility engine for automated Web UI testing
 * https://github.com/dequelabs/axe-core
 */

/**
 * Runs an aXe test on a given browser
 * @param {object} aBrowser
 * @param {string} elementId - The id of the element to run the test on
 * @param {Array} rules - the ruleset to use to do the tests against
 * @returns {Promise}
 * https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter-examples
 */
export const runAxe = (aBrowser, elementId, rules = [`best-practice`]) =>
  new Promise((resolve, reject) => {
    const axeResults = aBrowser.executeAsync((theElementId, theRules, done) => {
      const widgetElement = document.getElementById(theElementId);
      const options = {
        runOnly: {
          type: `tag`,
          values: theRules
        }
      };
      return window.axe.run(widgetElement, options, (err, results) => {
        done({err, results});
      });
    }, elementId, rules);
    if (axeResults.value.err) {
      reject(axeResults.value.err);
    }
    resolve(axeResults.value.results);
  }
);
