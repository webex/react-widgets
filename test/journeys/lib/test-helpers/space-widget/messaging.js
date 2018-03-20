import path from 'path';

import {assert} from 'chai';

import {moveMouse} from '../';
import {clearEventLog, getEventLog} from '../../events';
import {constructHydraId} from '../../hydra';

import {
  elements as mainElements,
  openMenuAndClickButton
} from './main';

const uploadDir = path.join(__dirname, '../assets');

const activityContainers = '//div[contains(@class, "ciscospark-activity-item-container")]';
const lastSuccessfulActivity = `(${activityContainers}/div[not(contains(@class, "pending"))]/parent::div)[last()]`;
const lastSuccessfulActivityText = `${lastSuccessfulActivity}//div[contains(@class, "ciscospark-activity-text")]`;
const downloadButtonContainer = `(${lastSuccessfulActivity}//div[starts-with(@class,"ciscospark-activity-content")])[last()]`;
const downloadFileButton = `(${lastSuccessfulActivity}//div[@title="Download this file"]/parent::button)[last()]`;

export const elements = {
  deleteMessageButton: `${lastSuccessfulActivity}//button[@aria-label="Delete this message"]`,
  flagButton: '//button[@aria-label="Flag this message"]',
  highlighted: '//div[contains(@class, "isHighlighted")]',
  pendingAction: '//div[contains(@class, "flagActionPending") and contains(@class, "isHighlighted")]',
  pendingActivity: '.activity-item-pending',
  inputFile: '.ciscospark-file-input',
  modalWindow: '.ciscospark-dialogue-modal',
  modalDeleteButton: 'button[title="Delete"].dialogue-modal-action-btn',
  lastSuccessfulActivity,
  lastSuccessfulActivityText,
  downloadButtonContainer,
  downloadFileButton,
  shareButton: '//button[@aria-label="Share"]',
  systemMessage: '//div[contains(@class, "ciscospark-system-message")]',
  lastActivity: '.ciscospark-activity-item-container:last-child',
  lastActivityText: '.ciscospark-activity-item-container:last-child .ciscospark-activity-text',
  readReceiptsArea: '.ciscospark-read-receipts',
  readReceiptsAvatar: '.ciscospark-typing-avatar',
  messageComposer: '.ciscospark-message-composer',
  textArea: '.ciscospark-message-composer textarea',
  stagedFiles: '.ciscospark-message-composer .ciscospark-staged-files',
  deleteShareButton: '//button[@aria-label="Delete Share"]'
};

export const messages = {
  youDeleted: 'You deleted your message.'
};

/**
 * Sends message to user from specified browser
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {string} options.message
 */
export function sendMessage({senderBrowser, message}) {
  senderBrowser.waitUntil(() =>
    senderBrowser.isVisible(elements.textArea),
  5000, 'message composer is not visible');
  senderBrowser.setValue(elements.textArea, message);
  senderBrowser.keys('Enter');
}

/**
 * Verifies message received from user in specified browser
 * @param {TestObject} receiver
 * @param {TestObject} sender
 * @param {string} message
 */
export function verifyMessageReceipt({
  receiverBrowser, senderBrowser, message
}) {
  receiverBrowser.waitUntil(() =>
    receiverBrowser.isExisting(elements.lastSuccessfulActivityText),
  15000, 'message text was not found');
  receiverBrowser.waitUntil(() =>
    receiverBrowser.getText(elements.lastSuccessfulActivityText) === message,
  1000, `message text did not match "${message}"`);
  // Move mouse to send read receipt
  moveMouse(receiverBrowser, elements.lastSuccessfulActivity);
  // Verify read receipt comes across
  senderBrowser.waitForExist(`${elements.readReceiptsArea} ${elements.readReceiptsAvatar}`);
  // Move Mouse to text area so it doesn't cause any tool tips
  moveMouse(receiverBrowser, elements.messageComposer);
  moveMouse(senderBrowser, elements.messageComposer);
}

/**
 * Verifies file is displayed in files tab
 * @param {Object} options
 * @param {Object} options.aBrowser
 * @param {string} options.fileName
 * @param {boolean} options.hasThumbnail
 */
