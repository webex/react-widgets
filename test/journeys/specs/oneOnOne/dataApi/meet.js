import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';

import {switchToMeet} from '../../../lib/test-helpers/space-widget/main';
import {elements, hangupBeforeAnswerTest, declineIncomingCallTest, hangupDuringCallTest} from '../../../lib/test-helpers/space-widget/meet';

describe(`Widget Space: One on One`, () => {
  describe(`Data API`, () => {
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
        .url(`/data-api/space.html`)
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

    before(`pause to let test users establish`, () => browser.pause(7500));

    before(`open local widget spock`, () => {
      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const csmmDom = document.createElement(`div`);
        csmmDom.setAttribute(`class`, `ciscospark-widget`);
        csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        csmmDom.setAttribute(`data-to-person-email`, localToUserEmail);
        csmmDom.setAttribute(`data-initial-activity`, `message`);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist/bundle.js`);
      }, spock.token.access_token, mccoy.email);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`, 30000);
    });

    before(`open remote widget mccoy`, () => {
      browserRemote.execute((localAccessToken, localToUserEmail) => {
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
      browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`, 30000);
    });

    describe(`meet widget`, () => {
      describe(`pre call experience`, () => {
        it(`has a call button`, () => {
          switchToMeet(browserLocal);
          browserLocal.element(elements.meetWidget).element(elements.callButton).waitForVisible();
        });
      });

      describe(`during call experience`, () => {
        it(`can hangup before answer`, () => {
          hangupBeforeAnswerTest(browserLocal, browserRemote);
        });

        it(`can decline an incoming call`, () => {
          declineIncomingCallTest(browserLocal, browserRemote);
        });

        it(`can hangup in call`, () => {
          hangupDuringCallTest(browserLocal, browserRemote);
        });
      });
    });
  });
});
