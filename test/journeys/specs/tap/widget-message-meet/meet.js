/* eslint-disable max-nested-callbacks */
import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-phone';
import {switchToMeet} from '../../../lib/menu';

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
      .url(`/production.html`)
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

  before(`pause to let test users establish`, () => browser.pause(7500));

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

    browserRemote.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);

  });

  before(`open remote widget`, () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      window.openWidget(localAccessToken, localToUserEmail);
    }, mccoy.token.access_token, spock.email);
    browserRemote.waitForVisible(`[placeholder="Send a message to ${spock.displayName}"]`);
  });

  describe(`meet widget`, () => {
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    const messageWidget = `.ciscospark-message-component-wrapper`;
    const callButton = `button[aria-label="Call"]`;
    const answerButton = `button[aria-label="Answer"]`;
    const declineButton = `button[aria-label="Decline"]`;
    const hangupButton = `button[aria-label="Hangup"]`;
    const callControls = `.call-controls`;
    const remoteVideo = `.remote-video video`;

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
      beforeEach(`switch to meet widget`, () => {
        // widget switches to message after hangup
        switchToMeet(browserLocal);
        switchToMeet(browserRemote);
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserRemote.element(meetWidget).element(callButton).waitForVisible();
      });

      it(`can hangup before answer`, () => {
        browserLocal.element(meetWidget).element(callButton).click();
        // wait for call to establish
        browserRemote.waitForVisible(answerButton);
        // Call controls currently has a hover state
        browserLocal.moveToObject(meetWidget);
        browserLocal.waitForVisible(callControls);
        browserLocal.moveToObject(hangupButton);
        browserLocal.element(meetWidget).element(hangupButton).click();
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        browserRemote.element(meetWidget).element(callButton).waitForVisible();
      });

      it(`can decline an incoming call`, () => {
        browserRemote.element(meetWidget).element(callButton).click();
        browserLocal.waitForVisible(declineButton);
        browserLocal.element(meetWidget).element(declineButton).click();
        browserLocal.element(meetWidget).element(callButton).waitForVisible();
        // Pausing to let locus session flush
        browserLocal.pause(20000);
      });

      it(`can hangup in call`, () => {
        browserLocal.element(meetWidget).element(callButton).click();
        browserRemote.waitForVisible(answerButton);
        browserRemote.element(meetWidget).element(answerButton).click();
        browserRemote.waitForVisible(remoteVideo);
        // Let call elapse 5 seconds before hanging up
        browserLocal.pause(5000);
        browserLocal.moveToObject(meetWidget);
        browserLocal.waitForVisible(callControls);
        browserLocal.moveToObject(hangupButton);
        browserLocal.element(meetWidget).element(hangupButton).click();
        // Should switch back to message widget after hangup
        browserLocal.waitForVisible(messageWidget);
      });
    });
  });
});
