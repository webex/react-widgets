import path from 'path';

import {assert} from 'chai';

import {clearEventLog, getEventLog} from '../../events';
import {constructHydraId} from '../../hydra';

import {elements as mainElements} from './main';

const uploadDir = path.join(__dirname, '../assets');

export const elements = {
  deleteMessageButton: 'button[aria-label="Delete message"]',
  flagButton: 'button[aria-label="Flag for follow-up"]',
  highlighted: '.isHighlighted',
  pendingAction: '.flagActionPending',
  pendingActivity: '.activity-item-pending',
  inputFile: '.webex-file-input',
  modalWindow: '.webex-dialogue-modal',
  modalDeleteButton: 'button[title="Delete"].dialogue-modal-action-btn',
  downloadButtonContainer: '(//div[starts-with(@class,"webex-activity-content")])[last()]',
  downloadFileButton: '(//div[@title="Download this file"]/parent::button)[last()]',
  shareButton: 'button[aria-label="Share"]',
  systemMessage: '.webex-system-message',
  lastActivity: '.webex-activity-item-container:last-child',
  lastActivityText: '.webex-activity-item-container:last-child .webex-activity-text',
  lastActivityActions: '.webex-activity-item-container:last-child .webex-activity-post-actions',
  lastActivityAttachments: '.webex-activity-item-container:last-child .webex-activity-share-list',
  readReceiptsArea: '.webex-read-receipts',
  readReceiptsAvatar: '.webex-typing-avatar',
  messageComposer: '.webex-message-composer'
};

export const messages = {
  youDeleted: 'You deleted your message.'
};

/**
 * @typedef {object} TestObject
 * @param {object} browser - browser for test
 * @param {object} user - user object for test
 * @param {object} displayName - name used to identify test object
 */

/**
 * Sends message to user from specified browser
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @param {string} message
 * @returns {void}
 */
export function sendMessage(sender, receiver, message) {
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).waitForDisplayed();
  sender.browser.$(elements.systemMessage).waitForDisplayed();
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue(message);
  sender.browser.keys(['Enter', 'NULL']);
}

/**
 * Verifies message received from user in specified browser
 * @param {TestObject} receiver
 * @param {TestObject} sender
 * @param {string} message
 * @param {boolean} [sendReadReceipt=true]
 * @returns {void}
 */
export function verifyMessageReceipt(receiver, sender, message, sendReadReceipt = true) {
  receiver.browser.$(`[placeholder="Send a message to ${sender.displayName}"]`).waitForDisplayed();
  receiver.browser.$(elements.pendingActivity).waitForExist({
    timeout: 60000,
    timeoutMsg: 'Timed out waiting for pending activity to appear',
    reverse: true
  });
  receiver.browser.$(elements.lastActivityText).waitForExist({
    timeoutMsg: 'Timed out waiting for last activity text to appear'
  });
  receiver.browser.waitUntil(
    () => receiver.browser.$(elements.lastActivityText).getText() === message,
    {
      timeout: 60000,
      timeoutMsg: `last message ${receiver.browser.$(elements.lastActivityText).getText()} did not equal expected message ${message}`
    }
  );
  if (sendReadReceipt) {
    // Move mouse to send read receipt
    receiver.browser.$(elements.lastActivityText).moveTo();
    // Verify read receipt comes across
    sender.browser.$(`${elements.readReceiptsArea} ${elements.readReceiptsAvatar}`).waitForExist();
    // Move Mouse to text area so it doesn't cause any tool tips
    receiver.browser.$(elements.messageComposer).click();
    sender.browser.$(elements.messageComposer).click();
  }
}

/**
 * Verifies file is displayed in files tab
 * @param {object} aBrowser
 * @param {string} fileName
 * @returns {void}
 */
export function verifyFilesActivityTab(aBrowser, fileName) {
  const fileTitle = `//span[text()="${fileName}"]`;

  aBrowser.$(mainElements.filesActivityButton).waitForDisplayed();
  aBrowser.$(mainElements.filesActivityButton).click();
  aBrowser.$(mainElements.filesWidget).waitForDisplayed();
  aBrowser.$(`${mainElements.filesWidget}${fileTitle}`).waitForExist();
  aBrowser.$(mainElements.messageActivityButton).click();
}

