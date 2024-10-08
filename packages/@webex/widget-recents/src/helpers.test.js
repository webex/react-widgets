import {SPACE_TYPE_GROUP, SPACE_TYPE_ONE_ON_ONE} from '@webex/react-component-utils';

import {getSpaceAvatar, getToParticipant} from './helpers';

describe('widget-recents helpers file', () => {
  let props;

  beforeEach(() => {
    props = {
      sparkInstance: {
        internal: {
          device: {
            registered: false
          }
        }
      },
      users: {
        get: () => 'my-user-id'
      },
      fetchAvatar: jest.fn()
    };
  });

  describe('#getSpaceAvatar', () => {
    it('should not fetch avatars for a decrypting space', () => {
      const space = {
        isDecrypting: true
      };

      getSpaceAvatar(space, props);

      expect(props.fetchAvatar).not.toHaveBeenCalled();
    });

    it('should fetch the avatar for the group space id', () => {
      const space = {
        id: 'my-group-id',
        isDecrypting: false,
        type: SPACE_TYPE_GROUP
      };

      getSpaceAvatar(space, props);
      const fetchConfig = props.fetchAvatar.mock.calls[0][0];

      expect(fetchConfig.space.id).toEqual('my-group-id');
    });

    it('should fetch the avatar for the to person id', () => {
      const space = {
        isDecrypting: false,
        participants: [
          {id: 'my-user-id'},
          {id: 'to-user-id'}
        ],
        type: SPACE_TYPE_ONE_ON_ONE
      };

      getSpaceAvatar(space, props);
      const fetchConfig = props.fetchAvatar.mock.calls[0][0];

      expect(fetchConfig.userId).toEqual('to-user-id');
    });
  });

  describe('#getToParticipant', () => {
    it('should find the user that is not the current user', () => {
      const space = {
        participants: [
          {id: 'myuserid'},
          {id: 'touserid'}
        ]
      };
      const toParticipant = getToParticipant(space, 'myuserid');

      expect(toParticipant.id).toEqual('touserid');
    });

    it('should return undefined if no user found', () => {
      const space = {
        participants: [
          {id: 'myuserid'}
        ]
      };
      const toParticipant = getToParticipant(space, 'myuserid');

      expect(toParticipant).not.toBeDefined();
    });
  });
});
