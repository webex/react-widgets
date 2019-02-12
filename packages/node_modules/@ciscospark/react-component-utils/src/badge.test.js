import {getBadgeState, getGlobalNotificationState} from './badge';
import * as NotificationsConstants from './constants';

describe('Notification states', () => {
  describe('Get badge state', () => {
    let space = {};
    let unread;
    let hasMention;
    const NOTIFICATION_CONFERENCE_A = {
      isMessageNotificationsOff: false,
      isMentionNotificationsOn: false,
      isMessageNotificationsOn: false,
      isMentionNotificationsOff: false
    };
    const NOTIFICATION_CONFERENCE_B = {
      isMessageNotificationsOff: false,
      isMentionNotificationsOn: true,
      isMessageNotificationsOn: false,
      isMentionNotificationsOff: false
    };
    const NOTIFICATION_CONFERENCE_C = {
      isMessageNotificationsOff: true,
      isMentionNotificationsOn: true,
      isMessageNotificationsOn: false,
      isMentionNotificationsOff: false
    };
    const NOTIFICATION_CONFERENCE_D = {
      isMessageNotificationsOff: true,
      isMentionNotificationsOn: false,
      isMessageNotificationsOn: false,
      isMentionNotificationsOff: false
    };

    beforeEach(() => {
      space = {isOneOnOne: false};
      unread = true;
      hasMention = true;
    });

    afterEach(() => {
      space = {};
    });

    describe('one on one spaces', () => {
      beforeEach(() => {
        space = {
          type: NotificationsConstants.SPACE_TYPE_ONE_ON_ONE,
          tags: []
        };
      });

      it('returns NOTIFICATIONS_BADGE_UNREAD for a unread 1on1 space', () => {
        expect(getBadgeState({
          space,
          unread,
          hasMention: false
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNREAD);
      });

      it('returns NOTIFICATIONS_BADGE_NONE for a read 1on1 space', () => {
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
      });

      it('returns NOTIFICATIONS_BADGE_MUTE for a muted 1on1 space', () => {
        space.tags.push(NotificationsConstants.MESSAGE_NOTIFICATIONS_OFF);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
      });
    });

    describe('global spaces', () => {
      describe('muted spaces', () => {
        it('returns MUTE for a read/unread group space (global ALL and space MENTION_ONLY)', () => {
          space = {...space, ...NOTIFICATION_CONFERENCE_C};
          const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

          expect(getBadgeState({
            space,
            unread: false,
            hasMention: false,
            globalNotificationState
          })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);

          expect(getBadgeState({
            space,
            unread,
            hasMention: false,
            globalNotificationState
          })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
        });

        it('returns MUTE for a group space (global ALL and space OFF)', () => {
          space = {...space, ...NOTIFICATION_CONFERENCE_D};
          const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

          expect(getBadgeState({
            space,
            unread,
            hasMention,
            globalNotificationState
          })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
          expect(getBadgeState({
            space,
            unread,
            hasMention: false,
            globalNotificationState
          })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
          expect(getBadgeState({
            space,
            unread: false,
            hasMention: false,
            globalNotificationState
          })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
        });
      });

      it('returns UNREAD for an unread group space (global ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_A};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNREAD);
      });

      it('returns MENTION for a mention group space (global ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_A};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns UNREAD for an unread group space (global ALL and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNREAD);
      });

      it('returns MENTION for a mention group space (global ALL and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns MENTION for a mention group space (global ALL and space MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_C};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_ALL;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns MENTION for a mention group space (global MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_A};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns NONE for a read/unread group space (global MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_A};
        space = {...space, ...{jeff: true}};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
      });

      it('returns UNREAD for an unread group space (global MENTION_ONLY and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNREAD);
      });

      it('returns UNMUTE for a read group space (global MENTION_ONLY and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNMUTE);
      });

      it('returns MENTION for a mention group space (global MENTION_ONLY and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns UNREAD for a unread group space (global MENTION_ONLY and space MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNREAD);
      });

      it('returns MENTION for a mention group space (global and space MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_C};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns NONE for a read/unread group space (global and space MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_C};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
      });

      it('returns MUTE for a read/unread/mention group space (global MENTION_ONLY and space OFF)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_D};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_MENTIONS;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MUTE);
      });

      it('returns MUTE for a read/unread/mention group space (global OFF)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_A};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
      });

      it('returns UNMUTE for a read group space (global OFF and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNMUTE);
      });

      it('returns UNREAD for an unread group space (global OFF and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNREAD);
      });

      it('returns MENTION for a mention group space (global OFF and space ALL)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_B};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns MENTION for a mention group space (global OFF and space MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_C};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_MENTION);
      });

      it('returns UNMUTE for a read/unread group space (global OFF and space MENTION_ONLY)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_C};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNMUTE);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_UNMUTE);
      });

      it('returns NONE for a read/unread/mention group space (global OFF and space OFF)', () => {
        space = {...space, ...NOTIFICATION_CONFERENCE_D};
        const globalNotificationState = NotificationsConstants.NOTIFICATIONS_OFF;

        expect(getBadgeState({
          space,
          unread,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
        expect(getBadgeState({
          space,
          unread,
          hasMention,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
        expect(getBadgeState({
          space,
          unread: false,
          hasMention: false,
          globalNotificationState
        })).toEqual(NotificationsConstants.NOTIFICATIONS_BADGE_NONE);
      });
    });
  });

  describe('Get global notification state', () => {
    let features;
    let items;

    beforeEach(() => {
      features = new Map();
      items = new Map();
    });

    it('returns NOTIFICATIONS_OFF if features are not set', () => {
      expect(getGlobalNotificationState(features)).toEqual(NotificationsConstants.NOTIFICATIONS_OFF);
    });

    it(`returns NOTIFICATIONS_ALL if ${NotificationsConstants.FEATURES_USER} feature "${NotificationsConstants.FEATURES_GROUP_MESSAGE_NOTIFICATIONS}" is set `, () => {
      features.set('items', items.set(NotificationsConstants.FEATURES_GROUP_MESSAGE_NOTIFICATIONS, true));
      expect(getGlobalNotificationState(features)).toEqual(NotificationsConstants.NOTIFICATIONS_ALL);
    });

    it(`returns NOTIFICATIONS_MENTIONS if ${NotificationsConstants.FEATURES_USER} feature "${NotificationsConstants.FEATURES_MENTION_NOTIFICATIONS}" is set`, () => {
      features.set('items', items.set(NotificationsConstants.FEATURES_MENTION_NOTIFICATIONS, true));
      expect(getGlobalNotificationState(features)).toEqual(NotificationsConstants.NOTIFICATIONS_MENTIONS);
    });
  });
});
