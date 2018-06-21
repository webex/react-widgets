import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

import setupTestUserJwt from '../../../lib/test-users';
import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {
  messageTests,
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';
import {elements as meetElements, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';
import {updateJobStatus} from '../../../lib/test-helpers';

describe('Widget Space: One on One', () => {
  describe('Global: Guest', () => {
    let mccoy, spock;
    let allPassed = true;

    const jobName = 'react-widget-oneOnOne-global';
    const mccoyName = 'Bones Mccoy';
    const spockName = 'Mr Spock';
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');

    before('create test users', () => Promise.all([
      setupTestUserJwt({displayName: spockName}).then((guestUser) => {
        spock = guestUser;
      }),
      // create standard user
      testUsers.create({count: 1, config: {displayName: mccoyName}})
        .then((users) => {
          [mccoy] = users;
        })
    ]));

    it('can load the widget for the guest user to the standard user', () => {
      browserLocal.url('/space.html?guest');

      const title = browserLocal.getTitle();
      assert.equal(title, 'Cisco Spark Widget Test');

      browserLocal.execute((localGuestToken, localToUserEmail) => {
        const options = {
          guestToken: localGuestToken,
          destinationId: localToUserEmail,
          destinationType: 'email',
          initialActivity: 'message'
        };
        window.openSpaceWidget(options);
      }, spock.jwt, mccoy.email);

      browserLocal.waitForVisible('h1.ciscospark-title');
      browserLocal.waitUntil(() => browserLocal.getText('h1.ciscospark-title') !== 'Loading...');
      assert.equal(browserLocal.getText('h1.ciscospark-title'), mccoy.displayName);
    });

    it('can load the widget for the standard user to the guest user', () => {
      browserRemote.url('/space.html?guest');

      const title = browserRemote.getTitle();
      assert.equal(title, 'Cisco Spark Widget Test');

      // We have to use the guest id instead of email because (currently)
      // the guest generated email isn't a real email and convo service
      // throws an error on email validation
      browserRemote.execute((localAccessToken, localToPersonId) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          destinationId: localToPersonId,
          destinationType: 'userId',
          initialActivity: 'message'
        };
        window.openSpaceWidget(options);
      }, mccoy.token.access_token, spock.id);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
    });

    describe('message widget', () => {
      let local, remote;
      before('create test objects for message suite', () => {
        local = {browser: browser.select('browserLocal'), displayName: spockName, user: spock};
        remote = {browser: browser.select('browserRemote'), displayName: mccoyName, user: mccoy};
      });

      it('sends and receives messages', () => {
        const message = 'Oh, I am sorry, Doctor. Were we having a good time?';
        sendMessage(local, remote, message);
        verifyMessageReceipt(remote, local, message);
      });

      it('receives proper events on messages', () => {
        messageTests.messageEventTest(local, remote);
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
        it('can hangup in call', () => {
          hangupDuringCallTest(browserLocal, browserRemote);
        });

        it('can decline an incoming call', () => {
          declineIncomingCallTest(browserLocal, browserRemote);
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
  });
});
