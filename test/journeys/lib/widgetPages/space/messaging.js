import path from 'path';

import {assert} from 'chai';

import MainSpaceWidget from './main';

const uploadDir = path.resolve(process.cwd(), 'test/journeys/lib/helpers/assets');

export default class MessageWidgetPage extends MainSpaceWidget {
  get hasTextArea() { return this.browser.isVisible(this.elements.textArea); }

  get hasActivityList() { return this.browser.isVisible(this.elements.activityList); }

  get hasModalWindow() { return this.browser.isVisible(this.elements.modalWindow); }

  get hasModalDeleteButton() { return this.browser.isVisible(this.elements.modalDeleteButton); }

  get hasFlagButton() {
    const {elements} = this;
    return this.browser.isVisible(`${elements.lastSuccessfulActivity}${elements.flagButton}`);
  }

  get lastSuccessfulActivityText() { return this.browser.getText(this.elements.lastSuccessfulActivityText); }

  get lastFileSize() { return this.browser.getText(this.elements.fileSize); }

  constructor(props) {
    super(props);

    const activityContainers = '//div[contains(@class, "ciscospark-activity-item-container")]';
    const lastSuccessfulActivity = `(${activityContainers}/div[not(contains(@class, "pending"))]/parent::div)[last()]`;
    const lastSuccessfulActivityText = `${lastSuccessfulActivity}//div[contains(@class, "ciscospark-activity-text")]`;
    const downloadButtonContainer = `(${lastSuccessfulActivity}//div[starts-with(@class,"ciscospark-activity-content")])[last()]`;
    const downloadFileButton = `(${lastSuccessfulActivity}//div[@title="Download this file"]/parent::button)[last()]`;
    this.elements = Object.assign({}, this.elements, {
      deleteMessageButton: `${lastSuccessfulActivity}//button[@aria-label="Delete this message"]`,
      flagButton: '//button[@aria-label="Flag this message"]',
      highlighted: '//div[contains(@class, "isHighlighted")]',
      pendingAction: '//div[contains(@class, "flagActionPending") and contains(@class, "isHighlighted")]',
      pendingActivity: '.activity-item-pending',
      inputFile: '.ciscospark-file-input',
      modalWindow: '.ciscospark-dialogue-modal',
      modalDeleteButton: 'button[title="Delete"].dialogue-modal-action-btn',
      shareButton: '//button[@aria-label="Share"]',
      systemMessage: '//div[contains(@class, "ciscospark-system-message")]',
      lastActivity: '.ciscospark-activity-item-container:last-child',
      lastActivityText: '.ciscospark-activity-item-container:last-child .ciscospark-activity-text',
      readReceiptsArea: '.ciscospark-read-receipts',
      readReceiptsAvatar: '.ciscospark-typing-avatar',
      messageComposer: '.ciscospark-message-composer',
      textArea: '.ciscospark-message-composer textarea',
      stagedFiles: '.ciscospark-message-composer .ciscospark-staged-files',
      deleteShareButton: '//button[@aria-label="Delete Share"]',
      fileSize: `${lastSuccessfulActivity}//span[contains(@class, "ciscospark-share-file-size")]`,
      activityList: '.ciscospark-activity-list',
      lastSuccessfulActivity,
      lastSuccessfulActivityText,
      downloadButtonContainer,
      downloadFileButton
    });

    this.messages = {
      youDeleted: 'You deleted your message.'
    };
  }

  /**
   * Get text from the last successful activity with selector
   * @param {string} selector
   * @returns {string}
   */
  getLastText(selector) {
    return this.browser.getText(`${this.elements.lastSuccessfulActivityText}//${selector}`);
  }

  /**
   * Checks if element from the last successful activity is visible
   * @param {string} selector
   * @returns {boolean}
   */
  hasLastElement(selector) {
    return this.browser.isVisible(`${this.elements.lastSuccessfulActivityText}//${selector}`);
  }

