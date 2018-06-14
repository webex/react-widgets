import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

import setupTestUserJwt from '../../../lib/test-users';
import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {updateJobStatus} from '../../../lib/test-helpers';
import {
  sendMessage,
  verifyMessageReceipt
} from '../../../lib/test-helpers/space-widget/messaging';
import {elements as meetElements, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';

describe('Widget Space: One on One', () => {
  describe('Data API: Guest', () => {
    let mccoy, spock;
    let allPassed = true;

    const mccoyName = 'Bones Mccoy';
    const spockName = 'Guest Spock';
    const jobName = 'react-widget-oneOnOne-dataApi';
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
      browserLocal.url('/data-api/space.html');

      const title = browserLocal.getTitle();
      assert.equal(title, 'Cisco Spark Widget Test');

      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-guest-token', localAccessToken);
        csmmDom.setAttribute('data-destination-id', localToUserEmail);
        csmmDom.setAttribute('data-destination-type', 'email');
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, spock.jwt, mccoy.email);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);

      browserLocal.waitForVisible('h1.ciscospark-title');
      browserLocal.waitUntil(() => browserLocal.getText('h1.ciscospark-title') !== 'Loading...');
      assert.equal(browserLocal.getText('h1.ciscospark-title'), mccoy.displayName);
    });

    it('can load the widget for the standard user to the guest user', () => {
      browserRemote.url('/data-api/space.html');

      const title = browserRemote.getTitle();
      assert.equal(title, 'Cisco Spark Widget Test');

      browserRemote.execute((localAccessToken, localToPersonId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-destination-id', localToPersonId);
        csmmDom.setAttribute('data-destination-type', 'userId');
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
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
