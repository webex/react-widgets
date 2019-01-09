import {elements} from './index';

/**
 * Enter keyword into search input box and wait for result to display
 *
 * @export
 * @param {object} browserLocal - browser
 * @param {object} keyword - search filter keyword
 * @param {number} expectedTotal - expected total number of items to display
 * @param {number} timeout - timeout for searching selector
 * @returns {object} list of items of text
 */
export function enterKeywordAndWait({
  browserLocal, keyword, expectedTotal, timeout
}) {
  browserLocal.setValue(elements.searchInput, typeof keyword === 'string' ? keyword.split('') : keyword);
  if (expectedTotal > 1) {
    browserLocal.waitForExist(elements.title);
    browserLocal.waitUntil((() => browserLocal.elements(elements.title).isVisible()), timeout);
    browserLocal.waitUntil((() => browserLocal.elements(elements.title).getText().length === expectedTotal), timeout);
  }
  else if (expectedTotal === 0) {
    return browserLocal.waitUntil((() => browserLocal.elements(elements.title)), timeout);
  }

  return browserLocal.elements(elements.title).getText();
}

export default {};
