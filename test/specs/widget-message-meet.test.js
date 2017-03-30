/* eslint-disable max-nested-callbacks */

import chai from 'chai';
import uuid from 'uuid';

const assert = chai.assert;

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

describe(`Widget Message Meet`, () => {
  let mccoy, spock;
  const scopes = `spark:kms spark:rooms_read spark:rooms_write spark:memberships_read spark:memberships_write spark:messages_read spark:messages_write`;
  before(`setup browser and users`, () =>
    testUsers.create({count: 2, scopes})
      .then((users) => {
        [mccoy, spock] = users;
        // spock.spark = new CiscoSpark({
        //   credentials: {
        //     authorization: spock.token
        //   }
        // });

        // mccoy.spark = new CiscoSpark({
        //   credentials: {
        //     authorization: mccoy.token
        //   }
        // });
        console.info(`RUN THIS:`);
        console.info(`window.openWidget("${spock.token.access_token}", "${mccoy.email}");`);
        console.info(`END: RUN THIS`);
        return browser
          .url(`/widget-message-meet`)
          .execute((localAccessToken, localToUserEmail) => {
            window.openWidget(localAccessToken, localToUserEmail);
          }, spock.token.access_token, mccoy.email);

      }));

  // Leaves the browser open for further testing and inspection
  after(() => {
    browser.timeouts(`implicit`, 120000);
    return browser.waitUntil(() => false, 120000, `done waiting: bye`, 10000);
  });

  it(`should have the right page title`, () => {
    const title = browser.getTitle();
    assert.equal(title, `Widget Message Meet Test`);
  });

  describe(`widget loaded`, () => {
    before(`make sure widget is loaded before testing`, () => {
      browser
        .waitForText(`h1=${mccoy.displayName}`, 60000);
    });

    it(`should have the user's name in title bar`, () => {
      const title = browser.getText(`h1=${mccoy.displayName}`);
      assert.equal(title, mccoy.displayName);
    });

    describe(`conversation loaded`, () => {
      const messageComposer = `.ciscospark-message-composer`;
      const textarea = `textarea.ciscospark-textarea`;
      const sendText = `e2e: ${uuid.v4()}`;

      before(() => {
        $(messageComposer).waitForVisible(30000);
      });

      it(`should have a send message textarea`, () => {
        assert.isTrue(browser.isVisible(textarea));
      });

      it(`should fill the textarea`, () => {
        browser.setValue(textarea, sendText);
        assert.equal(browser.getValue(textarea), sendText, `textarea equals sent text`);
      });

    });
  });
});
