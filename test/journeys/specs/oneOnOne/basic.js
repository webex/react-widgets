/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

describe(`Widget Space: One on One`, () => {
  const browserLocal = browser.select(`browserLocal`);

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
      .url(`/?basic`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create users`, () => testUsers.create({count: 2})
    .then((users) => {
      [mccoy, spock] = users;
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  before(`inject token`, () => {
    if (process.env.DEBUG_JOURNEYS) {
      console.info(`RUN THE FOLLOWING CODE BLOCK TO RERUN THIS TEST FROM DEV TOOLS`);
      console.info();
      console.info(`window.openSpaceWidget({
        accessToken: "${spock.token.access_token}",
        toPersonEmail: "${mccoy.email}",
        initialActivity: "message"
      });`);
      console.info();
      console.info();
    }
    browserLocal.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        toPersonEmail: localToUserEmail,
        initialActivity: `message`
      };
      window.openSpaceWidget(options);
    }, spock.token.access_token, mccoy.email);
  });

  if (process.env.DEBUG_JOURNEYS) {
    console.warn(`Running with DEBUG_JOURNEYS may require you to manually kill wdio`);
    // Leaves the browser open for further testing and inspection
    after(() => browserLocal.debug());
  }


  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Cisco Spark Widget Test`);
  });

  it(`loads the user's name`, () => {
    browserLocal.waitForVisible(`h1.ciscospark-title`);
    browserLocal.waitUntil(() => browserLocal.getText(`h1.ciscospark-title`) !== `Loading...`);
    assert.equal(browserLocal.getText(`h1.ciscospark-title`), mccoy.displayName);
  });

  describe(`Activity Menu`, () => {
    const menuButton = `button[aria-label="Main Menu"]`;
    const exitButton = `.ciscospark-activity-menu-exit button`;
    const messageButton = `button[aria-label="Message"]`;
    const meetButton = `button[aria-label="Call"]`;
    const activityMenu = `.ciscospark-activity-menu`;
    const controlsContainer = `.ciscospark-controls-container`;
    const messageWidget = `.ciscospark-message-wrapper`;
    const meetWidget = `.ciscospark-meet-wrapper`;

    it(`has a menu button`, () => {
      assert.isTrue(browserLocal.isVisible(menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      browserLocal.click(menuButton);
      browserLocal.waitForVisible(activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(browserLocal.isVisible(activityMenu));
      browserLocal.waitForVisible(exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      browserLocal.click(exitButton);
      browserLocal.waitForVisible(activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      browserLocal.click(menuButton);
      browserLocal.element(controlsContainer).element(messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      browserLocal.element(controlsContainer).element(messageButton).click();
      assert.isTrue(browserLocal.isVisible(messageWidget));
      assert.isFalse(browserLocal.isVisible(meetWidget));
    });

    it(`has a meet button`, () => {
      browserLocal.click(menuButton);
      browserLocal.element(controlsContainer).element(meetButton).waitForVisible();
    });

    it(`switches to meet widget`, () => {
      browserLocal.element(controlsContainer).element(meetButton).click();
      assert.isTrue(browserLocal.isVisible(meetWidget));
      assert.isFalse(browserLocal.isVisible(messageWidget));
    });

  });

});
