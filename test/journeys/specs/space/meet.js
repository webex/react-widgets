import allMeetTests from '../../lib/constructors/meet';
import {
  createTestUsers,
  createSpace
} from '../../lib/sdk';
import MeetWidgetPage from '../../lib/widgetPages/space/meet';


export default function groupMeetTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  };

  describe(`Widget Space: Group - Meet (${type})`, function groupMeet() {
    const localPage = new MeetWidgetPage({aBrowser: browser.select('1')});
    const remotePage = new MeetWidgetPage({aBrowser: browser.select('2')});

    let docbrown, lorraine, marty, space;

    before('initialize test users', () => {
      [docbrown, lorraine, marty] = createTestUsers(3);
      localPage.user = marty;
      remotePage.user = docbrown;

      browser.call(() => marty.spark.internal.device.register());

      browser.waitUntil(() => marty.spark.internal.device.userId,
        15000, 'failed to register marty');
    });

    describe('Setup', () => {
      it('creates group space', function createConversation() {
        this.retries(2);
        space = createSpace({
          displayName: 'Test Widget Space',
          sparkInstance: marty.spark,
          participants: [marty, docbrown, lorraine]
        });

        browser.waitUntil(() =>
          space && space.id,
        15000, 'failed to create conversation');
      });

      it('loads browsers and widgets', () => {
        localPage.open('./space.html');
        remotePage.open('./space.html');

        localPage[widgetInit[type]]({
          spaceId: space.id,
          initialActivity: 'meet'
        });

        remotePage[widgetInit[type]]({
          spaceId: space.id,
          initialActivity: 'meet'
        });

        browser.waitUntil(() =>
          localPage.hasCallButton,
        10000, 'failed to load local widget');

        browser.waitUntil(() =>
          remotePage.hasCallButton,
        10000, 'failed to load remote widget');
      });
    });

    describe('Main Tests', function main() {
      beforeEach(function testName() {
        const {title} = this.currentTest;
        localPage.setPageTestName(title);
        remotePage.setPageTestName(title);
      });

      allMeetTests({
        localPage,
        remotePage,
        isGroup: true
      });
    });
  });
}

['dataApi', 'global'].forEach((type) => groupMeetTests(type));
