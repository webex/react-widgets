import {assert} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import {jobNames, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {elements as meetElements, hangup} from '../../../lib/test-helpers/space-widget/meet';
import {
  createSpaceAndPost,
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  elements
} from '../../../lib/test-helpers/recents-widget';

describe('Widget Recents: Data API', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');

  let allPassed = true;
  let docbrown, lorraine, marty, participants;
  let conversation, oneOnOneConversation;

  before('start new sauce session', () => {
    renameJob(jobNames.recentsDataApi, browser);
  });


  before('load browser', () => {
    browserLocal.url('/data-api/recents.html');
  });

  before('load browser for meet widget', () => {
    browserRemote.url('/space.html?meetRecents');
  });

  before('create test users and spaces', () => {
    participants = setupGroupTestUsers();
    [docbrown, lorraine, marty] = participants;
    registerDevices(participants);
    conversation = createSpace({sparkInstance: marty.spark, participants, displayName: 'Test Group Space'});
    oneOnOneConversation = createSpace({sparkInstance: marty.spark, participants: [lorraine, marty]});
  });

  before('open recents widget for marty', () => {
    browserLocal.execute((localAccessToken) => {
      const csmmDom = document.createElement('div');

      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-recents');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-recents/bundle.js');
    }, marty.token.access_token);
    browserLocal.waitForVisible(elements.recentsWidget);
  });

  before('open meet widget for lorraine', () => {
    browserRemote.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        destinationType: 'email',
        destinationId: localToUserEmail,
        initialActivity: 'meet'
      };

      window.openSpaceWidget(options);
    }, lorraine.token.access_token, marty.email);
    browserRemote.waitForVisible(meetElements.meetWidget);
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();

    assert.equal(title, 'Cisco Spark Widget Test');
  });

  describe('group space', () => {
    it('displays a new incoming message', () => {
      const lorraineText = 'Marty, will we ever see you again?';

      displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
    });

    it('removes unread indicator when read', () => {
      const lorraineText = 'You\'re safe and sound now!';

      displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
    });
  });

  describe('one on one space', () => {
    it('displays a new incoming message', () => {
      const lorraineText = 'Marty? Why are you so nervous?';

      displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, lorraineText, true);
    });

    it('removes unread indicator when read', () => {
      const lorraineText = 'You\'re safe and sound now!';

      displayAndReadIncomingMessage(browserLocal, lorraine, marty, oneOnOneConversation, lorraineText);
    });

    it('displays a new one on one', () => {
      const docText = 'Marty! We have to talk!';

      createSpaceAndPost(browserLocal, docbrown, [marty, docbrown], undefined, docText, true);
    });
  });

  describe('incoming call', () => {
    it('displays a call in progress button', () => {
      browserRemote.waitForVisible(meetElements.callButton);
      browserRemote.click(meetElements.callButton);
      browserLocal.waitUntil(() => browserLocal.isVisible(elements.joinCallButton));
      hangup(browserRemote);
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobNames.recentsDataApi, allPassed);
  });

  after('disconnect', () => disconnectDevices(participants));
});
