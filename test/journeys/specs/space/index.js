import {assert} from 'chai';

import {createTestUsers, createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../lib/test-users';
import {runAxe} from '../../lib/axe';
import {clearEventLog} from '../../lib/events';
import {
  elements as rosterElements,
  canSearchForParticipants,
  hasParticipants,
  searchForPerson
} from '../../lib/test-helpers/space-widget/roster';
import {elements as mainElements, switchToMeet} from '../../lib/test-helpers/space-widget/main';
import {
  canDeleteMessage,
  deleteMessage,
  flagMessage,
  messageTests,
  removeFlagMessage,
  sendMessage,
  verifyMessageReceipt
} from '../../lib/test-helpers/space-widget/messaging';
import {
  elements as meetElements,
  declineIncomingCallTest,
  hangupBeforeAnswerTest,
  hangupDuringCallTest,
  callEventTest
} from '../../lib/test-helpers/space-widget/meet';
import waitForPromise from '../../lib/wait-for-promise';

describe('Space Widget Primary Tests', () => {
  let allPassed = true;
  let biff, docbrown, lorraine, marty, participants;
  let conversation, local, remote;

  before('load browsers', () => {
    browser.url('/space.html');
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();
    [docbrown, lorraine, marty] = participants;
    [biff] = createTestUsers(1, [{displayName: 'Biff Tannen'}]);
    registerDevices(participants);
    conversation = createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Group Space'});
  });

  before('open widget for marty in browserLocal', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        destinationId: spaceId,
        destinationType: 'spaceId'
      };

      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.hydraId);
  });

  before('open widget for docbrown in browserRemote', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    remote.browser.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        destinationId: spaceId,
        destinationType: 'spaceId'
      };

      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.hydraId);
    remote.browser.$(`[placeholder="Send a message to ${local.displayName}"]`).waitForDisplayed();
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();

    assert.equal(title, 'Cisco Spark Widget Test');
  });

  it('header has to group\'s name', () => {
    browserLocal.$(mainElements.widgetTitle).waitForDisplayed();
    assert.equal(browserLocal.$(mainElements.widgetTitle).getText(), conversation.displayName);
  });

  describe('When conversation is established', () => {
    before('wait for conversation to be ready', () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;

      browserLocal.$(textInputField).waitForDisplayed();
    });

    describe('Activity Section', () => {
      it('has a message button', () => {
        browserLocal.$(mainElements.messageActivityButton).waitForDisplayed();
      });

      it('has a files button', () => {
        browserLocal.$(mainElements.filesActivityButton).waitForDisplayed();
      });

      it('switches to files widget', () => {
        browserLocal.$(mainElements.filesActivityButton).waitForDisplayed();
        browserLocal.$(mainElements.filesActivityButton).click();
        browserLocal.$(mainElements.filesWidget).waitForDisplayed();
      });

      it('hides menu and switches to message widget', () => {
        browserLocal.$(mainElements.messageActivityButton).click();
        browserLocal.$(mainElements.activityMenu).waitForDisplayed({
          timeout: 60000,
          reverse: true
        });
        assert.isTrue(browserLocal.$(mainElements.messageWidget).isDisplayed());
      });
    });

    describe('roster tests', () => {
      before('open roster widget', () => {
        browserLocal.$(rosterElements.peopleButton).click();
        browserLocal.$(rosterElements.rosterWidget).waitForDisplayed();
      });

      it('has the total count of participants', () => {
        assert.equal(browserLocal.$(rosterElements.rosterTitle).getText(), 'People (3)');
      });

      it('has the participants listed', () => {
        hasParticipants(browserLocal, [marty, docbrown, lorraine]);
      });

      it('has search for participants', () => {
        canSearchForParticipants(browserLocal);
      });

      it('searches and adds person to space', () => {
        browserLocal.$(rosterElements.peopleButton).click();
        browserLocal.$(rosterElements.rosterWidget).waitForDisplayed();
        searchForPerson(browserLocal, biff.email, true, biff.displayName);
        browserLocal.$(rosterElements.rosterList).waitForDisplayed();
        browserLocal.waitUntil(
          () => browserLocal.$(rosterElements.rosterList).getText().includes(biff.displayName),
          {}
        );
        browserLocal.waitUntil(
          () => browserLocal.$(rosterElements.rosterTitle).getText() === 'People (4)',
          {}
        );
      });
    });

    describe('messaging', () => {
      it('sends and receives messages', () => {
        const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
        const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
        const lorraineText = 'Marty, will we ever see you again?';
        const martyText2 = 'I guarantee it.';

        local.browser.$(rosterElements.messagesButton).click();
        remote.browser.$(rosterElements.messagesButton).click();

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
        it('sends message with png attachment', () => {
          messageTests.sendFileTest(local, remote, 'png-sample.png');
        });

        it('verifies png-sample is in files tab', () => {
          messageTests.filesTabTest(local, remote, 'png-sample.png');
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

    describe('meet widget', () => {
      describe('pre call experience', () => {
        it('has a call button', () => {
          switchToMeet(browserLocal);
          browserLocal.$(meetElements.callButton).waitForDisplayed();
        });
      });

      describe('during call experience', () => {
        it('can hangup before answer', () => {
          hangupBeforeAnswerTest(browserLocal, browserRemote, true);
        });

        it('can decline an incoming call', () => {
          declineIncomingCallTest(browserLocal, browserRemote, true);
        });

        it('can hangup in call', () => {
          clearEventLog(browserLocal);
          clearEventLog(browserRemote);
          hangupDuringCallTest(browserLocal, browserRemote, true);
        });

        it('has proper call event data', () => {
          callEventTest(local, remote, true);
        });
      });
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'webex-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0);
          }));
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after('disconnect', () => disconnectDevices(participants));
});

