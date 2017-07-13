/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';
import {switchToMessage} from '../../lib/menu';
import {clearEventLog, getEventLog} from '../../lib/events';
import {constructHydraId} from '../../lib/hydra';
import request from 'superagent';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

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

    before(`widget switches to message`, () => {
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
      browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `Oh, I am sorry, Doctor. Were we having a good time?`);
      browserLocal.keys([`Enter`, `NULL`]);
      browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Oh, I am sorry, Doctor. Were we having a good time?`);
    });

    it(`receives proper events on messages`, () => {
      // Send a message back
      clearEventLog(browserLocal);
      browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `God, I liked him better before he died.`);
      browserRemote.keys([`Enter`, `NULL`]);
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `God, I liked him better before he died.`);
      const events = getEventLog(browserLocal);
      const eventCreated = events.find((event) => event.eventName === `messages:created`);
      const eventUnread = events.find((event) => event.eventName === `rooms:unread`);
      assert.isDefined(eventCreated, `has a message created event`);
      assert.containsAllKeys(eventCreated.detail, [`resource`, `event`, `actorId`, `data`]);
      assert.containsAllKeys(eventCreated.detail.data, [`actorId`, `actorName`, `id`, `personId`, `roomId`, `roomType`, `text`]);
      assert.equal(eventCreated.detail.actorId, constructHydraId(`PEOPLE`, mccoy.id));
      assert.equal(eventCreated.detail.data.actorName, mccoy.displayName);
      assert.containsAllKeys(eventUnread.detail, [`resource`, `event`, `data`]);
      assert.isDefined(eventUnread, `has an unread message event`);
    });

    it(`sends and deletes message`);

    describe(`File Transfer Tests`, () => {
      /* eslint no-sync: "off" */
      const uploadDir = path.join(__dirname, `assets`);
      const downloadDir = path.join(os.homedir(), `Downloads`);
      const inputFileElem = `.ciscospark-file-input`;
      const downloadButtonContainer = `(//div[starts-with(@class,"ciscospark-activity-content")])[last()]`;
      const downloadFileButton = `(//div[@title="Download this file"]/parent::button)[last()]`;
      const shareButtonElem = `button[aria-label="Share"]`;
      function sendFileTest(fileName) {
        clearEventLog(browserRemote);
        const filePath = path.join(uploadDir, fileName);
        const fileSize = fs.statSync(filePath).size;
        const downloadedFile = path.join(downloadDir, fileName);
        const fileTitle = `//div[text()="${fileName}"]`;
        if (fs.existsSync(downloadedFile)) {
          fs.unlinkSync(downloadedFile);
        }
        browserLocal.chooseFile(inputFileElem, filePath);
        browserLocal.click(shareButtonElem);
        browserRemote.waitForExist(fileTitle, 30000);
        browserRemote.moveToObject(downloadButtonContainer);
        browserRemote.waitForVisible(downloadFileButton);
        const events = getEventLog(browserRemote);
        const newMessage = events.find((event) => event.eventName === `messages:created`);
        const fileUrl = newMessage.detail.data.files[0].url;
        let downloadedFileSize;
        request.get(fileUrl)
            .set(`Authorization`, `Bearer ${mccoy.token.access_token}`)
            .end((error, response) => {
              downloadedFileSize = response.header[`content-length`];
            });
        browser.pause(8000);
        assert.equal(fileSize, downloadedFileSize);
        browser.pause(2000);
        browserRemote.moveToObject(downloadFileButton);
        browserRemote.waitForVisible(downloadFileButton);
        browserRemote.click(downloadFileButton);
        browser.pause(2000);
      }

      it(`sends message with pdf attachment`, () => {
        sendFileTest(`pdf-sample.pdf`);
      });

      it(`sends message with txt attachment`, () => {
        sendFileTest(`txt-sample.txt`);
      });

      it(`sends message with doc attachment`, () => {
        sendFileTest(`doc-sample.doc`);
      });

      it(`sends message with docx attachment`, () => {
        sendFileTest(`docx-sample.docx`);
      });

      it(`sends message with ppt attachment`, () => {
        sendFileTest(`ppt-sample.ppt`);
      });

      it(`sends message with html attachment`, () => {
        sendFileTest(`html-sample.html`);
      });

      it(`sends message with json attachment`, () => {
        sendFileTest(`json-sample.json`);
      });

      it(`sends message with zip attachment`, () => {
        sendFileTest(`zip-sample.zip`);
      });

      it(`sends message with gif attachment`, () => {
        sendFileTest(`gif-sample.gif`);
      });

      it(`sends message with jpg attachment`, () => {
        sendFileTest(`jpg-sample.jpg`);
      });

      it(`sends message with png attachment`, () => {
        sendFileTest(`png-sample.png`);
      });

      it(`sends message with mp3 attachment`, () => {
        sendFileTest(`mp3-sample.mp3`);
      });

    });

    it(`sends and flags message`);

    describe(`markdown messages`, () => {
      beforeEach(`wait until widget is loaded`, () => {
        // Increase wait timeout for message delivery
        browser.timeouts(`implicit`, 10000);
        browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
        browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
      });

      it(`sends message with bold text`, () => {
        // Remote is now ready, send a message with bold text from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `**Are you out of your Vulcan mind?** No human can tolerate the radiation that's in there!`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Are you out of your Vulcan mind? No human can tolerate the radiation that's in there!`);
        // Assert only the bolded text is in the strong tag
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > strong`), `Are you out of your Vulcan mind?`);
      });

      it(`sends message with italic text`, () => {
        // Remote is now ready, send a message with italic text to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `As you are _so fond_ of observing, doctor, I am not human.`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `As you are so fond of observing, doctor, I am not human.`);
        // Assert only the italicized text is in the em tag
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > em`), `so fond`);
      });

      it(`sends message with a blockquote`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `> You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
        // Quote break with two new lines
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${spock.displayName}"]`, `You call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.\nYou call this relaxing? I'm a nervous wreck. I'm not careful, I'll end up talking to myself.`);
        // Assert only first half of message is in the blockquote tag
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > blockquote`), `You'll have a great time, Bones. You'll enjoy your shore leave. You'll relax.`);
      });

      it(`sends message with numbered list`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `1. ordered list item 1`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `2. ordered list item 2`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `ordered list item 1\nordered list item 2`);
        // Assert text matches for the first and second ordered list items
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ol > li:nth-child(1)`), `ordered list item 1`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ol > li:nth-child(2)`), `ordered list item 2`);
      });

      it(`sends message with bulleted list`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `* unordered list item 1`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${spock.displayName}"]`, `* unordered list item 2`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until entire message arrives
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `unordered list item 1\nunordered list item 2`);
        // Assert text matches for the first and second unordered list items
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ul > li:nth-child(1)`), `unordered list item 1`);
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > ul > li:nth-child(2)`), `unordered list item 2`);
      });

      it(`sends message with heading 1`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `# Heading 1`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in h1 tag matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Heading 1`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > h1`), `Heading 1`);
      });

      it(`sends message with heading 2`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `## Heading 2`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in h2 tag matches
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Heading 2`);
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > h2`), `Heading 2`);
      });

      it(`sends message with heading 3`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `### Heading 3`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in h3 tag matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Heading 3`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > h3`), `Heading 3`);
      });

      it(`sends message with horizontal line`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `test horizontal line`);
        browserRemote.keys([`Shift`, `Enter`, `NULL`]);
        browserRemote.addValue(`[placeholder="Send a message to ${spock.displayName}"]`, `- - -`);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert horizontal line element is visible
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `test horizontal line`);
        assert.isTrue(browserLocal.isVisible(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > hr`));
      });

      it(`sends message with link`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `[Cisco](http://www.cisco.com/)`);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert link text and href value matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Cisco`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > a`), `Cisco`);
        assert.equal(browserRemote.getAttribute(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > a`, `href`), `http://www.cisco.com/`);
      });

      it(`sends message with inline code`, () => {
        // Remote is now ready, send a message from it
        browserRemote.setValue(`[placeholder="Send a message to ${spock.displayName}"]`, `this tests \`inline.code();\``);
        browserRemote.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in code tag matches
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `this tests inline.code();`);
        assert.equal(browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > code`), `inline.code();`);
      });

      it(`sends message with codeblock`, () => {
        // Remote is now ready, send a message to it
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `\`\`\` html`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `<h1>Hello World!</h1>`);
        browserLocal.keys([`Shift`, `Enter`, `NULL`]);
        browserLocal.addValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `\`\`\``);
        browserLocal.keys([`Enter`, `NULL`]);
        // Wait until message arrives and assert text in code tag matches
        browserRemote.waitUntil(() => browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > pre > code`) === `<h1>Hello World!</h1>`);
        assert.equal(browserRemote.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text > pre > code`), `<h1>Hello World!</h1>`);
      });
    });
  });
});
