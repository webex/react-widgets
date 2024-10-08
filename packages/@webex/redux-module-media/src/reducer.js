import {
  Record,
  Map,
  List
} from 'immutable';

import {
  DISMISS_INCOMING_CALL,
  UPDATE_STATUS,
  UPDATE_CALL_STATUS,
  UPDATE_CALL_ERROR,
  REMOVE_CALL,
  STORE_CALL
} from './actions';

const ErrorObject = Record({
  name: '',
  message: ''
});

export const CallRecord = Record({
  instance: null,
  activeParticipantsCount: 0,
  direction: '',
  startTime: null,
  remoteAudioStream: null,
  remoteVideoStream: null,
  remoteMediaStream: null,
  localMediaStream: null,
  error: null,
  memberships: List(),
  locusUrl: '',
  id: '',
  isActive: false,
  isIncoming: false,
  isInitiated: false,
  isConnected: false,
  isDismissed: false,
  isDeclined: false,
  isRinging: false,
  isReceivingAudio: false,
  isReceivingVideo: false,
  isSendingAudio: false,
  isSendingVideo: false,
  remoteAudioMuted: false,
  remoteVideoMuted: false,
  hasJoinedOnThisDevice: false,
  hasError: false
});

const WebRTCStatus = Record({
  isSupported: null
});


const MediaStatus = Record({
  isListening: false,
  isListeningToIncoming: false
});

const InitialState = Record({
  byDestination: Map(),
  byLocusUrl: Map(),
  byId: Map(),
  webRTC: WebRTCStatus(),
  status: MediaStatus()
});

export const initialState = new InitialState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATUS:
      return state.mergeIn(['status'], action.payload.status);

    case STORE_CALL: {
      const {
        call,
        destination,
        id
      } = action.payload;

      if (id) {
        const {locusUrl} = call;

        let updatedState = state
          .setIn(['byId', id], CallRecord(call).set('id', id));

        if (destination) {
          updatedState = updatedState.setIn(['byDestination', destination], id);
        }
        if (locusUrl) {
          updatedState = updatedState.setIn(['byLocusUrl', locusUrl], id);
        }

        return updatedState;
      }

      return state;
    }

    case UPDATE_CALL_STATUS: {
      let updatedState = state;
      const {
        call,
        id
      } = action.payload;

      if (id) {
        updatedState = updatedState.mergeIn(['byId', id], call);
        if (call.instance) {
          // Need to set instance object so it isn't manipulated by immutable
          updatedState = updatedState.setIn(['byId', id, 'instance'], call.instance);
        }
      }
      // Handle locus replacement
      const {instance} = call;

      if (
        instance?.locusUrl &&
        state.getIn(['byLocusUrl', instance.locusUrl]) !== id
      ) {
        // remove old locusUrl if it exists
        const oldUrl = state.get('byLocusUrl').keyOf(id);

        if (oldUrl) {
          updatedState = updatedState.removeIn(['byLocusUrl', oldUrl]);
        }
        // add new URL
        updatedState = updatedState.setIn(['byLocusUrl', instance.locusUrl], id);
      }

      return updatedState;
    }

    case UPDATE_CALL_ERROR: {
      const {
        call,
        id,
        error
      } = action.payload;

      if (id) {
        return state.mergeIn(['byId', id], call)
          .setIn(['byId', id, 'error'], new ErrorObject(error));
      }

      return state;
    }

    case DISMISS_INCOMING_CALL:
      return state.setIn(['byId', action.payload.id, 'isDismissed'], true);

    case REMOVE_CALL: {
      let updatedState = state;
      const byDestinationKey = state.get('byDestination').keyOf(action.payload.id);
      const byLocusUrl = state.get('byLocusUrl').keyOf(action.payload.id);

      // Also need to check if locusUrl exists for any other call objects
      state.get('byId').forEach((c, id) => {
        if (c.locusUrl === byLocusUrl) {
          updatedState = updatedState.deleteIn(['byId', id])
            .deleteIn(['byDestination', state.get('byDestination').keyOf(id)])
            .deleteIn(['byId', id]);
        }
      });

      updatedState = updatedState.deleteIn(['byId', action.payload.id])
        .deleteIn(['byDestination', byDestinationKey])
        .deleteIn(['byLocusUrl', byLocusUrl]);

      return updatedState;
    }

    default:
      return state;
  }
}
