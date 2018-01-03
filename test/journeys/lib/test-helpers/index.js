import uuid from 'uuid';

/**
 * Move mouse a specified amount of pixels
 * Origin is set to the element that matches the selector passed
 * Mouse is then moved from the origin by the x and y offset
 * @param {Object} aBrowser
 * @param {string} selector
 * @param {integer} [x=100]
 * @param {integer} [y=100]
 * @returns {void}
 */
// eslint-disable-next-line import/prefer-default-export
export function moveMouse(aBrowser, selector, x = 100, y = 100) {
  const element = aBrowser.element(selector);
  if (aBrowser.desiredCapabilities.browserName.toLowerCase().includes('firefox')) {
    aBrowser.actions([{
      type: 'pointer',
      id: `mouse-${uuid.v4()}`,
      parameters: {pointerType: 'mouse'},
      actions: [
        {
          type: 'pointerMove', element: element.value, duration: 0, x, y
        }
      ]
    }]);
  }
  else {
    aBrowser.moveToObject(selector);
  }
}
