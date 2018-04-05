import {assert} from 'chai';

import allMessagingTests from '../../lib/constructors/messaging';
import {
  createTestUsers,
  createSpace
} from '../../lib/sdk';
import MessageWidgetPage from '../../lib/widgetPages/space/messaging';
import runAxe from '../../lib/axe';

export default function oneOnOneMessageTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  }[type];

  describe(`Widget Space: One On One - Messaging (${type})`, () => {
    const localPage = new MessageWidgetPage({aBrowser: browser.select('1')});
    const remotePage = new MessageWidgetPage({aBrowser: browser.select('2')});

    let mccoy, spock, space;

    before('initialize test users', function intializeUsers() {
      [mccoy, spock] = createTestUsers(2);
      localPage.user = spock;
      remotePage.user = mccoy;

      browser.call(() => mccoy.spark.internal.device.register());

      assert.exists(spock.spark, 'failed to create mccoy test user');
      assert.exists(mccoy.spark.internal.device.userId, 'failed to register spock devices');
    });

    it('creates one on one space', function createOneOnOneSpace() {
      this.retries(2);
      space = createSpace({
        sparkInstance: mccoy.spark,
        participants: [spock, mccoy]
      });
      assert.exists(space.id, 'failed to create one on one space');
    });

    it('loads browsers and widgets', () => {
      localPage.open('./space.html');
      remotePage.open('./space.html');

      localPage[widgetInit]({
        toPersonEmail: remotePage.user.email,
        initialActivity: 'message'
      });

      remotePage[widgetInit]({
        toPersonEmail: localPage.user.email,
        initialActivity: 'message'
      });

      browser.waitUntil(() =>
        localPage.hasMessageWidget,
      10000, 'failed to load local widget');

      browser.waitUntil(() =>
        remotePage.hasMessageWidget,
      10000, 'failed to load remote widget');
    });

    allMessagingTests({
      localPage,
      remotePage
    });

    describe('accessibility', () => {
      it('should have no accessibility violations', () =>
        runAxe(localPage.browser, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0);
          }));
    });
  });
}

['dataApi', 'global'].forEach((type) => oneOnOneMessageTests(type));
