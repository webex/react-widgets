/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/plugin-conversation';
import waitForPromise from '../../lib/wait-for-promise';

describe(`Widget Recents`, () => {
  const browserLocal = browser.select(`browserLocal`);
  let docbrown, lorraine, marty;
  let conversation, oneOnOneConversation;
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

  before(`load browser`, () => {
    browserLocal
      .url(`/recents.html`)
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

  before(`pause to let test users establish`, () => browser.pause(5000));

  after(`disconnect`, () => Promise.all([
    marty.spark.mercury.disconnect(),
    lorraine.spark.mercury.disconnect()
  ]));

  before(`create group space`, () => marty.spark.conversation.create({
    displayName: `Test Group Space`,
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before(`create one on one converstation`, () => lorraine.spark.conversation.create({
    participants: [marty, lorraine]
  }).then((c) => {
    oneOnOneConversation = c;
    return oneOnOneConversation;
  }));

  before(`inject token`, () => {
    const recentsWidget = `.ciscospark-spaces-list-wrapper`;
    browserLocal.execute((localAccessToken) => {
      const options = {
        accessToken: localAccessToken
      };
      window.openRecentsWidget(options);
    }, marty.token.access_token);
    browserLocal.waitForVisible(recentsWidget);
  });

  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Cisco Spark Widget Test`);
  });

  describe(`group space`, () => {
    it(`displays a new incoming message`, () => {
      const lorraineText = `Marty, will we ever see you again?`;
      waitForPromise(lorraine.spark.conversation.post(conversation, {
        displayName: lorraineText
      }));
      browserLocal.waitForVisible(`.space-item:first-child .space-unread-indicator`);
      assert.equal(browserLocal.getText(`.space-item:first-child .space-title`), conversation.displayName);
      assert.include(browserLocal.getText(`.space-item:first-child .space-last-activity`), lorraineText);
    });
  });

  describe(`one on one space`, () => {
    it(`displays a new incoming message`, () => {
      const lorraineText = `Marty? Why are you so nervous?`;
      waitForPromise(lorraine.spark.conversation.post(oneOnOneConversation, {
        displayName: lorraineText
      }));
      browserLocal.waitUntil(() => browserLocal.getText(`.space-item:first-child .space-title`) === lorraine.displayName);
      assert.include(browserLocal.getText(`.space-item:first-child .space-last-activity`), lorraineText);
    });
  });
});
