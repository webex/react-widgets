/* eslint-disable max-nested-callbacks */

import chai from 'chai';
import uuid from 'uuid';

const assert = chai.assert;

// We want to get these constants setup with test user details
// Currently testing to my test account "adam.weeks+spark@gmail.com"
const toUserName = `AdamTest WeeksTest`;

describe(`Widget Message Meet`, () => {
  before(`setup browser`, () => {
    browser.url(`/`);
  });

  it(`should have the right page title`, () => {
    const title = browser.getTitle();
    assert.equal(title, `Message Meet Widget Demo`);
  });

  describe(`widget loaded`, () => {
    before(`make sure widget is loaded before testing`, () => {
      browser
        .waitForVisible(`h1`, 60000);
    });

    it(`should have the user's name in title bar`, () => {
      const title = browser.getText(`h1=${toUserName}`);
      assert.equal(title, toUserName);
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
