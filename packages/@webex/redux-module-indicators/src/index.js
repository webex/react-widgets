import {fromJS} from 'immutable';

export const ADD_TYPING_INDICATOR = 'indicators/ADD_TYPING_INDICATOR';
export const DELETE_TYPING_INDICATOR = 'indicators/DELETE_TYPING_INDICATOR';

export const initialState = fromJS({
  typing: {}
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TYPING_INDICATOR:
      return state.setIn(['typing', action.payload.userId], true);
    case DELETE_TYPING_INDICATOR:
      return state.deleteIn(['typing', action.payload.userId]);
    default:
      return state;
  }
}

export function addTyping(userId) {
  return {
    type: ADD_TYPING_INDICATOR,
    payload: {
      userId
    }
  };
}

export function deleteTyping(userId) {
  return {
    type: DELETE_TYPING_INDICATOR,
    payload: {
      userId
    }
  };
}

export function setTyping(userId, value) {
  if (value) {
    return addTyping(userId);
  }

  return deleteTyping(userId);
}
