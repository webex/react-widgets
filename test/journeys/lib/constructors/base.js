import {
  removeWidget,
  setPageTestName
} from '../test-helpers';
import {
  createTestUsers,
  registerDevices
} from '../test-helpers/sdk';

export default function baseTest({
  name,
  userCount,
  url,
  initSpace,
  initWidgets,
  tests
}) {
  describe(name, function baseDescribe() {
    this.retries(2);
    let users, space;
    before('initialize test users', function intializeUsers() {
      users = createTestUsers(userCount);
      registerDevices(users);
    });

    it('creates a space', function createSpace() {
      this.retries(2);
      space = initSpace({users});
    });

    it('load initial browser page', function loadBrowser() {
      this.retries(2);
      return browser.url(url)
        .execute(() => {
          localStorage.clear();
        });
    });

    describe('Meet', function meet() {
      before(() => {
        initWidgets({users});
      });

      beforeEach(function beforeEachTest() {
        setPageTestName(this.currentTest.title);
      });

      tests({users, space});

      after(() => {
        removeWidget(browser);
      });
    });
  });
}

