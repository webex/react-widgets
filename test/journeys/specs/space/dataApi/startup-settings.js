import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/internal-plugin-conversation';

import {moveMouse} from '../../../lib/test-helpers';
import {elements} from '../../../lib/test-helpers/space-widget/main';
import {answer, hangup, elements as meetElements} from '../../../lib/test-helpers/space-widget/meet';
import {constructHydraId} from '../../../lib/hydra';

describe('Widget Space', () => {
  describe('Data API Settings', () => {
    const browserLocal = browser.select('browserLocal');
    const browserRemote = browser.select('browserRemote');
    let docbrown, lorraine, marty;
    let conversation;

    process.env.CISCOSPARK_SCOPE = [
      'webexsquare:get_conversation',
      'spark:people_read',
      'spark:rooms_read',
      'spark:rooms_write',
      'spark:memberships_read',
      'spark:memberships_write',
      'spark:messages_read',
      'spark:messages_write',
      'spark:teams_read',
      'spark:teams_write',
      'spark:team_memberships_read',
      'spark:team_memberships_write',
      'spark:kms'
    ].join(' ');

    before('load browsers', () => {
      browser
        .url('/data-api/space.html')
        .execute(() => {
          localStorage.clear();
        });
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

    after('disconnect', () => Promise.all([
      marty.spark.internal.mercury.disconnect(),
      lorraine.spark.internal.mercury.disconnect()
    ]));

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
      });

      after('refresh browsers to remove widgets', browser.refresh);
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
      });

      after('refresh browsers to remove widgets', browser.refresh);
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
        const spaceWidget = '.ciscospark-space-widget';
        browserRemote.waitForVisible(spaceWidget);
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

      after('refresh browsers to remove widgets', browser.refresh);
    });
  });
});
