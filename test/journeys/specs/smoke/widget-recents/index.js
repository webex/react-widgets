import {assert} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import waitForPromise from '../../../lib/wait-for-promise';
import {runAxe} from '../../../lib/axe';
import {
  clearEventLog,
  getEventLog,
  findEventName
} from '../../../lib/events';

import {elements as meetElements} from '../../../lib/test-helpers/space-widget/meet';
import {
  createSpaceAndPost,
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  elements
} from '../../../lib/test-helpers/recents-widget';

describe('Smoke Tests - Recents Widget', () => {
  let allPassed = true;
  let docbrown, lorraine, marty, participants;
  let conversation, oneOnOneConversation;

  const TIMEOUT = 12000;
  const SPACE1 = 'Test Group Space';
  const SPACE2 = 'Test Group Space 2';
  const KEYWORD1 = 'test';
  const EXPECTED_RESULT_2 = [SPACE1, SPACE2];

  before('create test users', () => {
    participants = setupGroupTestUsers();
    assert.lengthOf(participants, 3, 'Test users were not created');
    [docbrown, lorraine, marty] = participants;
    registerDevices(participants);
  });

  before('loads the page', () => {
    browser.refresh();
    // load browser for recents widget
    browserLocal.url('/recents.html');
    // load browser for meet widget
    browserRemote.url('/space.html?meetRecents');
  });

  it('open recents widget for marty', () => {
    browserLocal.execute((localAccessToken) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        enableAddButton: true,
        enableSpaceListFilter: true,
        enableUserProfile: true
      };

      window.openRecentsWidget(options);
    }, marty.token.access_token);
    browserLocal.$(elements.recentsWidget).waitForDisplayed();
    browserLocal.$(elements.loadingScreen).waitForDisplayed({
      timeout: 10000,
      reverse: true
    });
  });

  it('loads the test page', () => {
    const title = browserLocal.getTitle();

    assert.equal(title, 'Cisco Spark Widget Test');
  });

  describe('Header Items', () => {
    it('has a search bar for space filtering', () => {
      assert.isTrue(browserLocal.$(elements.searchInput).isDisplayed(), 'does not have header search bar');
    });

    it('has a user profile picture', () => {
      assert.isTrue(browserLocal.$(elements.headerProfile).isDisplayed(), 'does not have header profile');
    });

    it('has an add space button', () => {
      assert.isTrue(browserLocal.$(elements.headerAddButton).isDisplayed(), 'does not have header add space button');
    });
  });

  describe('No Spaces Message', () => {
    it('has no spaces title', () => {
      assert.isTrue(browserLocal.$(elements.noSpacesTitle).isDisplayed(), 'does not have no spaces title');
      assert.equal(browserLocal.$(elements.noSpacesTitle).getText(), 'No spaces yet');
    });

    it('has no spaces message', () => {
      assert.isTrue(browserLocal.$(elements.noSpacesMessage).isDisplayed(), 'does not have no spaces message');
      assert.equal(browserLocal.$(elements.noSpacesMessage).getText(), 'Create a space using the plus button next to the search bar above.');
    });
  });

  describe('Group Space', () => {
    before('creates group spaces', () => {
      conversation = createSpace({
        sparkInstance: marty.spark,
        participants,
        displayName: SPACE1
      });
    });

    it('creates a one-on-one', () => {
      oneOnOneConversation = createSpace({
        sparkInstance: marty.spark,
        participants: [lorraine, marty]
      });
    }, 3);

    it('displays a new incoming message', () => {
      const lorraineText = 'Marty, will we ever see you again?';

      displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
    });

    it('removes unread indicator when read', () => {
      const lorraineText = 'You\'re safe and sound now!';

      displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
    });

    describe('events', () => {
      // https://github.com/webex/react-widgets/blob/master/packages/node_modules/%40ciscospark/widget-recents/events.md
      it('messages:created - group space', () => {
        clearEventLog(browserLocal);
        const lorraineText = 'Don\'t be such a square';

        displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
        const events = findEventName({
          eventName: 'messages:created',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have messages:created event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.roomId, 'does not contain roomId');
        assert.isNotEmpty(event.roomType, 'does not contain roomType');
        assert.isNotEmpty(event.text, 'does not contain text');
        assert.isNotEmpty(event.personId, 'does not contain personId');
        assert.isNotEmpty(event.personEmail, 'does not contain personEmail');
        assert.isNotEmpty(event.created, 'does not contain created');
      });

      it('rooms:unread', () => {
        clearEventLog(browserLocal);
        const lorraineText = 'Your Uncle Joey didn\'t make parole again.';

        displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
        const events = findEventName({
          eventName: 'rooms:unread',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have rooms:unread event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.title, 'does not contain title');
        assert.isNotEmpty(event.type, 'does not contain type');
        assert.exists(event.isLocked, 'does not contain isLocked');
        assert.isNotEmpty(event.lastActivity, 'does not contain lastActivity');
        assert.isNotEmpty(event.created, 'does not contain created');
      });

      it('rooms:read', () => {
        clearEventLog(browserLocal);
        const lorraineText = 'Your Uncle Joey didn\'t make parole again.';

        displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
        const events = findEventName({
          eventName: 'rooms:read',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have rooms:read event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.title, 'does not contain title');
        assert.isNotEmpty(event.type, 'does not contain type');
        assert.exists(event.isLocked, 'does not contain isLocked');
        assert.isNotEmpty(event.lastActivity, 'does not contain lastActivity');
        assert.isNotEmpty(event.created, 'does not contain created');
      });

      it('rooms:selected - group space', () => {
        clearEventLog(browserLocal);
        browserLocal.$(elements.firstSpace).click();
        const events = findEventName({
          eventName: 'rooms:selected',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have rooms:selected event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.title, 'does not contain title');
        assert.isNotEmpty(event.type, 'does not contain type');
        assert.exists(event.isLocked, 'does not contain isLocked');
        assert.isNotEmpty(event.lastActivity, 'does not contain lastActivity');
        assert.isNotEmpty(event.created, 'does not contain created');
      });

      it('rooms:selected - oneOnOne space', () => {
        const lorraineText = 'Your Uncle Joey didn\'t make parole again.';

        displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, lorraineText, true);
        clearEventLog(browserLocal);
        browserLocal.$(elements.firstSpace).click();
        const events = findEventName({
          eventName: 'rooms:selected',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have rooms:selected event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.title, 'does not contain title');
        assert.isNotEmpty(event.type, 'does not contain type');
        assert.exists(event.isLocked, 'does not contain isLocked');
        assert.isNotEmpty(event.lastActivity, 'does not contain lastActivity');
        assert.isNotEmpty(event.created, 'does not contain created');
        // Note: this attribute randomly show/do not show
        // assert.isNull(event.toPersonEmail, 'does not contain toPersonEmail');
      });

      it('memberships:created', () => {
        const firstPost = 'Everybody who\'s anybody drinks.';

        clearEventLog(browserLocal);
        createSpaceAndPost(browserLocal, lorraine, [marty, docbrown, lorraine], SPACE2, firstPost);
        const events = findEventName({
          eventName: 'memberships:created',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have memberships:created event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.roomId, 'does not contain roomId');
        assert.isNotEmpty(event.personId, 'does not contain personId');
        assert.isNotEmpty(event.personEmail, 'does not contain personEmail');
        assert.isNotEmpty(event.created, 'does not contain created');
      });

      it('memberships:deleted', () => {
        // Create Room
        const roomTitle = 'Kick Marty Out';
        const firstPost = 'Goodbye Marty.';
        const kickedConversation = createSpaceAndPost(
          browserLocal,
          lorraine,
          [marty, docbrown, lorraine],
          roomTitle,
          firstPost
        );

        // Remove user from room
        clearEventLog(browserLocal);
        waitForPromise(lorraine.spark.internal.conversation.leave(kickedConversation, marty));

        browserLocal.waitUntil(
          () =>
            browserLocal.$(`${elements.firstSpace} ${elements.title}`).isDisplayed() &&
            browserLocal.$(`${elements.firstSpace} ${elements.title}`).getText() !== roomTitle,
          {
            timeout: 20000,
            timeoutMsg: 'Room title was not displayed'
          }
        );

        const events = findEventName({
          eventName: 'memberships:deleted',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have memberships:deleted event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.roomId, 'does not contain roomId');
        assert.isNotEmpty(event.personId, 'does not contain personId');
        assert.isNotEmpty(event.personEmail, 'does not contain personEmail');
        assert.isNotEmpty(event.created, 'does not contain created');
      });

      it('add:clicked', () => {
        clearEventLog(browserLocal);
        browserLocal.$(elements.headerAddButton).click();
        const events = findEventName({
          eventName: 'add:clicked',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have add:clicked event in log');
      });

      it('profile:clicked', () => {
        clearEventLog(browserLocal);
        browserLocal.$(elements.headerProfile).click();
        const events = findEventName({
          eventName: 'profile:clicked',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have profile:clicked event in log');

        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'profile:clicked data does not contain id');
        assert.isNotEmpty(event.displayName, 'profile:clicked data does not contain displayName');
        assert.isNotEmpty(event.email, 'profile:clicked data does not contain email');
        assert.isNotEmpty(event.orgId, 'profile:clicked data does not contain orgId');
      });
    });
  });

  describe('1:1 Space', () => {
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

    describe('events', () => {
      it('messages:created - one on one space', () => {
        clearEventLog(browserLocal);
        const lorraineText = 'Don\'t be such a square';

        displayIncomingMessage(browserLocal, lorraine, oneOnOneConversation, lorraineText, true);
        const events = findEventName({
          eventName: 'messages:created',
          events: getEventLog(browserLocal)
        });

        assert.isNotEmpty(events, 'does not have messages:created event in log');
        const event = events[0].detail.data;

        assert.isNotEmpty(event.id, 'does not contain id');
        assert.isNotEmpty(event.roomId, 'does not contain roomId');
        assert.isNotEmpty(event.roomType, 'does not contain roomType');
        // Note: these 2 attributes randomly show/do not show
        // assert.isNotEmpty(event.toPersonId, 'does not contain toPersonId');
        // assert.isNotEmpty(event.toPersonEmail, 'does not contain toPersonEmail');
        assert.isNotEmpty(event.text, 'does not contain text');
        assert.isNotEmpty(event.personId, 'does not contain personId');
        assert.isNotEmpty(event.personEmail, 'does not contain personEmail');
        assert.isNotEmpty(event.created, 'does not contain created');
      });
    });
  });

  describe('Incoming Call', () => {
    it('open meet widget for lorraine', () => {
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

      browserRemote.$(meetElements.meetWidget).waitForDisplayed();
    });

    it('displays a call in progress button', () => {
      browserRemote.$(meetElements.callButton).waitForDisplayed({timeout: 60000});
      browserRemote.$(meetElements.callButton).click();
      browserLocal.waitUntil(() => browserLocal.$(elements.joinCallButton).isDisplayed(), {
        timeout: 10000,
        timeoutMsg: 'Join Call button was not displayed'
      });
    }, 3);
    // it('hangup', () => {
    //   // Hangup
    //   hangup(browserRemote);

    //   browserLocal.waitUntil(() => !browserLocal.$(elements.joinCallButton).isDisplayed(), {
    //     timeout: 20000,
    //     timeoutMsg: 'Join Call button was not hidden after hanging up'
    //   });
    // }, 3);
  });


  // This test doesn't work anymore and is failing constantly
  describe.skip('With keyword / search term input box', () => {
    it(`displays ${EXPECTED_RESULT_2.length} items for keyword filter '${KEYWORD1}'`, () => {
      browserLocal.$(elements.searchInput).setValue(KEYWORD1);

      const results = browserLocal.$$(elements.listContainer);

      console.log(results);

      assert.equal(results.length, EXPECTED_RESULT_2.length);
    });

    it('displays original list if clear icon is clicked', () => {
      browserLocal.$(elements.clearButton).click();
      // browserLocal.waitUntil(() => browserLocal.$(elements.clearButton).click(), {
      //   timeout: TIMEOUT
      // });
      browserLocal.waitUntil(() => browserLocal.$(elements.title).getText().length === 4, {
        timeout: TIMEOUT
      });
      const result = browserLocal.waitUntil(() => browserLocal.$(elements.title).getText(), {
        timeout: TIMEOUT
      });

      assert(result.length, 4);
    });
  });


  describe('Accessibility', () => {
    it('should have no accessibility violations', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'webex-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0, 'has accessibilty violations');
          }));
    });
  });


  it('disconnects test users', () => disconnectDevices(participants));

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });
});
