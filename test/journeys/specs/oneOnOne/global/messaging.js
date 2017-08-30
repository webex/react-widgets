/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {clearEventLog, getEventLog} from '../../../lib/events';
import {constructHydraId} from '../../../lib/hydra';
import {runAxe} from '../../../lib/axe';
import {elements, sendFileTest, sendMessage, verifyMessageReceipt} from '../../../lib/test-helpers/space-widget/messaging';

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
      .url(`/?message`)
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

  before(`pause to let test users establish`, () => browser.pause(5000));

  before(`inject token`, () => {
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
    browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
  });

  describe(`message widget`, () => {
    before(`open remote widget`, () => {
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
      browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
    });

    it(`sends and receives messages`, () => {
      const message = `Oh, I am sorry, Doctor. Were we having a good time?`;
      sendMessage(browserLocal, mccoy, message);
      verifyMessageReceipt(browserRemote, spock, message);
    });

    it(`receives proper events on messages`, () => {
      // Send a message back
      const message = `God, I liked him better before he died.`;
      clearEventLog(browserLocal);
      sendMessage(browserRemote, spock, message);
      verifyMessageReceipt(browserLocal, mccoy, message);
      const events = getEventLog(browserLocal);
      const eventCreated = events.find((event) => event.eventName === `messages:created`);
      const eventUnread = events.find((event) => event.eventName === `rooms:unread`);
      assert.isDefined(eventCreated, `has a message created event`);
      assert.containsAllKeys(eventCreated.detail, [`resource`, `event`, `actorId`, `data`]);
      assert.containsAllKeys(eventCreated.detail.data, [`actorId`, `actorName`, `id`, `personId`, `roomId`, `roomType`, `text`]);
      assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, mccoy.id));
      assert.equal(eventCreated.detail.data.actorName, mccoy.displayName);

      assert.isDefined(eventUnread, `has an unread message event`);
      assert.containsAllKeys(eventUnread.detail, [`resource`, `event`, `data`]);
      assert.containsAllKeys(eventUnread.detail.data, [`actorId`, `actorName`, `id`, `title`, `type`, `created`, `lastActivity`]);
      assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, mccoy.id));
      assert.equal(eventCreated.detail.data.actorName, mccoy.displayName);
    });

    describe(`accessibility`, () => {
      it(`should have no accessibility violations`, () =>
        runAxe(browserLocal, `ciscospark-widget`)
          .then((results) => {
            assert.equal(results.violations.length, 0);
          })
      );
    });

    describe(`File Transfer Tests`, () => {
      it(`sends message with pdf attachment`, () => sendFileTest(browserLocal, browserRemote, `pdf-sample.pdf`));

      it(`sends message with txt attachment`, () => sendFileTest(browserLocal, browserRemote, `txt-sample.txt`));

      it(`sends message with doc attachment`, () => sendFileTest(browserLocal, browserRemote, `doc-sample.doc`));

      it(`sends message with docx attachment`, () => sendFileTest(browserLocal, browserRemote, `docx-sample.docx`));

      it(`sends message with ppt attachment`, () => sendFileTest(browserLocal, browserRemote, `ppt-sample.ppt`));

      it(`sends message with html attachment`, () => sendFileTest(browserLocal, browserRemote, `html-sample.html`));

      it(`sends message with json attachment`, () => sendFileTest(browserLocal, browserRemote, `json-sample.json`));

      it(`sends message with zip attachment`, () => sendFileTest(browserLocal, browserRemote, `zip-sample.zip`));

      it(`sends message with gif attachment`, () => sendFileTest(browserLocal, browserRemote, `gif-sample.gif`));

      it(`sends message with jpg attachment`, () => sendFileTest(browserLocal, browserRemote, `jpg-sample.jpg`));

      it(`sends message with png attachment`, () => sendFileTest(browserLocal, browserRemote, `png-sample.png`));

      it(`sends message with mp3 attachment`, () => sendFileTest(browserLocal, browserRemote, `mp3-sample.mp3`));
    });

    describe(`markdown messages`, () => {
      it(`sends message with bold text`, () => {
        sendMessage(browserRemote, spock, `**Are you out of your Vulcan mind?** No human can tolerate the radiation that's in there!`);
        verifyMessageReceipt(browserLocal, mccoy, `Are you out of your Vulcan mind? No human can tolerate the radiation that's in there!`);
        // Assert only the bolded text is in the strong tag
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > strong`), `Are you out of your Vulcan mind?`);
      });

      it(`sends message with italic text`, () => {
        sendMessage(browserLocal, mccoy, `As you are _so fond_ of observing, doctor, I am not human.`);
        verifyMessageReceipt(browserRemote, spock, `As you are so fond of observing, doctor, I am not human.`);
        // Assert only the italicized text is in the em tag
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > em`), `so fond`);
      });

      it(`sends message with a blockquote`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `> You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
        // Quote break with two new lines
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${spock.displayName}"]`, `You call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        browserRemote.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserLocal, mccoy, `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.\nYou call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        // Assert only first half of message is in the blockquote tag
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > blockquote`), `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
      });

      it(`sends message with numbered list`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `1. ordered list item 1`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `2. ordered list item 2`);
        browserLocal.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserRemote, spock, `ordered list item 1\nordered list item 2`);
        // Assert text matches for the first and second ordered list items
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > ol > li:nth-child(1)`), `ordered list item 1`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > ol > li:nth-child(2)`), `ordered list item 2`);
      });

      it(`sends message with bulleted list`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `* unordered list item 1`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${spock.displayName}"]`, `* unordered list item 2`);
        browserRemote.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserLocal, mccoy, `unordered list item 1\nunordered list item 2`);
        // Assert text matches for the first and second unordered list items
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > ul > li:nth-child(1)`), `unordered list item 1`);
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > ul > li:nth-child(2)`), `unordered list item 2`);
      });

      it(`sends message with heading 1`, () => {
        sendMessage(browserLocal, mccoy, `# Heading 1`);
        verifyMessageReceipt(browserRemote, spock, `Heading 1`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > h1`), `Heading 1`);
      });

      it(`sends message with heading 2`, () => {
        sendMessage(browserRemote, spock, `## Heading 2`);
        verifyMessageReceipt(browserLocal, mccoy, `Heading 2`);
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > h2`), `Heading 2`);
      });

      it(`sends message with heading 3`, () => {
        sendMessage(browserLocal, mccoy, `### Heading 3`);
        verifyMessageReceipt(browserRemote, spock, `Heading 3`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > h3`), `Heading 3`);
      });

      it(`sends message with horizontal line`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `test horizontal line`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${spock.displayName}"]`, `- - -`);
        browserRemote.keys([`Enter`, `NULL`]);
        verifyMessageReceipt(browserLocal, mccoy, `test horizontal line`);
        assert.isTrue(browserLocal.isVisible(`${elements.lastActivityText} > hr`));
      });

      it(`sends message with link`, () => {
        sendMessage(browserLocal, mccoy, `[Cisco](http://www.cisco.com/)`);
        verifyMessageReceipt(browserRemote, spock, `Cisco`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > a`), `Cisco`);
        assert.equal(browserRemote.getAttribute(`${elements.lastActivityText} > a`, `href`), `http://www.cisco.com/`);
      });

      it(`sends message with inline code`, () => {
        sendMessage(browserRemote, spock, `this tests \`inline.code();\``);
        verifyMessageReceipt(browserLocal, mccoy, `this tests inline.code();`);
        assert.equal(browserLocal.getText(`${elements.lastActivityText} > code`), `inline.code();`);
      });

      it(`sends message with codeblock`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `\`\`\` html`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `<h1>Hello World!</h1>`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `\`\`\``);
        browserLocal.keys([`Enter`, `NULL`]);
        browserRemote.waitUntil(() => browserRemote.getText(`${elements.lastActivityText} > pre > code`) === `<h1>Hello World!</h1>`);
        assert.equal(browserRemote.getText(`${elements.lastActivityText} > pre > code`), `<h1>Hello World!</h1>`);
      });
    });
  });
});
