import {assert} from 'chai';

import {setupOneOnOneUsers} from '../../lib/test-users';
import {elements, saveToken} from '../../lib/test-helpers/demo';
import {elements as spaceElements} from '../../lib/test-helpers/space-widget/main';
import {sendMessage, verifyMessageReceipt} from '../../lib/test-helpers/space-widget/messaging';
import {jobNames, renameJob, updateJobStatus} from '../../lib/test-helpers';

describe('demo widget', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = jobNames.smokeDemo;
  let allPassed = true;
  let mccoy, spock, local, remote;

  it('start new sauce session', () => {
    browser.reload();
    browser.call(() => renameJob(jobName, browser));

    browserLocal.url('/dist-demo/index.html');
    browserRemote.url('/dist-demo/index.html');
  });

  it('create test users', () => {
    [mccoy, spock] = setupOneOnOneUsers();
    local = {browser: browserLocal, user: mccoy, displayName: mccoy.displayName};
    remote = {browser: browserRemote, user: spock, displayName: spock.displayName};
  });

  it('saves token for users', () => {
    saveToken(browserLocal, mccoy.token.access_token);
    saveToken(browserRemote, spock.token.access_token);
  });

  describe('space widget', () => {
    it('opens space widget for mccoy in local', () => {
      browserLocal.click(elements.toPersonRadioButton);
      browserLocal.element(elements.toPersonInput).setValue(spock.email);
      browserLocal.click(elements.openSpaceWidgetButton);
      // Wait for conversation to be ready
      const textInputField = `[placeholder="Send a message to ${spock.displayName}"]`;
      browserLocal.waitForVisible(textInputField);
      browserLocal.scroll(textInputField);
    });

    it('opens space widget for spock in remote', () => {
      browserRemote.click(elements.toPersonRadioButton);
      browserRemote.element(elements.toPersonInput).setValue(mccoy.email);
      browserRemote.click(elements.openSpaceWidgetButton);
      // Wait for conversation to be ready
      const textInputFieldRemote = `[placeholder="Send a message to ${mccoy.displayName}"]`;
      browserRemote.waitForVisible(textInputFieldRemote);
      browserRemote.scroll(textInputFieldRemote);
    });

    describe('space widget functionality', () => {
      describe('Activity Menu', () => {
        it('has a menu button', () => {
          assert.isTrue(browserLocal.isVisible(spaceElements.menuButton));
        });

        it('displays the menu when clicking the menu button', () => {
          browserLocal.click(spaceElements.menuButton);
          browserLocal.waitForVisible(spaceElements.activityMenu);
        });

        it('has an exit menu button', () => {
          assert.isTrue(browserLocal.isVisible(spaceElements.activityMenu));
          browserLocal.waitForVisible(spaceElements.exitButton);
        });

        it('closes the menu with the exit button', () => {
          browserLocal.click(spaceElements.exitButton);
          browserLocal.waitForVisible(spaceElements.activityMenu, 60000, true);
        });
      });

      describe('messaging', () => {
        it('sends and receives messages', () => {
          const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
          const docText = 'The way I see it, if you\'re gonna build a time machine into a car, why not do it with some style?';
          sendMessage(remote, local, martyText);
          verifyMessageReceipt(local, remote, martyText, false);
          sendMessage(local, remote, docText);
          verifyMessageReceipt(remote, local, docText, false);
        });
      });
    });
  });

  describe('recents widget', () => {
    it('opens recents widget for mccoy in local', () => {
      browserLocal.click(elements.openRecentsWidgetButton);
      browserLocal.waitForVisible(elements.recentsWidgetContainer);
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => browser.call(() => updateJobStatus(jobName, allPassed)));
});
