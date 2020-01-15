import {fromJS} from 'immutable';

import {
  SET_CONNECTING,
  SET_CONNECTED
} from './actions';

export const initialState = fromJS({
  status: {
    connected: false,
    connecting: false,
    hasConnected: false
  }
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONNECTING: {
      return state.setIn(['status', 'connecting'], action.payload);
    }
    case SET_CONNECTED: {
      let hasConnected = state.getIn(['status', 'hasConnected']);

      if (action.payload) {
        hasConnected = true;
      }

      return state.setIn(['status', 'connected'], action.payload).setIn(['status', 'hasConnected'], hasConnected);
    }
    default: {
      return state;
    }
  }
}