function verifyFilesActivityTab({aBrowser, fileName, hasThumbnail}) {
  const fileTitle = `//div[text()="${fileName}"]`;
  const fileThumbnail = `//img[@alt="Uploaded File ${fileName}"]`;
  openMenuAndClickButton(aBrowser, mainElements.filesButton);

  aBrowser.waitUntil(() =>
    aBrowser.isVisible(mainElements.filesWidget),
  5000, 'failed to open files tab');

  aBrowser.waitForExist(`${mainElements.filesWidget}${fileTitle}`);
  if (hasThumbnail) {
    aBrowser.waitForVisible(fileThumbnail);
  }
  aBrowser.waitForVisible(mainElements.closeButton);
  aBrowser.click(mainElements.closeButton);
}

/**
 * Flags the last message received
 * @param {Object} options
 * @param {Object} options.aBrowser
 * @param {String} options.messageToFlag
 */
export function flagMessage({aBrowser, messageToFlag}) {
  aBrowser.waitForExist(elements.pendingActivity, 15000, true);
  aBrowser.waitUntil(() =>
    aBrowser.getText(elements.lastSuccessfulActivityText) === messageToFlag,
  10000, 'message to flag does not exist');
  moveMouse(aBrowser, elements.lastSuccessfulActivity);
  aBrowser.waitUntil(() =>
    aBrowser
      .isVisible(`${elements.lastSuccessfulActivity}${elements.flagButton}`),
  1500, 'flag button is not visible when hovering');

  aBrowser
    .click(`${elements.lastSuccessfulActivity}${elements.flagButton}`);

  // Verify it is highlighted, showing it was flagged
  aBrowser.waitUntil(() => aBrowser
    .isVisible(`${elements.lastSuccessfulActivity}${elements.highlighted}${elements.flagButton}`),
  1500, 'flag button did not highlight');

  // Remove pending flag
  aBrowser.waitUntil(() => aBrowser
    .isVisible(`${elements.lastSuccessfulActivity}${elements.pendingAction}${elements.flagButton}`)
    === false, 7500, 'flag button did not remove pending state');
}

/**
 * Unflags the last message received. Expected message should already be flagged
 * @param {Object} options
 * @param {Object} options.aBrowser
 * @param {String} options.messageToUnflag
 */
export function removeFlagMessage({aBrowser, messageToUnflag}) {
  aBrowser.waitUntil(() =>
    aBrowser.getText(elements.lastSuccessfulActivityText) === messageToUnflag,
  1500, `message was not found "${messageToUnflag}"`);

  aBrowser.waitUntil(() => aBrowser
    .isVisible(`${elements.lastSuccessfulActivity}${elements.highlighted}${elements.flagButton}`),
  1500, 'message was not flagged');

  aBrowser
    .click(`${elements.lastSuccessfulActivity}${elements.flagButton}`);

  aBrowser.waitUntil(() => aBrowser
    .isVisible(`${elements.lastSuccessfulActivity}${elements.highlighted}`) === false,
  3500, 'message was still flagged');
}

/**
 * Looks to see if the last message can be deleted
 * @param {Object} options
 * @param {Object} options.aBrowser
 * @param {string} options.messageToDelete
 * @returns {boolean}
 */
export function canDeleteMessage({aBrowser, messageToDelete}) {
  aBrowser.waitUntil(() =>
    // Text matches message to delete
    aBrowser.getText(elements.lastSuccessfulActivityText) === messageToDelete,
  10000, `failed to find message to delete "${messageToDelete}"`);
  // Delete button is hidden but still exists
  return aBrowser
    .isExisting(elements.deleteMessageButton);
}

/**
 * Deletes the last message sent
 * @param {Object} options
 * @param {Object} options.aBrowser
 * @param {string} options.messageToDelete
 */
export function deleteMessage({aBrowser, messageToDelete}) {
  assert.isTrue(canDeleteMessage({aBrowser, messageToDelete}));

  moveMouse(aBrowser, elements.lastSuccessfulActivity);

  aBrowser.waitUntil(() =>
    aBrowser.isVisible(elements.deleteMessageButton),
  1500, 'delete button is not visible when hovering');

  aBrowser.click(elements.deleteMessageButton);

  // Click modal confirm
  aBrowser.waitUntil(() =>
    aBrowser
      .isVisible(elements.modalWindow),
  3500, 'delete modal window is not visible after clicking delete button');
  assert.isTrue(aBrowser.isVisible(elements.modalDeleteButton), 'modal delete button is not visible');
  aBrowser.click(elements.modalDeleteButton);

  const deletedSystemMessage = `${elements.lastSuccessfulActivity}${elements.systemMessage}`;
  aBrowser.waitUntil(() =>
    aBrowser.isVisible(deletedSystemMessage),
  10000, `could not find system message at ${deletedSystemMessage}`);

  aBrowser.waitUntil(() => {
    const text = aBrowser.getText(deletedSystemMessage);
    return text.includes(messages.youDeleted);
  }, 3500, 'message was not deleted');
}


