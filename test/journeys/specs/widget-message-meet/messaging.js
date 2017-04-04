/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-conversation';
import CiscoSpark from '@ciscospark/spark-core';
import waitForMercuryEvent from '../../lib/wait-for-mercury-event';
import waitForPromise from '../../lib/wait-for-promise';

describe(`Widget Message Meet`, function() {
  if (process.env.DEBUG_JOURNEYS) {
    console.warn(`Running with DEBUG_JOURNEYS may require you to manually kill wdio`);
    const timeout = 10 * 60 * 1000;
    // eslint-disable-next-line no-invalid-this
    this.timeout(timeout);
    // Leaves the browser open for further testing and inspection
    after(() => {
      browser.timeouts(`implicit`, 1200000);
      return browser.waitUntil(() => false, 1200000, `done waiting: bye`, 10000);
    });
  }

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

  before(`create spock`, () => testUsers.create({count: 1, displayName: `spock`})
    .then((users) => {
      [spock] = users;
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, displayName: `mccoy`})
    .then((users) => {
      [mccoy] = users;
    }));

  before(`connect mccoy`, () => {
    mccoy.spark = new CiscoSpark({
      credentials: {
        authorization: mccoy.token
      }
    });
    return mccoy.spark.mercury.connect();
  });

  before(`inject token`, () => {
    browser.url(`/widget-message-meet`);
    if (process.env.DEBUG_JOURNEYS) {
      console.info(`RUN THE FOLLOWING CODE BLOCK TO RERUN THIS TEST FROM DEV TOOLS`);
      console.info();
      console.info(`window.openWidget("${spock.token.access_token}", "${mccoy.email}");`);
      console.info();
      console.info();
    }

    browser.execute((localAccessToken, localToUserEmail) => {
      window.openWidget(localAccessToken, localToUserEmail);
    }, spock.token.access_token, mccoy.email);
  });

  after(() => mccoy && mccoy.spark.mercury.disconnect());

  it(`sends and receives messages`, () => {
    browser.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
    assert.match($(`.ciscospark-system-message`).getText(), /You created this conversation/);
    $(`[placeholder="Send a message to ${mccoy.displayName}"]`).setValue(`Oh, I am sorry, Doctor. Were we having a good time?\n`);

    const event = waitForMercuryEvent(mccoy.spark, `event:conversation.activity`);
    assert.equal(event.data.activity.object.displayName, `Oh, I am sorry, Doctor. Were we having a good time?`);

    waitForPromise(mccoy.spark.conversation.post(event.data.activity.target, {
      displayName: `God, I liked him better before he died.`
    }));

    browser.waitUntil(() => $(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`).getText() === `God, I liked him better before he died.`);
  });
});
