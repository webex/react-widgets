import testUsers from '@ciscospark/test-helper-test-users';


import {elements} from '../../../lib/test-helpers/space-widget/main.js';
import {answer, hangup} from '../../../lib/test-helpers/space-widget/meet.js';

describe('Widget Space: One on One', () => {
  describe('Data API Settings', () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let mccoy, spock;

    before('initalize', () => {
      browser
        .url('/data-api/space.html')
        .execute(() => {
          localStorage.clear();
        });
      testUsers.create({count: 1, config: {displayName: 'Mr Spock'}})
        .then((users) => { [spock] = users; });
      testUsers.create({count: 1, config: {displayName: 'Bones Mccoy'}})
        .then((users) => { [mccoy] = users; });
      browser.pause(5000);
    });

    describe('initial activity setting: meet', () => {
      it('opens meet widget', () => {
        browserLocal.execute((localAccessToken, localToUserEmail) => {
          const csmmDom = document.createElement('div');
          csmmDom.setAttribute('class', 'ciscospark-widget');
          csmmDom.setAttribute('data-toggle', 'ciscospark-space');
          csmmDom.setAttribute('data-access-token', localAccessToken);
          csmmDom.setAttribute('data-to-person-email', localToUserEmail);
          csmmDom.setAttribute('data-initial-activity', 'meet');
          document.getElementById('ciscospark-widget').appendChild(csmmDom);
          window.loadBundle('/dist-space/bundle.js');
        }, spock.token.access_token, mccoy.email);
        browserLocal.waitForVisible(elements.meetButton);
      });

      after('refresh browsers to remove widgets', browser.refresh);
    });

    describe('initial activity setting: message', () => {
      it('opens message widget', () => {
        browserLocal.execute((localAccessToken, localToUserEmail) => {
          const csmmDom = document.createElement('div');
          csmmDom.setAttribute('class', 'ciscospark-widget');
          csmmDom.setAttribute('data-toggle', 'ciscospark-space');
          csmmDom.setAttribute('data-access-token', localAccessToken);
          csmmDom.setAttribute('data-to-person-email', localToUserEmail);
          csmmDom.setAttribute('data-initial-activity', 'message');
          document.getElementById('ciscospark-widget').appendChild(csmmDom);
          window.loadBundle('/dist-space/bundle.js');
        }, spock.token.access_token, mccoy.email);
        browserLocal.waitForVisible(elements.activityList);
      });

      after('refresh browsers to remove widgets', browser.refresh);
    });

    describe('start call setting', () => {
      it('starts call when set to true', () => {
        browserRemote.execute((localAccessToken, localToUserEmail) => {
          const csmmDom = document.createElement('div');
          csmmDom.setAttribute('class', 'ciscospark-widget');
          csmmDom.setAttribute('data-toggle', 'ciscospark-space');
          csmmDom.setAttribute('data-access-token', localAccessToken);
          csmmDom.setAttribute('data-to-person-email', localToUserEmail);
          csmmDom.setAttribute('data-initial-activity', 'meet');
          document.getElementById('ciscospark-widget').appendChild(csmmDom);
          window.loadBundle('/dist-space/bundle.js');
        }, mccoy.token.access_token, spock.email);

        browserLocal.execute((localAccessToken, localToUserEmail) => {
          const csmmDom = document.createElement('div');
          csmmDom.setAttribute('class', 'ciscospark-widget');
          csmmDom.setAttribute('data-toggle', 'ciscospark-space');
          csmmDom.setAttribute('data-access-token', localAccessToken);
          csmmDom.setAttribute('data-to-person-email', localToUserEmail);
          csmmDom.setAttribute('data-initial-activity', 'meet');
          csmmDom.setAttribute('data-start-call', true);
          document.getElementById('ciscospark-widget').appendChild(csmmDom);
          window.loadBundle('/dist-space/bundle.js');
        }, spock.token.access_token, mccoy.email);

        browserRemote.waitForVisible(elements.meetButton);
        browserLocal.waitForVisible(elements.meetWidget);

        answer(browserRemote);
        hangup(browserLocal);
      });

      after('refresh browsers to remove widgets', browser.refresh);
    });
  });
});
