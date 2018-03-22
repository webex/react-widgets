import {
  elements,
  openMenuAndClickButton
} from '../test-helpers/space-widget/main';

export default function activityMenuTests(aBrowser) {
  describe('Activity Menu', () => {
    it('switches to files widget', () => {
      openMenuAndClickButton(aBrowser, elements.filesButton);
      browser.waitUntil(() =>
        aBrowser.isVisible(elements.filesWidget),
      5000, 'could not switch to files widget');
    });

    it('switches to message widget', () => {
      openMenuAndClickButton(aBrowser, elements.messageButton);
      browser.waitUntil(() =>
        aBrowser.isVisible(elements.messageWidget),
      5000, 'could not switch to message widget');
    });

    it('switches to meet widget', () => {
      openMenuAndClickButton(aBrowser, elements.meetButton);
      browser.waitUntil(() =>
        aBrowser.isVisible(elements.meetWidget),
      5000, 'could not switch to meet widget');
    });

    it('closes activity menu with the exit button', () => {
      openMenuAndClickButton(aBrowser, elements.exitButton);
      browser.waitUntil(() =>
        !aBrowser.isVisible(elements.activityMenu),
      5000, 'could not open and close activity menu');
    });
  });
}

