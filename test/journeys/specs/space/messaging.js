/* eslint-disable max-nested-callbacks */
import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';
import waitForPromise from '../../lib/wait-for-promise';
import {clearEventLog, getEventLog} from '../../lib/events';
import {constructHydraId} from '../../lib/hydra';
import {elements, sendMessage, verifyMessageReceipt} from '../../lib/test-helpers/messaging';

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
      return marty.spark.internal.mercury.connect();
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
      return lorraine.spark.internal.mercury.connect();
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  after(`disconnect`, () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));

  before(`create space`, () => marty.spark.internal.conversation.create({
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
        onEvent: (eventName, detail) => {
          // eslint-disable-next-line object-shorthand
          window.ciscoSparkEvents.push({eventName: eventName, detail: detail});
        },
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
        onEvent: (eventName, detail) => {
          // eslint-disable-next-line object-shorthand
          window.ciscoSparkEvents.push({eventName: eventName, detail: detail});
        },
        spaceId
      };
      window.openSpaceWidget(options);
    }, docbrown.token.access_token, conversation.id);
    const spaceWidget = `.ciscospark-space-widget`;
    browserRemote.waitForVisible(spaceWidget);
  });

  describe(`messaging`, () => {
    it(`sends and receives messages`, () => {
      const martyText = `Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?`;
      const docText = `The way I see it, if you're gonna build a time machine into a car, why not do it with some style?`;
      const lorraineText = `Marty, will we ever see you again?`;
      const martyText2 = `I guarantee it.`;
      sendMessage(browserLocal, conversation, martyText);
      verifyMessageReceipt(browserRemote, conversation, martyText);
      sendMessage(browserRemote, conversation, docText);
      verifyMessageReceipt(browserLocal, conversation, docText);
      // Send a message from a 'client'
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      verifyMessageReceipt(browserLocal, conversation, lorraineText);
      verifyMessageReceipt(browserRemote, conversation, lorraineText);
      sendMessage(browserLocal, conversation, martyText2);
      verifyMessageReceipt(browserRemote, conversation, martyText2);
    });

    it(`receives proper events on messages`, () => {
      // Send a message back
      clearEventLog(browserLocal);
      const eventText = `You're a wizard, Jim!`;
      sendMessage(browserRemote, conversation, eventText);
      verifyMessageReceipt(browserLocal, conversation, eventText);
      const events = getEventLog(browserLocal);
      const eventCreated = events.find((event) => event.eventName === `messages:created`);
      const eventUnread = events.find((event) => event.eventName === `rooms:unread`);
      assert.isDefined(eventCreated, `has a message created event`);
      assert.containsAllKeys(eventCreated.detail, [`resource`, `event`, `actorId`, `data`]);
      assert.containsAllKeys(eventCreated.detail.data, [`actorId`, `actorName`, `id`, `personId`, `roomId`, `roomType`, `text`]);
      assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, docbrown.id));
      assert.equal(eventCreated.detail.data.actorName, docbrown.displayName);
      assert.containsAllKeys(eventUnread.detail, [`resource`, `event`, `data`]);
      assert.isDefined(eventUnread, `has an unread message event`);
    });

    describe(`markdown messaging`, () => {
      beforeEach(`wait until widget is loaded`, () => {
        // Increase wait timeout for message delivery
        browser.timeouts(`implicit`, 10000);
        browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
        browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
      });

      it(`sends message with bold text`, () => {
        sendMessage(browserRemote, conversation, `**Are you out of your Vulcan mind?** No human can tolerate the radiation that's in there!`);
        verifyMessageReceipt(browserLocal, conversation, `Are you out of your Vulcan mind? No human can tolerate the radiation that's in there!`);
        // Assert only the bolded text is in the strong tag
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > strong`), `Are you out of your Vulcan mind?`);
      });

      it(`sends message with italic text`, () => {
        sendMessage(browserLocal, conversation, `As you are _so fond_ of observing, doctor, I am not human.`);
        verifyMessageReceipt(browserRemote, conversation, `As you are so fond of observing, doctor, I am not human.`);
        // Assert only the italicized text is in the em tag
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > em`), `so fond`);
      });

      it(`sends message with a blockquote`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `> You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
        // Quote break with two new lines
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `You call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        browserRemote.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserLocal, conversation, `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.\nYou call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        // Assert only first half of message is in the blockquote tag
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > blockquote`), `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
      });

      it(`sends message with numbered list`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `1. ordered list item 1`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `2. ordered list item 2`);
        browserLocal.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserRemote, conversation, `ordered list item 1\nordered list item 2`);
        // Assert text matches for the first and second ordered list items
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > ol > li:nth-child(1)`), `ordered list item 1`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > ol > li:nth-child(2)`), `ordered list item 2`);
      });

      it(`sends message with bulleted list`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `* unordered list item 1`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `* unordered list item 2`);
        browserRemote.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserLocal, conversation, `unordered list item 1\nunordered list item 2`);
        // Assert text matches for the first and second unordered list items
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > ul > li:nth-child(1)`), `unordered list item 1`);
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > ul > li:nth-child(2)`), `unordered list item 2`);
      });

      it(`sends message with heading 1`, () => {
        sendMessage(browserLocal, conversation, `# Heading 1`);
        verifyMessageReceipt(browserRemote, conversation, `Heading 1`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > h1`), `Heading 1`);
      });

      it(`sends message with heading 2`, () => {
        sendMessage(browserRemote, conversation, `## Heading 2`);
        verifyMessageReceipt(browserLocal, conversation, `Heading 2`);
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > h2`), `Heading 2`);
      });

      it(`sends message with heading 3`, () => {
        sendMessage(browserLocal, conversation, `### Heading 3`);
        verifyMessageReceipt(browserRemote, conversation, `Heading 3`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > h3`), `Heading 3`);
      });

      it(`sends message with horizontal line`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `test horizontal line`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `- - -`);
        browserRemote.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserLocal, conversation, `test horizontal line`);
        assert.isTrue(browserLocal.isVisible(`${elements.lastActivityText} > hr`));
      });

      it(`sends message with link`, () => {
        sendMessage(browserLocal, conversation, `[Cisco](http://www.cisco.com/)`);
        verifyMessageReceipt(browserRemote, conversation, `Cisco`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > a`), `Cisco`);
        assert.equal(browserRemote.getAttribute(`${elements.lastActivityText} > a`, `href`), `http://www.cisco.com/`);
      });

      it(`sends message with inline code`, () => {
        sendMessage(browserRemote, conversation, `this tests \`inline.code();\``);
        verifyMessageReceipt(browserLocal, conversation, `this tests inline.code();`);
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > code`), `inline.code();`);
      });

      it(`sends message with codeblock`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `\`\`\` html`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `<h1>Hello World!</h1>`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `\`\`\``);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in code tag matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > pre > code`) === `<h1>Hello World!</h1>`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > pre > code`), `<h1>Hello World!</h1>`);
      });
    });
  });

});
