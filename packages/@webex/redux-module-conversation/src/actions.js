import {last} from 'lodash';
import isEmail from 'validator/lib/isEmail';
import {validateAndDecodeId, SUCCESS, FAILURE, PENDING} from '@webex/react-component-utils';

export const ACKNOWLEDGE_ACTIVITY = 'conversation/ACKNOWLEDGE_ACTIVITY';
export const ADD_ACTIVITIES_TO_CONVERSATION = 'conversation/ADD_ACTIVITIES_TO_CONVERSATION';
export const ADD_PARTICIPANT = 'conversation/ADD_PARTICIPANT';
export const ADD_PARTICIPANT_INFLIGHT = 'conversation/ADD_PARTICIPANT_INFLIGHT';
export const CREATE_CONVERSATION_BEGIN = 'conversation/CREATE_CONVERSATION_BEGIN';
export const CREATE_CONVERSATION = 'conversation/CREATE_CONVERSATION';
export const UPDATE_CONVERSATION_STATE = 'conversation/UPDATE_CONVERSATION_STATE';
export const DELETE_ACTIVITY_FROM_CONVERSATION = 'conversation/DELETE_ACTIVITY_FROM_CONVERSATION';
export const RECEIVE_MERCURY_COMMENT = 'conversation/RECEIVE_MERCURY_COMMENT';
export const RECEIVE_MERCURY_ACTIVITY = 'conversation/RECEIVE_MERCURY_ACTIVITY';
export const REMOVE_PARTICIPANT = 'conversation/REMOVE_PARTICIPANT';
export const REMOVE_PARTICIPANT_INFLIGHT = 'conversation/REMOVE_PARTICIPANT_INFLIGHT';
export const RESET_CONVERSATION = 'conversation/RESET_CONVERSATION';
export const ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION = 'adaptiveCards/ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION';

function acknowledgeActivity(activity) {
  return {
    type: ACKNOWLEDGE_ACTIVITY,
    payload: {
      activity
    }
  };
}

function addActivitiesToConversation(activities) {
  return {
    type: ADD_ACTIVITIES_TO_CONVERSATION,
    payload: {
      activities
    }
  };
}

function addParticipantInflight(participant) {
  return {
    type: ADD_PARTICIPANT_INFLIGHT,
    payload: {
      participant
    }
  };
}

function deleteActivityFromConversation(conversation, activity) {
  return {
    type: DELETE_ACTIVITY_FROM_CONVERSATION,
    payload: {
      conversation,
      activity
    }
  };
}

function removeParticipantInflight(participant) {
  return {
    type: REMOVE_PARTICIPANT_INFLIGHT,
    payload: {
      participant
    }
  };
}

/**
 * Adds a participant to conversation's participants array
 *
 * @export
 * @param {object} participant
 * @returns {object}
 */
export function addParticipant(participant) {
  return {
    type: ADD_PARTICIPANT,
    payload: {
      participant
    }
  };
}

export function createConversationBegin() {
  return {
    type: CREATE_CONVERSATION_BEGIN
  };
}

export function receiveMercuryComment(activity) {
  return {
    type: RECEIVE_MERCURY_COMMENT,
    payload: {
      activity
    }
  };
}

export function receiveMercuryActivity(activity) {
  return {
    type: RECEIVE_MERCURY_ACTIVITY,
    payload: {
      activity
    }
  };
}

/**
 * Removes a participant from the participants array
 *
 * @export
 * @param {object} participant
 * @returns {object}
 */
export function removeParticipant(participant) {
  return {
    type: REMOVE_PARTICIPANT,
    payload: {
      participant
    }
  };
}

/**
 * Resets the conversation store to default
 *
 * @export
 * @returns {object}
 */
export function resetConversation() {
  return {
    type: RESET_CONVERSATION
  };
}

export function storeConversation(conversation) {
  return {
    type: CREATE_CONVERSATION,
    payload: {
      conversation
    }
  };
}

export function updateConversationState(conversationState) {
  return {
    type: UPDATE_CONVERSATION_STATE,
    payload: {
      conversationState
    }
  };
}


/**
 * Computes and updates room properties
 * @param {Object} conversation
 * @param {Object} sparkInstance
 * @returns {Object}
 */
