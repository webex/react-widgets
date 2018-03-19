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
 * Creates our Back to the Future Test Users for group meeting tests
 * @returns {Object}
 */
export function setupGroupTestUsers() {
  let docbrown, marty, lorraine;
  testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    });

  testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    });

  testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    });

  browser.waitUntil(() =>
    marty && marty.email && marty.spark && marty.spark.canAuthorize &&
    docbrown && docbrown.email && docbrown.spark && docbrown.spark.canAuthorize &&
    lorraine && lorraine.email && lorraine.spark && lorraine.spark.canAuthorize,
  10000, 'failed to create test users');

  return {marty, docbrown, lorraine};
}

/**
 * Creates our Star Trek Test Users for one on one meeting tests
 * @returns {Object}
 */
export function setupOneOnOneUsers() {
  let mccoy, spock;
  testUsers.create({count: 1, config: {displayName: 'Mr Spock'}})
    .then((users) => {
      [spock] = users;
      spock.spark = new CiscoSpark({
        credentials: {
          authorization: spock.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    });

  testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
    .then((users) => {
      [mccoy] = users;
      mccoy.spark = new CiscoSpark({
        credentials: {
          authorization: mccoy.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
    });

  browser.waitUntil(() =>
    mccoy && mccoy.email && mccoy.spark && mccoy.spark.canAuthorize &&
    spock && spock.email && spock.spark && spock.spark.canAuthorize,
  15000, 'failed to create test users');

  return {mccoy, spock};
}
