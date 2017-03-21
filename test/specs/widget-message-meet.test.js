/* eslint-disable max-nested-callbacks */

const assert = require(`assert`);

// We want to get these constants setup with test user details
// Currently testing to my test account "adam.weeks+spark@gmail.com"
const toUserName = `AdamTest WeeksTest`;

describe(`Widget Message Meet`, () => {
  before(`setup browser`, () => {
    browser
      .url(`/`);
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
  });
});
