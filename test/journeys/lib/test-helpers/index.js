import uuid from 'uuid';

import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import '@ciscospark/plugin-phone';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

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
 * Creates a number of test users
 * @param {number} count number of users to generate
 * @param {Object} userInfo with config to pass to test user creator
 * @returns {Object}
 */
export function createTestUsers(count, userInfo = {
  docbrown: {displayName: 'Emmett Brown'},
  lorraine: {displayName: 'Lorraine Baines'},
  marty: {displayName: 'Marty McFly'},
  biff: {displayName: 'Biff Tannen'}
}) {
  const users = {};
  const userKeys = Object.keys(userInfo);

  function storeUser(u, key) {
    [users[key]] = u;
    users[key].spark = new CiscoSpark({
      credentials: {
        authorization: users[key].token
      },
      config: {
        logger: {
          level: 'error'
        }
      }
    });
    return users[key];
  }

  for (let i = 0; i < count; i += 1) {
    const key = userKeys[i];
    testUsers.create({count: 1, config: userInfo[key]})
      .then((u) => storeUser(u, key));
  }

  browser.waitUntil(() =>
    userKeys.reduce((acc, val) =>
      acc && users[val] && users[val].email &&
      users[val].spark && users[val].spark.canAuthorize,
    true),
  15000, 'failed to create test users');

  return users;
}

/**
 * Creates our Back to the Future Test Users for group meeting tests
 * @returns {Object}
 */
export function setupGroupTestUsers() {
  return createTestUsers(3, {
    docbrown: {displayName: 'Emmett Brown'},
    lorraine: {displayName: 'Lorraine Baines'},
    marty: {displayName: 'Marty McFly'}
  });
}

/**
 * Creates our Star Trek Test Users for one on one meeting tests
 * @returns {Object}
 */
export function setupOneOnOneUsers() {
  return createTestUsers(2, {
    spock: {displayName: 'Mr Spock'},
    mccoy: {displayName: 'Bones Mccoy'}
  });
}

/**
 * Loads a widget into the browser with Data API
 * @param {Object} options
 */
export function loadWithDataApi({
  aBrowser,
  bundle,
  accessToken,
  spaceId,
  toPersonEmail,
  initialActivity,
  startCall,
  widget = 'space'
}) {
  aBrowser.execute((options) => {
    const csmmDom = document.createElement('div');
    csmmDom.setAttribute('class', 'ciscospark-widget');

    csmmDom.setAttribute('data-toggle', `ciscospark-${options.widget}`);
    csmmDom.setAttribute('data-access-token', options.accessToken);
    if (options.spaceId) {
      csmmDom.setAttribute('data-space-id', options.spaceId);
    }
    if (options.toPersonEmail) {
      csmmDom.setAttribute('data-to-person-email', options.toPersonEmail);
    }
    if (options.initialActivity) {
      csmmDom.setAttribute('data-initial-activity', options.initialActivity);
    }
    if (options.startCall) {
      csmmDom.setAttribute('data-start-call', options.startCall);
    }
    document.getElementById('ciscospark-widget').appendChild(csmmDom);
    window.loadBundle(options.bundle, () => {
      if (window.ciscoSparkEvents) {
        window.ciscospark.widget(csmmDom).on('all', (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        });
      }
    });
  }, {
    bundle,
    accessToken,
    spaceId,
    toPersonEmail,
    initialActivity,
    startCall,
    widget
  });
}

/**
 * Loads a widget into the browser with browser globals
 * @param {Object} options
 */
export function loadWithGlobals({
  aBrowser,
  accessToken,
  spaceId,
  toPersonEmail,
  initialActivity,
  startCall
}) {
  aBrowser.execute((options) => {
    window.openWidget(Object.assign(options, {
      onEvent: (eventName, detail) => {
        window.ciscoSparkEvents.push({eventName, detail});
      }
    }));
  }, {
    accessToken,
    spaceId,
    toPersonEmail,
    initialActivity,
    startCall
  });
}
