import {clearEventLog} from '../../lib/events';
import {assert} from 'chai';
import path from 'path';

const uploadDir = path.join(__dirname, `assets`);

export const elements = {
  inputFile: `.ciscospark-file-input`,
  downloadButtonContainer: `(//div[starts-with(@class,"ciscospark-activity-content")])[last()]`,
  downloadFileButton: `(//div[@title="Download this file"]/parent::button)[last()]`,
  shareButton: `button[aria-label="Share"]`,
  systemMessage: `.ciscospark-system-message`,
  lastActivityText: `.ciscospark-activity-item-container:last-child .ciscospark-activity-text`
};

/* eslint no-sync: "off" */
export function sendFileTest(browserLocal, browserRemote, mccoy, fileName) {
  clearEventLog(browserRemote);
  const filePath = path.join(uploadDir, fileName);
  // const fileSize = fs.statSync(filePath).size;
  const fileTitle = `//div[text()="${fileName}"]`;
  browserLocal.chooseFile(elements.inputFile, filePath);
  browserLocal.click(elements.shareButton);
  return browserRemote.waitForExist(fileTitle, 30000);
  // TODO: Re-enable file size checks
  // const events = getEventLog(browserRemote);
  // const newMessage = events.find((event) => event.eventName === `messages:created`);
  // const fileUrl = newMessage.detail.data.files[0].url;
  // let downloadedFileSize;
  // return request.get(fileUrl)
  //   .set(`Authorization`, `Bearer ${mccoy.token.access_token}`)
  //   .then((response) => {
  //     downloadedFileSize = response.header[`content-length`];
  //     assert.equal(fileSize, downloadedFileSize);
  //   });
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
