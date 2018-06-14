import testUsers from '@ciscospark/test-helper-test-users';

import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {elements, hangupBeforeAnswerTest, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';
import {updateJobStatus} from '../../../lib/test-helpers';

describe('Widget Space: One on One: Data API', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = 'react-widget-oneOnOne-dataApi';
  let allPassed = true;
  let mccoy, spock;

  before('load browsers', () => {
    browser.url('/data-api/space.html');
  });

  before('create spock', () => testUsers.create({count: 1, config: {displayName: 'Mr Spock'}})
    .then((users) => {
      [spock] = users;
    }));

  before('create mccoy', () => testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
    .then((users) => {
      [mccoy] = users;
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  before('open local widget spock', () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-destination-id', localToUserEmail);
      csmmDom.setAttribute('data-destination-type', 'email');
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, spock.token.access_token, mccoy.email);
    browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
  });

  before('open remote widget mccoy', () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-destination-id', localToUserEmail);
      csmmDom.setAttribute('data-destination-type', 'email');
      csmmDom.setAttribute('data-initial-activity', 'message');
      csmmDom.setAttribute('on-event', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js');
    }, mccoy.token.access_token, spock.email);
    browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
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
        declineIncomingCallTest(browserLocal, browserRemote);
      });

      it('can hangup in call', () => {
        hangupDuringCallTest(browserLocal, browserRemote);
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
