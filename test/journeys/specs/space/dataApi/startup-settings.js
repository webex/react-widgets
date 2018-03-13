import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {elements} from '../../../lib/test-helpers/space-widget/main';
import {answer, hangup} from '../../../lib/test-helpers/space-widget/meet';
import {constructHydraId} from '../../../lib/hydra';

describe('Widget Space: Group', () => {
  describe('Data API Settings', () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let docbrown, lorraine, marty;
    let conversation;

    before('intialize', () => {
      browser
        .url('/data-api/space.html')
        .execute(() => {
          localStorage.clear();
        });

      testUsers.create({count: 1, config: {displayName: 'Marty McFly'}})
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
        });

      testUsers.create({count: 1, config: {displayName: 'Emmett Brown'}})
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
        });

      testUsers.create({count: 1, config: {displayName: 'Lorraine Baines'}})
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
        });

      browser.pause(5000);

      marty.spark.internal.conversation.create({
        displayName: 'Test Widget Space',
        participants: [marty, docbrown, lorraine]
      }).then((c) => {
        conversation = c;
        return conversation;
      });

      browser.waitUntil(() => conversation && conversation.id, 5000, 'failed to create conversation');
    });

    describe('initial activity setting: meet', () => {
      it('opens meet widget', () => {
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
        browserLocal.waitForVisible(elements.meetButton);
      });

      after('refresh browsers to remove widgets', browser.refresh);
    });

    describe('initial activity setting: message', () => {
      it('opens message widget', () => {
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
        browserLocal.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
      });

      after('refresh browsers to remove widgets', browser.refresh);
    });

    describe('start call setting', () => {
      it('starts call when set to true', () => {
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
        browserRemote.waitForVisible(spaceWidget);

        answer(browserRemote);
        hangup(browserLocal);
      });

      after('refresh browsers to remove widgets', browser.refresh);
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
        browserRemote.waitForVisible(spaceWidget);
        browserLocal.waitForVisible(spaceWidget);

        browserRemote.waitForVisible(`[placeholder="Send a message to ${conversation.displayName}"]`);
      });

      after('refresh browsers to remove widgets', browser.refresh);
    });

    after('disconnect', () => Promise.all([
      marty.spark.internal.mercury.disconnect(),
      lorraine.spark.internal.mercury.disconnect()
    ]));
  });
});
