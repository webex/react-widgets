import {assert} from 'chai';
import path from 'path';

import {clearEventLog, getEventLog} from '../../events';
import {constructHydraId} from '../../hydra';

const uploadDir = path.join(__dirname, `../assets`);

export const elements = {
  inputFile: `.ciscospark-file-input`,
  downloadButtonContainer: `(//div[starts-with(@class,"ciscospark-activity-content")])[last()]`,
  downloadFileButton: `(//div[@title="Download this file"]/parent::button)[last()]`,
  shareButton: `button[aria-label="Share"]`,
  systemMessage: `.ciscospark-system-message`,
  lastActivity: `.ciscospark-activity-item-container:last-child`,
  lastActivityText: `.ciscospark-activity-item-container:last-child .ciscospark-activity-text`
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
  sender.browser.waitForVisible(`[placeholder="Send a message to ${receiver.displayName}"]`);
  sender.browser.waitForVisible(elements.systemMessage);
  assert.match(sender.browser.getText(elements.systemMessage), /created this conversation/);
  sender.browser.setValue(`[placeholder="Send a message to ${receiver.displayName}"]`, message);
  sender.browser.keys([`Enter`, `NULL`]);
}

/**
 * Verifies message received from user in specified browser
 * @param {TestObject} receiver
 * @param {TestObject} sender
 * @param {string} message
 * @returns {void}
 */
export function verifyMessageReceipt(receiver, sender, message) {
  receiver.browser.waitForVisible(`[placeholder="Send a message to ${sender.displayName}"]`);
  receiver.browser.waitForExist(elements.lastActivityText, 15000);
  receiver.browser.waitUntil(() => receiver.browser.element(elements.lastActivityText).getText() === message);
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
  const fileTitle = `//div[text()="${fileName}"]`;
  sender.browser.chooseFile(elements.inputFile, filePath);
  sender.browser.click(elements.shareButton);
  receiver.browser.waitForExist(fileTitle, 30000);
  receiver.browser.scroll(fileTitle);
  const localSize = sender.browser.element(elements.lastActivity).element(`.ciscospark-share-file-size`).getText();
  const remoteSize = receiver.browser.element(elements.lastActivity).element(`.ciscospark-share-file-size`).getText();
  console.info({localSize, remoteSize});
  assert.equal(localSize, remoteSize);
};

