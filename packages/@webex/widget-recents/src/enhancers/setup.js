import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {fetchAvatar} from '@webex/redux-module-avatar';
import {getFeature} from '@webex/redux-module-features';
import {connectToMercury} from '@webex/redux-module-mercury';
import {fetchSpaces, fetchSpacesEncrypted, fetchSpacesHydra} from '@webex/redux-module-spaces';
import {fetchTeams} from '@webex/redux-module-teams';
import {storeUser} from '@webex/redux-module-users';
import {
  FEATURES_GROUP_MESSAGE_NOTIFICATIONS,
  FEATURES_MENTION_NOTIFICATIONS,
  FEATURES_USER,
  SPACE_TYPE_ONE_ON_ONE
} from '@webex/react-component-utils';

import {updateWidgetStatus} from '../actions';
import {getToParticipant, getSpaceAvatar} from '../helpers';
import getRecentsWidgetProps from '../selector';

export const DEFAULT_SPACE_COUNT = 25;

/**
 * Store the "to" participant in a 1:1 convo
 * This user is needed in our store to calculate a space title
 *
 * @param {object} space
 * @param {object} props
 */
function storeToParticipant(space, props) {
  const {users} = props;

  // Store the to user in a direct convo to calculate space title
  if (
    space.type === SPACE_TYPE_ONE_ON_ONE
  ) {
    // Find the participant that is not the current user
    const toPerson = getToParticipant(space, users.get('currentUserId'));

    if (toPerson) {
      props.storeUser(toPerson);
    }
  }
}

/**
 * Connects to the websocket server (mercury)
 * @param {object} props
 */
function connectWebsocket(props) {
  const {
    sparkInstance,
    mercuryStatus
  } = props;


  if (!mercuryStatus.hasConnected
      && !mercuryStatus.connecting
      && !mercuryStatus.connected
      && sparkInstance.internal.device.registered) {
    props.connectToMercury(sparkInstance);
  }
}

/**
 * Gets the user's feature flags
 *
 * @param {object} props
 */
function getFeatures(props) {
  const {
    sparkInstance,
    widgetStatus
  } = props;

  // Initial fetching of group message notification feature
  if (!widgetStatus.hasFetchedGroupMessageNotificationFeature) {
    props.getFeature(FEATURES_USER, FEATURES_GROUP_MESSAGE_NOTIFICATIONS, sparkInstance).then(() => {
      props.updateWidgetStatus({
        hasFetchedGroupMessageNotificationFeature: true
      });
    });
  }

  // Initial Fetching of mention notification feature
  if (!widgetStatus.hasFetchedMentionNotificationFeature) {
    props.getFeature(FEATURES_USER, FEATURES_MENTION_NOTIFICATIONS, sparkInstance).then(() => {
      props.updateWidgetStatus({
        hasFetchedMentionNotificationFeature: true
      });
    });
  }
}

/**
 * Gets the user's teams
 *
 * @param {*} props
 */
function getTeams(props) {
  const {
    sparkInstance,
    widgetStatus
  } = props;

  // Grab teams
  if (sparkInstance.internal.team
    && !widgetStatus.isFetchingTeams
    && !widgetStatus.hasFetchedTeams) {
    props.updateWidgetStatus({isFetchingTeams: true});
    props.fetchTeams(sparkInstance)
      .then(() => {
        props.updateWidgetStatus({
          isFetchingTeams: false,
          hasFetchedTeams: true
        });
      });
  }
}

/**
 * Fetches the initial space list from services
 *
 * @param {object} props
 */
function getInitialSpaces(props) {
  const {
    sparkInstance,
    widgetStatus
  } = props;

  const spaceLoadCount = (props.spaceLoadCount > 0) ? props.spaceLoadCount : DEFAULT_SPACE_COUNT;

  if (!widgetStatus.isFetchingInitialSpaces
    && !widgetStatus.hasFetchedInitialSpaces) {
    props.updateWidgetStatus({isFetchingInitialSpaces: true});
    if (props.basicMode) {
      props.fetchSpacesHydra(sparkInstance, {
        max: spaceLoadCount
      })
        .then(() => props.updateWidgetStatus({
          hasFetchedInitialSpaces: true,
          // Basic mode doesn't have a second load state
          hasFetchedAllSpaces: true
        }));
    }
    else {
      /**
       * Fetches an encrypted small batch of spaces
       * This allows us to show the encrypted spaces in the spaces list
       * and decrypt individually to give a good initial user experience.
       */
      props.fetchSpacesEncrypted(sparkInstance, {
        conversationsLimit: spaceLoadCount
      })
        .then((encryptedSpaces) => {
          props.updateWidgetStatus({
            hasFetchedInitialSpaces: true,
            // We don't currently have a second load state (pagination to come)
            hasFetchedAllSpaces: true
          });

          // As the spaces decrypt, get the avatar for them
          const promises = encryptedSpaces.map((s) =>
            s.decryptPromise.then((decryptedSpace) => {
              // Store the to user in a direct convo to calculate space title
              if (decryptedSpace.type === SPACE_TYPE_ONE_ON_ONE) {
                storeToParticipant(decryptedSpace, props);
              }

              return getSpaceAvatar(decryptedSpace, props);
            }));

          return Promise.all(promises);
        });
    }
  }
}


/**
 * Fetches the avatars for all the loaded spaces
 *
 * @param {object} props
 */
function getAvatars(props) {
  const {
    spacesList,
    widgetStatus
  } = props;

  if (!widgetStatus.hasFetchedAvatars
    && !widgetStatus.isFetchingAvatars) {
    props.updateWidgetStatus({isFetchingAvatars: true});

    spacesList.forEach((s) => getSpaceAvatar(s, props));

    props.updateWidgetStatus({hasFetchedAvatars: true});
  }
}

/**
 * The main setup process that proceeds through a series of events
 * based on the state of the application.
 *
 * @export
 * @param {*} props
 */
export function setup(props) {
  const {
    mercuryStatus,
    sparkInstance,
    sparkState,
    widgetStatus
  } = props;

  // We cannot do anything until the sdk is ready
  if (sparkInstance
    && sparkState.authenticated
    && sparkState.registered
    && !sparkState.hasError
  ) {
    getFeatures(props);

    if (!mercuryStatus.connected) {
      connectWebsocket(props);
    }
    else {
      // Initial fetching workflow
      if (!widgetStatus.hasFetchedInitialSpaces) {
        getInitialSpaces(props);
      }
      else if (!widgetStatus.hasFetchedAvatars && !props.basicMode) {
        // All spaces have been fetched, load avatars
        getAvatars(props);
      }

      // Synchronous load of teams (smaller request)
      if (!widgetStatus.hasFetchedTeams) {
        getTeams(props);
      }
    }
  }
}

export default compose(
  connect(
    getRecentsWidgetProps,
    (dispatch) => bindActionCreators({
      connectToMercury,
      fetchAvatar,
      fetchSpaces,
      fetchSpacesEncrypted,
      fetchSpacesHydra,
      fetchTeams,
      getFeature,
      storeUser,
      updateWidgetStatus
    }, dispatch)
  ),
  lifecycle({
    componentWillMount() {
      setup(this.props);
    },
    shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    },
    componentWillReceiveProps(nextProps) {
      setup(nextProps, this.props);
    }
  })
);
