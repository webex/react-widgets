
import {
  setupGroupTestUsers,
  loadWithDataApi
} from '../../lib/test-helpers';
import {elements} from '../../lib/test-helpers/space-widget/main';
import {answer, hangup} from '../../lib/test-helpers/space-widget/meet';
import {constructHydraId} from '../../lib/hydra';

describe('Widget Space: Group - Data API Settings', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const spaceWidget = '.ciscospark-space-widget';
  let docbrown, lorraine, marty;
  let conversation;

  before('intialize test users', () => {
    ({docbrown, lorraine, marty} = setupGroupTestUsers());

    marty.spark.internal.device.register();

    browser.waitUntil(() =>
      marty.spark.internal.device.userId,
    15000, 'failed to register user devices');
  });

  it('creates group space', function createSpace() {
    this.retries(2);

    marty.spark.internal.conversation.create({
      displayName: 'Test Widget Space',
      participants: [marty, docbrown, lorraine]
    }).then((c) => {
      conversation = c;
      return conversation;
    });

    browser.waitUntil(() => conversation && conversation.id, 5000, 'failed to create group space');
  });

  it('loads browser', function loadBrowser() {
    browser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });
  });

  it('opens meet widget when set as intial activity', function meetActivity() {
    this.retries(2);

    loadWithDataApi({
      aBrowser: browserLocal,
      bundle: '/dist-space/bundle.js',
      accessToken: marty.token.access_token,
      spaceId: conversation.id,
      initialActivity: 'meet'
    });

    browser.waitUntil(() =>
      browserLocal.isVisible(elements.meetButton),
    5000, 'failed to load widget with meet initial activity');
  });

  it('opens message widget when set as initial activity', function messageActivity() {
    this.retries(2);

    loadWithDataApi({
      aBrowser: browserLocal,
      bundle: '/dist-space/bundle.js',
      accessToken: marty.token.access_token,
      spaceId: conversation.id,
      initialActivity: 'message'
    });

    browser.waitUntil(() =>
      browserLocal.isVisible(elements.activityList),
    5000, 'failed to load widget with message initial activity');
  });

  it('starts call when start call is set to true', function startCall() {
    this.retries(2);

    loadWithDataApi({
      aBrowser: browserRemote,
      bundle: '/dist-space/bundle.js',
      accessToken: docbrown.token.access_token,
      spaceId: conversation.id,
      initialActivity: 'message'
    });

    loadWithDataApi({
      aBrowser: browserLocal,
      bundle: '/dist-space/bundle.js',
      accessToken: marty.token.access_token,
      spaceId: conversation.id,
      initialActivity: 'meet',
      startCall: true
    });

    browser.waitUntil(() =>
      browserLocal.isVisible(spaceWidget) &&
      browserRemote.isVisible(spaceWidget),
    15000, 'does not load local browser');

    answer(browserRemote);
    hangup(browserLocal);
  });

  it('opens using hydra id', function withHydraIds() {
    this.retries(2);

    loadWithDataApi({
      aBrowser: browserRemote,
      bundle: '/dist-space/bundle.js',
      accessToken: docbrown.token.access_token,
      spaceId: constructHydraId('ROOM', conversation.id)
    });

    loadWithDataApi({
      aBrowser: browserLocal,
      bundle: '/dist-space/bundle.js',
      accessToken: marty.token.access_token,
      spaceId: constructHydraId('ROOM', conversation.id)
    });

    browser.waitUntil(() =>
      browserLocal.isVisible(spaceWidget) &&
      browserRemote.isVisible(spaceWidget),
    15000, 'does not load local browser');

    browser.waitUntil(() =>
      browserLocal.isVisible(elements.activityList) &&
      browserRemote.isVisible(elements.activityList),
    5000, 'failed to load widget with message initial activity');
  });

  afterEach(browser.refresh);
});