/**
 * Flags the last message received
 * @param {TestObject} testObject
 * @param {string} messageToFlag Verifies the last message is this string
 * @returns {void}
 */
export function flagMessage(testObject, messageToFlag) {
  testObject.browser.$(elements.pendingActivity).waitForExist({
    timeout: 60000,
    reverse: true
  });
  testObject.browser.waitUntil(() => testObject.browser.$(elements.lastActivityText).getText() === messageToFlag);
  testObject.browser.$(elements.lastActivityActions).moveTo();
  testObject.browser.$(`${elements.lastActivity} ${elements.flagButton}`).waitForDisplayed();
  testObject.browser.$(`${elements.lastActivity} ${elements.flagButton}`).click();

  // Verify it is highlighted, showing it was flagged
  testObject.browser.$(`${elements.lastActivity} ${elements.highlighted} ${elements.flagButton}`).waitForDisplayed();

  // Remove pending flag
  testObject.browser.$(`${elements.lastActivity} ${elements.highlighted}${elements.pendingAction} ${elements.flagButton}`).waitForDisplayed({
    timeout: 60000,
    reverse: true
  });
}

/**
 * Unflags the last message received. Expected message should already be flagged
 * @param {TestObject} testObject
 * @param {string} messageToUnflag
 * @returns {void}
 */
export function removeFlagMessage(testObject, messageToUnflag) {
  testObject.browser.$(elements.pendingActivity).waitForExist({
    timeout: 60000,
    reverse: true
  });
  testObject.browser.waitUntil(() => testObject.browser.$(elements.lastActivityText).getText() === messageToUnflag);

  testObject.browser.$(`${elements.lastActivity} ${elements.highlighted} ${elements.flagButton}`).waitForDisplayed();

  testObject.browser.$(`${elements.lastActivity} ${elements.flagButton}`).click();

  testObject.browser.$(`${elements.lastActivity} ${elements.highlighted}`).waitForDisplayed({
    timeout: 60000,
    reverse: true
  });
}

/**
 * Looks to see if the last message can be deleted
 * @param {TestObject} testObject
 * @param {string} messageToDelete
 * @returns {boolean}
 */
export function canDeleteMessage(testObject, messageToDelete) {
  testObject.browser.$(elements.pendingActivity).waitForExist({
    timeout: 60000,
    reverse: true
  });
  testObject.browser.waitUntil(() => testObject.browser.$(elements.lastActivityText).getText() === messageToDelete);

  return testObject.browser.isExisting(`${elements.lastActivity} ${elements.deleteMessageButton}`);
}

/**
 * Deletes the last message sent
 * @param {TestObject} testObject
 * @param {string} messageToDelete
 */
export function deleteMessage(testObject, messageToDelete) {
  assert.isTrue(canDeleteMessage(testObject, messageToDelete));

  testObject.browser.$(elements.lastActivityActions).moveTo();

  testObject.browser.$(`${elements.lastActivity} ${elements.deleteMessageButton}`).waitForDisplayed();
  testObject.browser.$(`${elements.lastActivity} ${elements.deleteMessageButton}`).click();

  // Click modal confirm
  testObject.browser.$(elements.modalWindow).waitForDisplayed();
  testObject.browser.$(elements.modalDeleteButton).waitForDisplayed();
  testObject.browser.$(elements.modalDeleteButton).click();

  testObject.browser.$(`${elements.lastActivity} ${elements.systemMessage}`).waitForDisplayed();
  testObject.browser.waitUntil(() => testObject.browser.$(`${elements.lastActivity} ${elements.systemMessage}`).getText().includes(messages.youDeleted));
}


/* eslint no-sync: "off" */
/**
 * Sends a file and verifies receipt
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @param {string} fileName
 * @returns {void}
 */
