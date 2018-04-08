import {
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest,
  callEventTest
} from '../helpers/space-widget/meet';

export default function allMeetTests({
  localPage, remotePage, isGroup
}) {
  describe('Meet Tests', function meet() {
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
      hangupDuringCallTest({localPage, remotePage, isGroup});
      callEventTest({
        caller: localPage,
        receiver: remotePage
      });
    });
  });
}

