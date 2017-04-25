/* eslint-disable max-nested-callbacks */
import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/plugin-conversation';
import waitForPromise from '../../lib/wait-for-promise';

describe(`Widget Space`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);

  let docbrown, lorraine, marty;
  let conversation;
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
      .url(`/`)
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

  before(`create lorraine`, () => testUsers.create({count: 1, config: {displayName: `Lorraine Baines`}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        }
      });
      return lorraine.spark.mercury.connect();
    }));

  after(`disconnect`, () => Promise.all([
    marty.spark.mercury.disconnect(),
    lorraine.spark.mercury.disconnect()
  ]));

  before(`create space`, () => marty.spark.conversation.create({
    displayName: `Test Widget Space`,
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before(`inject marty token`, () => {
    browserLocal.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        spaceId
      };
      window.openSpaceWidget(options);
    }, marty.token.access_token, conversation.id);
    const spaceWidget = `.ciscospark-space-widget`;
    browserLocal.waitForVisible(spaceWidget);
  });

  before(`inject docbrown token`, () => {
    browserRemote.execute((localAccessToken, spaceId) => {
      const options = {
        accessToken: localAccessToken,
        spaceId
      };
      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.id);
    const spaceWidget = `.ciscospark-space-widget`;
    browserRemote.waitForVisible(spaceWidget);
  });

  describe(`messaging`, () => {
    it(`sends and receives messages`, () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;
      // Increase wait timeout for message delivery
      browser.timeouts(`implicit`, 10000);
      browserLocal.waitForVisible(textInputField);
      assert.match(browserLocal.getText(`.ciscospark-system-message`), /You created this conversation/);
      browserRemote.waitForVisible(textInputField);
      // Remote is now ready, send a message to it
      const martyText = `Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?`;
      browserLocal.setValue(textInputField, `${martyText}\n`);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === martyText);
      // Send a message back
      const docText = `The way I see it, if you're gonna build a time machine into a car, why not do it with some style?`;
      browserRemote.setValue(textInputField, `${docText}\n`);
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === docText);
      // Send a message from a 'client'
      const lorraineText = `Marty, will we ever see you again?`;
      waitForPromise(lorraine.spark.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === lorraineText);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === lorraineText);
      const martyText2 = `I guarantee it.`;
      browserLocal.setValue(textInputField, `${martyText2}\n`);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === martyText2);
    });
  });

});
