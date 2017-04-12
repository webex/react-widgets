/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-conversation';
import {switchToMessage} from '../../../lib/menu';

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
      .url(`/widget-message-meet/production.html`)
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

  before(`inject token`, () => {
    if (process.env.DEBUG_JOURNEYS) {
      console.info(`RUN THE FOLLOWING CODE BLOCK TO RERUN THIS TEST FROM DEV TOOLS`);
      console.info();
      console.info(`window.openWidget("${spock.token.access_token}", "${mccoy.email}");`);
      console.info();
      console.info();

      console.info(`RUN THE FOLLOWING CODE BLOCK TO RERUN THIS REMOTE TEST FROM DEV TOOLS`);
      console.info();
      console.info(`window.openWidget("${mccoy.token.access_token}", "${spock.email}");`);
      console.info();
      console.info();
    }

    browserLocal.execute((localAccessToken, localToUserEmail) => {
      window.openWidget(localAccessToken, localToUserEmail);
    }, spock.token.access_token, mccoy.email);
    browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
  });

  describe(`meet widget`, () => {
    before(`open remote widget`, () => {
      browserRemote.execute((localAccessToken, localToUserEmail) => {
        window.openWidget(localAccessToken, localToUserEmail);
      }, mccoy.token.access_token, spock.email);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
    });

    beforeEach(`widget switches to message`, () => {
      switchToMessage(browserLocal);
      switchToMessage(browserRemote);
    });

    it(`sends and receives messages`, () => {
      // Increase wait timeout for message delivery
      browser.timeouts(`implicit`, 10000);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
      assert.match(browserLocal.getText(`.ciscospark-system-message`), /You created this conversation/);
      browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
      // Remote is now ready, send a message to it
      browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `Oh, I am sorry, Doctor. Were we having a good time?\n`);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Oh, I am sorry, Doctor. Were we having a good time?`);
      // Send a message back
      browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `God, I liked him better before he died.\n`);
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `God, I liked him better before he died.`);
    });

    it(`sends and deletes message`);

    it(`sends message with markdown`);

    it(`sends message with pdf attachment`);

    it(`sends message with gif attachment`);

    it(`sends message with jpg attachment`);

    it(`sends message with png attachment`);

    it(`sends and flags message`);

  });
});
