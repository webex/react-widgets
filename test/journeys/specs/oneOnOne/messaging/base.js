import {assert} from 'chai';

import {setupOneOnOneUsers} from '../../../lib/test-helpers';
import {runAxe} from '../../../lib/axe';
import {
  canDeleteMessage,
  deleteMessage,
  flagMessage,
  messageTests,
  removeFlagMessage,
  sendMessage,
  verifyMessageReceipt,
  clearFileUploader
} from '../../../lib/test-helpers/space-widget/messaging';

export default function oneOnOneMessageTests({name, browserSetup}) {
  describe(`Widget Space: One On One - Messaging (${name})`, () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let mccoy, spock, oneOnOneConversation;

    before('initialize test users', function intializeUsers() {
      ({mccoy, spock} = setupOneOnOneUsers());

      mccoy.spark.internal.device.register();

      browser.waitUntil(() =>
        mccoy.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);

      mccoy.spark.internal.conversation.create({
        participants: [mccoy, spock]
      }).then((c) => {
        oneOnOneConversation = c;
        return oneOnOneConversation;
      });

      browser.waitUntil(() => oneOnOneConversation && oneOnOneConversation.id,
        15000, 'failed to create one on one space');
    });

    it('can load browsers and widgets', function loadBrowsers() {
      this.retries(3);

      browserSetup({
        aBrowser: browserLocal,
        accessToken: spock.token.access_token,
        toPersonEmail: mccoy.email
      });

      browserSetup({
        aBrowser: browserRemote,
        accessToken: mccoy.token.access_token,
        toPersonEmail: spock.email
      });

      browser.waitUntil(() =>
        browserRemote.isVisible(`[placeholder="Send a message to ${spock.displayName}"]`) &&
        browserLocal.isVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`),
      10000, 'failed to load browsers and widgets');
    });

    describe('message widget', () => {
      it('sends and receives messages', () => {
        const message = 'Oh, I am sorry, Doctor. Were we having a good time?';
        sendMessage({
          senderBrowser: browserLocal,
          message
        });
        verifyMessageReceipt({
          senderBrowser: browserRemote,
          receiverBrowser: browserLocal,
          message
        });
      });

      it('receives proper events on messages', () => {
        messageTests.messageEventTest({
          senderBrowser: browserLocal,
          sender: spock,
          receiverBrowser: browserRemote
        });
      });

      describe('message actions', function messageActionTests() {
        describe('message flags', function messageFlagTests() {
          this.retries(2);
          const message = 'Do you really think this is a good idea?';
          before('create a message to flag', () => {
            sendMessage({
              senderBrowser: browserRemote,
              message
            });
            verifyMessageReceipt({
              senderBrowser: browserLocal,
              receiverBrowser: browserRemote,
              message
            });
          });

          it('should be able to flag a message', () => {
            flagMessage({
              aBrowser: browserLocal,
              messageToFlag: message
            });
          });

          it('should be able to unflag a message', () => {
            removeFlagMessage({
              aBrowser: browserLocal,
              messageToUnflag: message
            });
          });
        });

        describe('delete message', function deleteMessageTests() {
          this.retries(2);
          it('should be able to delete a message from self', () => {
            const message = 'There is no spoon!';
            sendMessage({
              senderBrowser: browserLocal,
              message
            });
            verifyMessageReceipt({
              senderBrowser: browserRemote,
              receiverBrowser: browserLocal,
              message
            });
            deleteMessage({
              aBrowser: browserLocal,
              messageToDelete: message
            });
          });

          it('should not be able to delete a message from others', () => {
            const message = 'Hey you guys!';
            sendMessage({
              senderBrowser: browserRemote,
              message
            });
            verifyMessageReceipt({
              senderBrowser: browserLocal,
              receiverBrowser: browserRemote,
              message
            });
            assert.isFalse(canDeleteMessage({
              aBrowser: browserLocal,
              messageToDelete: message
            }));
          });
        });
      });

      describe('File Transfer Tests', function fileTransferTests() {
        this.retries(2);
        const senderBrowser = browserLocal;
        const receiverBrowser = browserRemote;
        function sendFile(fileName, fileSizeVerify = true) {
          messageTests.sendFileTest({
            senderBrowser,
            receiverBrowser,
            fileName,
            fileSizeVerify
          });
        }

        before('clear shares in file uploader', function clearFiles() {
          this.timeout(10000);
          clearFileUploader(browserRemote);
          clearFileUploader(browserLocal);
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
            senderBrowser,
            receiverBrowser,
            fileName: 'png-sample.png'
          });
        });

        it('verifies mp3-sample is in files tab', () => {
          messageTests.filesTabTest({
            senderBrowser,
            receiverBrowser,
            fileName: 'mp3-sample.mp3',
            hasThumbnail: false
          });
        });
      });

      describe('markdown messaging', function markdownMessaging() {
        this.retries(2);
        it('sends message with bold text', () => {
          messageTests.markdown.bold(browserRemote, browserLocal);
        });

        it('sends message with italic text', () => {
          messageTests.markdown.italic(browserLocal, browserRemote);
        });

        it('sends message with a blockquote', () => {
          messageTests.markdown.blockquote(browserRemote, browserLocal);
        });

        it('sends message with numbered list', () => {
          messageTests.markdown.orderedList(browserLocal, browserRemote);
        });

        it('sends message with bulleted list', () => {
          messageTests.markdown.unorderedList(browserRemote, browserLocal);
        });

        it('sends message with heading 1', () => {
          messageTests.markdown.heading1(browserLocal, browserRemote);
        });

        it('sends message with heading 2', () => {
          messageTests.markdown.heading2(browserRemote, browserLocal);
        });

        it('sends message with heading 3', () => {
          messageTests.markdown.heading3(browserLocal, browserRemote);
        });

        it('sends message with horizontal line', () => {
          messageTests.markdown.hr(browserRemote, browserLocal);
        });

        it('sends message with link', () => {
          messageTests.markdown.link(browserLocal, browserRemote);
        });

        it('sends message with inline code', () => {
          messageTests.markdown.inline(browserRemote, browserLocal);
        });

        it('sends message with codeblock', () => {
          messageTests.markdown.codeblock(browserLocal, browserRemote);
        });
      });
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0);
          }));
    });
  });
}
