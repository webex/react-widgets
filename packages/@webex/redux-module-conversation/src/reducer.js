/* eslint complexity: ["error", 14] */
import {fromJS, Map} from 'immutable';

import {
  ACKNOWLEDGE_ACTIVITY,
  ADD_ACTIVITIES_TO_CONVERSATION,
  ADD_PARTICIPANT,
  ADD_PARTICIPANT_INFLIGHT,
  CREATE_CONVERSATION,
  CREATE_CONVERSATION_BEGIN,
  RECEIVE_MERCURY_ACTIVITY,
  RECEIVE_MERCURY_COMMENT,
  REMOVE_PARTICIPANT,
  REMOVE_PARTICIPANT_INFLIGHT,
  RESET_CONVERSATION,
  UPDATE_CONVERSATION_STATE,
  ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION
} from './actions';

import {filterActivities, normalizeActivities, normalizeActivity} from './helpers';

export const initialState = fromJS({
  sortNonThreadActivities: [],
  threadActivities: {},
  id: null,
  inFlightParticipants: {
    adding: new Map(),
    removing: new Map()
  },
  lastAcknowledgedActivityId: null,
  participants: [],
  cardActionAcknowledgedState: '',
  status: {
    addParticipantError: null,
    isFetching: false,
    isListeningToMercury: false,
    isLoaded: false,
    isLoadingHistoryUp: false,
    isLoadingMissing: false,
    isLocked: true,
    isModerator: false,
    isOneOnOne: null,
    error: null,
    removeParticipantError: null
  }
});

const markDeletedActivity = ({activity: {object: {id}}, activities}) =>
  activities.map((activityItem) => {
    if (activityItem.id === id) {
      return Object.assign({}, activityItem, {
        verb: 'tombstone'
      });
    }

    return activityItem;
  });

function receiveMercuryActivity(state, {payload: {activity}}) {
  switch (activity.verb) {
    case 'delete': {
      // Find activity that is being deleted and change it to a tombstone
      const sortNonThreadActivities = markDeletedActivity({
        activity,
        activities: state.get('sortNonThreadActivities')
      });

      const threadActivities = {};

      for (const [threadId, threads] of Object.entries(state.get('threadActivities'))) {
        threadActivities[threadId] = markDeletedActivity({
          activity,
          activities: threads
        });
      }

      return state.set('sortNonThreadActivities', sortNonThreadActivities)
        .set('threadActivities', threadActivities);
    }
    case 'acknowledge': {
      // acknowledge is a read receipt. we need to update the participants who
      // are listed in this acknowledgement
      const participants = state.get('participants');
      const actorId = activity.actor.id;

      return state.set('participants',
        participants.map((participant) => {
          if (participant.get('id') === actorId) {
            return participant
              .setIn(['roomProperties', 'lastSeenActivityUUID'], activity.object.id)
              .setIn(['roomProperties', 'lastSeenActivityDate'], activity.published);
          }

          return participant;
        }));
    }
    default:
      return state;
  }
}

const compareActivities = (first, second) => Date.parse(first.published) - Date.parse(second.published);

const findOldestPublishedDate = ({activity, published}) =>
  ((compareActivities({published}, activity) < 0) ? published : activity.published);

const processActivities = ({
  activities, threadActivities = {}, nonThreadActivities = [], oldestPublishedDate
}) => {
  let ta = threadActivities;
  let nta = nonThreadActivities;

  const dirtyThreadList = new Set();
  let needSort = false;
  let published = oldestPublishedDate;

  for (const activity of activities) {
    published = findOldestPublishedDate({activity, published});

    // Split the activities into the correct buckets
    const parentId = activity.parent?.id;

    if (parentId) {
      dirtyThreadList.add(parentId);

      const threads = ta[parentId] ?? [];

      ta = {...ta};
      ta[parentId] = [...threads, activity];
    }
    else {
      needSort = true;
      nta = [...nta, activity];
    }
  }

  for (const threadParent of dirtyThreadList) {
    ta[threadParent] = ta[threadParent].sort(compareActivities);
  }

  return {
    threadActivities: ta,
    sortNonThreadActivities: needSort ? nta.sort(compareActivities) : nta,
    oldestPublishedDate: published
  };
};

