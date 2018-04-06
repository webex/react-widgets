import {assert} from 'chai';

import {declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/helpers/space-widget/meet';
import {loginAndOpenWidget} from '../../../lib/helpers/tap/space';
import {createTestUsers} from '../../../lib/sdk';
import MessageWidgetPage from '../../../lib/widgetPages/space/messaging';
import MeetWidgetPage from '../../../lib/widgetPages/space/meet';

describe('Widget Space: One on One - TAP', () => {
  const localMeetPage = new MeetWidgetPage({aBrowser: browser.select('1')});
  const localMessagePage = new MessageWidgetPage({aBrowser: browser.select('1')});
  const remoteMeetPage = new MeetWidgetPage({aBrowser: browser.select('2')});
  const remoteMessagePage = new MessageWidgetPage({aBrowser: browser.select('2')});
  let mccoy, spock;

  before('load browsers', () => {
    browser.url('/widget-space/production/demo/index.html?oneOnOne');
  });

  before('initialize test users', function intializeUsers() {
    [mccoy, spock] = createTestUsers(2);
    localMeetPage.user = spock;
    localMessagePage.user = spock;
    remoteMeetPage.user = mccoy;
    remoteMessagePage.user = mccoy;

    assert.exists(mccoy.spark, 'failed to create mccoy test user');
    assert.exists(spock.spark, 'failed to create spock test user');
  });

  it('inject token for spock', () => {
    loginAndOpenWidget(localMeetPage.browser, spock.token.access_token, true, mccoy.email);
    localMeetPage.browser.waitForExist(`[placeholder="Send a message to ${mccoy.displayName}"]`, 30000);
  });

  it('open remote widget for mccoy', () => {
    loginAndOpenWidget(remoteMeetPage.browser, mccoy.token.access_token, true, spock.email);
    remoteMeetPage.browser.waitForExist(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
  });

  describe('Activity Menu', () => {
    it('has a menu button', () => {
      assert.isTrue(localMessagePage.hasActivityMenuButton);
    });

    it('displays the menu when clicking the menu button', () => {
      localMessagePage.openActivityMenu();
    });

    it('has an exit menu button', () => {
      browser.waitUntil(() =>
        localMessagePage.hasExitButton,
      5000, 'exit button not visible after opening activity menu');
    });

    it('closes the menu with the exit button', () => {
      localMessagePage.closeActivityMenu();
    });

    it('switches to message widget', () => {
      localMessagePage.switchToMessage();
    });

    it('switches to meet widget', () => {
      localMessagePage.switchToMeet();
    });
  });

  describe('message widget', () => {
    it('sends and receives messages', () => {
      localMessagePage.switchToMessage();

      const message = 'Oh, I am sorry, Doctor. Were we having a good time?';
      localMessagePage.sendMessage(message);
      remoteMessagePage.verifyMessageReceipt(message);

      localMessagePage.clearEventLog();
      remoteMessagePage.clearEventLog();

      // Send a message back
      const response = 'God, I liked him better before he died.';
      remoteMessagePage.sendMessage(response);
      localMessagePage.verifyMessageReceipt(response);

      const events = localMessagePage.getEventLog();
      const eventCreated = events.find((event) => event.eventName === 'messages:created');
      const eventUnread = events.find((event) => event.eventName === 'rooms:unread');
      assert.isDefined(eventCreated, 'messages:created', 'has a message created event');
      assert.isDefined(eventUnread, 'rooms:unread', 'has an unread message event');
    });
  });

  describe('meet widget', () => {
    describe('pre call experience', () => {
      it('has a call button', () => {
        localMeetPage.switchToMeet();
        browser.waitUntil(() =>
          localMeetPage.hasCallButton,
        5000, 'call button is not visible after switching to meet widget');
      });
    });

    describe('during call experience', () => {
      it('can hangup in call', () => {
        hangupDuringCallTest({localPage: localMeetPage, remotePage: remoteMeetPage});
      });

      it('can decline an incoming call', () => {
        declineIncomingCallTest({localPage: localMeetPage, remotePage: remoteMeetPage});
      });
    });
  });
});
