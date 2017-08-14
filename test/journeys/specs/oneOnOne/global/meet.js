/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';

import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {clearEventLog} from '../../../lib/events';
import {constructHydraId} from '../../../lib/hydra';
import {elements, answer, call, decline, hangup} from '../../../lib/test-helpers/space-widget/meet';

describe(`Widget Space: One on One`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let mccoy, spock;
  process.env.CISCOSPARK_SCOPE = [
    `webexsquare:get_conversation`,
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
      .url(`/?meet`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create spock`, () => testUsers.create({count: 1, config: {displayName: `Mr Spock`}})
    .then((users) => {
      [spock] = users;
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, config: {displayName: `Bones Mccoy`}})
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
      window.openSpaceWidget(options);
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
      window.openSpaceWidget(options);
    }, mccoy.token.access_token, spock.email);
    browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
  });

  describe(`meet widget`, () => {
    describe(`pre call experience`, () => {
      it(`has a call button`, () => {
        switchToMeet(browserLocal);
        browserLocal.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });
    });

    describe(`during call experience`, () => {
      it(`can hangup before answer`, () => {
        switchToMeet(browserLocal);
        call(browserLocal, browserRemote);
        hangup(browserLocal);
        browserRemote.element(elements.meetWidget).element(elements.callButton).waitForVisible();
      });

      it(`can decline an incoming call`, () => {
        switchToMeet(browserRemote);
        call(browserRemote, browserLocal);
        decline(browserLocal);
        browserRemote.element(elements.meetWidget).element(elements.callButton).waitForVisible();
        // Pausing to let locus session flush
        browserLocal.pause(10000);
      });

      it(`can hangup in call`, () => {
        clearEventLog(browserLocal);
        clearEventLog(browserRemote);
        switchToMeet(browserLocal);
        call(browserLocal, browserRemote);
        answer(browserRemote);
        hangup(browserLocal);
        // Should switch back to message widget after hangup
        browserLocal.waitForVisible(elements.messageWidget);
      });

      it(`has proper call event data`, () => {
        const result = browserLocal.execute(() => {
          const events = window.ciscoSparkEvents.map((event) => {
            // Passing the call object from the browser causes an overflow
            Reflect.deleteProperty(event.detail.data, `call`);
            return event;
          });
          return events;
        });
        const events = result.value;
        const eventCreated = events.find((event) => event.eventName === `calls:created`);
        const eventConnected = events.find((event) => event.eventName === `calls:connected`);
        const eventDisconnected = events.find((event) => event.eventName === `calls:disconnected`);
        assert.isDefined(eventCreated, `has a calls ringing event`);
        assert.isDefined(eventConnected, `has a calls connected event`);
        assert.isDefined(eventDisconnected, `has a calls disconnected event`);
        assert.containsAllKeys(eventCreated.detail, [`resource`, `event`, `actorId`, `data`]);
        assert.containsAllKeys(eventConnected.detail, [`resource`, `event`, `actorId`, `data`]);
        assert.containsAllKeys(eventDisconnected.detail, [`resource`, `event`, `actorId`, `data`]);
        assert.containsAllKeys(eventCreated.detail.data, [`actorName`, `roomId`]);
        assert.containsAllKeys(eventConnected.detail.data, [`actorName`, `roomId`]);
        assert.containsAllKeys(eventDisconnected.detail.data, [`actorName`, `roomId`]);
        assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, spock.id));
        assert.equal(eventConnected.detail.actorId, constructHydraId(`PEOPLE`, spock.id));
        assert.equal(eventDisconnected.detail.actorId, constructHydraId(`PEOPLE`, spock.id));
        assert.equal(eventCreated.detail.data.actorName, spock.displayName);
        assert.equal(eventConnected.detail.data.actorName, spock.displayName);
        assert.equal(eventDisconnected.detail.data.actorName, spock.displayName);
      });
    });
  });
});
