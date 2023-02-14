import {assert} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import {runAxe} from '../../../lib/axe';

import {elements, openMenuAndClickButton, switchToMeet, switchToMessage} from '../../../lib/test-helpers/space-widget/main';
import {
  elements as rosterElements,
  hasParticipants
} from '../../../lib/test-helpers/space-widget/roster';
import {
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';
import {elements as meetElements, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';

describe('Smoke Tests - Space Widget', () => {
  let allPassed = true;
  let docbrown, lorraine, marty, participants;
  let conversation, local, remote;

  before('loads the page', () => {
    browser.refresh();
    browser.url('/space.html');
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();
    [docbrown, lorraine, marty] = participants;
    assert.lengthOf(participants, 3, 'Test users were not created');
    registerDevices(participants);
    conversation = createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Widget Space'});
  });

  it('open widget for marty in browserLocal', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        destinationId: spaceId,
        destinationType: 'spaceId'
      };

      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.hydraId);
  });

  it('open widget for docbrown in browserRemote', () => {
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

  it('loads the space name', () => {
    browserLocal.$(elements.widgetTitle).waitForDisplayed();
    browserLocal.waitUntil(() => browserLocal.$(elements.widgetTitle).getText() === conversation.displayName, {
      timeout: 60000
    });
  });

  describe('When conversation is established', () => {
    before('wait for conversation to be ready', () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;

      browserLocal.$(textInputField).waitForDisplayed();
    });

    describe('Activity Section', () => {
      it('has a message button', () => {
        browserLocal.$(elements.messageActivityButton).waitForDisplayed();
      });

      it('has a meet button', () => {
        browserLocal.$(elements.meetActivityButton).waitForDisplayed();
      });

      it('has a files button', () => {
        browserLocal.$(elements.filesActivityButton).waitForDisplayed();
      });

      it('has a roster button', () => {
        browserLocal.$(elements.peopleActivityButton).waitForDisplayed();
      });

      it('switches to files widget', () => {
        browserLocal.$(elements.filesActivityButton).waitForDisplayed();
        browserLocal.$(elements.filesActivityButton).click();
        browserLocal.$(elements.filesWidget).waitForDisplayed();
      });

      it('hides menu and switches to message widget', () => {
        browserLocal.$(elements.messageActivityButton).click();
        browserLocal.$(elements.activityMenu).waitForDisplayed({
          timeout: 60000,
          reverse: true
        });
        assert.isTrue(browserLocal.$(elements.messageWidget).isDisplayed());
      });

      describe('roster tests', () => {
        before('open roster widget', () => {
          openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
          browserLocal.$(rosterElements.rosterWidget).waitForDisplayed();
        });

        it('has the total count of participants', () => {
          assert.equal(browserLocal.$(rosterElements.rosterTitle).getText(), 'People (3)');
        });

        it('has the participants listed', () => {
          hasParticipants(browserLocal, [marty, docbrown, lorraine]);
        });
      });
    });

    describe('messaging', () => {
      const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
      const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';

      it('switches to Messages', () => {
        switchToMessage(local.browser);
        switchToMessage(remote.browser);
      });

      it('marty sends a message', () => {
        sendMessage(remote, local, martyText);
        verifyMessageReceipt(local, remote, martyText);
      });

      it('docbrown receives a message', () => {
        sendMessage(remote, local, docText);
        verifyMessageReceipt(local, remote, docText);
      });

      // it('lorraine sends a message and verifies it was sent', () => {
      // This request is flaky for some reason
      // and the message won't get sent and the function doesn't throw if there's an error
      // waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
      //   displayName: lorraineText
      // }));
      // Send a message from a 'client'
      // Wait for both widgets to receive client message
      //   verifyMessageReceipt(local, remote, lorraineText);
      //   verifyMessageReceipt(remote, local, lorraineText);
      // }, 5);

    //   it('marty sends another message', () => {
    //     sendMessage(local, remote, martyText2);
    //     verifyMessageReceipt(remote, local, martyText2);
    //   });
    });

    describe.skip('meet widget', () => {
      it('has a call button', () => {
        switchToMeet(browserLocal);
        browserLocal.$(meetElements.callButton).waitForDisplayed();
      });

      it('can place a call and hangup after answer', () => {
        hangupDuringCallTest(browserLocal, browserRemote, true);
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
