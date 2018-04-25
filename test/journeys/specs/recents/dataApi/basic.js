import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-logger';
import '@ciscospark/internal-plugin-conversation';
import '@ciscospark/internal-plugin-feature';
import CiscoSpark from '@ciscospark/spark-core';

import {moveMouse, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {FEATURE_FLAG_GROUP_CALLING, elements as meetElements, hangup} from '../../../lib/test-helpers/space-widget/meet';
import {
  createSpaceAndPost,
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  elements
} from '../../../lib/test-helpers/recents-widget';

describe('Widget Recents: Data API', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = 'react-widget-recents-dataApi';

  let allPassed = true;
  let docbrown, lorraine, marty;
  let conversation, oneOnOneConversation;

  before('start new sauce session', () => {
    if (process.env.INTEGRATION) {
      browser.reload();
    }
    renameJob(jobName);
  });


  before('load browser', () => {
    browserLocal.url('/data-api/recents.html');
  });

  before('load browser for meet widget', () => {
    browserRemote.url('/space.html?meetRecents');
  });

  before('create marty', () => testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
    .then((users) => {
      [marty] = users;
      marty.spark = new CiscoSpark({
        credentials: {
          authorization: marty.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return marty.spark.internal.device.register()
        .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_GROUP_CALLING, true))
        .then(() => marty.spark.internal.mercury.connect());
    }));

  before('create docbrown', () => testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
    .then((users) => {
      [docbrown] = users;
      docbrown.spark = new CiscoSpark({
        credentials: {
          authorization: docbrown.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return docbrown.spark.internal.mercury.connect();
    }));

  before('create lorraine', () => testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
    .then((users) => {
      [lorraine] = users;
      lorraine.spark = new CiscoSpark({
        credentials: {
          authorization: lorraine.token
        },
        config: {
          logger: {
            level: 'error'
          }
        }
      });
      return lorraine.spark.internal.mercury.connect();
    }));

  before('pause to let test users establish', () => browser.pause(5000));

  before('create group space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Group Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));

  before('create one on one converstation', () => lorraine.spark.internal.conversation.create({
    participants: [marty, lorraine]
  }).then((c) => {
    oneOnOneConversation = c;
    return oneOnOneConversation;
  }));

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
        toPersonEmail: localToUserEmail,
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

    it('displays a call button on hover', () => {
      displayIncomingMessage(browserLocal, lorraine, conversation, 'Can you call me?');
      moveMouse(browserLocal, elements.firstSpace);
      browserLocal.waitUntil(() => browserLocal.isVisible(elements.callButton));
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

    it('displays a call button on hover', () => {
      displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, 'Can you call me?', true);
      moveMouse(browserLocal, elements.firstSpace);
      browserLocal.waitUntil(() => browserLocal.isVisible(elements.callButton));
    });
  });

  describe('incoming call', () => {
    it('should display incoming call screen', () => {
      browserRemote.waitForVisible(meetElements.callButton);
      browserRemote.click(meetElements.callButton);
      browserLocal.waitUntil(() => browserLocal.isVisible(elements.answerButton));
      hangup(browserRemote);
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobName, allPassed);
  });

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect(),
    docbrown.spark.internal.mercury.disconnect()
  ]));
});
