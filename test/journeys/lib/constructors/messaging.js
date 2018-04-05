import {assert} from 'chai';

import messageTests from '../helpers/space-widget/messaging';

/**
 *
 * @param {Object} options
 * @param {Object} options.browserLocal
 * @param {Object} options.browserRemote
 * @param {Object} options.sender
 */
export default function allMessagingTest({
  localPage,
  remotePage
}) {
  describe('Messaging Tests', () => {
    describe('flag message', function messageFlagTests() {
      this.retries(2);
      const message = 'Do you really think this is a good idea?';
      before('create a message to flag', () => {
        localPage.sendMessage(message);
        remotePage.verifyMessageReceipt(message);
      });

      it('should be able to flag a message', () => {
        localPage.flagMessage(message);
      });

      it('should be able to unflag a message', () => {
        localPage.removeFlagMessage(message);
      });
    });

    describe('delete Message', function deleteMessageTests() {
      it('should be able to delete a message from self', () => {
        const message = 'There is no spoon!';
        localPage.sendMessage(message);
        remotePage.verifyMessageReceipt(message);
        localPage.deleteMessage(message);
      });

      it('should not be able to delete a message from others', () => {
        const message = 'Hey you guys!';
        remotePage.sendMessage(message);
        localPage.verifyMessageReceipt(message);
        assert.isFalse(localPage.canDeleteMessage(message));
      });
    });

    describe('file sharing', function fileTransferTests() {
      this.retries(2);
      function sendFile(fileName, fileSizeVerify = true) {
        localPage.clearFileUploader();
        messageTests.sendFileTest({
          localPage,
          remotePage,
          fileName,
          fileSizeVerify
        });
      }

      before('clear shares in file uploader', function clearFiles() {
        this.timeout(10000);
        localPage.clearFileUploader();
        remotePage.clearFileUploader();
      });

      it('sends message with pdf attachment', () => {
        sendFile('pdf-sample.pdf');
      });

      it('sends message with txt attachment', () => {
        sendFile('txt-sample.txt');
      });

      it('sends message with doc attachment', () => {
        sendFile('doc-sample.doc');
      });

      it('sends message with docx attachment', () => {
        sendFile('docx-sample.docx');
      });

      it('sends message with ppt attachment', () => {
        sendFile('ppt-sample.ppt');
      });

      it('sends message with html attachment', () => {
        sendFile('html-sample.html');
      });

      it('sends message with json attachment', () => {
        sendFile('json-sample.json');
      });

      it('sends message with zip attachment', () => {
        sendFile('zip-sample.zip');
      });

      it('sends message with gif attachment', () => {
        sendFile('gif-sample.gif', false);
      });

      it('sends message with jpg attachment', () => {
        sendFile('jpg-sample.jpg', false);
      });

      it('sends message with png attachment', () => {
        sendFile('png-sample.png');
      });

      it('sends message with mp3 attachment', () => {
        sendFile('mp3-sample.mp3');
      });

      it('verifies png-sample is in files tab', () => {
        messageTests.filesTabTest({
          localPage,
          remotePage,
          fileName: 'png-sample.png'
        });
      });

      it('verifies mp3-sample is in files tab', () => {
        messageTests.filesTabTest({
          localPage,
          remotePage,
          fileName: 'mp3-sample.mp3',
          hasThumbnail: false
        });
      });
    });

    describe('markdown messages', function markdownMessaging() {
      this.retries(2);
      it('sends message with bold text', () => {
        messageTests.markdown.bold(remotePage, localPage);
      });

      it('sends message with italic text', () => {
        messageTests.markdown.italic(localPage, remotePage);
      });

      it('sends message with a blockquote', () => {
        messageTests.markdown.blockquote(remotePage, localPage);
      });

      it('sends message with numbered list', () => {
        messageTests.markdown.orderedList(localPage, remotePage);
      });

      it('sends message with bulleted list', () => {
        messageTests.markdown.unorderedList(remotePage, localPage);
      });

      it('sends message with heading 1', () => {
        messageTests.markdown.heading1(localPage, remotePage);
      });

      it('sends message with heading 2', () => {
        messageTests.markdown.heading2(remotePage, localPage);
      });

      it('sends message with heading 3', () => {
        messageTests.markdown.heading3(localPage, remotePage);
      });

      it('sends message with horizontal line', () => {
        messageTests.markdown.hr(remotePage, localPage);
      });

      it('sends message with link', () => {
        messageTests.markdown.link(localPage, remotePage);
      });

      it('sends message with inline code', () => {
        messageTests.markdown.inline(remotePage, localPage);
      });

      it('sends message with codeblock', () => {
        messageTests.markdown.codeblock(localPage, remotePage);
      });
    });

    it('receives proper events on messages', () => {
      messageTests.messageEventTest({
        localPage, remotePage
      });
    });
  });
}
