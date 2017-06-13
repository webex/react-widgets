/* eslint-disable max-nested-callbacks */
import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';
import waitForPromise from '../../lib/wait-for-promise';
import {clearEventLog, getEventLog} from '../../lib/events';

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
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
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
        onEvent: (eventName) => {
          window.ciscoSparkEvents.push(eventName);
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
      clearEventLog(browserLocal);
      const docText = `The way I see it, if you're gonna build a time machine into a car, why not do it with some style?`;
      browserRemote.setValue(textInputField, `${docText}\n`);
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === docText);
      const remoteSendEvents = getEventLog(browserLocal);
      assert.include(remoteSendEvents, `messages:created`, `has a message created event`);
      assert.include(remoteSendEvents, `rooms:unread`, `has an unread message event`);
      // Send a message from a 'client'
      clearEventLog(browserLocal);
      const lorraineText = `Marty, will we ever see you again?`;
      waitForPromise(lorraine.spark.internal.conversation.post(conversation, {
        displayName: lorraineText
      }));
      // Wait for both widgets to receive client message
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === lorraineText);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === lorraineText);
      const clientSendEvents = getEventLog(browserLocal);
      assert.include(clientSendEvents, `messages:created`, `has a message created event`);
      assert.include(clientSendEvents, `rooms:unread`, `has an unread message event`);
      const martyText2 = `I guarantee it.`;
      browserLocal.setValue(textInputField, `${martyText2}\n`);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === martyText2);
    });

    describe(`markdown messaging`, () => {
      beforeEach(`wait until widget is loaded`, () => {
        // Increase wait timeout for message delivery
        browser.timeouts(`implicit`, 10000);
        browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
        browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
      });

      it(`sends message with bold text`, () => {
        // Remote is now ready, send a message with bold text from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `**Are you out of your Vulcan mind?** No human can tolerate the radiation that's in there!`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Are you out of your Vulcan mind? No human can tolerate the radiation that's in there!`);
        // Assert only the bolded text is in the strong tag
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > strong`), `Are you out of your Vulcan mind?`);
      });

      it(`sends message with italic text`, () => {
        // Remote is now ready, send a message with italic text to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `As you are _so fond_ of observing, doctor, I am not human.`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `As you are so fond of observing, doctor, I am not human.`);
        // Assert only the italicized text is in the em tag
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > em`), `so fond`);
      });

      it(`sends message with a blockquote`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `> You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
        // Quote break with two new lines
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `You call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.\nYou call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        // Assert only first half of message is in the blockquote tag
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > blockquote`), `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
      });

      it(`sends message with numbered list`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `1. ordered list item 1`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `2. ordered list item 2`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `ordered list item 1\nordered list item 2`);
        // Assert text matches for the first and second ordered list items
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ol > li:nth-child(1)`), `ordered list item 1`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ol > li:nth-child(2)`), `ordered list item 2`);
      });

      it(`sends message with bulleted list`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `* unordered list item 1`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `* unordered list item 2`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `unordered list item 1\nunordered list item 2`);
        // Assert text matches for the first and second unordered list items
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ul > li:nth-child(1)`), `unordered list item 1`);
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ul > li:nth-child(2)`), `unordered list item 2`);
      });

      it(`sends message with heading 1`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `# Heading 1`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in h1 tag matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Heading 1`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > h1`), `Heading 1`);
      });

      it(`sends message with heading 2`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `## Heading 2`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in h2 tag matches
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Heading 2`);
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > h2`), `Heading 2`);
      });

      it(`sends message with heading 3`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `### Heading 3`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in h3 tag matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Heading 3`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > h3`), `Heading 3`);
      });

      it(`sends message with horizontal line`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `test horizontal line`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `- - -`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert horizontal line element is visible
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `test horizontal line`);
        assert.isTrue(browserLocal.isVisible(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > hr`));
      });

      // TODO: https://voxeolabs.atlassian.net/projects/SSDK/issues/SSDK-920
      it(`sends message with link`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `[Cisco](http://www.cisco.com/)`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert link text and href value matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Cisco`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > a`), `Cisco`);
        assert.equal(browserRemote.getAttribute(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > a`, `href`), `http://www.cisco.com/`);
      });

      it(`sends message with inline code`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${conversation.displayName}"]`, `this tests \`inline.code();\``);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in code tag matches
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `this tests inline.code();`);
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > code`), `inline.code();`);
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
