import {
  createTestUsers,
  createSpace
} from '../../lib/sdk';
import {constructHydraId} from '../../lib/hydra';
import MeetWidgetPage from '../../lib/widgetPages/space/meet';

describe('Widget Space: Group - Data API Settings', () => {
  const localPage = new MeetWidgetPage({aBrowser: browser.select('1')});
  const remotePage = new MeetWidgetPage({aBrowser: browser.select('2')});
  let docbrown, lorraine, marty, space;

  before('intialize test users', () => {
    [docbrown, lorraine, marty] = createTestUsers(3);
    localPage.user = marty;
    remotePage.user = docbrown;

    marty.spark.internal.device.register();

    browser.waitUntil(() =>
      marty.spark.internal.device.userId,
    15000, 'failed to register user devices');
  });

  describe('Setup', () => {
    it('creates group space', function createGroupSpace() {
      this.retries(2);

      space = createSpace({
        sparkInstance: marty.spark,
        displayName: 'Test Widget Space',
        participants: [marty, docbrown, lorraine]
      });

      browser.waitUntil(() =>
        space && space.id,
      5000, 'failed to create group space');
    });

    it('loads browser', function loadBrowser() {
      localPage.open('./space.html');
      remotePage.open('./space.html');
    });
  });

  describe('Main Tests', function main() {
    beforeEach(function testName() {
      const title = `Space - Data API Settings - ${this.currentTest.title}`;
      localPage.setPageTestName(title);
      remotePage.setPageTestName(title);
    });

    it('opens meet widget when set as intial activity', function meetActivity() {
      this.retries(2);

      localPage.loadWithDataApi({
        spaceId: space.id,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        localPage.hasMeetWidget,
      5000, 'failed to load widget with meet initial activity');
    });

    it('opens message widget when set as initial activity', function messageActivity() {
      this.retries(2);

      localPage.loadWithDataApi({
        spaceId: space.id,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        localPage.hasMeetWidget,
      5000, 'failed to load widget with meet initial activity');
    });

    it('starts call when start call is set to true', function startCall() {
      this.retries(2);

      remotePage.loadWithDataApi({
        spaceId: space.id,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        remotePage.hasCallButton,
      5000, 'failed to load widget with meet initial activity');

      localPage.loadWithDataApi({
        spaceId: space.id,
        startCall: true,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        localPage.hasMeetWidget,
      5000, 'failed to load widget with meet initial activity');

      remotePage.answerCall();
      localPage.hangupCall();

      browser.waitUntil(() =>
        localPage.hasMessageWidget,
      20000, 'browserLocal failed to return to message activity after hanging up a call');
      remotePage.hangupCall();
      // Should switch back to message widget after hangup
      browser.waitUntil(() =>
        remotePage.hasMessageWidget,
      20000, 'browserRemote failed to return to message activity after hanging up a call');
    });

    it('opens using hydra id', function withHydraIds() {
      this.retries(2);

      remotePage.loadWithDataApi({
        spaceId: constructHydraId('ROOM', space.id)
      });

      localPage.loadWithDataApi({
        spaceId: constructHydraId('ROOM', space.id)
      });

      browser.waitUntil(() =>
        localPage.hasMessageWidget &&
        remotePage.hasMessageWidget,
      15000, 'does not load message widget');

      browser.waitUntil(() =>
        localPage.hasActivityList &&
        remotePage.hasActivityList,
      5000, 'failed to load widget with activity');
    });
  });
});
