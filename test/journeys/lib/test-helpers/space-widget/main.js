import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import '@ciscospark/plugin-phone';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

export const elements = {
  spaceWidget: '.ciscospark-space-widget',
  menuButton: 'button[aria-label="Main Menu"]',
  messageButton: 'button[aria-label="Message"]',
  meetButton: 'button[aria-label="Call"]',
  filesButton: 'button[aria-label="Files"]',
  filesWidget: '//div[contains(@class, "ciscospark-widget-files")]',
  activityMenu: '.ciscospark-activity-menu',
  activityList: '.ciscospark-activity-list',
  controlsContainer: '.ciscospark-controls-container',
  closeButton: 'button[aria-label="Close"]',
  exitButton: '.ciscospark-activity-menu-exit button',
  messageWidget: '.ciscospark-message-wrapper',
  meetWidget: '.ciscospark-meet-wrapper'
};

/**
 * Switches to message widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMessage(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.waitForVisible(`${elements.activityMenu} ${elements.messageButton}`);
  aBrowser.click(elements.messageButton);
}

/**
 * Switches to meet widget
 * @param {Object} aBrowser
 * @returns {void}
 */
export function switchToMeet(aBrowser) {
  if (!aBrowser.isVisible(elements.activityMenu)) {
    aBrowser.waitForVisible(elements.menuButton);
    aBrowser.click(elements.menuButton);
    aBrowser.waitForVisible(elements.activityMenu);
  }
  aBrowser.waitForVisible(`${elements.activityMenu} ${elements.meetButton}`);
  aBrowser.click(elements.meetButton);
}

/**
 * Opens activity menu and clicks a button inside it
 * @param {Browser} aBrowser
 * @param {string} buttonToClick element selector
 */
export function openMenuAndClickButton(aBrowser, buttonToClick) {
  aBrowser.click(elements.menuButton);
  aBrowser.waitForVisible(elements.activityMenu);
  aBrowser.click(`${elements.activityMenu} ${buttonToClick}`);
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
    marty && marty.spark && marty.spark.canAuthorize &&
    docbrown && docbrown.spark && docbrown.spark.canAuthorize &&
    lorraine && lorraine.spark && lorraine.spark.canAuthorize,
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
    });

  testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
    .then((users) => {
      [mccoy] = users;
    });

  browser.waitUntil(() =>
    mccoy && mccoy.email && spock && spock.email,
  15000, 'failed to create test users');

  return {mccoy, spock};
}
