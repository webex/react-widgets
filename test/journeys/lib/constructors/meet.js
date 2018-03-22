import {
  hangupBeforeAnswerTest,
  declineIncomingCallTest,
  hangupDuringCallTest
} from '../test-helpers/space-widget/meet';

export default function allMeetTests({
  browserLocal, browserRemote, loadBrowsers
}) {
  it('hangs up before answer', () => {
    loadBrowsers();
    hangupBeforeAnswerTest(browserLocal, browserRemote);
  });

  it('declines an incoming call', () => {
    loadBrowsers();
    declineIncomingCallTest(browserLocal, browserRemote);
  });

  it('hangs up active call', () => {
    loadBrowsers();
    hangupDuringCallTest(browserLocal, browserRemote);
  });
}