  /**
   * Get the attribute from the last successful activity with selector
   * @param {string} selector
   * @param {string} attribute
   * @returns {string}
   */
  getLastElementAttribute(selector, attribute) {
    return this.browser.getAttribute(`${this.elements.lastSuccessfulActivityText}//${selector}`, attribute);
  }

  /**
   * Sends message to user from specified browser
   * @param {string} message
   */
  sendMessage(message) {
    const aBrowser = this.browser;
    const {textArea} = this.elements;
    browser.waitUntil(() =>
      this.hasTextArea,
    5000, 'message composer is not visible');
    const withBreaks = message.split('\n');

    if (withBreaks.length > 1) {
      aBrowser.setValue(textArea, '');
      withBreaks.forEach((text, i) => {
        if (text) {
          aBrowser.addValue(textArea, text);
        }
        // Do not add break after last line
        if (withBreaks.length !== i - 1) {
          aBrowser.keys(['Shift', 'Enter', 'NULL']);
        }
      });
    }
    else {
      aBrowser.setValue(textArea, message);
    }

    aBrowser.keys('Enter');
  }

  /**
   * Looks to see if the last message can be deleted
   * @param {string} messageToDelete
   * @returns {boolean}
   */
  canDeleteMessage(messageToDelete) {
    const aBrowser = this.browser;
    const {
      deleteMessageButton
    } = this.elements;
    browser.waitUntil(() =>
      // Text matches message to delete
      this.lastSuccessfulActivityText === messageToDelete,
    10000, `failed to find message to delete "${messageToDelete}"`);
    // Delete button is hidden but still exists
    return aBrowser.isExisting(deleteMessageButton);
  }

  /**
   * Deletes the last message sent
   * @param {string} messageToDelete
   */
  deleteMessage(messageToDelete) {
    const aBrowser = this.browser;
    const {
      lastSuccessfulActivity,
      deleteMessageButton,
      modalDeleteButton,
      systemMessage
    } = this.elements;

    assert.isTrue(this.canDeleteMessage(messageToDelete));

    this.moveMouse(lastSuccessfulActivity);

    browser.waitUntil(() =>
      aBrowser.isVisible(deleteMessageButton),
    2000, 'delete button is not visible when hovering');

    aBrowser.click(deleteMessageButton);

    // Click modal confirm
    browser.waitUntil(() =>
      this.hasModalWindow,
    3500, 'delete modal window is not visible after clicking delete button');

    assert.isTrue(this.hasModalDeleteButton, 'modal delete button is not visible');
    aBrowser.click(modalDeleteButton);

    const deletedSystemMessage = `${lastSuccessfulActivity}${systemMessage}`;
    browser.waitUntil(() =>
      aBrowser.isVisible(deletedSystemMessage),
    10000, `could not find system message at ${deletedSystemMessage}`);

    browser.waitUntil(() => {
      const text = aBrowser.getText(deletedSystemMessage);
      return text.includes(this.messages.youDeleted);
    }, 3500, 'message was not deleted');
  }

  /**
   * Flags the last message received
   * @param {String} messageToFlag
   */
  flagMessage(messageToFlag) {
    const aBrowser = this.browser;
    const {
      lastSuccessfulActivity,
      flagButton,
      highlighted,
      pendingAction
    } = this.elements;

    browser.waitUntil(() =>
      this.lastSuccessfulActivityText === messageToFlag,
    10000, 'message to flag does not exist');
    this.moveMouse(lastSuccessfulActivity);

    browser.waitUntil(() =>
      this.hasFlagButton,
    1500, 'flag button is not visible when hovering');

    aBrowser.click(`${lastSuccessfulActivity}${flagButton}`);

    // Verify it is highlighted, showing it was flagged
    browser.waitUntil(() =>
      aBrowser.isVisible(`${lastSuccessfulActivity}${highlighted}${flagButton}`),
    1500, 'flag button did not highlight');

    // Remove pending flag
    browser.waitUntil(() =>
      aBrowser.isVisible(`${lastSuccessfulActivity}${pendingAction}${flagButton}`) === false,
    7500, 'flag button did not remove pending state');
  }

