import {createSelector} from 'reselect';
import moment from 'moment';
import {filterSync} from '@webex/helper-html';
import {
  ITEM_TYPE_ACTIVITY,
  ITEM_TYPE_DAY_SEPARATOR,
  ITEM_TYPE_NEW_MESSAGE_SEPARATOR
} from '@webex/react-component-activity-list';
import {getActivitiesFromThreadAndNonThreadCollections} from '@webex/redux-module-conversation';

import defaultFormatters from './formatters';
import {isActivityVisible, isReplyActivity} from './helpers';

const getConversationThreadActivities = (state) => state.conversation.get('threadActivities');
const getConversationNonThreadActivities = (state) => state.conversation.get('sortNonThreadActivities');
const getConversationActivities = createSelector(
  [
    getConversationThreadActivities,
    getConversationNonThreadActivities
  ],
  getActivitiesFromThreadAndNonThreadCollections
);
const getAvatar = (state) => state.avatar;
const getUsers = (state) => state.users;
const getFlags = (state) => state.flags.get('flags');
const getSendingActivities = (state) => state.activity;
const getActivityFormatter = (state, props) => props.activityFormatter;
const getLastAcknowledgedActivityId = (state) => state.conversation.get('lastAcknowledgedActivityId');
const getOnEvent = (state, props) => props.onEvent;


/**
 * Applies safe filters activity content
 *
 * @param {Object} activityObject raw activity.object
 * @returns {Object}
 */

export function filterActivity(activityObject) {
  const outputActivity = Object.assign({}, activityObject);

  if (outputActivity.content) {
    outputActivity.content = filterSync(() => {}, {
      'spark-mention': ['data-object-type', 'data-object-id', 'data-object-url'],
      a: ['href'],
      b: [],
      blockquote: ['class'],
      strong: [],
      i: [],
      em: [],
      pre: [],
      code: ['class'],
      br: [],
      hr: [],
      p: [],
      ul: [],
      ol: [],
      li: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: []
    }, [], outputActivity.content);
  }

  return outputActivity;
}

/**
 * Applies additional formatting to activity
 *
 * @export
 * @param {Object} activityObject
 * @returns {Object}
 */

export function formatActivity(activity, activityFormatter, onEvent) {
  const activityObject = filterActivity(activity);

  if (typeof activityFormatter === 'function') {
    return activityFormatter(activityObject, defaultFormatters, onEvent);
  }

  return defaultFormatters(activityObject, onEvent);
}

/**
 * This loops through our conversation activities and computes an array
 * of 'visible activities' to be used with the ActivityList component
 */
export const getActivityList = createSelector(
  [
    getConversationActivities,
    getAvatar,
    getUsers,
    getSendingActivities,
    getFlags,
    getLastAcknowledgedActivityId,
    getActivityFormatter,
    getOnEvent
  ],
  (
    conversationActivities,
    avatar,
    users,
    sendingActivities,
    flags,
    lastAcknowledgedActivityId,
    activityFormatter,
    onEvent
  ) => {
    const avatars = avatar.get('items');
    const currentUser = users.getIn(['byId', users.get('currentUserId')]);
    const inFlightActivities = sendingActivities.get('inFlightActivities');
    const activityFailures = sendingActivities.get('activityFailures');
    const visibleActivityList = [];
    const now = moment();
    let lastActorId, lastVerb;
    const lastActivity = {};
    let shouldDisplayNewMessageMarker = false;

    conversationActivities.forEach((activity) => {
      if (isActivityVisible(activity)) {
        // Insert day separator if this activity and last one happen on a different day
        const activityDay = moment(activity.published, moment.ISO_8601).endOf('day');
        const activityMinute = moment(activity.published, moment.ISO_8601).endOf('minute');

        const lastDay = lastActivity.day;
        const lastMinute = lastActivity.minute;
        const sameDay = activityDay.diff(lastDay, 'days') === 0;
        const sameMinute = activityMinute.diff(lastMinute, 'minutes') === 0;
        const isReply = isReplyActivity(activity);

        if (!isReply && lastDay && !sameDay) {
          visibleActivityList.push({
            type: ITEM_TYPE_DAY_SEPARATOR,
            fromDate: lastDay,
            key: `day-separtor-${activity.id}`,
            now,
            toDate: activityDay
          });
        }

        if (!isReply) {
          lastActivity.day = activityDay;
        }
        lastActivity.minute = activityMinute;
        lastActivity.isReply = isReply;

        // New message marker
        if (shouldDisplayNewMessageMarker) {
          visibleActivityList.push({
            type: ITEM_TYPE_NEW_MESSAGE_SEPARATOR,
            key: `new-messages-${activity.id}`
          });
          shouldDisplayNewMessageMarker = false;
        }

        // Actual visible activity item
        // additional items don't repeat user avatar and name
        const isAdditional = sameDay && sameMinute && lastActorId === activity.actor.id && lastVerb === activity.verb;

        lastActorId = activity.actor.id;
        lastVerb = activity.verb;

        const isFlagged = !!flags.count() && flags.has(activity.url);
        const isFlagPending = isFlagged && flags.getIn([activity.url, 'isInFlight']);

        let formattedActivity = activity;

        if (activity.verb === 'post') {
          formattedActivity = Object.assign({}, activity, {
            object: formatActivity(activity.object, activityFormatter, onEvent)
          });
        }

        // Name of the user
        let name = activity.actor.displayName;

        if (activity.verb === 'add' || activity.verb === 'leave') {
          name = activity.object.displayName;
        }

        const visibleActivity = {
          currentUser,
          type: ITEM_TYPE_ACTIVITY,
          activity: formattedActivity,
          avatarUrl: avatars.get(activity.actor.id),
          isAdditional,
          isFlagged,
          isFlagPending,
          isSelf: currentUser.id === activity.actor.id,
          name
        };

        visibleActivityList.push(visibleActivity);

        // Check if this is the last read activity
        const isLastAcked = lastAcknowledgedActivityId && lastAcknowledgedActivityId === activity.id;
        const isNotSelf = currentUser.id !== activity.actor.id;

        if (isLastAcked && isNotSelf) {
          shouldDisplayNewMessageMarker = true;
        }
      }
    });

    // Create a "fake" activity to display in flight activities
    inFlightActivities.forEach((inFlightActivity) => {
      visibleActivityList.push({
        currentUser,
        type: ITEM_TYPE_ACTIVITY,
        activity: inFlightActivity,
        avatarUrl: avatars.get(currentUser.id),
        isAdditional: false,
        isFlagged: false,
        isFlagPending: false,
        isSelf: true,
        isPending: true
      });
    });

    // Create a "fake" activity to display failed activities
    activityFailures.forEach((activityFailure) => {
      visibleActivityList.push({
        currentUser,
        type: ITEM_TYPE_ACTIVITY,
        activity: activityFailure,
        avatarUrl: avatars.get(currentUser.id),
        isAdditional: false,
        hasError: true,
        isFlagged: false,
        isFlagPending: false,
        isSelf: true,
        isPending: true
      });
    });

    return visibleActivityList;
  }
);
