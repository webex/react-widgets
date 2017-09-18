/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';

import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {constructHydraId} from '../../../lib/hydra';

describe(`Widget Message Meet`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let mccoy, spock;
  process.env.CISCOSPARK_SCOPE = [
    `webexsquare:get_conversation`,
    `Identity:SCIM`,
    `spark:people_read`,
    `spark:rooms_read`,
    `spark:rooms_write`,
    `spark:memberships_read`,
    `spark:memberships_write`,
    `spark:messages_read`,
    `spark:messages_write`,
    `spark:teams_read`,
    `spark:teams_write`,
    `spark:team_memberships_read`,
    `spark:team_memberships_write`,
    `spark:kms`
  ].join(` `);

  before(`load browsers`, () => {
    browser
      .url(`/message-meet.html`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create spock`, () => testUsers.create({count: 1, displayName: `spock`})
    .then((users) => {
      [spock] = users;
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, displayName: `mccoy`})
    .then((users) => {
      [mccoy] = users;
    }));

  before(`pause to let test users establish`, () => browser.pause(7500));

  before(`open local widget spock`, () => {
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          // eslint-disable-next-line object-shorthand
          window.ciscoSparkEvents.push({eventName: eventName, detail: detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openWidgetMessageMeet(options);
    }, spock.token.access_token, mccoy.email);
    browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`, 30000);
  });

  before(`open remote widget mccoy`, () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          // eslint-disable-next-line object-shorthand
          window.ciscoSparkEvents.push({eventName: eventName, detail: detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openWidgetMessageMeet(options);
    }, mccoy.token.access_token, spock.email);
    browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
  });

  describe(`meet widget`, () => {
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    const messageWidget = `.ciscospark-message-component-wrapper`;
    const callButton = `button[aria-label="Call"]`;
    const answerButton = `button[aria-label="Answer"]`;
    const declineButton = `button[aria-label="Decline"]`;
    const hangupButton = `button[aria-label="Hangup"]`;
    const callControls = `.call-controls`;
    const remoteVideo = `.remote-video video`;

    describe(`pre call experience`, () => {
      it(`has a call button`, () => {
        switchToMeet(browserLocal);
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
      });
    });

    describe(`during call experience`, () => {
      it(`can hangup before answer`, () => {
        switchToMeet(browserLocal);
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserLocal.element(meetWidget).element(callButton).click();
        // wait for call to establish
        browserRemote.waitForVisible(answerButton);
        // Call controls currently has a hover state
        browserLocal.moveToObject(meetWidget);
        browserLocal.waitForVisible(callControls);
        browserLocal.moveToObject(hangupButton);
        browserLocal.element(meetWidget).element(hangupButton).click();
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserRemote.element(meetWidget).element(callButton).waitForVisible();
      });

      it(`can decline an incoming call`, () => {
        switchToMeet(browserRemote);
        browserRemote.element(meetWidget).element(callButton).waitForVisible();
        browserRemote.element(meetWidget).element(callButton).click();
        browserLocal.waitForVisible(declineButton);
        browserLocal.element(meetWidget).element(declineButton).click();
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserRemote.element(meetWidget).element(callButton).waitForVisible();
        // Pausing to let locus session flush
        browserLocal.pause(10000);
      });

      it(`can hangup in call`, () => {
        clearEventLog(browserLocal);
        switchToMeet(browserLocal);
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserLocal.element(meetWidget).element(callButton).click();
        browserRemote.waitForVisible(answerButton);
        browserRemote.element(meetWidget).element(answerButton).click();
        browserRemote.waitForVisible(remoteVideo);
        // Let call elapse 5 seconds before hanging up
        browserLocal.pause(5000);
        browserLocal.moveToObject(meetWidget);
        browserLocal.waitForVisible(callControls);
        browserLocal.moveToObject(hangupButton);
        browserLocal.element(meetWidget).element(hangupButton).click();
        // Should switch back to message widget after hangup
        browserLocal.waitForVisible(messageWidget);
      });

      it(`has proper call event data`, () => {
        const events = getEventLog(browserLocal);
        const eventRinging = events.find((event) => event.eventName === `calls:ringing`);
        const eventConnected = events.find((event) => event.eventName === `calls:connected`);
        const eventDisconnected = events.find((event) => event.eventName === `calls:disconnected`);
        assert.isDefined(eventRinging, `has a calls ringing event`);
        assert.isDefined(eventConnected, `has a calls connected event`);
        assert.isDefined(eventDisconnected, `has a calls disconnected event`);
        assert.containsAllKeys(eventRinging.detail, [`resource`, `event`, `actorId`, `data`]);
        assert.containsAllKeys(eventConnected.detail, [`resource`, `event`, `actorId`, `data`]);
        assert.containsAllKeys(eventDisconnected.detail, [`resource`, `event`, `actorId`, `data`]);
        assert.equal(eventRinging.detail.actorId, constructHydraId(`PEOPLE`, spock.id));
        assert.equal(eventConnected.detail.actorId, constructHydraId(`PEOPLE`, spock.id));
        assert.equal(eventDisconnected.detail.actorId, constructHydraId(`PEOPLE`, spock.id));
      });
    });

    afterEach(`logs errors`, () => {
      const logsRemote = browserRemote.log(`browser`).value;
      console.info(`browerRemote logs:`);
      logsRemote.forEach((log) => {
        if (log.level === `SEVERE`) {
          console.info(log.message);
        }
      });
      const logsLocal = browserLocal.log(`browser`).value;
      console.info(`browserLocal logs:`);
      logsLocal.forEach((log) => {
        if (log.level === `SEVERE`) {
          console.info(log.message);
        }
      });
    });
  });
});
