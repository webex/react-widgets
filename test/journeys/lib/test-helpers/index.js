import uuid from 'uuid';

/**
 * Move mouse a specified amount of pixels
 * Origin is set to the element that matches the selector passed
 * Mouse is then moved from the origin by the x and y offset
 * @param {Object} aBrowser
 * @param {string} selector
 * @param {integer} [offsetX=0]
 * @param {integer} [offsetY=0]
 * @returns {void}
 */
// eslint-disable-next-line import/prefer-default-export
export function moveMouse(aBrowser, selector) {
  if (aBrowser.desiredCapabilities.browserName.toLowerCase().includes('firefox')) {
    // Find center point of element
    const {x: elementX, y: elementY} = aBrowser.getLocation(selector);
    const {height, width} = aBrowser.getElementSize(selector);

    const x = Math.round(elementX + width / 2);
    const y = Math.round(elementY + height / 2);
    aBrowser.actions([{
      type: 'pointer',
      id: `mouse-${uuid.v4()}`,
      parameters: {pointerType: 'mouse'},
      actions: [
        {
          type: 'pointerMove',
          duration: 0,
          x,
          y
        },
        {
          type: 'pause',
          duration: 500
        }
      ]
    }]);
  }
  else {
    aBrowser.moveToObject(selector);
  }
}


/**
 * Loads a widget into the browser with Data API
 * @param {Object} options
 * @param {Object} options.aBrowser required
 * @param {string} options.bundle required
 * @param {string} options.accessToken required
 * @param {string} options.widget required, name of widget we need to load
 * @param {string} options.spaceId
 * @param {string} options.toPersonEmail
 * @param {string} options.initialActivity
 * @param {boolean} options.startCall
 */
export function loadWithDataApi({
  aBrowser,
  accessToken,
  spaceId,
  toPersonEmail,
  initialActivity,
  startCall
}) {
  aBrowser.refresh();
  aBrowser.waitUntil(() =>
    aBrowser.isVisible('#ciscospark-widget'),
  15000, 'failed to refresh browser');

  aBrowser.execute((options) => {
    window.openWidgetDataApi(options);
  }, {
    accessToken,
    spaceId,
    toPersonEmail,
    initialActivity,
    startCall
  });
}

/**
 * Loads a widget into the browser with browser globals
 * @param {Object} options
 * @param {Object} options.aBrowser required
 * @param {string} options.accessToken required
 * @param {string} options.spaceId
 * @param {string} options.toPersonEmail
 * @param {string} options.initialActivity
 * @param {boolean} options.startCall
 */
export function loadWithGlobals({
  aBrowser,
  accessToken,
  spaceId,
  toPersonEmail,
  initialActivity,
  startCall
}) {
  aBrowser.refresh();
  aBrowser.waitUntil(() =>
    aBrowser.isVisible('#ciscospark-widget'),
  15000, 'failed to refresh browser');

  aBrowser.execute((options) => {
    window.openWidgetGlobal(options);
  }, {
    accessToken,
    spaceId,
    toPersonEmail,
    initialActivity,
    startCall
  });
}

export function clickButton(aBrowser, button) {
  aBrowser.waitUntil(() =>
    aBrowser.isVisible(button),
  5000, `button (${button}) was not visible after 5s and could not be clicked`);
  aBrowser.click(button);
}

export function removeWidget(aBrowser) {
  aBrowser.execute(() => {
    window.removeWidget();
  });
}

export function setPageTestName(aBrowser, testName) {
  aBrowser.execute((name) => {
    window.setTestName(name);
  }, testName);
}
