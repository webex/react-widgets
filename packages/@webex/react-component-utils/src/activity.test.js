import {constructActivity} from './activity';

describe('Activity Utilities', () => {
  describe('constructActivity() functionality', () => {
    let activityObject, actor, conversation;

    beforeEach(() => {
      actor = {
        id: 'mocked-actor-id',
        name: 'mocked-actor-name'
      };

      activityObject = {
        displayName: 'Mocked Test Message'
      };

      conversation = {
        id: 'mocked-convo'
      };
    });

    it('creates a pending activity', () => {
      const constructedActivity = constructActivity(conversation, activityObject, actor);

      // eslint-disable-next-line no-underscore-dangle
      expect(constructedActivity._status).toEqual('pending');
    });

    it('sanitizes xss inputs', () => {
      const xssAttempt = '<svg/onload=alert(1)>';

      activityObject.content = xssAttempt;

      const constructedActivity = constructActivity(conversation, activityObject, actor, true);

      expect(constructedActivity.object.content).toEqual('&lt;svg/onload=alert(1)&gt;');
    });
  });
});
