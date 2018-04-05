export default function activityMenuTests(page) {
  describe('Activity Menu', () => {
    it('switches to files widget', () => {
      page.switchToFiles();
      browser.waitUntil(() =>
        page.hasFilesWidget,
      5000, 'could not switch to files widget');
    });

    it('switches to message widget', () => {
      page.switchToMessage();
      browser.waitUntil(() =>
        page.hasMessageWidget,
      5000, 'could not switch to message widget');
    });

    it('switches to meet widget', () => {
      page.switchToMeet();
      browser.waitUntil(() =>
        page.hasMeetWidget,
      5000, 'could not switch to meet widget');
    });

    it('closes activity menu with the exit button', () => {
      page.closeActivityMenu();
    });
  });
}

