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
});
