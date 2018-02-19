import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import waitForPromise from '../../../lib/wait-for-promise';
import {
  canDeleteMessage,
  deleteMessage,
  flagMessage,
  messageTests,
  removeFlagMessage,
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';

describe('Widget Space', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let docbrown, lorraine, marty;
  let conversation, local, remote;

  process.env.CISCOSPARK_SCOPE = [
    'webexsquare:get_conversation',
    'spark:people_read',
    'spark:rooms_read',
    'spark:rooms_write',
    'spark:memberships_read',
    'spark:memberships_write',
    'spark:messages_read',
    'spark:messages_write',
    'spark:teams_read',
    'spark:teams_write',
    'spark:team_memberships_read',
    'spark:team_memberships_write',
    'spark:kms'
  ].join(' ');

  before('load browsers', () => {
    browser
      .url('/space.html')
      .execute(() => {
        localStorage.clear();
      });
  });

  before('create marty', () => testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
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
      return marty.spark.internal.mercury.connect();
    }));

  before('create docbrown', () => testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
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
    }));

  before('create lorraine', () => testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
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
      return lorraine.spark.internal.mercury.connect();
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));

  before('create space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Widget Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before('inject marty token', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    local.browser.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    remote.browser.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.id);
  });

  describe('messaging', () => {
    it('sends and receives messages', () => {
      const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
      const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
      const lorraineText = 'Marty, will we ever see you again?';
      const martyText2 = 'I guarantee it.';
      sendMessage(remote, local, martyText);
      verifyMessageReceipt(local, remote, martyText);
      sendMessage(remote, local, docText);
      verifyMessageReceipt(local, remote, docText);
      // Send a message from a 'client'
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      verifyMessageReceipt(local, remote, lorraineText);
      verifyMessageReceipt(remote, local, lorraineText);
      sendMessage(local, remote, martyText2);
      verifyMessageReceipt(remote, local, martyText2);
    });

    it('receives proper events on messages', () => {
      messageTests.messageEventTest(local, remote);
    });

    describe('message actions', () => {
      describe('message flags', () => {
        const message = 'Do you really think this is a good idea?';
        before('create a message to flag', () => {
          sendMessage(remote, local, message);
          verifyMessageReceipt(local, remote, message);
        });

        it('should be able to flag a message', () => {
          flagMessage(local, message);
        });

        it('should be able to unflag a message', () => {
          removeFlagMessage(local, message);
        });
      });

      describe('delete message', () => {
        it('should be able to delete a message from self', () => {
          const message = 'There is no spoon!';
          sendMessage(local, remote, message);
          verifyMessageReceipt(remote, local, message);
          deleteMessage(local, message);
        });

        it('should not be able to delete a message from others', () => {
          const message = 'Hey you guys!';
          sendMessage(remote, local, message);
          verifyMessageReceipt(local, remote, message);
          assert.isFalse(canDeleteMessage(local, message));
        });
      });
    });

    describe('File Transfer Tests', () => {
      it('sends message with pdf attachment', () => {
        messageTests.sendFileTest(local, remote, 'pdf-sample.pdf');
      });

      it('sends message with txt attachment', () => {
        messageTests.sendFileTest(local, remote, 'txt-sample.txt');
      });

      it('sends message with doc attachment', () => {
        messageTests.sendFileTest(local, remote, 'doc-sample.doc');
      });

      it('sends message with docx attachment', () => {
        messageTests.sendFileTest(local, remote, 'docx-sample.docx');
      });

      it('sends message with ppt attachment', () => {
        messageTests.sendFileTest(local, remote, 'ppt-sample.ppt');
      });

      it('sends message with html attachment', () => {
        messageTests.sendFileTest(local, remote, 'html-sample.html');
      });

      it('sends message with json attachment', () => {
        messageTests.sendFileTest(local, remote, 'json-sample.json');
      });

      it('sends message with zip attachment', () => {
        messageTests.sendFileTest(local, remote, 'zip-sample.zip');
      });

      it('sends message with gif attachment', () => {
        messageTests.sendFileTest(local, remote, 'gif-sample.gif', false);
      });

      it('sends message with jpg attachment', () => {
        messageTests.sendFileTest(local, remote, 'jpg-sample.jpg', false);
      });

      it('sends message with png attachment', () => {
        messageTests.sendFileTest(local, remote, 'png-sample.png');
      });

      it('sends message with mp3 attachment', () => {
        messageTests.sendFileTest(local, remote, 'mp3-sample.mp3');
      });

      it('verifies png-sample is in files tab', () => {
        messageTests.filesTabTest(local, remote, 'png-sample.png');
      });

      it('verifies mp3-sample is in files tab', () => {
        messageTests.filesTabTest(local, remote, 'mp3-sample.mp3', false);
      });
    });

    describe('markdown messaging', () => {
      it('sends message with bold text', () => {
        messageTests.markdown.bold(remote, local);
      });

      it('sends message with italic text', () => {
        messageTests.markdown.italic(local, remote);
      });

      it('sends message with a blockquote', () => {
        messageTests.markdown.blockquote(remote, local);
      });

      it('sends message with numbered list', () => {
        messageTests.markdown.orderedList(local, remote);
      });

      it('sends message with bulleted list', () => {
        messageTests.markdown.unorderedList(remote, local);
      });

      it('sends message with heading 1', () => {
        messageTests.markdown.heading1(local, remote);
      });

      it('sends message with heading 2', () => {
        messageTests.markdown.heading2(remote, local);
      });

      it('sends message with heading 3', () => {
        messageTests.markdown.heading3(local, remote);
      });

      it('sends message with horizontal line', () => {
        messageTests.markdown.hr(remote, local);
      });

      it('sends message with link', () => {
        messageTests.markdown.link(local, remote);
      });

      it('sends message with inline code', () => {
        messageTests.markdown.inline(remote, local);
      });

      it('sends message with codeblock', () => {
        messageTests.markdown.codeblock(local, remote);
      });
    });
  });
});
