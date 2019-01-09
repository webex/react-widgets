import {assert, expect} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import {enterKeywordAndWait} from '../../../lib/test-helpers/recents-widget/space-list-filter.js';

import {jobNames, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/recents-widget';

describe('Widget Recents Space Filters', () => {
  const browserLocal = browser.select('browserLocal');
  const TIMEOUT = 10000;
  const SPACE1 = 'Test Group Space';
  const SPACE2 = 'Ask Group Space';
  const SPACE3 = 'General Group Space';
  const SPACE4 = 'Ask Widgets';
  const KEYWORD1 = 'ask';
  const KEYWORD2 = 'group';
  const KEYWORD3 = 'test';
  const KEYWORD4 = 'something';
  const BACKSPACES = ['\b', '\b', '\b', '\b', '\b'];
  const EXPECTED_RESULT_2 = [SPACE2, SPACE4];
  const EXPECTED_RESULT_3 = [SPACE1, SPACE2, SPACE3];
  const EXPECTED_RESULT_4 = [SPACE1, SPACE2, SPACE3, SPACE4];

  let allPassed = true;
  let docbrown, lorraine, marty, participants;

  before('start new sauce session', () => {
    renameJob(jobNames.recentsFilterGlobal, browser);
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();
    [marty] = participants;
    registerDevices(participants);
    createSpace({sparkInstance: marty.spark, participants, displayName: SPACE1});
    createSpace({sparkInstance: marty.spark, participants, displayName: SPACE2});
    createSpace({sparkInstance: marty.spark, participants, displayName: SPACE3});
    createSpace({sparkInstance: marty.spark, participants, displayName: SPACE4});
  });

  describe('With search input box', () => {
    before('load browser', () => {
      browserLocal.url('/recents.html');
    });

    before('opens recents widget for marty', () => {
      browserLocal.execute((localAccessToken) => {
        const options = {
          accessToken: localAccessToken,
          onEvent: (eventName, detail) => {
            window.ciscoSparkEvents.push({eventName, detail});
          },
          enableSpaceListFilter: true
        };

        window.openRecentsWidget(options);
      }, marty.token.access_token);
      browserLocal.waitForVisible(elements.recentsWidget);
    });

    beforeEach(() => {
      browserLocal.waitForVisible(elements.listContainer);
      browserLocal.waitForExist(elements.searchInput);
    });

    it(`displays 2 items for keyword filter '${KEYWORD1}'`, () => {
      const result = enterKeywordAndWait({
        browserLocal, keyword: KEYWORD1, expectedTotal: EXPECTED_RESULT_2.length, timeout: TIMEOUT
      });

      result.map((x) => {
        const itemLabel = x.trim();

        return expect(EXPECTED_RESULT_2).contains(itemLabel);
      });
      assert(result.length, 2);
    });

    it(`displays 3 items for keyword filter '${KEYWORD2}'`, () => {
      const result = enterKeywordAndWait({
        browserLocal, keyword: KEYWORD2, expectedTotal: EXPECTED_RESULT_3.length, timeout: TIMEOUT
      });

      result.map((x) => {
        const itemLabel = x.trim();

        return expect(EXPECTED_RESULT_3).contains(itemLabel);
      });
      assert(result.length, 3);
    });

    it(`displays 1 item for keyword filter '${KEYWORD3}'`, () => {
      const result = enterKeywordAndWait({
        browserLocal, keyword: KEYWORD3, expectedTotal: 1, timeout: TIMEOUT
      });

      expect(result).to.be.an('string').that.does.contain(SPACE1);
      assert(result.length, 1);
    });

    it('displays original list for backspaces to the 1st index', () => {
      const result = enterKeywordAndWait({
        browserLocal, keyword: BACKSPACES, expectedTotal: EXPECTED_RESULT_4.length, timeout: TIMEOUT
      });

      result.map((x) => {
        const itemLabel = x.trim();

        return expect(EXPECTED_RESULT_4).contains(itemLabel);
      });
      assert(result.length, 4);
    });

    it('displays no result if keyword filter does not match items in list ', () => {
      const result = enterKeywordAndWait({
        browserLocal, keyword: KEYWORD4, expectedTotal: 0, timeout: TIMEOUT
      });

      assert.equal(result.value.length, 0, 'result does not exist');
    });

    it('displays original list if clear icon is clicked', () => {
      enterKeywordAndWait({
        browserLocal, keyword: KEYWORD1, expectedTotal: EXPECTED_RESULT_2.length, timeout: TIMEOUT
      });
      browserLocal.click(elements.clearButton);
      browserLocal.waitUntil((() => browserLocal.elements(elements.title).getText().length === 4), TIMEOUT);
      const result = browserLocal.waitUntil((() => browserLocal.elements(elements.title).getText()), TIMEOUT);

      result.map((x) => {
        const itemLabel = x.trim();

        return expect(EXPECTED_RESULT_4).contains(itemLabel);
      });
      assert(result.length, 4);
    });

    /* eslint-disable-next-line func-names */
    afterEach(function () {
      if (browserLocal.element(elements.clearButton).isExisting()) {
        browserLocal.click(elements.clearButton);
      }
      allPassed = allPassed && (this.currentTest.state === 'passed');
    });
  });

  describe('With space type filter', () => {
    describe('Space type of group', () => {
      before('load browser', () => {
        browserLocal.url('/recents.html');
      });

      before('opens recents widget for marty', () => {
        browserLocal.execute((localAccessToken) => {
          const options = {
            accessToken: localAccessToken,
            onEvent: (eventName, detail) => {
              window.ciscoSparkEvents.push({eventName, detail});
            },
            enableSpaceListFilter: true,
            spaceTypeFilter: 'group'
          };

          window.openRecentsWidget(options);
        }, marty.token.access_token);
        browserLocal.waitForVisible(elements.recentsWidget);
      });

      it('displays 4 items', () => {
        browserLocal.waitUntil((() => browserLocal.elements(elements.title).isVisible()
          && browserLocal.elements(elements.title).getText().length === 4), TIMEOUT);
        assert(browserLocal.elements(elements.title).getText().length, 4);
      });
    });

    describe('Space type of direct (one on one)', () => {
      before('load browser', () => {
        browserLocal.url('/recents.html');
      });

      before('create one on one conversations', () => {
        [lorraine, marty, docbrown] = participants;
        createSpace({sparkInstance: marty.spark, participants: [lorraine, marty]});
        createSpace({sparkInstance: marty.spark, participants: [docbrown, marty]});
      });

      before('opens recents widget for marty', () => {
        browserLocal.execute((localAccessToken) => {
          const options = {
            accessToken: localAccessToken,
            onEvent: (eventName, detail) => {
              window.ciscoSparkEvents.push({eventName, detail});
            },
            enableSpaceListFilter: true,
            spaceTypeFilter: 'direct'
          };

          window.openRecentsWidget(options);
        }, marty.token.access_token);
        browserLocal.waitForVisible(elements.recentsWidget);
      });

      it('displays 2 items', () => {
        browserLocal.waitUntil((() => browserLocal.elements(elements.title).isVisible()
          && browserLocal.elements(elements.title).getText().length === 2), TIMEOUT);
        assert(browserLocal.elements(elements.title).getText().length, 2);
      });
    });

    describe('Space type filter is not set', () => {
      before('load browser', () => {
        browserLocal.url('/recents.html');
      });

      before('opens recents widget for marty', () => {
        browserLocal.execute((localAccessToken) => {
          const options = {
            accessToken: localAccessToken,
            onEvent: (eventName, detail) => {
              window.ciscoSparkEvents.push({eventName, detail});
            },
            enableSpaceListFilter: true
          };

          window.openRecentsWidget(options);
        }, marty.token.access_token);
        browserLocal.waitForVisible(elements.recentsWidget);
      });

      it('displays 6 items', () => {
        browserLocal.waitUntil((() => browserLocal.elements(elements.title).isVisible()
          && browserLocal.elements(elements.title).getText().length === 6), TIMEOUT);
        assert(browserLocal.elements(elements.title).getText().length, 6);
      });
    });

    /* eslint-disable-next-line func-names */
    afterEach(function () {
      allPassed = allPassed && (this.currentTest.state === 'passed');
    });
  });

  after(() => {
    updateJobStatus(jobNames.recentsFilterGlobal, allPassed);
  });

  after('disconnect', () => disconnectDevices(participants));
});
