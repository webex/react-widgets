/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

describe(`Widget Message Meet`, () => {
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

  before(`create users`, () => testUsers.create({count: 2})
    .then((users) => {
      [mccoy, spock] = users;
    }));

  before(`inject token`, () => {
    browser.url(`/widget-message-meet`);
    browser.execute((localAccessToken, localToUserEmail) => {
      window.openWidget(localAccessToken, localToUserEmail);
    }, spock.token.access_token, mccoy.email);
  });

  it(`loads the test page`, () => {
    const title = browser.getTitle();
    assert.equal(title, `Widget Message Meet Test`);
  });

  it(`loads the user's name`, () => {
    browser.waitUntil(() => $(`h1`).getText() !== mccoy.email);
    assert.equal($(`h1`).getText(), mccoy.displayName);
  });

  describe(`menu functionality`, () => {
    const menuButton = `.ciscospark-activity-menu-button-wrapper button`;
    const exitButton = `.ciscospark-activity-menu-exit button`;
    const messageButton = `button[aria-label="Message"]`;
    const meetButton = `button[aria-label="Call"]`;
    const activityMenu = `.ciscospark-activity-menu`;
    const controlsContainer = `.ciscospark-controls-container`;
    const messageWidget = `.ciscospark-message-component-wrapper`;
    const meetWidget = `.ciscospark-meet-component-wrapper`;
    it(`has a menu button`, () => {
      assert.isTrue(browser.isVisible(menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      browser.click(menuButton);
      browser.waitForVisible(activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(browser.isVisible(activityMenu));
      browser.waitForVisible(exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      browser.click(exitButton);
      browser.waitForVisible(activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      browser.click(menuButton);
      browser.element(controlsContainer).element(messageButton).waitForVisible();
    });

    it(`switches to message widget`, () => {
      browser.element(controlsContainer).element(messageButton).click();
      assert.isTrue(browser.isVisible(messageWidget));
      assert.isFalse(browser.isVisible(meetWidget));
    });

    it(`has a meet button`, () => {
      browser.click(menuButton);
      browser.element(controlsContainer).element(meetButton).waitForVisible();
    });

    it(`switches to meet widget`, () => {
      browser.element(controlsContainer).element(meetButton).click();
      assert.isTrue(browser.isVisible(meetWidget));
      assert.isFalse(browser.isVisible(messageWidget));
    });

  });

});
