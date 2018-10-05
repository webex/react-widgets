import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../lib/test-users';
import {jobNames, renameJob, updateJobStatus} from '../../lib/test-helpers';
import waitForPromise from '../../lib/wait-for-promise';
import {switchToMeet} from '../../lib/test-helpers/space-widget/main';
import {elements, declineIncomingCallTest, hangupBeforeAnswerTest, hangupDuringCallTest} from '../../lib/test-helpers/space-widget/meet';
import {
  sendMessage,
  verifyMessageReceipt
} from '../../lib/test-helpers/space-widget/messaging';

describe('Space Widget Data API Tests', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const spaceWidget = '.ciscospark-space-widget';
  const jobName = jobNames.spaceDataApi;

  let allPassed = true;
  let docbrown, lorraine, marty, participants;
  let conversation, local, remote;

  before('start new sauce session', () => {
    renameJob(jobName, browser);
  });


  before('load browsers', () => {
    browser.url('/data-api/space.html');
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();
    [docbrown, lorraine, marty] = participants;
    registerDevices(participants);
    conversation = createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Group Space'});
  });

  before('inject marty token', () => {
    local = {browser: browserLocal, user: marty, displayName: conversation.displayName};
    local.browser.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-destination-id', spaceId);
      csmmDom.setAttribute('data-destination-type', 'spaceId');
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, marty.token.access_token, conversation.id);
    local.browser.waitForVisible(spaceWidget);
  });

  before('inject docbrown token', () => {
    remote = {browser: browserRemote, user: docbrown, displayName: conversation.displayName};
    remote.browser.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-destination-id', spaceId);
      csmmDom.setAttribute('data-destination-type', 'spaceId');
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, docbrown.token.access_token, conversation.id);
    remote.browser.waitForVisible(spaceWidget);
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
        browserLocal.waitForVisible(elements.callButton);
      });
    });

    describe('during call experience', () => {
      it('can hangup before answer', () => {
        hangupBeforeAnswerTest(browserLocal, browserRemote);
      });

      it('can decline an incoming call', () => {
        declineIncomingCallTest(browserLocal, browserRemote, true);
      });

      it('can hangup in call', () => {
        hangupDuringCallTest(browserLocal, browserRemote, true);
      });
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

