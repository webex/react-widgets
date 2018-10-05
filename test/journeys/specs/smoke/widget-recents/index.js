import {assert} from 'chai';

import {createSpace, disconnectDevices, registerDevices, setupGroupTestUsers} from '../../../lib/test-users';
import waitForPromise from '../../../lib/wait-for-promise';
import {runAxe} from '../../../lib/axe';
import {
  clearEventLog,
  getEventLog,
  findEventName
} from '../../../lib/events';

import {jobNames, renameJob, updateJobStatus} from '../../../lib/test-helpers';
import {elements as meetElements, hangup} from '../../../lib/test-helpers/space-widget/meet';
import {
  createSpaceAndPost,
  displayAndReadIncomingMessage,
  displayIncomingMessage,
  elements
} from '../../../lib/test-helpers/recents-widget';

describe('Smoke Tests - Recents Widget', () => {
  const browserLocal = browser.select('browserLocal');
  const browserRemote = browser.select('browserRemote');
  const jobName = jobNames.smokeRecents;

  let allPassed = true;
  let docbrown, lorraine, marty, participants;
  let conversation, oneOnOneConversation;

  before('start new sauce session', () => {
    renameJob(jobName, browser);
  });

  before('load browser for recents widget', () => {
    browserLocal.url('/recents.html');
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

  it('open recents widget for marty', () => {
    browserLocal.execute((localAccessToken) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        }
      };
      window.openRecentsWidget(options);
    }, marty.token.access_token);
    browserLocal.waitForVisible(elements.recentsWidget);
  });

  it('open meet widget for lorraine', () => {
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

  describe('Group Space', () => {
    it('displays a new incoming message', () => {
      const lorraineText = 'Marty, will we ever see you again?';
      displayIncomingMessage(browserLocal, lorraine, conversation, lorraineText);
    });

    it('removes unread indicator when read', () => {
      const lorraineText = 'You\'re safe and sound now!';
      displayAndReadIncomingMessage(browserLocal, lorraine, marty, conversation, lorraineText);
    });

    describe('events', () => {
      // https://github.com/webex/react-ciscospark/blob/master/packages/node_modules/%40ciscospark/widget-recents/events.md
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
        assert.isNotEmpty(event.toPersonId, 'does not contain toPersonId');
        assert.isNotEmpty(event.toPersonEmail, 'does not contain toPersonEmail');
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
        browserLocal.click(elements.firstSpace);
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
        browserLocal.click(elements.firstSpace);
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
        assert.isNotEmpty(event.toPersonEmail, 'does not contain toPersonEmail');
      });

      it('memberships:created', () => {
        const roomTitle = 'Test Group Space 2';
        const firstPost = 'Everybody who\'s anybody drinks.';
        clearEventLog(browserLocal);
        createSpaceAndPost(browserLocal, lorraine, [marty, docbrown, lorraine], roomTitle, firstPost);
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
        browserLocal.waitUntil(() => browserLocal.getText(`${elements.firstSpace} ${elements.title}`) !== roomTitle);
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
  });

  describe('Incoming Call', () => {
    it('displays a call in progress button', () => {
      browserRemote.waitForVisible(meetElements.callButton);
      browserRemote.click(meetElements.callButton);
      browserLocal.waitUntil(() => browserLocal.isVisible(elements.joinCallButton));
      hangup(browserRemote);
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', () => {
      it('should have no accessibility violations', () =>
        runAxe(browserLocal, 'ciscospark-widget')
          .then((results) => {
            assert.equal(results.violations.length, 0, 'has accessibilty violations');
          }));
    });
  });

  /* eslint-disable-next-line func-names */
  afterEach(function () {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(() => {
    updateJobStatus(jobName, allPassed);
  });

  after('disconnect', () => disconnectDevices(participants));
});
