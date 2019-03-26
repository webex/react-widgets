import {assert} from 'chai';

import waitForPromise from '../../wait-for-promise';

export const elements = {
  loadingScreen: '.ciscospark-loading',
  recentsWidget: '.ciscospark-recents-widget',
  listContainer: '.ciscospark-spaces-list',
  noSpacesTitle: '.ciscospark-no-spaces-title',
  noSpacesMessage: '.ciscospark-no-spaces-message',
  firstSpace: '.ciscospark-spaces-list-item-0',
  title: '.cui-list-item__header',
  unreadIndicator: '.cui-list-item--unread',
  indicatorIcon: '.cui-list-item--unread .cui-list-item__right .cui-icon',
  lastActivity: '.space-last-activity',
  callButton: 'button[aria-label="Call Space"]',
  joinCallButton: 'button[aria-label="Join Call"]',
  answerButton: 'button[aria-label="Answer"]',
  searchInput: '#pillSearchInput',
  clearButton: 'button[aria-label="clear input"]',
  headerBar: '.ciscospark-recents-header',
  headerProfile: '.ciscospark-recents-header .ciscospark-recents-header-left button',
  headerSignout: '.ciscospark-recents-header-profile-menu-signout',
  headerAddButton: 'button[aria-label="Contact a person or create a space"]'
};

export * from './space-list-filter';

/**
 * Sends a message to a space and verifies that it is received and displayed
 *
 * @export
 * @param {object} aBrowser
 * @param {object} sender - Person with spark object
 * @param {object} conversation
 * @param {string} message
 * @param {boolean} [isOneOnOne=false]
 * @returns {undefined}
 */
export function displayIncomingMessage(aBrowser, sender, conversation, message, isOneOnOne = false) {
  const spaceTitle = isOneOnOne ? sender.displayName : conversation.displayName;

  waitForPromise(sender.spark.internal.conversation.post(conversation, {
    displayName: message
  }));
  aBrowser.waitUntil(() => aBrowser.element(`${elements.firstSpace} ${elements.title}`).isVisible()
    && aBrowser.element(`${elements.firstSpace} ${elements.title}`).getText() === spaceTitle);
  assert.isTrue(aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible(), 'does not have unread indicator');
}

/**
 * Sends a message to a space and verifies that it is received and displayed,
 * then marks it read.
 *
 * @export
 * @param {object} aBrowser
 * @param {object} sender - Person with spark object
 * @param {object} receiver - Person with spark object
 * @param {object} conversation
 * @param {string} message
 * @returns {undefined}
 */
export function displayAndReadIncomingMessage(aBrowser, sender, receiver, conversation, message) {
  let activity;

  waitForPromise(sender.spark.internal.conversation.post(conversation, {
    displayName: message
  }).then((a) => {
    activity = a;
  }));
  aBrowser.waitUntil(() => aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible());
  assert.isTrue(aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible(), 'does not have unread indicator');
  // Acknowledge the activity to mark it read
  waitForPromise(receiver.spark.internal.conversation.acknowledge(conversation, activity));
  aBrowser.waitUntil(() => !aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible());
}

/**
 * Sends a message to a space and verifies that it is received and muted icon is displayed,
 * then marks it read.
 *
 * @export
 * @param {object} aBrowser
 * @param {object} sender - Person with spark object
 * @param {object} receiver - Person with spark object
 * @param {object} conversation
 * @param {string} message
 * @returns {undefined}
 */
export function displayMutedIconAndReadIncomingMessage(aBrowser, sender, receiver, conversation, message) {
  let activity;

  waitForPromise(sender.spark.internal.conversation.post(conversation, {
    displayName: message
  }).then((a) => {
    activity = a;
  }));
  aBrowser.waitUntil(() => aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible());
  assert.isTrue(aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible(), 'does not have unread indicator');
  assert.exists(aBrowser.element(`${elements.indicatorIcon}`).getAttribute('name').match(/alert-muted(.*)/g), 'does not have muted indicator');

  // Acknowledge the activity to mark it read
  waitForPromise(receiver.spark.internal.conversation.acknowledge(conversation, activity));
  aBrowser.waitUntil(() => !aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible());
}

/**
 * Sends a message to a space and verifies that it is received and mention icon is displayed,
 * then marks it read.
 *
 * @export
 * @param {object} aBrowser
 * @param {object} sender - Person with spark object
 * @param {object} receiver - Person with spark object
 * @param {object} conversation
 * @param {string} message
 * @param {object} mentions
 * @returns {undefined}
 */
export function displayMentionIconAndReadIncomingMessage(aBrowser, sender, receiver, conversation, message, mentions) {
  let activity;

  waitForPromise(sender.spark.internal.conversation.post(conversation, {
    displayName: message,
    mentions
  }).then((a) => {
    activity = a;
  }));
  aBrowser.waitUntil(() => aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible());
  assert.isTrue(aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible(), 'does not have unread indicator');
  assert.exists(aBrowser.element(`${elements.indicatorIcon}`).getAttribute('name').match(/mention(.*)/g), 'does not have mention indicator');

  // Acknowledge the activity to mark it read
  waitForPromise(receiver.spark.internal.conversation.acknowledge(conversation, activity));
  aBrowser.waitUntil(() => !aBrowser.element(`${elements.firstSpace} ${elements.unreadIndicator}`).isVisible());
}

/**
 * Creates a new space and posts a message to it, then verifies
 * space is displayed properly
 *
 * @export
 * @param {object} aBrowser
 * @param {object} sender
 * @param {array} participants
 * @param {string} roomTitle
 * @param {string} firstPost
 * @param {boolean} [isOneOnOne=false]
 * @returns {undefined}
 */
export function createSpaceAndPost(aBrowser, sender, participants, roomTitle, firstPost, isOneOnOne = false) {
  const spaceTitle = isOneOnOne ? sender.displayName : roomTitle;
  let conversation;
  const createOptions = {
    participants
  };

  if (roomTitle) {
    createOptions.displayName = roomTitle;
  }
  waitForPromise(sender.spark.internal.conversation.create(createOptions)
    .then((c) => {
      conversation = c;

      return sender.spark.internal.conversation.post(c, {
        displayName: firstPost
      });
    }));
  aBrowser.waitUntil(() => aBrowser.element(`${elements.firstSpace} ${elements.title}`).isVisible()
    && aBrowser.element(`${elements.firstSpace} ${elements.title}`).getText().includes(spaceTitle));

  return conversation;
}
