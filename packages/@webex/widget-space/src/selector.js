import {createSelector} from 'reselect';

import {validateAndDecodeId} from '@webex/react-component-utils';

import {destinationTypes} from './constants';

const getWidget = (state) => state.widgetSpace;
const getSpark = (state) => state.spark;
const getMedia = (state) => state.media;
const getConversation = (state) => state.conversation;
const getFeatures = (state) => state.features;
const getUsers = (state) => state.users;
const getSpaces = (state) => state.spaces;
const getOwnProps = (state, ownProps) => ownProps;
const getMercuryStatus = (state) => state.mercury.get('status');

export const getCall = createSelector(
  [getConversation, getMedia, getWidget, getOwnProps],
  (conversation, media, widget, ownProps) => {
    if (ownProps && ownProps.call && typeof ownProps.call === 'object'
      && ownProps.call.id) {
      return ownProps.call;
    }
    let mediaId;

    // Conversation is the easiest way to get a media id
    if (conversation.has('locusUrl')) {
      mediaId = media.getIn(['byLocusUrl', conversation.get('locusUrl')]);
    }
    else {
      const destination = widget.get('destination');

      if (!destination) {
        return null;
      }
      mediaId = media.getIn(['byDestination', destination.id]);

      // Incoming call
      if (!mediaId &&
        [destinationTypes.SIP, destinationTypes.PSTN].includes(destination.type)) {
        // This is a bit of a hack. We're matching on the string, but this can
        // cause ambiguity if the phone numbers are too close.
        const matchedCall = media.get('byId').find((call) => {
          if (call && call.has('instance')) {
            const {locus} = call.get('instance');

            if (locus && locus.host) {
              if (destination.type === destinationTypes.PSTN && locus.host.phoneNumber) {
                if (destination.id.startsWith('+')) {
                  return locus.host.phoneNumber === destination.id;
                }

                return locus.host.phoneNumber.includes(destination.id);
              }
              if (locus.info && locus.info.sipUri) {
                return locus.info.sipUri.includes(destination.id);
              }
            }
          }

          return false;
        });

        if (matchedCall) {
          mediaId = media.getIn(['byLocusUrl', matchedCall.get('instance').locusUrl]);
        }
      }
    }

    const call = media.getIn(['byId', mediaId]);

    if (call && call.isDismissed) {
      return null;
    }

    return call;
  }
);

export const getCurrentActivity = createSelector(
  [getWidget, getFeatures, getOwnProps],
  (widget) => {
    if (widget.get('secondaryActivityType')) return widget.get('secondaryActivityType');

    return widget.get('primaryActivityType');
  }
);

/**
 * Builds a space details object from store + calculated title & avatarid
 */
export const getSpaceDetails = createSelector(
  [getWidget, getUsers, getSpaces, getCall],
  (widget, users, spaces, call) => {
    if (!widget.get('spaceDetails')) {
      return null;
    }

    const spaceDetails = widget.get('spaceDetails').toJS();
    const destination = widget.get('destination');

    if (!destination) {
      return spaceDetails;
    }
    const {
      id,
      type
    } = destination;

    let avatarId, displayName;

    switch (type) {
      case destinationTypes.SIP:
      case destinationTypes.PSTN: {
        if (call?.locusInfo?.self?.displayInfo) {
          displayName = call.locusInfo.self.displayInfo.primaryDisplayName;
        }
        else {
          displayName = id;
        }
        break;
      }
      case destinationTypes.EMAIL: {
        avatarId = users.getIn(['byEmail', id]);
        displayName = users.getIn(['byId', avatarId, 'displayName']);
        break;
      }
      case destinationTypes.USERID: {
        const {id: userId} = validateAndDecodeId(id);

        displayName = users.getIn(['byId', userId, 'displayName']);
        avatarId = userId;
        break;
      }
      case destinationTypes.SPACEID:
        if (spaceDetails.type === 'direct') {
          const currentUserId = users.get('currentUserId');
          const toUser = users.get('byId').find((u) => u.get('id') !== currentUserId);

          displayName = spaceDetails.title;
          if (toUser) {
            avatarId = toUser.get('id');
          }
        }
        else {
          const {id: tempId} = validateAndDecodeId(id);

          displayName = spaces.getIn(['byId', tempId, 'displayName']);
          avatarId = tempId;
        }
        break;
      default:
        displayName = null;
    }

    spaceDetails.avatarId = avatarId;
    spaceDetails.title = displayName;

    return spaceDetails;
  }
);

export const getActivityTypes = createSelector(
  [getWidget, getFeatures, getOwnProps],
  (widget, features, ownProps) => {
    const {spaceActivities, call} = ownProps;
    const destination = widget.get('destination');
    const spaceType = widget.getIn(['spaceDetails', 'type']);
    const filteredActivityTypes = [];
    let activityTypes = widget.get('activityTypes').toJS();

    if (spaceActivities) {
      activityTypes = activityTypes.filter((a) => spaceActivities[a.name] !== false);
    }
    activityTypes.forEach((activityType) => {
      let isValid = true;

      // Filter activity Type based on spaceType
      if (spaceType && !activityType.spaceTypes.includes(spaceType)) {
        isValid = false;
      }
      // Filter activity type based on feature requirement
      if (activityType.feature && !activityType.feature.hide && !features.getIn(['items', activityType.feature.key])) {
        isValid = false;
      }
      // Hide flag on feature means to hide activity if feature is enabled
      if (activityType.feature && activityType.feature.hide && features.getIn(['items', activityType.feature.key])) {
        isValid = false;
      }
      // Filter based on destination type
      if (
        destination && destination.type
        && ([destinationTypes.SIP, destinationTypes.PSTN].includes(destination.type) || call)
        && ['message', 'files'].includes(activityType.name)
      ) {
        isValid = false;
      }

      if (isValid) {
        filteredActivityTypes.push(activityType);
      }
    });

    return filteredActivityTypes;
  }
);

export const getSubmitOptions = createSelector(
  [getOwnProps],
  (ownProps) => {
    const {showSubmitButton = false, sendMessageOnReturnKey = true} = ownProps;

    return {showSubmitButton, sendMessageOnReturnKey};
  }
);


export const getSpaceWidgetProps = createSelector(
  [getWidget,
    getSpark,
    getMedia,
    getSpaceDetails,
    getActivityTypes,
    getCall,
    getMercuryStatus,
    getCurrentActivity,
    getSubmitOptions],
  (widget,
    spark,
    media,
    spaceDetails,
    activityTypes,
    call, mercuryStatus,
    currentActivity,
    {
      showSubmitButton,
      sendMessageOnReturnKey
    }) => ({
    activityTypes,
    destination: widget.get('destination'),
    media,
    mercuryStatus: mercuryStatus.toJS(),
    sparkInstance: spark.get('spark'),
    sparkState: spark.get('status'),
    spaceDetails,
    widgetStatus: widget.get('status'),
    call,
    currentActivity,
    showSubmitButton,
    sendMessageOnReturnKey
  })
);
