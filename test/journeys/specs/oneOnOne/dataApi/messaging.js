import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {sendMessage, verifyMessageReceipt, messageTests} from '../../../lib/test-helpers/space-widget/messaging';

describe(`Widget Space: One on One`, () => {
  describe(`Data API`, () => {
    const browserLocal = browser.select(`browserLocal`);
    const browserRemote = browser.select(`browserRemote`);
    let local, mccoy, remote, spock;
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
        .url(`/data-api/space.html`)
        .execute(() => {
          localStorage.clear();
        });
    });

    before(`create spock`, () => testUsers.create({count: 1, config: {displayName: `Mr Spock`}})
      .then((users) => {
        [spock] = users;
        local = {browser: browserLocal, user: spock, displayName: spock.displayName};
      }));

    before(`create mccoy`, () => testUsers.create({count: 1, config: {displayName: `Bones Mccoy`}})
      .then((users) => {
        [mccoy] = users;
        remote = {browser: browserRemote, user: mccoy, displayName: mccoy.displayName};
      }));

    before(`pause to let test users establish`, () => browser.pause(5000));

    before(`inject token`, () => {
      local.browser.execute((localAccessToken, localToUserEmail) => {
        const csmmDom = document.createElement(`div`);
        csmmDom.setAttribute(`class`, `ciscospark-widget`);
        csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        csmmDom.setAttribute(`data-to-person-email`, localToUserEmail);
        csmmDom.setAttribute(`data-initial-activity`, `message`);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist/bundle.js`);
      }, spock.token.access_token, mccoy.email);
      local.browser.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`, 30000);
    });

    describe(`message widget`, () => {
      before(`open remote widget`, () => {
        remote.browser.execute((localAccessToken, localToUserEmail) => {
          const csmmDom = document.createElement(`div`);
          csmmDom.setAttribute(`class`, `ciscospark-widget`);
          csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
          csmmDom.setAttribute(`data-access-token`, localAccessToken);
          csmmDom.setAttribute(`data-to-person-email`, localToUserEmail);
          csmmDom.setAttribute(`data-initial-activity`, `message`);
          csmmDom.setAttribute(`on-event`, `message`);
          document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
          window.loadBundle(`/dist/bundle.js`);
        }, mccoy.token.access_token, spock.email);
        remote.browser.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
      });

      it(`sends and receives messages`, () => {
        const message = `Oh, I am sorry, Doctor. Were we having a good time?`;
        sendMessage(local, remote, message);
        verifyMessageReceipt(remote, local, message);
      });

      describe(`File Transfer Tests`, () => {
        it(`sends message with pdf attachment`, () => {
          messageTests.sendFileTest(local, remote, `pdf-sample.pdf`);
        });

        it(`sends message with txt attachment`, () => {
          messageTests.sendFileTest(local, remote, `txt-sample.txt`);
        });

        it(`sends message with doc attachment`, () => {
          messageTests.sendFileTest(local, remote, `doc-sample.doc`);
        });

        it(`sends message with docx attachment`, () => {
          messageTests.sendFileTest(local, remote, `docx-sample.docx`);
        });

        it(`sends message with ppt attachment`, () => {
          messageTests.sendFileTest(local, remote, `ppt-sample.ppt`);
        });

        it(`sends message with html attachment`, () => {
          messageTests.sendFileTest(local, remote, `html-sample.html`);
        });

        it(`sends message with json attachment`, () => {
          messageTests.sendFileTest(local, remote, `json-sample.json`);
        });

        it(`sends message with zip attachment`, () => {
          messageTests.sendFileTest(local, remote, `zip-sample.zip`);
        });

        it(`sends message with gif attachment`, () => {
          messageTests.sendFileTest(local, remote, `gif-sample.gif`, false);
        });

        it(`sends message with jpg attachment`, () => {
          messageTests.sendFileTest(local, remote, `jpg-sample.jpg`, false);
        });

        it(`sends message with png attachment`, () => {
          messageTests.sendFileTest(local, remote, `png-sample.png`);
        });

        it(`sends message with mp3 attachment`, () => {
          messageTests.sendFileTest(local, remote, `mp3-sample.mp3`);
        });
      });

      describe(`markdown messaging`, () => {
        it(`sends message with bold text`, () => {
          messageTests.markdown.bold(remote, local);
        });

        it(`sends message with italic text`, () => {
          messageTests.markdown.italic(local, remote);
        });

        it(`sends message with a blockquote`, () => {
          messageTests.markdown.blockquote(remote, local);
        });

        it(`sends message with numbered list`, () => {
          messageTests.markdown.orderedList(local, remote);
        });

        it(`sends message with bulleted list`, () => {
          messageTests.markdown.unorderedList(remote, local);
        });

        it(`sends message with heading 1`, () => {
          messageTests.markdown.heading1(local, remote);
        });

        it(`sends message with heading 2`, () => {
          messageTests.markdown.heading2(remote, local);
        });

        it(`sends message with heading 3`, () => {
          messageTests.markdown.heading3(local, remote);
        });

        it(`sends message with horizontal line`, () => {
          messageTests.markdown.hr(remote, local);
        });

        it(`sends message with link`, () => {
          messageTests.markdown.link(local, remote);
        });

        it(`sends message with inline code`, () => {
          messageTests.markdown.inline(remote, local);
        });

        it(`sends message with codeblock`, () => {
          messageTests.markdown.codeblock(local, remote);
        });
      });
    });
  });
});
