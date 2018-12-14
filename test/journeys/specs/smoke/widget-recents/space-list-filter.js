import {assert, expect} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import {enterKeywordAndWait} from '../../../lib/test-helpers/recents-widget/space-list-filter.js';

import {jobNames, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/recents-widget';

describe('Widget Recents with Space Filter Input Box', () => {
  const browserLocal = browser.select('browserLocal');
  const TIMEOUT = 20000;
  const SPACE1 = 'Test Group Space';
  const SPACE2 = 'Ask Group Space';
  const SPACE3 = 'General Group Space';
  const SPACE4 = 'Ask Widgets';
  const KEYWORD1 = 'ask';
  const KEYWORD2 = 'group';
  const EXPECTED_RESULT_2 = [SPACE2, SPACE4];
  const EXPECTED_RESULT_3 = [SPACE1, SPACE2, SPACE3];
  const EXPECTED_RESULT_4 = [SPACE1, SPACE2, SPACE3, SPACE4];

  let allPassed = true;
  let marty, participants;

  before('start new sauce session', () => {
    renameJob(jobNames.recentsGlobal, browser);
  });

  before('load browser for recents widget', () => {
    browserLocal.url('/recents.html');
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
    browserLocal.waitForVisible(elements.listContainer);
  });

  beforeEach(() => {
    browserLocal.waitForVisible(elements.listContainer);
    browserLocal.waitForVisible(elements.searchInput);
  });

  it(`display 2 items for keyword filter '${KEYWORD1}'`, () => {
    const result = enterKeywordAndWait({
      browserLocal, keyword: KEYWORD1, expectedTotal: EXPECTED_RESULT_2.length, timeout: TIMEOUT
    });
    result.map((x) => {
      const itemLabel = x.trim();
      return expect(EXPECTED_RESULT_2).contains(itemLabel);
    });
    assert(result.length, 2);
  });

  it('displays original list if clear icon is clicked', () => {
    enterKeywordAndWait({
      browserLocal, keyword: KEYWORD2, expectedTotal: EXPECTED_RESULT_3.length, timeout: TIMEOUT
    });
    browserLocal.waitUntil((() => browserLocal.click(elements.clearButton)), TIMEOUT);
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

  after(() => {
    updateJobStatus(jobNames.recentsGlobal, allPassed);
  });

  after('disconnect', () => disconnectDevices(participants));
});

