const assert = require(`assert`);

browser.timeouts(`script`, 60000);

// We want to get these constants setup with test user details
// Currently testing to my test account "adam.weeks+spark@gmail.com"
const toUserName = `AdamTest WeeksTest`;

describe(`Widget Message Meet`, () => {
  before(() => {
    const textarea = browser.element(`textarea`);
    browser
      .url(`/`)
      .waitForVisible(textarea, 30000);
  });

  it(`should have the right page title`, () => {
    const title = browser.getTitle();
    assert.equal(title, `Message Meet Widget Demo`);
  });

  it(`should have the user's name in title bar`, () => {
    const title = browser.getText(`h1=${toUserName}`);
    assert.equal(title, toUserName);
  });
});