  /**
   * Unflags the last message received. Expected message should already be flagged
   * @param {String} messageToUnflag
   */
  removeFlagMessage(messageToUnflag) {
    const aBrowser = this.browser;
    const {
      lastSuccessfulActivity,
      lastSuccessfulActivityText,
      highlighted,
      flagButton
    } = this.elements;

    browser.waitUntil(() =>
      aBrowser.getText(lastSuccessfulActivityText) === messageToUnflag,
    1500, `message was not found "${messageToUnflag}"`);

    browser.waitUntil(() =>
      aBrowser.isVisible(`${lastSuccessfulActivity}${highlighted}${flagButton}`),
    1500, 'message was not flagged');

    aBrowser.click(`${lastSuccessfulActivity}${flagButton}`);

    browser.waitUntil(() =>
      aBrowser.isVisible(`${lastSuccessfulActivity}${highlighted}`) === false,
    3500, 'message was still flagged');
  }

  /**
   * Sends a file
   * @param {string} fileName
   */
  sendFile(fileName) {
    const filePath = path.join(uploadDir, fileName);
    const aBrowser = this.browser;
    const {
      inputFile,
      shareButton
    } = this.elements;
    aBrowser.chooseFile(inputFile, filePath);
    aBrowser.click(shareButton);
  }

  /**
   * Checks to see if file has been received
   * @param {string} fileName
   */
  hasFile(fileName) {
    const aBrowser = this.browser;
    const fileTitle = `//div[text()="${fileName}"]`;
    aBrowser.waitUntil(() =>
      aBrowser.isExisting(fileTitle),
    15000, 'failed to send file');
    aBrowser.scroll(fileTitle);
  }

  /**
   * Clears the file uploader of any temporary files
   */
  clearFileUploader() {
    const {elements} = this;
    const aBrowser = this.browser;

    while (aBrowser.isVisible(elements.stagedFiles)) {
      aBrowser.click(elements.deleteShareButton);
    }
  }


  /**
   * Verifies message received from user in specified browser
   * @param {string} message
   */
  verifyMessageReceipt(message) {
    const aBrowser = this.browser;
    const {
      lastSuccessfulActivityText,
      messageComposer
    } = this.elements;

    browser.waitUntil(() =>
      aBrowser.isExisting(lastSuccessfulActivityText),
    15000, 'message text was not found');
    browser.waitUntil(() =>
      this.lastSuccessfulActivityText === message,
    10000, `message text did not match "${message}" !== "${this.lastSuccessfulActivityText}"`);
    // Move Mouse to text area so it doesn't cause any tool tips
    this.moveMouse(messageComposer);
  }

  /**
   * Verifies a read receipt has been received
   */
  verifyReadReceipt() {
    const aBrowser = this.browser;
    const {
      messageComposer,
      readReceiptsArea,
      readReceiptsAvatar
    } = this.elements;

    aBrowser.waitUntil(() =>
      aBrowser.isExisting(`${readReceiptsArea} ${readReceiptsAvatar}`),
    10000, 'read receipt was not received');
    // Move Mouse to text area so it doesn't cause any tool tips
    this.moveMouse(messageComposer);
  }

  /**
   * Verifies file is displayed in files tab
   * @param {Object} options
   * @param {string} options.fileName
   * @param {boolean} options.hasThumbnail
   */
  verifyFilesActivityTab({fileName, hasThumbnail}) {
    const aBrowser = this.browser;
    const {
      filesButton,
      filesWidget,
      closeButton
    } = this.elements;
    const fileTitle = `//div[text()="${fileName}"]`;
    const fileThumbnail = `//img[@alt="Uploaded File ${fileName}"]`;
    this.openMenuAndClickButton(filesButton);

    browser.waitUntil(() =>
      aBrowser.isVisible(filesWidget),
    5000, 'failed to open files tab');

    aBrowser.waitForExist(`${filesWidget}${fileTitle}`);
    if (hasThumbnail) {
      aBrowser.waitForVisible(fileThumbnail);
    }
    aBrowser.waitForVisible(closeButton);
    aBrowser.click(closeButton);
  }
}
