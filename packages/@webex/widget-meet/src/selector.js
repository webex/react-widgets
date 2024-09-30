import {createSelector} from 'reselect';

import {validateAndDecodeId} from '@webex/react-component-utils';

import {destinationTypes} from './';

const getSDKAdapter = (state) => state.spark.get('adaptor');
const getWidget = (state) => state.widgetMeet;
const getCalls = (state) => state.media.byId;
const getAvatars = (state) => state.avatar;
const getUsers = (state) => state.users;
const getSpaces = (state) => state.spaces;
const getErrors = (state) => state.errors;
const getOwnProps = (state, ownProps) => ownProps;

const getCall = createSelector(
  [getOwnProps, getCalls],
  (ownProps, calls) => {
    let call;

    if (ownProps.call && ownProps.call?.instance) {
      if (calls.has(ownProps.call.id)) {
        call = calls.get(ownProps.call.id);
      }
      else {
        ({call} = ownProps);
      }
    }

    // Patching in activeParticipantsCount with devices to support sip should be migrated to sdk
    if (call?.instance?.locusInfo?.participants) {
      const count = call.instance.locusInfo.participants.reduce((acc, p) =>
        acc + (p.state === 'JOINED' && p.type !== 'MEETING' ? 1 : 0), 0);

      call = call.set('activeParticipantsCount', count);
    }

    return call;
  }
);

const getMeeting = createSelector(
  [getWidget, getSDKAdapter],
  // eslint-disable-next-line arrow-body-style
  (widget, sdkAdapter) => {
    return widget.callId ? sdkAdapter?.meetingsAdapter.datasource.meetings.getMeetingByType('id', widget.callId) : null;
  }
);

const getAvatarImage = createSelector(
  [getOwnProps, getAvatars, getWidget, getUsers],
  (ownProps, avatars, widget, users) => {
    const {
      toValue,
      toType
    } = widget;

    let avatarId;

    if (toType === destinationTypes.EMAIL) {
      avatarId = users.getIn(['byEmail', toValue]);
    }
    else if ([destinationTypes.EMAIL, destinationTypes.USERID, destinationTypes.SPACEID].includes(toType)) {
      avatarId = toValue;
    }

    return avatars.getIn(['items', avatarId]);
  }
);

const getDisplayName = createSelector(
  [getOwnProps, getWidget, getUsers, getSpaces],
  (ownProps, widget, users, spaces) => {
    const {
      toValue,
      toType
    } = widget;

    switch (toType) {
      case destinationTypes.SIP:
      case destinationTypes.PSTN:
        return toValue;
      case destinationTypes.EMAIL: {
        const userId = users.getIn(['byEmail', toValue]);

        return users.getIn(['byId', userId, 'displayName']);
      }
      case destinationTypes.USERID:
        return users.getIn(['byId', toValue, 'displayName']);
      case destinationTypes.SPACEID:
        if (ownProps.spaceDetails.type === 'direct') {
          return ownProps.spaceDetails.title;
        }

        return spaces.getIn(['byId', validateAndDecodeId(toValue).id, 'displayName']);
      default:
        return '';
    }
  }
);

const getMeetWidgetError = createSelector(
  [getErrors], (errors) => errors.get('errors').first()
);

const isInState = (states = []) => (call) =>
  states.find((state) => call?.instance?.state === state);
const isOut = isInState(['DECLINED', 'LEFT']);
const isAnswered = isInState(['JOINED']);

const getMeetWidgetProps = createSelector(
  [
    getAvatarImage,
    getWidget,
    getCall,
    getDisplayName,
    getMeetWidgetError,
    getSDKAdapter,
    getMeeting
  ],
  (avatarImage, widgetMeet, call, displayName, error, sdkAdapter, meeting) => {
    const props = {
      avatarImage,
      displayName,
      call,
      widgetMeet,
      error,
      localVideoPosition: widgetMeet.localVideoPosition,
      hasVideo: widgetMeet.toType !== destinationTypes.PSTN,
      sdkAdapter,
      meeting
    };

    let callProps;

    if (call) {
      // Is the call active?
      const {
        direction,
        isConnected,
        hasJoinedOnThisDevice,
        isRinging,
        localMediaStream,
        isSendingVideo
      } = call;
      const validCall = !!call.instance.state;

      callProps = {
        isRinging,
        callInstance: call.instance,
        isActive: isConnected && hasJoinedOnThisDevice || direction === 'out',
        isIncoming: validCall && direction === 'in' && !hasJoinedOnThisDevice && !isOut(call) && !isAnswered(call)
      };
      props.hasLocalVideo = localMediaStream && localMediaStream.active && isSendingVideo;
    }

    return {
      ...props,
      ...callProps
    };
  }
);

export default getMeetWidgetProps;
