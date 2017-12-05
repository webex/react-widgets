import {assert} from 'chai';

import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/plugin-logger';
import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';


import waitForPromise from '../../../lib/wait-for-promise';
import {clearEventLog, getEventLog} from '../../../lib/events';
import {loginAndOpenWidget} from '../../../lib/test-helpers/tap/recents';

describe('Widget Recents', () => {
  const browserLocal = browser.select('browserLocal');
  let docbrown, lorraine, marty;
  let conversation, oneOnOneConversation;
  process.env.CISCOSPARK_SCOPE = [
    'webexsquare:get_conversation',
    'spark:people_read',
    'spark:rooms_read',
    'spark:rooms_write',
    'spark:memberships_read',
    'spark:memberships_write',
    'spark:messages_read',
    'spark:messages_write',
    'spark:teams_read',
    'spark:teams_write',
    'spark:team_memberships_read',
    'spark:team_memberships_write',
    'spark:kms'
  ].join(' ');

  before('load browser', () => {
    browserLocal
      .url('/widget-recents/production/demo/index.html')
      .execute(() => {
        localStorage.clear();
      });
  });

  before('create marty', () => testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return marty.spark.internal.mercury.connect();
    }));

  before('create docbrown', () => testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return docbrown.spark.internal.mercury.connect();
    }));

  before('create lorraine', () => testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return lorraine.spark.internal.mercury.connect();
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect(),
    docbrown.spark.internal.mercury.disconnect()
  ]));

  before('create group space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Group Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before('create one on one converstation', () => lorraine.spark.internal.conversation.create({
    participants: [marty, lorraine]
  }).then((c) => {
    oneOnOneConversation = c;
    return oneOnOneConversation;
  }));

  before('inject token', () => {
    loginAndOpenWidget(browserLocal, marty.token.access_token);
    const recentsWidget = '.ciscospark-spaces-list-wrapper';
    browserLocal.waitUntil(() => browserLocal.element(recentsWidget).isVisible(), 3500, 'widget was never created');
  });

  describe('group space', () => {
    it('displays a new incoming message', () => {
      const lorraineText = 'Marty, will we ever see you again?';
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      browserLocal.waitForExist('.space-item:first-child .space-title', 10000);
      browserLocal.waitUntil(() => browserLocal.getText('.space-item:first-child .space-title') === conversation.displayName);
      assert.isTrue(browserLocal.isVisible('.space-item:first-child .space-unread-indicator'));
      assert.include(browserLocal.getText('.space-item:first-child .space-last-activity'), lorraineText);
    });

    it('removes unread indicator when read', () => {
      let activity;
      const lorraineText = 'You\'re safe and sound now!';
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }).then((a) => {
        activity = a;
      }));
      browserLocal.waitForExist('.space-item:first-child .space-last-activity', 10000);
      browserLocal.waitUntil(() =>
        browserLocal.getText('.space-item:first-child .space-last-activity').includes(lorraineText),
      10000,
      'expected remote text to display in list');
      assert.isTrue(browserLocal.isVisible('.space-item:first-child .space-unread-indicator'));
      // Acknowledge the activity to mark it read
      waitForPromise(marty.spark.internal.conversation.acknowledge(conversation, activity));
      browserLocal.waitForVisible('.space-item:first-child .space-unread-indicator', 1500, true);
    });

    describe('events', () => {
      // https://github.com/ciscospark/react-ciscospark/blob/master/packages/node_modules/%40ciscospark/widget-recents/events.md
      it('messages:created', () => {
        clearEventLog(browserLocal);
        const lorraineText = 'Don\'t be such a square';
        waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
          displayName: lorraineText
        }));
        browserLocal.waitUntil(() =>
          browserLocal.getText('.space-item:first-child .space-last-activity').includes(lorraineText));
        assert.isTrue(getEventLog(browserLocal).some((event) => event.eventName === 'messages:created'), 'event was not seen');
      });

      it('rooms:unread', () => {
        clearEventLog(browserLocal);
        const lorraineText = 'Your Uncle Joey didn\'t make parole again.';
        waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
          displayName: lorraineText
        }));
        browserLocal.waitUntil(() =>
          browserLocal.getText('.space-item:first-child .space-last-activity').includes(lorraineText));
        assert.isTrue(getEventLog(browserLocal).some((event) => event.eventName === 'rooms:unread'), 'event was not seen');
      });

      it('rooms:read', () => {
        let activity;
        clearEventLog(browserLocal);
        const lorraineText = 'Your Uncle Joey didn\'t make parole again.';
        waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
          displayName: lorraineText
        }).then((a) => {
          activity = a;
        }));
        browserLocal.waitUntil(() =>
          browserLocal.getText('.space-item:first-child .space-last-activity').includes(lorraineText));
        waitForPromise(marty.spark.internal.conversation.acknowledge(conversation, activity));
        browserLocal.waitForVisible('.space-item:first-child .space-unread-indicator', 1500, true);
        assert.isTrue(getEventLog(browserLocal).some((event) => event.eventName === 'rooms:read'), 'event was not seen');
      });

      it('rooms:selected', () => {
        clearEventLog(browserLocal);
        browserLocal.click('.space-item:first-child');
        assert.isTrue(getEventLog(browserLocal).some((event) => event.eventName === 'rooms:selected'), 'event was not seen');
      });

      it('memberships:created', () => {
        const roomTitle = 'Test Group Space 2';
        clearEventLog(browserLocal);
        waitForPromise(lorraine.spark.internal.conversation.create({
          displayName: roomTitle,
          participants: [marty, docbrown, lorraine]
        }).then((c) => lorraine.spark.internal.conversation.post(c, {
          displayName: 'Everybody who\'s anybody drinks.'
        })));
        browserLocal.waitUntil(() =>
          browserLocal.getText('.space-item:first-child .space-title').includes(roomTitle));
        assert.isTrue(getEventLog(browserLocal).some((event) => event.eventName === 'memberships:created'), 'event was not seen');
      });

      it('memberships:deleted', () => {
        // Create Room
        let kickedConversation;
        const roomTitle = 'Kick Marty Out';
        waitForPromise(lorraine.spark.internal.conversation.create({
          displayName: roomTitle,
          participants: [marty, docbrown, lorraine]
        }).then((c) => {
          kickedConversation = c;
          return lorraine.spark.internal.conversation.post(c, {
            displayName: 'Goodbye Marty.'
          });
        }));
        browserLocal.waitUntil(() =>
          browserLocal.getText('.space-item:first-child .space-title') === roomTitle);
        // Remove user from room
        clearEventLog(browserLocal);
        waitForPromise(lorraine.spark.internal.conversation.leave(kickedConversation, marty));
        browserLocal.waitUntil(() =>
          browserLocal.getText('.space-item:first-child .space-title') !== roomTitle);
        assert.isTrue(getEventLog(browserLocal).some((event) => event.eventName === 'memberships:deleted'), 'event was not seen');
      });
    });
  });

  describe('one on one space', () => {
    it('displays a new incoming message', () => {
      const lorraineText = 'Marty? Why are you so nervous?';
      waitForPromise(lorraine.spark.internal.conversation.post(oneOnOneConversation, {
        displayName: lorraineText
      }));
      browserLocal.waitUntil(() => browserLocal.getText('.space-item:first-child .space-title') === lorraine.displayName);
      assert.include(browserLocal.getText('.space-item:first-child .space-last-activity'), lorraineText);
    });

    it('removes unread indicator when read', () => {
      let activity;
      const lorraineText = 'You\'re safe and sound now!';
      waitForPromise(lorraine.spark.internal.conversation.post(oneOnOneConversation, {
        displayName: lorraineText
      }).then((a) => {
        activity = a;
      }));
      browserLocal.waitUntil(() =>
        browserLocal.getText('.space-item:first-child .space-last-activity').includes(lorraineText));

      assert.isTrue(browserLocal.isVisible('.space-item:first-child .space-unread-indicator'));
      // Acknowledge the activity to mark it read
      waitForPromise(marty.spark.internal.conversation.acknowledge(oneOnOneConversation, activity));
      browserLocal.waitForVisible('.space-item:first-child .space-unread-indicator', 1500, true);
    });

    it('displays a new one on one', () => {
      const docText = 'Marty! We have to talk!';
      waitForPromise(docbrown.spark.internal.conversation.create({
        participants: [marty, docbrown]
      }).then((c) => docbrown.spark.internal.conversation.post(c, {
        displayName: docText
      })));
      browserLocal.waitUntil(() => browserLocal.getText('.space-item:first-child .space-last-activity').includes(docText));
      assert.isTrue(browserLocal.isVisible('.space-item:first-child .space-unread-indicator'));
    });
  });
});