export function computeRoomProperties(conversation, sparkInstance) {
  const computedConversation = Object.assign({}, conversation);

  const lockedTag = 'LOCKED';
  const oneOnOneTag = 'ONE_ON_ONE';
  const isLocked = conversation.tags.some((tag) => tag === lockedTag);
  const isOneOnOne = conversation.tags.some((tag) => tag === oneOnOneTag);
  const currentUserId = sparkInstance.internal.device.userId;
  const currentUserParticipant = conversation.participants.items
    .find((participant) => participant.id === currentUserId);
  const isModerator = currentUserParticipant
    && currentUserParticipant.roomProperties
    && currentUserParticipant.roomProperties.isModerator;

  if (isOneOnOne && !conversation.displayName) {
    const otherUser = conversation.participants.items
      .find((p) => p.id !== currentUserId);

    if (otherUser) {
      computedConversation.displayName = otherUser.displayName;
    }
  }
  computedConversation.status = Object.assign({}, conversation.status,
    {isLocked, isModerator, isOneOnOne});

  return computedConversation;
}


/**
 * Acknowledges (marks as read) an activity
 * @param {object} conversation (immutable object expected)
 * @param {object} activity
 * @param {object} spark
 * @returns {function}
 */
export function acknowledgeActivityOnServer(conversation, activity, spark) {
  return (dispatch) =>
    spark.internal.conversation.acknowledge(conversation.toJS(), activity)
      .then(() => dispatch(acknowledgeActivity(activity)));
}

/**
 * Creates/Opens a conversation with a user
 *
 * @param {Array} participants List of userIds or emails
 * @param {object} spark
 * @returns {function}
 */
export function createConversation(participants = [], spark) {
  return (dispatch) => {
    dispatch(createConversationBegin());

    const mappedParticipants = participants.map((p) => {
      if (isEmail(p)) {
        return p;
      }
      const {id: uuid} = validateAndDecodeId(p);

      if (uuid) {
        return uuid;
      }

      return p;
    });

    return spark.internal.conversation.create({
      participants: mappedParticipants
    }, {
      latestActivity: true,
      activitiesLimit: 40,
      participantAckFilter: 'all'
    })
      .then((conversation) =>
        dispatch(storeConversation(
          computeRoomProperties(conversation, spark)
        )))
      .catch((error) => dispatch(updateConversationState({error: error.message})));
  };
}

/**
 * Deletes an activity from a conversation
 * @param {object} conversation (immutable object expected)
 * @param {object} activity
 * @param {object} spark
 * @returns {function}
 */
export function deleteActivity(conversation, activity, spark) {
  return (dispatch) =>
    spark.internal.conversation.delete(conversation.toJS(), activity)
      .then(() => dispatch(deleteActivityFromConversation(conversation, activity)));
}

/**
 * Retrieves a conversation with SpaceId
 *
 * @param {string} id SpaceId
 * @param {object} spark
 * @returns {Promise}
 */
export function getConversation(id, spark) {
  const room = validateAndDecodeId(id);

  return (dispatch) => {
    dispatch(createConversationBegin());
    if (room.id) {
      return spark.internal.conversation.get(room, {
        latestActivity: true,
        activitiesLimit: 40,
        participantAckFilter: 'all',
        includeParticipants: true
      })
        .then((conversation) =>
          dispatch(storeConversation(
            computeRoomProperties(conversation, spark)
          )))
        .catch((error) => dispatch(updateConversationState({error: error.message})));
    }

    return false;
  };
}

/**
 * Fetches activities that were posted after sinceDate
 * @param {string} conversationUrl
 * @param {string} sinceDate
 * @param {object} spark
 * @returns {function}
 */
