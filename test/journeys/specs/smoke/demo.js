import {assert} from 'chai';

import {setupOneOnOneUsers} from '../../lib/test-users';
import {elements, saveToken} from '../../lib/test-helpers/demo';
import {elements as spaceElements} from '../../lib/test-helpers/space-widget/main';
import {sendMessage, verifyMessageReceipt} from '../../lib/test-helpers/space-widget/messaging';

describe('demo widget', () => {
  let allPassed = true;
  let mccoy, spock, local, remote;

  before('loads the page', async () => {
    await browser.refresh();

    await browserLocal.url('/dist-demo/index.html?local');
    await browserRemote.url('/dist-demo/index.html?remote');
  });

  before('create test users', () => {
    [mccoy, spock] = setupOneOnOneUsers();
    local = {
      browser: browserLocal,
      user: mccoy,
      displayName: mccoy.displayName
    };
    remote = {
      browser: browserRemote,
      user: spock,
      displayName: spock.displayName
    };
  });

  describe('access token authentication', () => {
    before('saves token for local user', () => {
      saveToken(browserLocal, mccoy.token.access_token);
    }, 3);

    before('saves token for remote user', () => {
      saveToken(browserRemote, spock.token.access_token);
    }, 3);

    describe('space widget', () => {
      it('opens space widget for mccoy in local', async () => {
        const toPersonRadioButton = await browserLocal.$(elements.toPersonRadioButton);
        const toPersonInput = await browserLocal.$(elements.toPersonInput);
        const openSpaceWidgetButton = await browserLocal.$(elements.openSpaceWidgetButton);
        const textInputField = await browserLocal.$(`[placeholder="Send a message to ${spock.displayName}"]`);

        await toPersonRadioButton.click();
        await toPersonInput.setValue(spock.email);
        await openSpaceWidgetButton.click();

        // Wait for conversation to be ready
        await textInputField.waitForDisplayed();
        await textInputField.scrollIntoView();
      });

      it('opens space widget for spock in remote', async () => {
        const toPersonRadioButton = await browserRemote.$(elements.toPersonRadioButton);
        const toPersonInput = await browserRemote.$(elements.toPersonInput);
        const openSpaceWidgetButton = await browserRemote.$(elements.openSpaceWidgetButton);
        const textInputField = await browserRemote.$(`[placeholder="Send a message to ${mccoy.displayName}"]`);

        await toPersonRadioButton.click();
        await toPersonInput.setValue(mccoy.email);
        await openSpaceWidgetButton.click();

        // Wait for conversation to be ready
        await textInputField.waitForDisplayed();
        await textInputField.scrollIntoView();
      });


      describe('space widget functionality', () => {
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

        describe('external control', () => {
          it('can change current activity', () => {
            assert.isTrue(browserLocal.$(spaceElements.messageWidget).isDisplayed());
            browserLocal.$(elements.changeActivityMeetButton).click();
            browserLocal.$(elements.updateSpaceWidgetButton).click();
            browserLocal.$(spaceElements.meetWidget).waitForDisplayed({
              timeout: 6000
            });
          });
        });
      });
    });

    describe('recents widget', () => {
      it('opens recents widget for mccoy in local', () => {
        browserLocal.$(elements.openRecentsWidgetButton).click();
        browserLocal.$(elements.recentsWidgetContainer).waitForDisplayed();
      });
    });
  });

  describe('sdk instance authentication', () => {
    before('reloads demo page and stores access token', async () => {
      await browser.deleteCookies();
      await browser.refresh();

      await saveToken(browserLocal, mccoy.token.access_token, true);
      await saveToken(browserRemote, spock.token.access_token, true);
    }, 3);

    describe('space widget', () => {
      it('opens space widget for mccoy in local', () => {
        browserLocal.$(elements.toPersonRadioButton).click();
        browserLocal.$(elements.toPersonInput).setValue(spock.email);
        browserLocal.$(elements.openSpaceWidgetButton).click();
        // Wait for conversation to be ready
        const textInputField = `[placeholder="Send a message to ${spock.displayName}"]`;

        browserLocal.$(textInputField).waitForDisplayed();
        browserLocal.$(textInputField).scrollIntoView();
      });

      it('opens space widget for spock in remote', () => {
        browserRemote.$(elements.toPersonRadioButton).click();
        browserRemote.$(elements.toPersonInput).setValue(mccoy.email);
        browserRemote.$(elements.openSpaceWidgetButton).click();
        // Wait for conversation to be ready
        const textInputFieldRemote = `[placeholder="Send a message to ${mccoy.displayName}"]`;

        browserRemote.$(textInputFieldRemote).waitForDisplayed();
        browserRemote.$(textInputFieldRemote).scrollIntoView();
      });

      describe('messaging', () => {
        it('sends and receives messages', () => {
          const martyText = 'Doc... what if we don\'t succeed?';
          const docText = 'We must succeed.';

          sendMessage(remote, local, martyText);
          verifyMessageReceipt(local, remote, martyText, false);
          sendMessage(local, remote, docText);
          verifyMessageReceipt(remote, local, docText, false);
        });
      });
    });

    describe('recents widget', () => {
      it('opens recents widget for mccoy in local', () => {
        browserLocal.$(elements.openRecentsWidgetButton).click();
        browserLocal.$(elements.recentsWidgetContainer).waitForDisplayed();
      });
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });
});
