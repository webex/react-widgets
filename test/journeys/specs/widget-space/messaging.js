/* eslint-disable max-nested-callbacks */
import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/plugin-conversation';

describe(`Widget Space`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);

  let docbrown, lorraine, marty;
  let conversation, participants;
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
      .url(`/widget-space`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create marty`, () => testUsers.create({count: 1, config: {displayName: `Marty McFly`}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        }
      });
      return marty.spark.mercury.connect();
    }));

  before(`create docbrown`, () => testUsers.create({count: 1, config: {displayName: `Emmett Brown`}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        }
      });
    }));

  before(`create lorraine`, () => testUsers.create({count: 1, displayName: `lorraine`})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        }
      });
    }));

  after(`disconnect`, () => marty.spark.mercury.disconnect());

  before(`create space`, () => marty.spark.conversation.create({
    displayName: `Test Widget Space`,
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before(`inject marty token`, () => {
    browserLocal.execute((localAccessToken, spaceId) => {
      window.openWidget(localAccessToken, spaceId);
    }, marty.token.access_token, conversation.id);
    browserLocal.execute((c) => {
      console.log(c);
    }, conversation);
    // TODO: Remove the reload once stable
    const spaceWidget = `.ciscospark-space-widget`;
    browserLocal.waitForVisible(spaceWidget);
    browserLocal.refresh();
    browserLocal.execute((localAccessToken, spaceId) => {
      window.openWidget(localAccessToken, spaceId);
    }, marty.token.access_token, conversation.id);
    console.log(`Marty: ${marty.displayName}`);
    console.log(`Marty: ${marty.token.access_token}`);
  });

  before(`inject docbrown token`, () => {
    browserRemote.execute((localAccessToken, spaceId) => {
      window.openWidget(localAccessToken, spaceId);
    }, docbrown.token.access_token, conversation.id);
    // TODO: Remove the reload once stable
    const spaceWidget = `.ciscospark-space-widget`;
    browserRemote.waitForVisible(spaceWidget);
    browserRemote.refresh();
    browserRemote.execute((localAccessToken, spaceId) => {
      window.openWidget(localAccessToken, spaceId);
    }, docbrown.token.access_token, conversation.id);
    console.log(`Doc Brown: ${docbrown.displayName}`);
    console.log(`Doc Brown: ${docbrown.token.access_token}`);
  });

  describe(`space widget`, () => {
    it(`sends and receives messages`, () => {
      // Increase wait timeout for message delivery
      browser.timeouts(`implicit`, 10000);
      browserLocal.waitForVisible(`[placeholder="Send a message to "]`);
      assert.match(browserLocal.getText(`.ciscospark-system-message`), /You created this conversation/);
      browserRemote.waitForVisible(`[placeholder="Send a message to "]`);
      // Remote is now ready, send a message to it
      const martyText = `Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?`;
      browserLocal.setValue(`[placeholder="Send a message to "]`, `${martyText}\n`);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === martyText);
      // Send a message back
      const docText = `The way I see it, if you're gonna build a time machine into a car, why not do it with some style?`;
      browserRemote.setValue(`[placeholder="Send a message to "]`, `${docText}\n`);
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === docText);
    });
  });

});
