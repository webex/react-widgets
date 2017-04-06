/* eslint-disable max-nested-callbacks */
import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';
import {switchToMeet} from '../../lib/menu';

describe(`Widget Message Meet`, () => {
  const browserLocal = browser.select(`browserLocal`);
  const browserRemote = browser.select(`browserRemote`);
  let mccoy, spock;
  process.env.CISCOSPARK_SCOPE = [
    `webexsquare:get_conversation`,
    `Identity:SCIM`,
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
      .url(`/widget-message-meet`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create spock`, () => testUsers.create({count: 1, displayName: `spock`})
    .then((users) => {
      [spock] = users;
    }));

  before(`create mccoy`, () => testUsers.create({count: 1, displayName: `mccoy`})
    .then((users) => {
      [mccoy] = users;
    }));

  before(`inject token`, () => {
    if (process.env.DEBUG_JOURNEYS) {
      console.info(`RUN THE FOLLOWING CODE BLOCK TO RERUN THIS TEST FROM DEV TOOLS`);
      console.info();
      console.info(`window.openWidget("${spock.token.access_token}", "${mccoy.email}");`);
      console.info();
      console.info();

      console.info(`RUN THE FOLLOWING CODE BLOCK TO RERUN THIS REMOTE TEST FROM DEV TOOLS`);
      console.info();
      console.info(`window.openWidget("${mccoy.token.access_token}", "${spock.email}");`);
      console.info();
      console.info();
    }

    browserLocal.execute((localAccessToken, localToUserEmail) => {
      window.openWidget(localAccessToken, localToUserEmail);
    }, spock.token.access_token, mccoy.email);

  });

  describe(`meet widget`, () => {
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    const callButton = `button[aria-label="Call"]`;
    const hangupButton = `button[aria-label="hangup"]`;

    describe(`pre call experience`, () => {
      before(`switch to meet widget`, () => {
        // Wait for conversation to be established before continuing
        browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
        switchToMeet(browserLocal);
      });

      it(`has a call button`, () => {
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
      });
    });

    describe(`during call experience`, () => {
      before(`open remote widget`, () => {
        browserRemote.execute((localAccessToken, localToUserEmail) => {
          window.openWidget(localAccessToken, localToUserEmail);
        }, mccoy.token.access_token, spock.email);
        browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
      });

      beforeEach(`widget switches to message after hangup`, () => {
        switchToMeet(browserLocal);
        switchToMeet(browserRemote);
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserRemote.element(meetWidget).element(callButton).waitForVisible();
      });

      it(`can hangup before answer`, () => {
        browserLocal.element(meetWidget).element(callButton).click();
        browserLocal.moveTo(browserLocal.element(meetWidget).value.ELEMENT);
        browserLocal.waitForVisible(`.call-controls`);
        browserLocal.element(meetWidget).element(hangupButton).click();
      });

      it(`can hangup in call`, () => {
        browserLocal.element(meetWidget).element(callButton).click();
        // TODO: Click the answer button in browserRemote

        // TODO: Click the hang up button in browserLocal
      });

      it(`can decline an incoming call`);
    });
  });
});
