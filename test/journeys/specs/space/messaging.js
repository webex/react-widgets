import {assert} from 'chai';

import allMessagingTests from '../../lib/constructors/messaging';
import {
  createTestUsers,
  createSpace,
  sendMessage,
  registerDevices
} from '../../lib/sdk';
import MessageWidgetPage from '../../lib/widgetPages/space/messaging';
import runAxe from '../../lib/axe';


export default function groupMessageTests(type) {
  const widgetInit = {
    dataApi: 'loadWithDataApi',
    global: 'loadWithGlobals'
  }[type];

  describe(`Widget Space: Group - Messaging (${type})`, () => {
    const localPage = new MessageWidgetPage({aBrowser: browser.select('1')});
    const remotePage = new MessageWidgetPage({aBrowser: browser.select('2')});

    let docbrown, lorraine, marty, space;

    before('initialize test users', function intializeUsers() {
      [marty, docbrown, lorraine] = createTestUsers(3);
      localPage.user = docbrown;
      remotePage.user = marty;

      registerDevices([marty, lorraine]);

      browser.waitUntil(() =>
        marty.spark.internal.device.userId &&
        lorraine.spark.internal.device.userId,
      15000, 'failed to register user devices');
    });

    describe('Setup', () => {
      it('creates group space', function createOneOnOneSpace() {
        this.retries(2);

        space = createSpace({
          displayName: 'Test Widget Space',
          sparkInstance: marty.spark,
          participants: [marty, docbrown, lorraine]
        });

        browser.waitUntil(() =>
          space && space.id,
        15000, 'failed to create one on one space');
      });

      it('loads browsers and widgets', function loadBrowsers() {
        this.retries(3);

        localPage.open('./space.html');
        remotePage.open('./space.html');

        localPage[widgetInit]({
          spaceId: space.id,
          initialActivity: 'message'
        });

        remotePage[widgetInit]({
          spaceId: space.id,
          initialActivity: 'message'
        });

        browser.waitUntil(() =>
          localPage.hasMessageWidget,
        10000, 'failed to load local widget');

        browser.waitUntil(() =>
          remotePage.hasMessageWidget,
        10000, 'failed to load remote widget');
      });
    });

    describe('Main Tests', function main() {
      beforeEach(function testName() {
        const title = `Space - Messaging - ${this.currentTest.title}`;
        localPage.setPageTestName(title);
        remotePage.setPageTestName(title);
      });

      allMessagingTests({
        localPage,
        remotePage
      });

      describe('Multiple User Messaging Tests', () => {
        it('sends and receives messages', () => {
          const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
          remotePage.sendMessage(martyText);
          localPage.verifyMessageReceipt(martyText);

          const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
          localPage.sendMessage(docText);
          remotePage.verifyMessageReceipt(docText);

          const lorraineText = 'Marty, will we ever see you again?';
          browser.call(() => sendMessage({
            sparkInstance: lorraine.spark,
            space,
            message: lorraineText
          }));
          localPage.verifyMessageReceipt(lorraineText);
          remotePage.verifyMessageReceipt(lorraineText);

          const martyText2 = 'I guarantee it.';
          localPage.sendMessage(martyText2);
          remotePage.verifyMessageReceipt(martyText2);
        });
      });

      describe('accessibility', () => {
        it('should have no accessibility violations', () =>
          runAxe(localPage.browser, 'ciscospark-widget')
            .then((results) => {
              assert.equal(results.violations.length, 0);
            }));
      });
    });
  });
}

['dataApi', 'global'].forEach((type) => groupMessageTests(type));
