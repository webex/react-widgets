import reducer, {initialState, Space} from './reducer';
import {
  ADD_SPACE_TAGS,
  STORE_SPACES,
  UPDATE_SPACE_WITH_ACTIVITY,
  UPDATE_SPACE_READ,
  REMOVE_SPACE,
  REMOVE_SPACE_TAGS
} from './actions';

let activity, avatar, space, spaces, team, user1, user2;

describe('redux module spaces reducer', () => {
  beforeEach(() => {
    avatar = {
      objectType: 'content',
      files: {
        items: [
          {
            objectType: 'file',
            url: 'https://fileUrl',
            fileSize: 56520,
            mimeType: 'image/png',
            scr: {}
          }
        ]
      },
      contentCategory: 'images'
    };

    user1 = {
      entryEmail: 'person1@email.com',
      displayName: 'Person 1',
      emailAddress: 'person1@email.com',
      objectType: 'person',
      type: 'PERSON',
      id: 'other-userid',
      orgId: '12345678-1234-1234-1234-123456789000'
    };

    user2 = {
      entryEmail: 'person2@email.com',
      displayName: 'Person 2',
      emailAddress: 'person2@email.com',
      objectType: 'person',
      type: 'PERSON',
      id: 'this-user-id',
      orgId: '12345678-1234-1234-1234-123456789000'
    };

    team = {
      displayName: 'Test Team',
      color: '#C589C5',
      generalConversationUuid: 'spaceId',
      id: 'teamId',
      archived: false
    };

    space = {
      participants: [user1, user2],
      lastReadableActivityDate: '2017-06-07T15:13:56.326Z',
      displayName: 'Space 1',
      lastSeenActivityDate: '2017-06-07T15:13:34.505Z',
      published: '2016-02-29T17:49:17.029Z',
      url: 'https://converstaionUrl',
      locusUrl: 'https://converstaionLocusUrl',
      activities: {
        items: [activity]
      },
      tags: [
        'MUTED',
        'FAVORITE',
        'LOCKED',
        'TEAM',
        'JOINED',
        'MESSAGE_NOTIFICATIONS_OFF',
        'MENTION_NOTIFICATIONS_ON'
      ],
      avatar,
      type: 'group',
      id: 'mySpaceId',
      cluster: 'us',
      team,
      conversationWebUrl: 'https://conversationWebUrl'
    };

    spaces = [space];
  });

  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle STORE_SPACES', () => {
    expect(reducer(initialState, {
      type: STORE_SPACES,
      payload: {
        spaces
      }
    })).toMatchSnapshot();
  });

  describe('modifying existing spaces', () => {
    let addedSpaceState;

    beforeEach(() => {
      addedSpaceState = initialState.mergeDeepIn(['byId', space.id], new Space(space));
    });

    it('should handle ADD_SPACE_TAGS', () => {
      const result = reducer(addedSpaceState, {
        type: ADD_SPACE_TAGS,
        payload: {
          spaceId: space.id,
          tags: ['MESSAGE_NOTIFICATIONS_OFF']
        }
      });

      expect(result.getIn(['byId', space.id, 'tags']).indexOf('MESSAGE_NOTIFICATIONS_OFF')).not.toEqual(-1);
    });

    it('should handle REMOVE_SPACE', () => {
      const result = reducer(addedSpaceState, {
        type: REMOVE_SPACE,
        payload: {
          id: space.id
        }
      });

      expect(result.hasIn(['byId', space.id])).toBe(false);
    });

    it('should handle REMOVE_SPACE_TAGS', () => {
      const result = reducer(addedSpaceState, {
        type: REMOVE_SPACE_TAGS,
        payload: {
          spaceId: space.id,
          tags: ['MUTED']
        }
      });

      expect(result.getIn(['byId', space.id, 'tags']).indexOf('MUTED')).toEqual(-1);
    });

    it('should handle UPDATE_SPACE_WITH_ACTIVITY', () => {
      space.lastSeenActivityDate = '2017-06-17T15:13:34.505Z';

      const result = reducer(addedSpaceState, {
        type: UPDATE_SPACE_WITH_ACTIVITY,
        payload: {
          space
        }
      });

      const lastSeenActivityDate = result.getIn(['byId', space.id, 'lastSeenActivityDate']);

      expect(lastSeenActivityDate).toEqual('2017-06-17T15:13:34.505Z');
    });

    it('should handle UPDATE_SPACE_READ', () => {
      const result = reducer(addedSpaceState, {
        type: UPDATE_SPACE_READ,
        payload: {
          spaceId: space.id,
          lastSeenDate: '2017-06-17T17:11:34.505Z'
        }
      });

      const lastSeenActivityDate = result.getIn(['byId', space.id, 'lastSeenActivityDate']);

      expect(lastSeenActivityDate).toEqual('2017-06-17T17:11:34.505Z');
    });
  });
});