import {setupOneOnOneUsers} from '../../lib/test-helpers';

import {elements} from '../../lib/test-helpers/space-widget/main.js';
import {answer, hangup} from '../../lib/test-helpers/space-widget/meet.js';

describe('Widget Space: One on One - Data API Settings', () => {
  const browserLocal = browser.select('1');
  const browserRemote = browser.select('2');
  let mccoy, spock;

  before('initialize test users', () => {
    ({mccoy, spock} = setupOneOnOneUsers());
  });

  it('loads browser', function loadBrowser() {
    browser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });
  });

  it('opens meet widget when set as initial activity', function meetActivity() {
    this.retries(2);

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
    browser.waitUntil(() =>
      browserLocal.isVisible(elements.meetButton),
    5000, 'failed to load widget with meet initial activity');
  });

  it('opens message widget when set as initial activity', function messageActivity() {
    this.retries(2);

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
    browser.waitUntil(() =>
      browserLocal.isVisible(elements.activityList),
    5000, 'failed to load widget with message initial activity');
  });


  it('starts call when start call is set to true', function startCall() {
    this.retries(2);

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

    browser.waitUntil(() =>
      browserRemote.isVisible(elements.meetButton) &&
      browserLocal.isVisible(elements.meetWidget),
    5000, 'failed to load widget with message initial activity');

    answer(browserRemote);
    hangup(browserLocal);
  });

  afterEach(browser.refresh);
});
