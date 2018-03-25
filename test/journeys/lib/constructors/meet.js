import {
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest
} from '../test-helpers/space-widget/meet';

export default function allMeetTests({
  browserLocal, browserRemote, isGroup
}) {
  it('hangs up before answer', () => {
    hangupBeforeAnswerTest(browserLocal, browserRemote);
  });

  it('declines an incoming call', () => {
    declineIncomingCallTest({browserLocal, browserRemote, isGroup});
  });

  it('hangs up active call', () => {
    hangupDuringCallTest({browserLocal, browserRemote, isGroup});
  });
}

