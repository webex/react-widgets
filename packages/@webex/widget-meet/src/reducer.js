import {combineReducers} from 'redux';
import {Record} from 'immutable';
import media from '@webex/redux-module-media';
import {reducer as notifications} from '@webex/react-container-notifications';
import avatar from '@webex/redux-module-avatar';
import mercury from '@webex/redux-module-mercury';
import spaces from '@webex/redux-module-spaces';
import activities from '@webex/redux-module-activities';

import {
  STORE_MEET_DETAILS,
  UPDATE_LOCAL_VIDEO_POSITION,
  UPDATE_WIDGET_STATUS
} from './actions';

const Status = Record({
  hasOpenWithCall: false,
  hasInitiatedCall: false // local user has clicked call button
});

const VideoPosition = Record({
  x: 0,
  y: 0
});

/**
 * Note: We are storing the call object because services can take a long time to
 * return with a full locus object. If the call object exists in this store, it
 * will be used as a fallback if no others exist in the media store.
 */

const InitialState = Record({
  toType: '', // valid types: userId, spaceId, email, sip, pstn
  toValue: '', // sip address, uuid, email, phone number
  callId: '', // id of call object in media store.
  spaceId: '',
  userId: '',
  localVideoPosition: new VideoPosition(),
  status: new Status()
});

export const initialState = new InitialState();

export function reducer(state = initialState, action) {
  switch (action.type) {
    case STORE_MEET_DETAILS:
      return state.merge(action.payload);
    case UPDATE_LOCAL_VIDEO_POSITION:
      return state.set('localVideoPosition', action.payload.position);
    case UPDATE_WIDGET_STATUS:
      return state.mergeIn(['status'], action.payload.status);

    default:
      return state;
  }
}

export const reducers = {
  media,
  avatar,
  activities,
  mercury,
  notifications,
  spaces,
  widgetMeet: reducer
};

export default combineReducers(reducers);