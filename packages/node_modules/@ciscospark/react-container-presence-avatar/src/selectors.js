import {createSelector} from 'reselect';
import moment from 'moment';

const getAvatars = (state) => state.avatar.get('items').toJS();
const getPresence = (state) => state.presence.get('items').toJS();
const getProps = (state, props) => props;

const getAvatarProps = createSelector(
  [getAvatars, getPresence, getProps],
  (avatars, presence, props) => {
    const image = props.image || avatars[props.avatarId];
    // Allow user to override the avatar image, otherwise get it from the store
    const userPresence = presence[props.avatarId];
    let presenceStatus;

    if (userPresence) {
      presenceStatus = userPresence.status;
      if (userPresence.status === 'inactive' && userPresence.lastActive) {
        // Users are actually only 'inactive' after lastActive is > 24 hours
        const lastActive = moment(userPresence.lastActive);
        const now = moment();

        if (now.diff(lastActive, 'hours') < 24) {
          // User is in limbo, not active and not inactive
          presenceStatus = undefined;
        }
      }
    }

    return {
      image,
      presenceStatus
    };
  }
);

export default getAvatarProps;
