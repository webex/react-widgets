import testUsers from '@ciscospark/test-helper-test-users';

import {moveMouse} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/space-widget/main.js';
import {answer, hangup, elements as meetElements} from '../../../lib/test-helpers/space-widget/meet.js';

describe('Widget Space: One on One: Data API Settings', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
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

  describe('initial activity setting: meet', () => {
    before('inject token', () => {
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
      browserLocal.waitForVisible(elements.meetWidget);
    });

    it('opens meet widget', () => {
      browserLocal.element(elements.meetWidget).element(elements.meetButton).waitForVisible();
      browserLocal.refresh();
    });
  });

  describe('initial activity setting: message', () => {
    before('inject token', () => {
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
    });

    it('opens message widget', () => {
      browserLocal.waitForVisible(elements.messageWidget);
      browserLocal.refresh();
    });
  });

  describe('start call setting', () => {
    before('inject token', () => {
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
      browserRemote.waitForVisible(elements.meetButton);
    });

    before('inject token', () => {
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
      browserLocal.waitForVisible(elements.meetWidget);
    });

    it('starts call when set to true', () => {
      answer(browserRemote);
      moveMouse(browserLocal, meetElements.callContainer);
      hangup(browserLocal);
      browserLocal.refresh();
      browserRemote.refresh();
    });
  });
});
