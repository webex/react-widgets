import {
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest
} from '../test-helpers/space-widget/meet';

export default function allMeetTests({
  localPage, remotePage, isGroup
}) {
  describe('Data API', function meet() {
    before(() => {
      localPage.loadWithDataApi({
        toPersonEmail: remotePage.user.email,
        initialActivity: 'message'
      });

      remotePage.loadWithDataApi({
        toPersonEmail: localPage.user.email,
        initialActivity: 'message'
      });

      browser.waitUntil(() =>
        localPage.hasMessageWidget,
      10000, 'failed to load local widget');

      browser.waitUntil(() =>
        remotePage.hasMessageWidget,
      10000, 'failed to load remote widget');
    });

    beforeEach(function beforeEachTest() {
      remotePage.setPageTestName(`Remote - ${this.currentTest.title}`);
      localPage.setPageTestName(`Local - ${this.currentTest.title}`);
    });

    it('hangs up before answer', () => {
      hangupBeforeAnswerTest({localPage, remotePage});
    });

    it('declines an incoming call', () => {
      declineIncomingCallTest({localPage, remotePage, isGroup});
    });

    it('hangs up active call', () => {
      hangupDuringCallTest({localPage, remotePage, isGroup});
    });

    it('has proper call event data', () => {
      localPage.clearEventLog();
      remotePage.clearEventLog();
      hangupDuringCallTest({localPage, remotePage, isGroup: false});
      callEventTest({
        caller: localPage,
        receiver: remotePage
      });
    });
  });
}

