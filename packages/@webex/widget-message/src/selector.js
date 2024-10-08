import {createSelector} from 'reselect';
import {getActivitiesFromThreadAndNonThreadCollections} from '@webex/redux-module-conversation';

const getSparkInstance = (state, props) => props.sparkInstance || state.spark.get('spark');
const getSparkState = (state) => state.spark.get('status');
const getConversation = (state) => state.conversation;
const getParticipants = (state) => state.conversation.get('participants');
const getConversationThreadActivities = (state) => state.conversation.get('threadActivities');
const getConversationNonThreadActivities = (state) => state.conversation.get('sortNonThreadActivities');
const getActivities = createSelector(
  [
    getConversationThreadActivities,
    getConversationNonThreadActivities
  ],
  getActivitiesFromThreadAndNonThreadCollections
);
const getConversationOldestPublishedDate = (state) => state.conversation.get('oldestPublishedDate');
const getUsers = (state) => state.users;
const getFeatures = (state) => state.features;

function constructSpace(space) {
  const lastActivityTimestamp = space.get('lastReadableActivityDate');
  const tags = space.get('tags');
  const id = space.get('id');

  return {
    id,
    type: tags && tags.includes('ONE_ON_ONE') ? 'direct' : 'group',
    lastActivityTimestamp,
    published: space.get('published'),
    isLocked: tags && tags.includes('LOCKED')
  };
}

function constructOneOnOne(space, currentUser) {
  const thisSpace = constructSpace(space);
  const currentUserEmail = currentUser.email;
  const otherUsers = space.get('participants')
    .find((p) => p.get('emailAddress') !== currentUserEmail);

  if (otherUsers) {
    thisSpace.toUser = otherUsers;
    thisSpace.name = otherUsers.get('displayName');
  }

  return thisSpace;
}

function constructGroup(space) {
  const thisSpace = constructSpace(space);

  thisSpace.name = space.get('displayName');
  const team = space.get('team');

  if (team) {
    thisSpace.teamName = team.get('displayName');
    thisSpace.teamColor = team.get('color');
    thisSpace.teamId = team.get('id');
  }

  return thisSpace;
}


export const getSpace = createSelector(
  [getConversation, getUsers],
  (conversation, users) => {
    const space = conversation;
    const currentUser = users.getIn(['byId', users.get('currentUserId')]);

    if (space.getIn(['status', 'isOneOnOne'])) {
      return constructOneOnOne(space, currentUser);
    }

    return constructGroup(space, currentUser);
  }
);

const getActivitiesStatus = createSelector(
  [getConversation],
  (conversation) => conversation.get('status').toJS()
);

const getMessageWidgetProps = createSelector(
  [
    getSparkInstance,
    getSparkState,
    getConversation,
    getConversationOldestPublishedDate,
    getParticipants,
    getActivities,
    getSpace,
    getActivitiesStatus,
    getFeatures
  ],
  (
    sparkInstance, sparkState, conversation, oldestPublishedDate,
    participants, activities, space, activitiesStatus, features
  ) => ({
    activities: activities.toJS(),
    activityCount: activities.count(),
    activitiesStatus,
    lastActivity: activities.last(),
    firstActivity: activities.first(),
    oldestPublishedDate,
    conversationId: conversation.get('id'),
    participants: participants.toJS(),
    space,
    sparkInstance,
    sparkState: sparkState.toJS(),
    features
  })
);

export default getMessageWidgetProps;
