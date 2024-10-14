import {createSelector} from 'reselect';
import {concat, has} from 'lodash';

import messages from './messages';

const getSparkInstance = (state, props) => props.sparkInstance || state.spark.get('spark');
const getConversation = (state) => state.conversation;
const getCurrentUser = (state) => state.users.getIn(['byId', state.users.get('currentUserId')]);
const getSearch = (state) => state.search;
const getMedia = (state) => state.media;
const getWidget = (state) => state.widgetRoster;
const getFormatMessage = (state, props) => props.intl.formatMessage;


function sortParticipants(participantA, participantB) {
  const A = participantA.displayName;
  const B = participantB.displayName;
  const aGreaterThanB = A > B ? 1 : 0;

  return A < B ? -1 : aGreaterThanB;
}


const getCurrentCall = createSelector(
  [
    getMedia,
    getConversation
  ],
  (media, conversation) => {
    const locusUrl = conversation.get('locusUrl');

    if (locusUrl) {
      return media.getIn(['byId', media.getIn(['byLocusUrl', locusUrl])]);
    }

    return undefined;
  }
);

const getSearchResults = createSelector(
  [
    getSearch,
    getWidget,
    getCurrentUser
  ],
  (search, widgetRoster, currentUser) => {
    const searchTerm = widgetRoster.get('searchTerm');

    if (searchTerm && search.hasIn(['searchResults', searchTerm])) {
      const searchResults = search.getIn(['searchResults', searchTerm]).toJS();
      const results = [];

      if (searchResults.results) {
        searchResults.results.forEach((user) => {
          if (user.id !== currentUser.id) {
            results.push(user);
          }
        });
        searchResults.results = results;
      }

      return searchResults;
    }

    return undefined;
  }
);

export const getParticipantsById = createSelector(
  [getConversation, getCurrentUser],
  (conversation, currentUser) => {
    const participantsList = conversation.get('participants');
    const inFlightParticipants = conversation.get('inFlightParticipants').toJS();
    const isConsumerOrg = currentUser.orgId === 'consumer';
    const participantsById = {};

    participantsList.forEach((p) => {
      const participant = p.toJS();

      participant.isExternal = currentUser && !isConsumerOrg && currentUser.orgId !== 'consumer' && currentUser.orgId !== participant.orgId;
      participant.displayName = participant.displayName ? participant.displayName : participant.name;
      participant.isPending = has(inFlightParticipants, ['removing', participant.id]) || has(inFlightParticipants, ['adding', participant.id]);
      participantsById[participant.id] = participant;
    });

    return participantsById;
  }
);

export const getParticipants = createSelector(
  [
    getConversation,
    getParticipantsById,
    getCurrentUser,
    getCurrentCall,
    getFormatMessage
  ],
  (
    conversation,
    participantsById,
    currentUser,
    currentCall,
    formatMessage
  ) => {
    const people = [];
    let hasExternalParticipants = false;
    let count = 0;


    if (currentCall && currentCall.getIn(['callState', 'connected'])) {
      const callMemberships = currentCall.get('instance').memberships;
      const inMeeting = [];
      const notInMeeting = [];

      callMemberships.forEach((m) => {
        const participant = participantsById[m.personUuid];

        if (participant) {
          if (m.state === 'connected') {
            inMeeting.push(participant);
          }
          else {
            notInMeeting.push(participant);
          }
        }
      });

      if (inMeeting.length > 0) {
        people.push({
          label: formatMessage(messages.inMeeting),
          people: inMeeting
        });
      }

      if (notInMeeting.length > 0) {
        people.push({
          label: formatMessage(messages.notInMeeting),
          people: notInMeeting
        });
      }
    }
    else {
      const currentUserParticipant = [];
      const moderatorParticipants = [];
      let otherParticipants = [];
      const inFlightParticipantsAdding = conversation.getIn(['inFlightParticipants', 'adding']).toArray();

      Object.keys(participantsById).forEach((id) => {
        const p = participantsById[id];

        if (p.isExternal) {
          hasExternalParticipants = true;
        }
        if (p.roomProperties && p.roomProperties.isModerator) {
          moderatorParticipants.push(p);
        }
        else if (p.id === currentUser.id) {
          currentUserParticipant.push(p);
        }
        else {
          otherParticipants.push(p);
        }
        count += 1;
      });

      // Add inflight adding participants to other participants
      otherParticipants = concat(
        currentUserParticipant.sort(sortParticipants),
        otherParticipants.sort(sortParticipants),
        inFlightParticipantsAdding
      );

      if (moderatorParticipants.length > 0) {
        people.push({
          label: formatMessage(messages.moderators),
          people: moderatorParticipants
        });
      }

      if (otherParticipants.length > 0) {
        people.push({
          label: formatMessage(messages.participants),
          people: otherParticipants
        });
      }
    }

    return {
      hasExternalParticipants,
      count,
      people
    };
  }
);

export const getRosterWidgetProps = createSelector(
  [
    getSparkInstance,
    getConversation,
    getCurrentUser,
    getSearchResults,
    getWidget,
    getParticipants
  ],
  (
    sparkInstance,
    conversation,
    currentUser,
    searchResults,
    widgetRoster,
    participants
  ) => {
    const isOneOnOne = conversation.getIn(['status', 'isOneOnOne']);
    const isLocked = conversation.getIn(['status', 'isLocked']);
    const isModerator = conversation.getIn(['status', 'isModerator']);
    const canEditRoster = !isOneOnOne && (isLocked && isModerator || !isLocked);
    const isConsumerOrg = currentUser.orgId === 'consumer';

    return {
      sparkInstance,
      canEditRoster,
      searchResults,
      participants,
      isConsumerOrg,
      currentView: widgetRoster.get('currentView'),
      searchTerm: widgetRoster.get('searchTerm')
    };
  }
);