/* eslint no-sync: "off" */
/**
 * Sends a file and verifies receipt
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {Object} options.receiverBrowser
 * @param {string} options.fileName
 * @param {boolean} [options.fileSizeVerify=true] Some files are embedded and don't display file sizes
 */
function sendFileTest({
  senderBrowser, receiverBrowser, fileName, fileSizeVerify = true
}) {
  const filePath = path.join(uploadDir, fileName);
  const fileTitle = `//div[text()="${fileName}"]`;
  senderBrowser.chooseFile(elements.inputFile, filePath);
  senderBrowser.click(elements.shareButton);
  receiverBrowser.waitUntil(() =>
    receiverBrowser.isExisting(fileTitle),
  15000, 'failed to send file');

  receiverBrowser.scroll(fileTitle);

  // Some files are embedded and don't display file sizes
  if (fileSizeVerify) {
    const fileSizeSelector = `${elements.lastSuccessfulActivity}//span[contains(@class, "ciscospark-share-file-size")]`;
    const localSize = senderBrowser.getText(fileSizeSelector);
    const remoteSize = receiverBrowser.getText(fileSizeSelector);
    assert.equal(localSize, remoteSize);
  }
  // Send receipt acknowledgement and verify before moving on
  const message = `Received: ${fileName}`;
  sendMessage({
    senderBrowser: receiverBrowser,
    message
  });
  verifyMessageReceipt({
    senderBrowser,
    receiverBrowser,
    message
  });
}

/**
 * Test that sends a file and verifies that it is present in the files activity tab
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {Object} options.receiverBrowser
 * @param {string} options.fileName
 * @param {boolean} [options.hasThumbnail = true] Some files don't have a thumbnail
 */
function filesTabTest({
  senderBrowser, receiverBrowser, fileName, hasThumbnail = true
}) {
  verifyFilesActivityTab({
    aBrowser: senderBrowser, fileName, hasThumbnail
  });
  verifyFilesActivityTab({
    aBrowser: receiverBrowser, fileName, hasThumbnail
  });
}

/**
 * Test that verifies correct message events are created
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {Object} options.sender
 * @param {Object} options.receiverBrowser
 */
function messageEventTest({
  senderBrowser, sender, receiverBrowser
}) {
  const message = 'God, I liked him better before he died.';
  clearEventLog(receiverBrowser);
  sendMessage({
    senderBrowser,
    message
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message
  });
  const events = getEventLog(receiverBrowser);
  const eventCreated = events.find((event) => event.eventName === 'messages:created');
  const eventUnread = events.find((event) => event.eventName === 'rooms:unread');

  assert.isDefined(eventCreated, 'has a message created event');
  assert.containsAllKeys(eventCreated.detail, ['resource', 'event', 'actorId', 'data']);
  assert.containsAllKeys(eventCreated.detail.data, ['actorId', 'actorName', 'id', 'personId', 'roomId', 'roomType', 'text']);
  assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', sender.id));
  assert.equal(eventCreated.detail.data.actorName, sender.displayName);

  assert.isDefined(eventUnread, 'has an unread message event');
  assert.containsAllKeys(eventUnread.detail, ['resource', 'event', 'data']);
  assert.containsAllKeys(eventUnread.detail.data, ['actorId', 'actorName', 'id', 'title', 'type', 'created', 'lastActivity']);
  assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', sender.id));
  assert.equal(eventCreated.detail.data.actorName, sender.displayName);
}

