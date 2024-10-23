/**
 * Recompose Lifecycle Enhancers for Websocket Listeners
 */

import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {storeActivities} from '@webex/redux-module-activities';
import {fetchAvatar} from '@webex/redux-module-avatar';
import {
  addSpaceTags,
  fetchSpace,
  removeSpace,
  removeSpaceTags,
  updateSpaceWithActivity,
  updateSpaceRead
} from '@webex/redux-module-spaces';
import {storeUser} from '@webex/redux-module-users';
import {API_ACTIVITY_TYPE, API_ACTIVITY_VERB, SPACE_TYPE_ONE_ON_ONE} from '@webex/react-component-utils';

import {
  eventNames,
  constructMessagesEventData,
  constructRoomsEventData,
  constructMembershipEventData
} from '../events';

import {updateWidgetStatus} from '../actions';
import {getToParticipant, getSpaceAvatar} from '../helpers';
import getRecentsWidgetProps from '../selector';

/**
 * Event handler that logs data then sends to the onEvent function
 *
 * @param {String} name
 * @param {Object} data
 * @param {Object} props
 */
function handleEvent(name, data, props) {
  const {
    onEvent,
    sparkInstance
  } = props;
  const logData = Object.assign({}, data);

  // Omit call objet from logger to prevent call range error
  if (data.call) {
    logData.call = '--- OMITTED ---';
  }
  sparkInstance.logger.info(`event handler - ${name}`, logData);
  if (typeof onEvent === 'function') {
    props.onEvent(name, data);
  }
}

/**
 * Processes a space activity as it comes in via websocket
 *
 * Expects a space to have been loaded for the given activity
 *
 * @param {Object} activity
 * @param {Object} space
 * @param {Object} props
 */
function processActivity(activity, space, props) {
  const {
    users,
    spacesList
  } = props;

  // Reply activities are not currently supported
  if (activity.type === API_ACTIVITY_TYPE.REPLY) {
    return;
  }

  props.storeActivities([activity]);
  const currentUserId = users.get('currentUserId');
  const isSelf = activity.actor.id === currentUserId;
  const formattedSpace = spacesList.get(space.id);

  switch (activity.verb) {
    case API_ACTIVITY_VERB.SHARE:
    case API_ACTIVITY_VERB.POST: {
      const otherParticipant = !!space.participants && typeof space.participants.find === 'function' && space.participants
        .find((p) => p.id !== currentUserId);
      const otherParticipantId = otherParticipant && otherParticipant.id;
      const otherUser = users.getIn(['byId', otherParticipantId]);

      // Update space with newest post activity
      props.updateSpaceWithActivity(activity, isSelf, true);

      // Do not emit unread if current user created the message
      if (!isSelf && formattedSpace) {
        handleEvent(eventNames.SPACES_UNREAD, constructRoomsEventData(formattedSpace, activity), props);
      }
      // Emit message:created event
      handleEvent(eventNames.MESSAGES_CREATED, constructMessagesEventData(activity, otherUser), props);
      break;
    }
    case API_ACTIVITY_VERB.LOCK:
    case API_ACTIVITY_VERB.UNLOCK: {
      props.updateSpaceWithActivity(activity, isSelf);
      break;
    }
    case API_ACTIVITY_VERB.ACKNOWLEDGE: {
      if (isSelf && formattedSpace) {
      // update space with last acknowledgment if it's this user
        props.updateSpaceRead(activity.target.id, activity.published);
        handleEvent(eventNames.SPACES_READ, constructRoomsEventData(formattedSpace, activity), props);
      }
      break;
    }
    case API_ACTIVITY_VERB.CREATE: {
      const constructedActivity = Object.assign({}, activity, {
        target: activity.object,
        object: {
          id: activity.actor.id,
          emailAddress: activity.actor.emailAddress
        }
      });

      handleEvent(eventNames.MEMBERSHIPS_CREATED, constructMembershipEventData(constructedActivity), props);
      break;
    }
    case API_ACTIVITY_VERB.ADD: {
      handleEvent(eventNames.MEMBERSHIPS_CREATED, constructMembershipEventData(activity), props);
      break;
    }
    case API_ACTIVITY_VERB.LEAVE: {
      props.removeSpace(space.id);
      handleEvent(eventNames.MEMBERSHIPS_DELETED, constructMembershipEventData(activity), props);
      break;
    }
    case API_ACTIVITY_VERB.HIDE: {
      props.removeSpace(space.id);
      break;
    }
    case API_ACTIVITY_VERB.TAG: {
      props.addSpaceTags(space.id, activity.object.tags);
      break;
    }

    case API_ACTIVITY_VERB.UNTAG: {
      props.removeSpaceTags(space.id, activity.object.tags);
      break;
    }
    default:
  }
}

/**
 * Handles the initial processing of new activity coming in via websocket
 *
 * @param {Object} activity
 * @param {Object} props
 */
function handleNewActivity(activity, props) {
  const {
    sparkInstance,
    spacesById,
    users
  } = props;

  const space = activity.target || activity.object;
  let spaceId = space && space.id;

  // On delete, refetch space to get previous activity
  if (spaceId && ['delete', 'tombstone'].includes(activity.verb)) {
    props.fetchSpace(sparkInstance, space);
  }

  // Handle spaceId if this is a completely new space or hiding a space
  if (!spaceId && ['create', 'hide'].includes(activity.verb)) {
    spaceId = activity.object.id;
  }

  const cachedSpace = spacesById.get(spaceId);

  if (cachedSpace) {
    processActivity(activity, cachedSpace, props);
  }
  else {
    // go retrieve the space if it doesn't exist
    props.fetchSpace(sparkInstance, space)
      .then((newSpace) => {
        if (newSpace) {
          processActivity(activity, newSpace, props);
          getSpaceAvatar(newSpace, props);

          // Store user for 1:1 spaces
          if (newSpace.type === SPACE_TYPE_ONE_ON_ONE) {
            const toUser = getToParticipant(newSpace, users.get('currentUserId'));

            if (toUser) {
              props.storeUser(toUser);
            }
          }
        }
      });
  }
}

export default compose(
  connect(
    getRecentsWidgetProps,
    (dispatch) => bindActionCreators({
      addSpaceTags,
      fetchAvatar,
      fetchSpace,
      removeSpace,
      removeSpaceTags,
      storeActivities,
      storeUser,
      updateSpaceRead,
      updateSpaceWithActivity,
      updateWidgetStatus
    }, dispatch)
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const {users, sparkInstance, widgetStatus} = nextProps;

      // Listen for new conversation activity
      if (users.get('currentUserId') && !widgetStatus.isListeningForNewActivity) {
        nextProps.updateWidgetStatus({isListeningForNewActivity: true});

        sparkInstance.internal.mercury.on('event:conversation.activity',
          (event) => handleNewActivity(event.data.activity, this.props));
      }
    }
  })
);