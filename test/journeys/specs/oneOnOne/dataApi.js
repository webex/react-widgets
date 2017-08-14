/* eslint-disable max-nested-callbacks */

import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';

import {elements, switchToMessage} from '../../lib/test-helpers/basic';

describe(`Widget Space: One on One`, () => {
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
        .url(`/data-api/space.html`)
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
        csmmDom.setAttribute(`data-toggle`, `ciscospark-space`);
        csmmDom.setAttribute(`data-access-token`, localAccessToken);
        csmmDom.setAttribute(`data-to-person-email`, localToUserEmail);
        csmmDom.setAttribute(`data-initial-activity`, `message`);
        document.getElementById(`ciscospark-widget`).appendChild(csmmDom);
        window.loadBundle(`/dist/bundle.js`);
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

      it(`switches to message widget`, () => {
        browserLocal.element(elements.controlsContainer).element(elements.messageButton).click();
        assert.isTrue(browserLocal.isVisible(elements.messageWidget));
        assert.isFalse(browserLocal.isVisible(elements.meetWidget));
      });

      it(`has a meet button`, () => {
        browserLocal.click(elements.menuButton);
        browserLocal.element(elements.controlsContainer).element(elements.meetButton).waitForVisible();
      });

      it(`switches to meet widget`, () => {
        browserLocal.element(elements.controlsContainer).element(elements.meetButton).click();
        assert.isTrue(browserLocal.isVisible(elements.meetWidget));
        assert.isFalse(browserLocal.isVisible(elements.messageWidget));
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
