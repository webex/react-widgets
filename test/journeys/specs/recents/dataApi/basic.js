import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import waitForPromise from '../../../lib/wait-for-promise';

describe(`Widget Recents`, () => {
  describe(`Data API`, () => {
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
        .url(`/data-api/recents.html`)
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
          },
          config: {
            logger: {
              level: `error`
            }
          }
        });
        return marty.spark.internal.mercury.connect();
      }));

    before(`create docbrown`, () => testUsers.create({count: 1, config: {displayName: `Emmett Brown`}})
      .then((users) => {
        [docbrown] = users;
        docbrown.spark = new CiscoSpark({
          credentials: {
            authorization: docbrown.token
          },
          config: {
            logger: {
              level: `error`
            }
          }
        });
        return docbrown.spark.internal.mercury.connect();
      }));

    before(`create lorraine`, () => testUsers.create({count: 1, config: {displayName: `Lorraine Baines`}})
      .then((users) => {
        [lorraine] = users;
        lorraine.spark = new CiscoSpark({
          credentials: {
            authorization: lorraine.token
          },
          config: {
            logger: {
              level: `error`
            }
          }
        });
        return lorraine.spark.internal.mercury.connect();
      }));

    before(`pause to let test users establish`, () => browser.pause(5000));

    after(`disconnect`, () => Promise.all([
      marty.spark.internal.mercury.disconnect(),
      lorraine.spark.internal.mercury.disconnect(),
      docbrown.spark.internal.mercury.disconnect()
    ]));

    before(`create group space`, () => marty.spark.internal.conversation.create({
      displayName: `Test Group Space`,
      participants: [marty, docbrown, lorraine]
    }).then((c) => {
      conversation = c;
      return conversation;
    }));

    before(`create one on one converstation`, () => lorraine.spark.internal.conversation.create({
      participants: [marty, lorraine]
    }).then((c) => {
      oneOnOneConversation = c;
      return oneOnOneConversation;
    }));

    before(`inject token`, () => {
      const recentsWidget = `.ciscospark-spaces-list-wrapper`;
      browserLocal.execute((localAccessToken) => {
        const csmmDom = document.createElement(`div`);
        csmmDom.setAttribute(`class`, `ciscospark-widget`);
        csmmDom.setAttribute(`data-toggle`, `ciscospark-recents`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist-recents/bundle.js`);
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
        waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
          displayName: lorraineText
        }));
        browserLocal.waitUntil(() => browserLocal.getText(`.space-item:first-child .space-title`) === conversation.displayName);
        assert.isTrue(browserLocal.isVisible(`.space-item:first-child .space-unread-indicator`));
        assert.include(browserLocal.getText(`.space-item:first-child .space-last-activity`), lorraineText);
      });

      it(`removes unread indicator when read`, () => {
        let activity;
        const lorraineText = `You're safe and sound now!`;
        waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
          displayName: lorraineText
        }).then((a) => {
          activity = a;
        }));
        browserLocal.waitUntil(() =>
          browserLocal.getText(`.space-item:first-child .space-last-activity`).includes(lorraineText));
        assert.isTrue(browserLocal.isVisible(`.space-item:first-child .space-unread-indicator`));
        // Acknowledge the activity to mark it read
        waitForPromise(marty.spark.internal.conversation.acknowledge(conversation, activity));
        browserLocal.waitForVisible(`.space-item:first-child .space-unread-indicator`, 1500, true);
      });
    });

    describe(`one on one space`, () => {
      it(`displays a new incoming message`, () => {
        const lorraineText = `Marty? Why are you so nervous?`;
        waitForPromise(lorraine.spark.internal.conversation.post(oneOnOneConversation, {
          displayName: lorraineText
        }));
        browserLocal.waitUntil(() => browserLocal.getText(`.space-item:first-child .space-title`) === lorraine.displayName);
        assert.include(browserLocal.getText(`.space-item:first-child .space-last-activity`), lorraineText);
      });

      it(`removes unread indicator when read`, () => {
        let activity;
        const lorraineText = `You're safe and sound now!`;
        waitForPromise(lorraine.spark.internal.conversation.post(oneOnOneConversation, {
          displayName: lorraineText
        }).then((a) => {
          activity = a;
        }));
        browserLocal.waitUntil(() =>
          browserLocal.getText(`.space-item:first-child .space-last-activity`).includes(lorraineText));

        assert.isTrue(browserLocal.isVisible(`.space-item:first-child .space-unread-indicator`));
        // Acknowledge the activity to mark it read
        waitForPromise(marty.spark.internal.conversation.acknowledge(oneOnOneConversation, activity));
        browserLocal.waitForVisible(`.space-item:first-child .space-unread-indicator`, 1500, true);
      });

      it(`displays a new one on one`, () => {
        const docText = `Marty! We have to talk!`;
        waitForPromise(docbrown.spark.internal.conversation.create({
          participants: [marty, docbrown]
        }).then((c) => docbrown.spark.internal.conversation.post(c, {
          displayName: docText
        })));
        browserLocal.waitUntil(() => browserLocal.getText(`.space-item:first-child .space-last-activity`).includes(docText));
        assert.isTrue(browserLocal.isVisible(`.space-item:first-child .space-unread-indicator`));
      });
    });
  });
});
