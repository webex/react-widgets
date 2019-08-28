import {assert} from 'chai';

import {createTestUsers, createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../lib/test-users';
import {jobNames, renameJob, updateJobStatus} from '../../lib/test-helpers';
import {runAxe} from '../../lib/axe';
import {clearEventLog} from '../../lib/events';
import {
  elements as rosterElements,
  canSearchForParticipants,
  hasParticipants,
  searchForPerson
} from '../../lib/test-helpers/space-widget/roster';
import {elements as mainElements, openMenuAndClickButton, switchToMeet} from '../../lib/test-helpers/space-widget/main';
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
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = jobNames.space;
  let allPassed = true;
  let biff, docbrown, lorraine, marty, participants;
  let conversation, local, remote;

  before('start new sauce session', () => {
    renameJob(jobName, browser);
  });

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
    remote.browser.waitForVisible(`[placeholder="Send a message to ${local.displayName}"]`);
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();

    assert.equal(title, 'Cisco Spark Widget Test');
  });

  it('header has to group\'s name', () => {
    browserLocal.waitForVisible(mainElements.widgetTitle);
    assert.equal(browserLocal.getText(mainElements.widgetTitle), conversation.displayName);
  });

  describe('When conversation is established', () => {
    before('wait for conversation to be ready', () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;

      browserLocal.waitForVisible(textInputField);
    });

    describe('Activity Menu', () => {
      it('has a menu button', () => {
        assert.isTrue(browserLocal.isVisible(mainElements.menuButton));
      });

      it('displays the menu when clicking the menu button', () => {
        browserLocal.click(mainElements.menuButton);
        browserLocal.waitForVisible(mainElements.activityMenu);
      });

      it('has an exit menu button', () => {
        assert.isTrue(browserLocal.isVisible(mainElements.activityMenu));
        browserLocal.waitForVisible(mainElements.exitButton);
      });

      it('closes the menu with the exit button', () => {
        browserLocal.click(mainElements.exitButton);
        browserLocal.waitForVisible(mainElements.activityMenu, 60000, true);
      });

      it('has a message button', () => {
        browserLocal.click(mainElements.menuButton);
        browserLocal.waitForVisible(mainElements.messageButton);
      });

      it('has a files button', () => {
        browserLocal.waitForVisible(mainElements.filesButton);
      });

      it('switches to files widget', () => {
        browserLocal.waitForVisible(mainElements.filesButton);
        browserLocal.click(mainElements.filesButton);
        browserLocal.waitForVisible(mainElements.filesWidget);
        browserLocal.waitForVisible(mainElements.menuButton);
        browserLocal.click(mainElements.menuButton);
      });

      it('hides menu and switches to message widget', () => {
        browserLocal.click(mainElements.messageButton);
        browserLocal.waitForVisible(mainElements.activityMenu, 60000, true);
        assert.isTrue(browserLocal.isVisible(mainElements.messageWidget));
      });
    });

    describe('roster tests', () => {
      before('open roster widget', () => {
        openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
        browserLocal.waitForVisible(rosterElements.rosterWidget);
      });

      it('has a close button', () => {
        assert.isTrue(browserLocal.isVisible(rosterElements.closeButton));
      });

      it('has the total count of participants', () => {
        assert.equal(browserLocal.getText(rosterElements.rosterTitle), 'People (3)');
      });

      it('has the participants listed', () => {
        hasParticipants(browserLocal, [marty, docbrown, lorraine]);
      });

      it('has search for participants', () => {
        canSearchForParticipants(browserLocal);
      });

      it('searches and adds person to space', () => {
        openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
        browserLocal.waitForVisible(rosterElements.rosterWidget);
        searchForPerson(browserLocal, biff.email, true, biff.displayName);
        browserLocal.waitForVisible(rosterElements.rosterList);
        browserLocal.waitUntil(() => browserLocal.getText(rosterElements.rosterList).includes(biff.displayName));
        browserLocal.waitUntil(() => browserLocal.getText(rosterElements.rosterTitle) === 'People (4)');
      });

      it('closes the people roster widget', () => {
        browserLocal.click(rosterElements.closeButton);
        browserLocal.waitForVisible(rosterElements.rosterWidget, 60000, true);
      });
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
          browserLocal.waitForVisible(meetElements.callButton);
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
        runAxe(browserLocal, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0);
          }));
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobName, allPassed);
  });

  after('disconnect', () => disconnectDevices(participants));
});

