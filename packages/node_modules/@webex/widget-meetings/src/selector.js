import {createSelector} from 'reselect';

import {PENDING_STATUS} from '@webex/redux-module-users';
import {buildDestinationLookup} from '@webex/redux-module-meetings';

import {destinationTypes} from './index';

const getErrors = (state) => state.errors;
const getMeetings = (state) => state.meetings;
const getSDKState = (state) => state.spark.get('status');
const getSDKInstance = (state) => state.spark.get('spark');
const getMercuryStatus = (state) => state.mercury.get('status');
const getUsers = (state) => state.users;
const getOwnProps = (state, ownProps) => ownProps;

const getMeetingDetails = createSelector(
  [getMeetings, getSDKInstance, getOwnProps],
  (meetings, sdkInstance, props) => {
    let meeting;
    let meetingStatus = {};
    let meetingMedia = {};

    const {destinationId, destinationType} = props;
    const meetingId = meetings.getIn(['byDestination', buildDestinationLookup({destinationType, destinationId})]);

    if (meetingId) {
      // Get the meeting status from the store
      meetingStatus = meetings.getIn(['byId', meetingId]);

      // Get the meeting object from the SDK collection
      meeting = sdkInstance.meetings.meetingCollection.meetings[meetingId];

      if (meeting && meetingStatus.joined) {
        // Get the meeting media from the meeting instance
        let remoteVideoStream;

        if (meetingStatus.hasRemoteVideo || meetingStatus.hasRemoteAudio) {
          remoteVideoStream = meeting.mediaProperties.remoteStream;
        }

        meetingMedia = {
          // Only local tracks are in the SDK, so create a stream from it
          localVideoStream: meetingStatus.hasLocalMedia && new MediaStream([meeting.mediaProperties.videoTrack]),
          remoteVideoStream
        };
      }
    }

    return {
      meeting,
      meetingMedia,
      meetingStatus
    };
  }
);

const getDestinationDetails = createSelector(
  [getUsers, getOwnProps],
  (users, props) => {
    let avatarId, displayName;

    if (props.destinationType === destinationTypes.EMAIL) {
      // Get User ID from store
      const userId = users.getIn(['byEmail', props.destinationId]);

      if (userId && userId !== PENDING_STATUS) {
        avatarId = userId;

        // Get Display name from store
        const user = users.getIn(['byId', userId]);

        if (user) {
          ({displayName} = user);
        }
      }
    }

    const destination = {
      id: avatarId,
      avatarImage: '',
      displayName
    };

    return destination;
  }
);

const getMeetingsWidgetProps = createSelector(
  [getSDKState, getSDKInstance, getMercuryStatus, getDestinationDetails, getErrors, getMeetingDetails],
  (sdkState, sdkInstance, mercuryStatusRedux, destination, errors, meetingDetails) => {
    let error;

    // Check error store for an error
    if (errors.get('hasError')) {
      error = errors.get('errors').first();
    }

    // Mercury Status isn't a Redux Record yet, convert to js
    const mercuryStatus = mercuryStatusRedux.toJS();

    // Meetings Widget is ready when SDK has device registered and websockets are connected
    const isReady = sdkState.authenticated && sdkState.registered && !sdkState.hasError &&
      mercuryStatus.hasConnected && destination.displayName && !error;

    const {meeting, meetingMedia, meetingStatus} = meetingDetails;

    return {
      destination,
      error,
      isReady,
      meeting,
      meetingMedia,
      meetingStatus,
      mercuryStatus,
      sdkState,
      sdkInstance
    };
  }
);

export default getMeetingsWidgetProps;
