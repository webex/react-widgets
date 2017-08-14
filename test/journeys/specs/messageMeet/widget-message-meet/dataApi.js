/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

import {switchToMessage} from '../../../lib/test-helpers/space-widget/main';

describe(`Widget Message Meet`, () => {
  describe(`Data API`, () => {
    const browserLocal = browser.select(`browserLocal`);

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
        .url(`/data-api/message-meet.html`)
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
      browserLocal.execute((localAccessToken, localToUserEmail) => {
        const csmmDom = document.createElement(`div`);
        csmmDom.setAttribute(`class`, `ciscospark-widget`);
        csmmDom.setAttribute(`data-toggle`, `ciscospark-message-meet`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        csmmDom.setAttribute(`data-to-person-email`, localToUserEmail);
        csmmDom.setAttribute(`data-initial-activity`, `message`);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist-wmm/bundle.js`);
      }, spock.token.access_token, mccoy.email);
    });

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

    describe(`Messaging`, () => {
      before(`switch to message`, () => {
        switchToMessage(browserLocal);
      });

      it(`sends messages`, () => {
        // Increase wait timeout for message delivery
        browser.timeouts(`implicit`, 10000);
        browserLocal.waitForVisible(`[placeholder="Send a message to ${mccoy.displayName}"]`);
        assert.match(browserLocal.getText(`.ciscospark-system-message`), /You created this conversation/);
        browserLocal.setValue(`[placeholder="Send a message to ${mccoy.displayName}"]`, `Fly, you fools!\n`);
        browserLocal.waitUntil(() => browserLocal.getText(`.ciscospark-activity-item-container:last-child .ciscospark-activity-text`) === `Fly, you fools!`);
      });
    });
  });
});
