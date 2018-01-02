import {assert} from 'chai';

import testUsers from '@ciscospark/test-helper-test-users';
import '@ciscospark/plugin-logger';
import CiscoSpark from '@ciscospark/spark-core';
import '@ciscospark/internal-plugin-conversation';

import {elements, openMenuAndClickButton} from '../../../lib/test-helpers/space-widget/main';
import {
  elements as rosterElements,
  canSearchForParticipants,
  hasParticipants,
  searchForPerson,
  FEATURE_FLAG_ROSTER
} from '../../../lib/test-helpers/space-widget/roster';

describe('Widget Space', () => {
  describe('Data API', () => {
    const browserLocal = browser.select('browserLocal');
    let biff, docbrown, lorraine, marty;
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
        return marty.spark.internal.device.register()
          .then(() => marty.spark.internal.feature.setFeature('developer', FEATURE_FLAG_ROSTER, true))
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
      }));

    before('create biff', () => testUsers.create({count: 1, config: {displayName: 'Biff Tannen'}})
      .then((users) => {
        [biff] = users;
        biff.spark = new CiscoSpark({
          credentials: {
            authorization: biff.token
          },
          config: {
            logger: {
              level: 'error'
            }
          }
        });
      }));

    before('pause to let test users establish', () => browser.pause(5000));

    after('disconnect', () => marty.spark.internal.mercury.disconnect());

    before('create space', () => marty.spark.internal.conversation.create({
      displayName: 'Test Widget Space',
      participants: [marty, docbrown, lorraine]
    }).then((c) => {
      conversation = c;
      return conversation;
    }));

    before('open widget for marty in browserLocal', () => {
      const spaceWidget = '.ciscospark-space-widget';
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
      browserLocal.waitForVisible(spaceWidget);
    });

    it('loads the test page', () => {
      const title = browserLocal.getTitle();
      assert.equal(title, 'Cisco Spark Widget Test');
    });

    it('loads the space name', () => {
      browserLocal.waitForVisible('h1.ciscospark-title');
      assert.equal(browserLocal.getText('h1.ciscospark-title'), conversation.displayName);
    });

    describe('When conversation is established', () => {
      before('wait for conversation to be ready', () => {
        const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;
        browserLocal.waitForVisible(textInputField);
      });

      describe('Activity Menu', () => {
        it('has a menu button', () => {
          assert.isTrue(browserLocal.isVisible(elements.menuButton));
        });

        it('displays the menu when clicking the menu button', () => {
          browserLocal.click(elements.menuButton);
          browserLocal.waitForVisible(elements.activityMenu);
        });

        it('has an exit menu button', () => {
          assert.isTrue(browserLocal.isVisible(elements.activityMenu));
          browserLocal.waitForVisible(elements.exitButton);
        });

        it('closes the menu with the exit button', () => {
          browserLocal.click(elements.exitButton);
          browserLocal.waitForVisible(elements.activityMenu, 1500, true);
        });

        it('has a message button', () => {
          browserLocal.click(elements.menuButton);
          browserLocal.element(elements.controlsContainer).element(elements.messageButton).waitForVisible();
        });

        it('has a files button', () => {
          browserLocal.element(elements.controlsContainer).element(elements.filesButton).waitForVisible();
        });

        it('hides menu and switches to message widget', () => {
          browserLocal.element(elements.controlsContainer).element(elements.messageButton).click();
          browserLocal.waitForVisible(elements.activityMenu, 1500, true);
          assert.isTrue(browserLocal.isVisible(elements.messageWidget));
        });
      });

      describe('roster tests', () => {
        before('open roster widget', () => {
          openMenuAndClickButton(browserLocal, rosterElements.peopleButton);
          browserLocal.waitForVisible(rosterElements.rosterWidget);
        });

        it('has a close button', () => {
          assert.isTrue(
            browserLocal.element(rosterElements.rosterWidget)
              .element(rosterElements.closeButton)
              .isVisible()
          );
        });

        it('has the total count of participants', () => {
          assert.equal(browserLocal.element(rosterElements.rosterTitle).getText(), 'People (3)');
        });

        it('has the participants listed', () => {
          hasParticipants(browserLocal, [marty, docbrown, lorraine]);
        });

        it('has search for participants', () => {
          canSearchForParticipants(browserLocal);
        });

        it('searches and adds person to space', () => {
          searchForPerson(browserLocal, biff.displayName, true);
          browserLocal.element(rosterElements.rosterList).waitForVisible();
          browserLocal.waitUntil(() => {
            const participantsText = browserLocal.element(rosterElements.rosterList).getText();
            return participantsText.includes(biff.displayName);
          }, 15000, 'added person not found in participant list');
          browserLocal.waitUntil(() => {
            const rosterTitle = browserLocal.element(rosterElements.rosterTitle).getText();
            return rosterTitle === 'People (4)';
          }, 15000, 'Participant count should update once user is added');
        });

        it('closes the people roster widget', () => {
          browserLocal.element(rosterElements.rosterWidget).element(rosterElements.closeButton).click();
          browserLocal.element(rosterElements.rosterWidget).waitForVisible(1500, true);
        });
      });

      describe('messaging', () => {
        it('sends and receives messages', () => {
          const textInputField = `[placeholder="Send a message to ${conversation.displayName}"]`;
          // Increase wait timeout for message delivery
          browser.timeouts('implicit', 10000);
          browserLocal.waitForVisible(textInputField);
          assert.match(browserLocal.getText('.ciscospark-system-message'), /You created this conversation/);
          const martyText = 'Wait a minute. Wait a minute, Doc. Ah... Are you telling me that you built a time machine... out of a DeLorean?';
          browserLocal.setValue(textInputField, `${martyText}\n`);
          browserLocal.waitUntil(() => browserLocal.getText('.ciscospark-activity-item-container:last-child .ciscospark-activity-text') === martyText);
        });
      });
    });
  });
});
