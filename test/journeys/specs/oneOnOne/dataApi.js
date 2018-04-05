import {
  createTestUsers,
  createSpace
} from '../../lib/sdk';
import MeetWidgetPage from '../../lib/widgetPages/space/meet';

describe('Widget Space: One on One - Data API Settings', () => {
  const localPage = new MeetWidgetPage({aBrowser: browser.select('1')});
  const remotePage = new MeetWidgetPage({aBrowser: browser.select('2')});
  let mccoy, spock, space;

  before('initialize test users', () => {
    [mccoy, spock] = createTestUsers(2);
    localPage.user = spock;
    remotePage.user = mccoy;

    browser.call(() => spock.spark.internal.device.register());

    browser.waitUntil(() =>
      spock.spark.internal.device.userId,
    15000, 'failed to register user devices');
  });

  describe('Setup', () => {
    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);
      space = createSpace({
        sparkInstance: spock.spark,
        participants: [spock, mccoy]
      });

      browser.waitUntil(() =>
        space && space.id,
      15000, 'failed to create one on one space');
    });

    it('loads browser', function loadBrowser() {
      localPage.open('./space.html');
      remotePage.open('./space.html');
    });
  });

  describe('Main Tests', () => {
    beforeEach(function testName() {
      const {title} = this.currentTest;
      localPage.setPageTestName(title);
      remotePage.setPageTestName(title);
    });

    it('opens meet widget when set as initial activity', function meetActivity() {
      this.retries(2);

      localPage.loadWithDataApi({
        toPersonEmail: mccoy.email,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        localPage.hasMeetWidget,
      5000, 'failed to load widget with meet initial activity');
    });

    it('opens message widget when set as initial activity', function messageActivity() {
      this.retries(2);

      localPage.loadWithDataApi({
        toPersonEmail: mccoy.email,
        initialActivity: 'message'
      });

      browser.waitUntil(() =>
        localPage.hasMessageWidget,
      5000, 'failed to load widget with message initial activity');
    });

    it('starts call when start call is set to true', function startCall() {
      this.retries(2);

      remotePage.loadWithDataApi({
        toPersonEmail: spock.email,
        initialActivity: 'meet'
      });

      browser.waitUntil(() =>
        remotePage.hasCallButton,
      5000, 'failed to load widget with meet initial activity');

      localPage.loadWithDataApi({
        toPersonEmail: mccoy.email,
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
      // Should switch back to message widget after hangup
      browser.waitUntil(() =>
        remotePage.hasMessageWidget,
      20000, 'browserRemote failed to return to message activity after hanging up a call');
    });
  });
});
