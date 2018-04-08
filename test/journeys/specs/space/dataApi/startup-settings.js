import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {moveMouse} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/space-widget/main';
import {elements as messageElements} from '../../../lib/test-helpers/space-widget/messaging';
import {answer, hangup, elements as meetElements} from '../../../lib/test-helpers/space-widget/meet';
import {constructHydraId} from '../../../lib/hydra';

describe('Widget Space: Data API Settings', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  let docbrown, lorraine, marty;
  let conversation;

  before('load browsers', () => {
    browser.url('/data-api/space.html');
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
      return marty.spark.internal.mercury.connect();
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

  before('create space', () => marty.spark.internal.conversation.create({
    displayName: 'Test Widget Space',
    participants: [marty, docbrown, lorraine]
  }).then((c) => {
    conversation = c;
    return conversation;
  }));


  describe('initial activity setting: meet', () => {
    before('inject marty token', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', spaceId);
        csmmDom.setAttribute('data-initial-activity', 'meet');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, marty.token.access_token, conversation.id);
      const spaceWidget = '.ciscospark-space-widget';
      browserLocal.waitForVisible(spaceWidget);
    });

    it('opens meet widget', () => {
      browserLocal.waitForVisible(elements.meetWidget);
      browserLocal.waitForVisible(elements.meetButton);
      browserLocal.refresh();
    });
  });

  describe('initial activity setting: message', () => {
    before('inject marty token', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', spaceId);
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, marty.token.access_token, conversation.id);
      const spaceWidget = '.ciscospark-space-widget';
      browserLocal.waitForVisible(spaceWidget);
    });

    it('opens message widget', () => {
      browserLocal.waitForVisible(elements.messageWidget);
      browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
      browserLocal.refresh();
    });
  });

  describe('start call setting', () => {
    before('inject docbrown token', () => {
      browserRemote.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', spaceId);
        csmmDom.setAttribute('data-initial-activity', 'message');
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, docbrown.token.access_token, conversation.id);
    });

    before('inject marty token', () => {
      browserLocal.execute((localAccessToken, spaceId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', spaceId);
        csmmDom.setAttribute('data-initial-activity', 'meet');
        csmmDom.setAttribute('data-start-call', true);
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, marty.token.access_token, conversation.id);
      const spaceWidget = '.ciscospark-space-widget';
      browserLocal.waitForVisible(spaceWidget);
    });

    it('starts call when set to true', () => {
      answer(browserRemote);
      moveMouse(browserLocal, meetElements.callContainer);
      hangup(browserLocal);
      hangup(browserRemote);
      // Wait for end of locus session before continuing
      browserLocal.waitUntil(() => browserLocal.getText(`${messageElements.lastActivity} ${messageElements.systemMessage}`).includes('You had a meeting'));
      browserLocal.refresh();
      browserRemote.refresh();
    });
  });

  describe('opens using hydra id ', () => {
    before('inject docbrown token', () => {
      browserRemote.execute((localAccessToken, hydraId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', hydraId);
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, docbrown.token.access_token, constructHydraId('ROOM', conversation.id));
      const spaceWidget = '.ciscospark-space-widget';
      browserRemote.waitForVisible(spaceWidget);
    });

    before('inject marty token', () => {
      browserLocal.execute((localAccessToken, hydraId) => {
        const csmmDom = document.createElement('div');
        csmmDom.setAttribute('class', 'ciscospark-widget');
        csmmDom.setAttribute('data-toggle', 'ciscospark-space');
        csmmDom.setAttribute('data-access-token', localAccessToken);
        csmmDom.setAttribute('data-space-id', hydraId);
        document.getElementById('ciscospark-widget').appendChild(csmmDom);
        window.loadBundle('/dist-space/bundle.js');
      }, marty.token.access_token, constructHydraId('ROOM', conversation.id));
      const spaceWidget = '.ciscospark-space-widget';
      browserLocal.waitForVisible(spaceWidget);
    });

    it('opens meet widget', () => {
      browser.waitForVisible(elements.messageWidget);
      browser.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
    });
  });

  after('disconnect', () => Promise.all([
    marty.spark.internal.mercury.disconnect(),
    lorraine.spark.internal.mercury.disconnect()
  ]));
});
