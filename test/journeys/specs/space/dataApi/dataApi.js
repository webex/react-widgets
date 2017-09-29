/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import {elements} from '../../../lib/test-helpers/space-widget/main';

describe(`Widget Space`, () => {
  const browserLocal = browser.select(`browserLocal`);
  let marty;
  let conversation, participants;
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

  before(`create users`, () => testUsers.create({count: 3})
    .then((users) => {
      participants = users;
      marty = users[0];

      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        }
      });

      return marty.spark.internal.mercury.connect();
    }));

  before(`pause to let test users establish`, () => browser.pause(5000));

  after(`disconnect`, () => marty.spark.internal.mercury.disconnect());

  before(`create space`, () => marty.spark.internal.conversation.create({
    displayName: `Test Widget Space`,
    participants
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before(`inject token`, () => {
    const spaceWidget = `.ciscospark-space-widget`;
    browserLocal.execute((localAccessToken, spaceId) => {
      const csmmDom = document.createElement(`div`);
      csmmDom.setAttribute(`class`, `ciscospark-widget`);
      csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
      csmmDom.setAttribute(`data-access-token`, localAccessToken);
      csmmDom.setAttribute(`data-space-id`, spaceId);
      csmmDom.setAttribute(`data-initial-activity`, `message`);
      document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
      window.loadBundle(`/dist/bundle.js`);
    }, marty.token.access_token, conversation.id);
    browserLocal.waitForVisible(spaceWidget);
  });

  it(`loads the test page`, () => {
    const title = browserLocal.getTitle();
    assert.equal(title, `Cisco Spark Widget Test`);
  });

  it(`loads the space name`, () => {
    browserLocal.waitForVisible(`h1.ciscospark-title`);
    assert.equal(browserLocal.getText(`h1.ciscospark-title`), conversation.displayName);
  });

  describe(`Activity Menu`, () => {
    it(`has a menu button`, () => {
      assert.isTrue(browserLocal.isVisible(elements.menuButton));
    });

    it(`displays the menu when clicking the menu button`, () => {
      browserLocal.click(elements.menuButton);
      browserLocal.waitForVisible(elements.activityMenu);
    });

    it(`has an exit menu button`, () => {
      assert.isTrue(browserLocal.isVisible(elements.activityMenu));
      browserLocal.waitForVisible(elements.exitButton);
    });

    it(`closes the menu with the exit button`, () => {
      browserLocal.click(elements.exitButton);
      browserLocal.waitForVisible(elements.activityMenu, 1500, true);
    });

    it(`has a message button`, () => {
      browserLocal.click(elements.menuButton);
      browserLocal.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
    });

    it(`hides menu and switches to message widget`, () => {
      browserLocal.element(elements.controlsContainer).element(elements.messageButton).click();
      browserLocal.waitForVisible(elements.activityMenu, 1500, true);
      assert.isTrue(browserLocal.isVisible(elements.messageWidget));
    });

  });

  describe(`messaging`, () => {
    it(`sends and receives messages`, () => {
      const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;
      // Increase wait timeout for message delivery
      browser.timeouts(`implicit`, 10000);
      browserLocal.waitForVisible(textInputField);
      assert.match(browserLocal.getText(`.ciscospark-system-message`), /You created this conversation/);
      const martyText = `Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?`;
      browserLocal.setValue(textInputField, `${martyText}\n`);
      browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === martyText);
    });
  });

});
