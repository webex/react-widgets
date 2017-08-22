import {assert} from 'chai';
import path from 'path';

import {clearEventLog} from '../../../lib/events';

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
 * Sends a file and verifies receipt
 * @param {object} browserLocal
 * @param {object} browserRemote
 * @param {string} fileName
 * @returns {null}
 */
export function sendFileTest(browserLocal, browserRemote, fileName) {
  clearEventLog(browserRemote);
  const filePath = path.join(uploadDir, fileName);
  const fileTitle = `//div[text()="${fileName}"]`;
  browserLocal.chooseFile(elements.inputFile, filePath);
  browserLocal.click(elements.shareButton);
  browserRemote.waitForExist(fileTitle, 30000);
  browserRemote.scroll(fileTitle);
  const localSize = browserLocal.element(elements.lastActivity).element(`.ciscospark-share-file-size`).getText();
  const remoteSize = browserRemote.element(elements.lastActivity).element(`.ciscospark-share-file-size`).getText();
  console.info({localSize, remoteSize});
  assert.equal(localSize, remoteSize);
}

/**
 * Sends message to user from specified browser
 * @param {Object} aBrowser
 * @param {Object} user
 * @param {string} message
 * @returns {void}
 */
export function sendMessage(aBrowser, user, message) {
  aBrowser.waitForVisible(`[placeholder="Send a message to ${user.displayName}"]`);
  aBrowser.waitForVisible(elements.systemMessage);
  assert.match(aBrowser.getText(elements.systemMessage), /created this conversation/);
  aBrowser.setValue(`[placeholder="Send a message to ${user.displayName}"]`, message);
  aBrowser.keys([`Enter`, `NULL`]);
}

/**
 * Verifies message recieved from user in specified browser
 * @param {Object} aBrowser
 * @param {Object} user
 * @param {string} message
 * @returns {void}
 */
export function verifyMessageReceipt(aBrowser, user, message) {
  aBrowser.waitForVisible(`[placeholder="Send a message to ${user.displayName}"]`);
  aBrowser.waitForExist(elements.lastActivityText, 15000);
  aBrowser.waitUntil(() => aBrowser.element(elements.lastActivityText).getText() === message);
}
