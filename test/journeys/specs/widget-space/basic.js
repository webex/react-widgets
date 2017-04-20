/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/plugin-conversation';

describe(`Widget Space`, () => {
  const browserLocal = browser.select(`browserLocal`);

  let docbrown, lorraine, marty;
  let conversation;
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
      .url(`/widget-space`)
      .execute(() => {
        localStorage.clear();
      });
  });

  before(`create users`, () => testUsers.create({count: 3})
    .then((users) => {
      [marty, docbrown, lorraine] = users;

      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        }
      });

      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        }
      });

      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        }
      });

      return marty.spark.mercury.connect();
    }));

  after(`disconnect`, () => marty.spark.mercury.disconnect());

  before(`create space`, () => marty.spark.conversation.create({
    displayName: `Test Widget Space`,
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before(`inject token`, () => {
    const spaceWidget = `.ciscospark-space-widget`;
    browserLocal.execute((localAccessToken, spaceId) => {
      window.openWidget(localAccessToken, spaceId);
    }, marty.token.access_token, conversation.id);
    browserLocal.execute((c) => {
      console.log(c);
    }, conversation);
    // TODO: Remove the reload once stable
    browserLocal.waitForVisible(spaceWidget);
    browserLocal.refresh();
    browserLocal.execute((localAccessToken, spaceId) => {
      window.openWidget(localAccessToken, spaceId);
    }, marty.token.access_token, conversation.id);
  });

  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Widget Space Test`);
  });

  it(`loads the space name`, () => {
    browserLocal.waitUntil(() => browserLocal.getText(`h1`) !== conversation.displayName);
  });

  describe.skip(`Activity Menu`, () => {
    const menuButton = `button[aria-label="Main Menu"]`;
    const exitButton = `.ciscospark-activity-menu-exit button`;
    const messageButton = `button[aria-label="Message"]`;
    const meetButton = `button[aria-label="Call"]`;
    const activityMenu = `.ciscospark-activity-menu`;
    const controlsContainer = `.ciscospark-controls-container`;
    const messageWidget = `.ciscospark-message-component-wrapper`;
    const meetWidget = `.ciscospark-meet-component-wrapper`;
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