/**
 * Test that verifies correct message events are created
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const messageEventTest = (sender, receiver) => {
  const message = `God, I liked him better before he died.`;
  clearEventLog(receiver.browser);
  sendMessage(sender, receiver, message);
  verifyMessageReceipt(receiver, sender, message);
  const events = getEventLog(receiver.browser);
  const eventCreated = events.find((event) => event.eventName === `messages:created`);
  const eventUnread = events.find((event) => event.eventName === `rooms:unread`);
  assert.isDefined(eventCreated, `has a message created event`);
  assert.containsAllKeys(eventCreated.detail, [`resource`, `event`, `actorId`, `data`]);
  assert.containsAllKeys(eventCreated.detail.data, [`actorId`, `actorName`, `id`, `personId`, `roomId`, `roomType`, `text`]);
  assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, sender.user.id));
  assert.equal(eventCreated.detail.data.actorName, sender.user.displayName);

  assert.isDefined(eventUnread, `has an unread message event`);
  assert.containsAllKeys(eventUnread.detail, [`resource`, `event`, `data`]);
  assert.containsAllKeys(eventUnread.detail.data, [`actorId`, `actorName`, `id`, `title`, `type`, `created`, `lastActivity`]);
  assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, sender.user.id));
  assert.equal(eventCreated.detail.data.actorName, sender.user.displayName);
};

/**
 * Test for sending markdown message with bold text
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const bold = (sender, receiver) => {
  sendMessage(sender, receiver, `**Are you out of your Vulcan mind?** No human can tolerate the radiation that's in there!`);
  verifyMessageReceipt(receiver, sender, `Are you out of your Vulcan mind? No human can tolerate the radiation that's in there!`);
  // Assert only the bolded text is in the strong tag
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > strong`), `Are you out of your Vulcan mind?`);
};

/**
 * Test for sending markdown message with italic text
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const italic = (sender, receiver) => {
  sendMessage(sender, receiver, `As you are _so fond_ of observing, doctor, I am not human.`);
  verifyMessageReceipt(receiver, sender, `As you are so fond of observing, doctor, I am not human.`);
  // Assert only the italicized text is in the em tag
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > em`), `so fond`);
};

/**
 * Test for sending markdown message with a blockquote
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const blockquote = (sender, receiver) => {
  sender.browser.setValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `> You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
  // Quote break with two new lines
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `You call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
  sender.browser.keys([`Enter`, `NULL`]);
  verifyMessageReceipt(receiver, sender, `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.\nYou call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
  // Assert only first half of message is in the blockquote tag
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > blockquote`), `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
};

/**
 * Test for sending markdown message with an ordered list
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const orderedList = (sender, receiver) => {
  sender.browser.setValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `1. ordered list item 1`);
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `2. ordered list item 2`);
  sender.browser.keys([`Enter`, `NULL`]);
  verifyMessageReceipt(receiver, sender, `ordered list item 1\nordered list item 2`);
  // Assert text matches for the first and second ordered list items
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > ol > li:nth-child(1)`), `ordered list item 1`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > ol > li:nth-child(2)`), `ordered list item 2`);
};

/**
 * Test for sending markdown message with an unordered list
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const unorderedList = (sender, receiver) => {
  sender.browser.setValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `* unordered list item 1`);
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `* unordered list item 2`);
  sender.browser.keys([`Enter`, `NULL`]);
  verifyMessageReceipt(receiver, sender, `unordered list item 1\nunordered list item 2`);
  // Assert text matches for the first and second unordered list items
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > ul > li:nth-child(1)`), `unordered list item 1`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > ul > li:nth-child(2)`), `unordered list item 2`);
};

/**
 * Test for sending markdown message with a h1 heading
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const heading1 = (sender, receiver) => {
  sendMessage(sender, receiver, `# Heading 1`);
  verifyMessageReceipt(receiver, sender, `Heading 1`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > h1`), `Heading 1`);
};

/**
 * Test for sending markdown message with a h2 heading
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const heading2 = (sender, receiver) => {
  sendMessage(sender, receiver, `## Heading 2`);
  verifyMessageReceipt(receiver, sender, `Heading 2`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > h2`), `Heading 2`);
};

/**
 * Test for sending markdown message with a h3 heading
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const heading3 = (sender, receiver) => {
  sendMessage(sender, receiver, `### Heading 3`);
  verifyMessageReceipt(receiver, sender, `Heading 3`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > h3`), `Heading 3`);
};

/**
 * Test for sending markdown message with a horizontal line
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const hr = (sender, receiver) => {
  sender.browser.setValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `test horizontal line`);
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `- - -`);
  sender.browser.keys([`Enter`, `NULL`]);
  verifyMessageReceipt(receiver, sender, `test horizontal line`);
  assert.isTrue(receiver.browser.isVisible(`${elements.lastActivityText} > hr`));
};

/**
 * Test for sending markdown message with a link
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const link = (sender, receiver) => {
  sendMessage(sender, receiver, `[Cisco](http://www.cisco.com/)`);
  verifyMessageReceipt(receiver, sender, `Cisco`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > a`), `Cisco`);
  assert.equal(receiver.browser.getAttribute(`${elements.lastActivityText} > a`, `href`), `http://www.cisco.com/`);
};

/**
 * Test for sending markdown message with inline code
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const inline = (sender, receiver) => {
  sendMessage(sender, receiver, `this tests \`inline.code();\``);
  verifyMessageReceipt(receiver, sender, `this tests inline.code();`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > code`), `inline.code();`);
};

/**
 * Test for sending markdown message with a codeblock
 * @param {TestObject} sender
 * @param {TestObject} receiver
 * @returns {void}
 */
const codeblock = (sender, receiver) => {
  sender.browser.waitForVisible(`[placeholder="Send a message to ${receiver.displayName}"]`);
  sender.browser.setValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `\`\`\` html`);
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `<h1>Hello World!</h1>`);
  sender.browser.keys([`Shift`, `Enter`, `NULL`]);
  sender.browser.addValue(`[placeholder="Send a message to ${receiver.displayName}"]`, `\`\`\``);
  sender.browser.keys([`Enter`, `NULL`]);
  receiver.browser.waitForVisible(`${elements.lastActivityText} > pre > code`);
  receiver.browser.waitUntil(() => receiver.browser.getText(`${elements.lastActivityText} > pre > code`) === `<h1>Hello World!</h1>`);
  assert.equal(receiver.browser.getText(`${elements.lastActivityText} > pre > code`), `<h1>Hello World!</h1>`);
};

export const messageTests = {
  sendFileTest,
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