const sendFileTest = (sender, receiver, fileName) => {
  const filePath = path.join(uploadDir, fileName);

  sender.browser.chooseFile(elements.inputFile, filePath);
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue(`Sending: ${fileName}`);
  sender.browser.keys(['Enter', 'NULL']);
  receiver.browser.$(elements.lastActivityAttachments).waitForDisplayed();
  receiver.browser.waitUntil(() => receiver.browser.$(elements.lastActivityAttachments).getText().includes(fileName));
  // Send receipt acknowledgement and verify before moving on
  sendMessage(receiver, sender, `Received: ${fileName}`);
  verifyMessageReceipt(sender, receiver, `Received: ${fileName}`);
  // Wait so we don't overload file uploads
  sender.browser.pause(1000);
};

/**
 * Test that sends a file and verifies that it is present in the files activity tab
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @param {string} fileName
 * @returns {void}
 */
const filesTabTest = (sender, receiver, fileName) => {
  verifyFilesActivityTab(sender.browser, fileName);
  verifyFilesActivityTab(receiver.browser, fileName);
};

/**
 * Test that verifies correct message events are created
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const messageEventTest = (sender, receiver) => {
  const message = 'God, I liked him better before he died.';

  clearEventLog(receiver.browser);
  sendMessage(sender, receiver, message);
  verifyMessageReceipt(receiver, sender, message);
  const events = getEventLog(receiver.browser);
  const eventCreated = events.find((event) => event.eventName === 'messages:created');
  const eventUnread = events.find((event) => event.eventName === 'rooms:unread');

  assert.isDefined(eventCreated, 'has a message created event');
  assert.containsAllKeys(eventCreated.detail, ['resource', 'event', 'actorId', 'data']);
  assert.containsAllKeys(eventCreated.detail.data, ['actorId', 'actorName', 'id', 'personId', 'roomId', 'roomType', 'text']);
  assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', sender.user.id));
  assert.equal(eventCreated.detail.data.actorName, sender.user.displayName);

  assert.isDefined(eventUnread, 'has an unread message event');
  assert.containsAllKeys(eventUnread.detail, ['resource', 'event', 'data']);
  assert.containsAllKeys(eventUnread.detail.data, ['actorId', 'actorName', 'id', 'title', 'type', 'created', 'lastActivity']);
  assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', sender.user.id));
  assert.equal(eventCreated.detail.data.actorName, sender.user.displayName);
};

/**
 * Test for sending markdown message with bold text
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const bold = (sender, receiver) => {
  sendMessage(sender, receiver, '**Are you out of your Vulcan mind?** No human can tolerate the radiation that\'s in there!');
  verifyMessageReceipt(receiver, sender, 'Are you out of your Vulcan mind? No human can tolerate the radiation that\'s in there!');
  // Assert only the bolded text is in the strong tag
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > strong`).getText(), 'Are you out of your Vulcan mind?');
};

/**
 * Test for sending markdown message with italic text
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const italic = (sender, receiver) => {
  sendMessage(sender, receiver, 'As you are _so fond_ of observing, doctor, I am not human.');
  verifyMessageReceipt(receiver, sender, 'As you are so fond of observing, doctor, I am not human.');
  // Assert only the italicized text is in the em tag
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > em`).getText(), 'so fond');
};

/**
 * Test for sending markdown message with a blockquote
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const blockquote = (sender, receiver) => {
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue('> You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.');
  // Quote break with two new lines
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, 'You call this relaxing? I\'m a nervous wreck. I\'m not careful, I\'ll end up talking to myself.');
  sender.browser.keys(['Enter', 'NULL']);
  verifyMessageReceipt(receiver, sender, 'You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.\nYou call this relaxing? I\'m a nervous wreck. I\'m not careful, I\'ll end up talking to myself.');
  // Assert only first half of message is in the blockquote tag
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > blockquote`).getText(), 'You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.');
};

/**
 * Test for sending markdown message with an ordered list
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const orderedList = (sender, receiver) => {
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue('1. ordered list item 1');
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, '2. ordered list item 2');
  sender.browser.keys(['Enter', 'NULL']);
  verifyMessageReceipt(receiver, sender, 'ordered list item 1\nordered list item 2');
  // Assert text matches for the first and second ordered list items
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > ol > li:nth-child(1).getText()`), 'ordered list item 1');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > ol > li:nth-child(2).getText()`), 'ordered list item 2');
};

/**
 * Test for sending markdown message with an unordered list
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const unorderedList = (sender, receiver) => {
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue('* unordered list item 1');
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, '* unordered list item 2');
  sender.browser.keys(['Enter', 'NULL']);
  verifyMessageReceipt(receiver, sender, 'unordered list item 1\nunordered list item 2');
  // Assert text matches for the first and second unordered list items
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > ul > li:nth-child(1).getText()`), 'unordered list item 1');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > ul > li:nth-child(2).getText()`), 'unordered list item 2');
};

/**
 * Test for sending markdown message with a h1 heading
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const heading1 = (sender, receiver) => {
  sendMessage(sender, receiver, '# Heading 1');
  verifyMessageReceipt(receiver, sender, 'Heading 1');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > h1`).getText(), 'Heading 1');
};

/**
 * Test for sending markdown message with a h2 heading
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const heading2 = (sender, receiver) => {
  sendMessage(sender, receiver, '## Heading 2');
  verifyMessageReceipt(receiver, sender, 'Heading 2');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > h2`).getText(), 'Heading 2');
};

/**
 * Test for sending markdown message with a h3 heading
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const heading3 = (sender, receiver) => {
  sendMessage(sender, receiver, '### Heading 3');
  verifyMessageReceipt(receiver, sender, 'Heading 3');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > h3`).getText(), 'Heading 3');
};

/**
 * Test for sending markdown message with a horizontal line
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const hr = (sender, receiver) => {
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue('test horizontal line');
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, '- - -');
  sender.browser.keys(['Enter', 'NULL']);
  verifyMessageReceipt(receiver, sender, 'test horizontal line');
  assert.isTrue(receiver.browser.$(`${elements.lastActivityText} > hr`).isDisplayed());
};

/**
 * Test for sending markdown message with a link
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const link = (sender, receiver) => {
  sendMessage(sender, receiver, '[Cisco](http://www.cisco.com/)');
  verifyMessageReceipt(receiver, sender, 'Cisco');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > a`).getText(), 'Cisco');
  assert.equal(receiver.browser.getAttribute(`${elements.lastActivityText} > a`, 'href'), 'http://www.cisco.com/');
};

/**
 * Test for sending markdown message with inline code
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const inline = (sender, receiver) => {
  sendMessage(sender, receiver, 'this tests `inline.code();`');
  verifyMessageReceipt(receiver, sender, 'this tests inline.code();');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > code`).getText(), 'inline.code();');
};

/**
 * Test for sending markdown message with a codeblock
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const codeblock = (sender, receiver) => {
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).waitForDisplayed();
  sender.browser.$(`[placeholder="Send a message to ${receiver.displayName}"]`).setValue('``` html');
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, '<h1>Hello World!</h1>');
  sender.browser.keys(['Shift', 'Enter', 'NULL']);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, '```');
  sender.browser.keys(['Enter', 'NULL']);
  receiver.browser.$(`${elements.lastActivityText} > pre > code`).waitForDisplayed();
  receiver.browser.waitUntil(() => receiver.browser.$(`${elements.lastActivityText} > pre > code`).getText() === '<h1>Hello World!</h1>');
  assert.equal(receiver.browser.$(`${elements.lastActivityText} > pre > code`).getText(), '<h1>Hello World!</h1>');
};

export const messageTests = {
  sendFileTest,
  filesTabTest,
  messageEventTest,
  markdown: {
    bold,
    italic,
    blockquote,
    orderedList,
    unorderedList,
    heading1,
    heading2,
    heading3,
    hr,
    link,
    inline,
    codeblock
  }
};
