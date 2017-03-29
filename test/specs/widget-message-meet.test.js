/* eslint-disable max-nested-callbacks */

import chai from 'chai';
import uuid from 'uuid';

const assert = chai.assert;

import testUsers from '@ciscospark/test-helper-test-users';
import CiscoSpark from '@ciscospark/spark-core';

describe(`Widget Message Meet`, () => {
  let mccoy, spock;
  before(`setup browser and users`, () =>
    testUsers.create({count: 2})
      .then((users) => {
        [mccoy, spock] = users;
        console.info({mccoy});
        spock.spark = new CiscoSpark({
          credentials: {
            authorization: spock.token
          }
        });

        mccoy.spark = new CiscoSpark({
          credentials: {
            authorization: mccoy.token
          }
        });

        return Promise.all([
          spock.spark.phone.register(),
          mccoy.spark.phone.register(),
          browser
            .url(`/widget-message-meet`)
            .execute((localAccessToken, localToUserEmail) => {
              window.openWidget(localAccessToken, localToUserEmail);
            }, spock.token, mccoy.email)
        ]);
      }));

  after(() => Promise.all([
    spock && spock.spark.phone.deregister()
      .catch((reason) => console.warn(`could not disconnect spock from mercury`, reason)),
    mccoy && mccoy.spark.phone.deregister()
      .catch((reason) => console.warn(`could not disconnect mccoy from mercury`, reason))
  ]));

  it(`should have the right page title`, () => {
    const title = browser.getTitle();
    assert.equal(title, `Widget Message Meet Test`);
  });

  describe(`widget loaded`, () => {
    before(`make sure widget is loaded before testing`, () => {
      browser
        .waitForText(`h1=${mccoy.username}`, 60000);
    });

    it(`should have the user's name in title bar`, () => {
      const title = browser.getText(`h1=${mccoy.username}`);
      assert.equal(title, mccoy.username);
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
