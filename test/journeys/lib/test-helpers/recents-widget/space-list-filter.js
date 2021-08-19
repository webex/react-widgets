import {elements} from './index';

/**
 * Enter keyword into search input box and wait for result to display
 *
 * @export
 * @param {Object} options
 * @param {object} options.browserLocal - browser
 * @param {object} options.keyword - search filter keyword
 * @param {number} options.expectedTotal - expected total number of items to display
 * @param {number} options.timeout - timeout for searching selector
 * @returns {object} list of items of text
 */
export function enterKeywordAndWait({
  browserLocal,
  keyword,
  expectedTotal,
  timeout
}) {
  browserLocal
    .$(elements.searchInput)
    .setValue(typeof keyword === 'string' ? keyword.split('') : keyword);

  if (expectedTotal > 1) {
    browserLocal.$(elements.title).waitForExist();
    browserLocal.waitUntil(() => browserLocal.$(elements.title).isDisplayed(), timeout);
    console.log(browserLocal.$(elements.title).getText().length, expectedTotal);
    browserLocal.waitUntil(() => browserLocal.$(elements.title).getText().length === expectedTotal, timeout);
  }
  else if (expectedTotal === 0) {
    return browserLocal.waitUntil(() => browserLocal.$(elements.title), timeout);
  }

  return browserLocal.$(elements.title).getText();
}


export default {};