/**
 * Test for sending markdown message with bold text
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function bold(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: '**Are you out of your Vulcan mind?** No human can tolerate the radiation that\'s in there!'
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'Are you out of your Vulcan mind? No human can tolerate the radiation that\'s in there!'
  });
  // Assert only the bolded text is in the strong tag
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}//strong`), 'Are you out of your Vulcan mind?');
}

/**
 * Test for sending markdown message with italic text
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function italic(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: 'As you are _so fond_ of observing, doctor, I am not human.'
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'As you are so fond of observing, doctor, I am not human.'
  });
  // Assert only the italicized text is in the em tag
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}//em`), 'so fond');
}

/**
 * Test for sending markdown message with a blockquote
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function blockquote(senderBrowser, receiverBrowser) {
  senderBrowser.setValue(elements.textArea, '> You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.');
  // Quote break with two new lines
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.addValue(elements.textArea, 'You call this relaxing? I\'m a nervous wreck. I\'m not careful, I\'ll end up talking to myself.');
  senderBrowser.keys('Enter');
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.\nYou call this relaxing? I\'m a nervous wreck. I\'m not careful, I\'ll end up talking to myself.'
  });
  // Assert only first half of message is in the blockquote tag
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}//blockquote`), 'You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.');
}

/**
 * Test for sending markdown message with an ordered list
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function orderedList(senderBrowser, receiverBrowser) {
  senderBrowser.setValue(elements.textArea, '1. ordered list item 1');
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.addValue(elements.textArea, '2. ordered list item 2');
  senderBrowser.keys('Enter');
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'ordered list item 1\nordered list item 2'
  });
  // Assert text matches for the first and second ordered list items
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/ol/li[1]`), 'ordered list item 1');
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/ol/li[2]`), 'ordered list item 2');
}

/**
 * Test for sending markdown message with an unordered list
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function unorderedList(senderBrowser, receiverBrowser) {
  senderBrowser.setValue(elements.textArea, '* unordered list item 1');
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.addValue(elements.textArea, '* unordered list item 2');
  senderBrowser.keys('Enter');
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'unordered list item 1\nunordered list item 2'
  });
  // Assert text matches for the first and second unordered list items
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/ul/li[1]`), 'unordered list item 1');
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/ul/li[2]`), 'unordered list item 2');
}

/**
 * Test for sending markdown message with a h1 heading
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function heading1(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: '# Heading 1'
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'Heading 1'
  });
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/h1`), 'Heading 1');
}

/**
 * Test for sending markdown message with a h2 heading
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function heading2(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: '## Heading 2'
  });

  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'Heading 2'
  });
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/h2`), 'Heading 2');
}

/**
 * Test for sending markdown message with a h3 heading
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function heading3(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: '### Heading 3'
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'Heading 3'
  });
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/h3`), 'Heading 3');
}

/**
 * Test for sending markdown message with a horizontal line
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function hr(senderBrowser, receiverBrowser) {
  senderBrowser.setValue(elements.textArea, 'test horizontal line');
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.addValue(elements.textArea, '- - -');
  senderBrowser.keys('Enter');
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'test horizontal line'
  });
  assert.isTrue(receiverBrowser.isVisible(`${elements.lastSuccessfulActivityText}/hr`));
}

/**
 * Test for sending markdown message with a link
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function link(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: '[Cisco](http://www.cisco.com/)'
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'Cisco'
  });
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/a`), 'Cisco');
  assert.equal(receiverBrowser.getAttribute(`${elements.lastSuccessfulActivityText}/a`, 'href'), 'http://www.cisco.com/');
}

/**
 * Test for sending markdown message with inline code
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function inline(senderBrowser, receiverBrowser) {
  sendMessage({
    senderBrowser,
    message: 'this tests `inline.code();`'
  });
  verifyMessageReceipt({
    receiverBrowser,
    senderBrowser,
    message: 'this tests inline.code();'
  });
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/code`), 'inline.code();');
}

/**
 * Test for sending markdown message with a codeblock
 * @param {Object} senderBrowser
 * @param {Object} receiverBrowser
 */
function codeblock(senderBrowser, receiverBrowser) {
  senderBrowser.waitForVisible(elements.textArea);
  senderBrowser.setValue(elements.textArea, '``` html');
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.addValue(elements.textArea, '<h1>Hello World!</h1>');
  senderBrowser.keys(['Shift', 'Enter', 'NULL']);
  senderBrowser.addValue(elements.textArea, '```');
  senderBrowser.keys('Enter');
  receiverBrowser.waitForVisible(`${elements.lastSuccessfulActivityText}/pre/code`);
  receiverBrowser.waitUntil(() =>
    receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/pre/code`) === '<h1>Hello World!</h1>');
  assert.equal(receiverBrowser.getText(`${elements.lastSuccessfulActivityText}/pre/code`), '<h1>Hello World!</h1>');
}

/**
 * Clears any stuck file in the file uploader
 * @param {Object} aBrowser
 */
export function clearFileUploader(aBrowser) {
  while (aBrowser.isVisible(elements.stagedFiles)) {
    aBrowser.click(elements.deleteShareButton);
  }
}

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
