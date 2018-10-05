import {assert} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import {jobNames, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import waitForPromise from '../../../lib/wait-for-promise';
import {runAxe} from '../../../lib/axe';

import {elements, openMenuAndClickButton, switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {
  elements as rosterElements,
  hasParticipants
} from '../../../lib/test-helpers/space-widget/roster';
import {
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';
import {elements as meetElements, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';

describe('Smoke Tests - Space Widget', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = jobNames.smokeSpace;
  let allPassed = true;
  let docbrown, lorraine, marty, participants;
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
    registerDevices(participants);
    conversation = createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Widget Space'});
  });

  before('open widget for marty in browserLocal', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        destinationId: spaceId,
        destinationType: 'spaceId'
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);
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
    }, docbrown.token.access_token, conversation.id);
    remote.browser.waitForVisible(`[placeholder="Send a message to ${local.displayName}"]`);
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();
    assert.equal(title, 'Cisco Spark Widget Test');
  });

  it('loads the space name', () => {
    browserLocal.waitForVisible('h1.ciscospark-title');
    assert.equal(browserLocal.getText('h1.ciscospark-title'), conversation.displayName);
  });

  describe('When conversation is established', () => {
    before('wait for conversation to be ready', () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;
      browserLocal.waitForVisible(textInputField);
    });

    describe('Activity Menu', () => {
      it('has a menu button', () => {
        assert.isTrue(browserLocal.isVisible(elements.menuButton));
      });

      it('displays the menu when clicking the menu button', () => {
        browserLocal.click(elements.menuButton);
        browserLocal.waitForVisible(elements.activityMenu);
      });

      it('has an exit menu button', () => {
        assert.isTrue(browserLocal.isVisible(elements.activityMenu));
        browserLocal.waitForVisible(elements.exitButton);
      });

      it('closes the menu with the exit button', () => {
        browserLocal.click(elements.exitButton);
        browserLocal.waitForVisible(elements.activityMenu, 60000, true);
      });

      it('has a message button', () => {
        browserLocal.click(elements.menuButton);
        browserLocal.waitForVisible(elements.messageButton);
      });

      it('has a meet button', () => {
        browserLocal.waitForVisible(elements.meetButton);
      });

      it('has a files button', () => {
        browserLocal.waitForVisible(elements.filesButton);
      });

      it('has a roster button', () => {
        browserLocal.waitForVisible(elements.peopleButton);
      });

      it('switches to files widget', () => {
        browserLocal.waitForVisible(elements.filesButton);
        browserLocal.click(elements.filesButton);
        browserLocal.waitForVisible(elements.filesWidget);
        browserLocal.waitForVisible(elements.menuButton);
        browserLocal.click(elements.menuButton);
      });

      it('hides menu and switches to message widget', () => {
        browserLocal.click(elements.messageButton);
        browserLocal.waitForVisible(elements.activityMenu, 60000, true);
        assert.isTrue(browserLocal.isVisible(elements.messageWidget));
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

        it('closes the people roster widget', () => {
          browserLocal.click(rosterElements.closeButton);
          browserLocal.waitForVisible(rosterElements.rosterWidget, 60000, true);
        });
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
    });

    describe('meet widget', () => {
      describe('pre call experience', () => {
        it('has a call button', () => {
          switchToMeet(browserLocal);
          browserLocal.waitForVisible(meetElements.callButton);
        });
      });

      describe('during call experience', () => {
        it('can decline an incoming call', () => {
          declineIncomingCallTest(browserLocal, browserRemote, true);
        });

        it('can hangup in call', () => {
          hangupDuringCallTest(browserLocal, browserRemote, true);
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