export function loadMissingActivities(conversationUrl, sinceDate, spark) {
  function fetchAndMergeMissingActivities(fetchConversationUrl, fetchSinceDate) {
    return (dispatch) => {
      const limit = 50;

      return spark.internal.conversation.listActivities({
        lastActivityFirst: false,
        conversationUrl: fetchConversationUrl,
        limit,
        fetchSinceDate
      })
        .then((activities) => {
          if (activities.length) {
            dispatch(addActivitiesToConversation(activities));
            if (activities.length === limit) {
            // We still have (possibly) more activities missing
              const lastActivityDate = last(activities).published;

              return fetchAndMergeMissingActivities(fetchConversationUrl, lastActivityDate, dispatch);
            }
          }

          return Promise.resolve();
        });
    };
  }

  return (dispatch) => {
    dispatch(updateConversationState({isLoadingMissing: true}));

    return dispatch(fetchAndMergeMissingActivities(conversationUrl, sinceDate))
      .then(() => dispatch(updateConversationState({isLoadingMissing: false})));
  };
}

/**
 * Loads activities for a conversation previous to the maxDate
 *
 * @export
 * @param {string} conversationUrl
 * @param {string} maxDate
 * @param {object} spark
 * @returns {function}
 */
export function loadPreviousMessages(conversationUrl, maxDate, spark) {
  return (dispatch) => {
    dispatch(updateConversationState({isLoadingHistoryUp: true}));

    return spark.internal.conversation.listActivities({
      conversationUrl,
      lastActivityFirst: true,
      limit: 20,
      maxDate: Date.parse(maxDate) || Date.now()
    })
      .then((activities) => {
        dispatch(addActivitiesToConversation(activities));
        dispatch(updateConversationState({isLoadingHistoryUp: false}));
      })
      .catch((error) => dispatch(updateConversationState({error: error.message})));
  };
}

/**
 * Adds participant to the conversation on the server
 *
 * @export
 * @param {object} conversation (immutable object expected)
 * @param {object|string} participant the full participant object (js-sdk required)
 *                                    if string, must be an email address
 * @param {object} spark
 * @returns {function}
 */
export function addParticipantToConversation(conversation, participant, spark) {
  return (dispatch) => {
    let participantObject = participant;

    if (typeof participant === 'string') {
      if (isEmail(participant)) {
        participantObject = {
          id: participant,
          displayName: participant,
          name: participant,
          emailAddress: participant
        };
      }
      else {
        const error = new Error('An email is required for string values of \'participant\' parameter.');

        dispatch(updateConversationState({addParticipantError: error}));

        return Promise.resolve();
      }
    }
    dispatch(addParticipantInflight(participantObject));

    return spark.internal.conversation.add(conversation.toJS(), participantObject)
      .then(() =>
        // Add will come as mercury event
        dispatch(updateConversationState({addParticipantError: null})))
      .catch((error) =>
        dispatch(updateConversationState({addParticipantError: error})));
  };
}

/**
 * Removes a participant from the conversation on the server
 *
 * @export
 * @param {object} conversation
 * @param {object} participant
 * @param {object} spark
 * @returns {function}
 */
export function removeParticipantFromConversation(conversation, participant, spark) {
  return (dispatch) => {
    dispatch(removeParticipantInflight(participant));

    return spark.internal.conversation.leave(conversation.toJS(), participant)
      .then(() =>
        // Remove will come as mercury event
        dispatch(updateConversationState({removeParticipantError: null})))
      .catch((error) =>
        dispatch(updateConversationState({removeParticipantError: error})));
  };
}

/**
 * submits the adaptive card action
 *
 * @export
 * @param {string} url conversation end point to post data
 * @param {object} actionInput contians type of object and input data
 * @param {string} parentId id of the parent activity
 * @param {object} spark object used to call the funcion of conversation
 * @param {HTMLElement} btnClicked disable the clicked button
 * @returns {function}
 */
export function handleAdaptiveCardSubmitAction(url, actionInput, parentId, spark, btnClicked) {
  return (dispatch) => {
    dispatch({
      type: ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION,
      status: PENDING
    });
    /* this button is from adaptive cards library we get only when an action happens and
     we don't have a reference to it in React */
    // eslint-disable-next-line no-param-reassign
    btnClicked.disabled = true;

    return spark.internal.conversation.cardAction(
      {url},
      actionInput,
      {id: parentId}
    )
      .then(() => {
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          btnClicked.disabled = false;
        }, 2000);
        dispatch({
          type: ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION,
          status: SUCCESS
        });
      })
      .catch(() => {
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          btnClicked.disabled = false;
        }, 2000);
        dispatch({
          type: ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION,
          status: FAILURE
        });
      });
  };
}