const processCreateConversation = ({action, state}) => {
  const {
    defaultActivityEncryptionKeyUrl,
    avatar,
    displayName,
    id,
    kmsResourceObjectUrl,
    locusUrl,
    participants,
    tags,
    published,
    url,
    lastReadableActivityDate,
    teams,
    status
  } = action.payload.conversation;

  const rawActivities = action.payload.conversation.activities.items;
  const conversationActivities = normalizeActivities(filterActivities(rawActivities));

  const {threadActivities, sortNonThreadActivities, oldestPublishedDate} = processActivities({
    activities: conversationActivities,
    oldestPublishedDate: state.get('oldestPublishedDate')
  });

  return state
    .set('threadActivities', threadActivities)
    .set('sortNonThreadActivities', sortNonThreadActivities)
    .set('oldestPublishedDate', oldestPublishedDate)
    .mergeDeep({
      avatar,
      displayName,
      defaultActivityEncryptionKeyUrl,
      id,
      kmsResourceObjectUrl,
      locusUrl,
      url,
      published,
      tags,
      lastReadableActivityDate,
      teams,
      status: Object.assign({}, status, {
        error: null,
        isFetching: false,
        isLoaded: true
      }),
      participants: participants.items
    });
};

const addActivities = ({state, addedActivities}) => {
  const opd = state.get('oldestPublishedDate');

  const {threadActivities, sortNonThreadActivities, oldestPublishedDate} = processActivities({
    threadActivities: state.get('threadActivities'),
    nonThreadActivities: state.get('sortNonThreadActivities'),
    activities: addedActivities,
    oldestPublishedDate: opd
  });

  return state.set('threadActivities', threadActivities)
    .set('sortNonThreadActivities', sortNonThreadActivities)
    .set('oldestPublishedDate', oldestPublishedDate);
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACKNOWLEDGE_ACTIVITY: {
      return state.set('lastAcknowledgedActivityId', action.payload.activity.id);
    }
    case ADD_ACTIVITIES_TO_CONVERSATION: {
      const addedActivities = normalizeActivities(filterActivities(action.payload.activities));

      return addActivities({state, addedActivities});
    }

    case ADD_PARTICIPANT: {
      const participants = state.get('participants').push(fromJS(action.payload.participant));

      return state
        .set('participants', participants)
        .removeIn(['inFlightParticipants', 'adding', action.payload.participant.id])
      // In flight participants could be sideboarded and not have an id
        .removeIn(['inFlightParticipants', 'adding', action.payload.participant.emailAddress]);
    }

    case ADD_PARTICIPANT_INFLIGHT: {
      const {participant} = action.payload;

      return state.setIn(['inFlightParticipants', 'adding', participant.id], participant);
    }

    case CREATE_CONVERSATION_BEGIN: {
      return state.setIn(['status', 'isFetching'], true);
    }

    case CREATE_CONVERSATION: {
      return processCreateConversation({action, state});
    }

    case RECEIVE_MERCURY_ACTIVITY: {
      return receiveMercuryActivity(state, action);
    }

    case RECEIVE_MERCURY_COMMENT: {
      const receivedActivity = normalizeActivity(action.payload.activity);

      return addActivities({state, addedActivities: [receivedActivity]});
    }

    case REMOVE_PARTICIPANT: {
      const participants = [];

      state.get('participants').forEach((p) => {
        if (p.get('id') !== action.payload.participant.id) {
          participants.push(p);
        }
      });

      return state
        .set('participants', fromJS(participants))
        .removeIn(['inFlightParticipants', 'removing', action.payload.participant.id]);
    }

    case REMOVE_PARTICIPANT_INFLIGHT: {
      const {participant} = action.payload;

      return state.setIn(['inFlightParticipants', 'removing', participant.id], participant);
    }

    case RESET_CONVERSATION: {
      return initialState;
    }

    case UPDATE_CONVERSATION_STATE: {
      return state.mergeIn(['status'], action.payload.conversationState);
    }

    case ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION: {
      return state.set('cardActionAcknowledgedState', action.status);
    }

    default: {
      return state;
    }
  }
}