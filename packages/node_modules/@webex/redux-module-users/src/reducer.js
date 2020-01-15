import {fromJS, Record} from 'immutable';

import {
  STORE_USER,
  STORE_USERS,
  FETCH_USER_REQUEST,
  STORE_CURRENT_USER,
  FETCH_CURRENT_USER_REQUEST,
  PENDING_STATUS
} from './actions';

const Status = new Record({
  isFetching: false
});
const User = new Record({
  id: undefined,
  displayName: '',
  nickName: '',
  email: '',
  orgId: '',
  status: new Status()
});

export const initialState = fromJS({
  currentUserId: null,
  byId: {},
  byEmail: {}
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case STORE_USER: {
      const {user} = action.payload;

      return state
        .setIn(['byId', user.id], new User(user))
        .setIn(['byEmail', user.email], user.id);
    }
    case STORE_USERS: {
      const users = {};
      const emails = {};

      action.payload.users.forEach((u) => {
        users[u.id] = new User(u);
        emails[u.email] = u.id;
      });

      return state
        .mergeIn(['byId'], users)
        .mergeIn(['byEmail'], emails);
    }
    case STORE_CURRENT_USER: {
      const {user} = action.payload;

      return state.set('currentUserId', user.id)
        .setIn(['byId', user.id], new User(user))
        .setIn(['byEmail', user.email], user.id);
    }
    case FETCH_USER_REQUEST: {
      const {email, id} = action.payload;
      let newState = state;

      if (id) {
        newState = newState.setIn(['byId', id], new User({status: {isFetching: true}}));
      }
      else if (email) {
        newState = newState.setIn(['byEmail', email], id || PENDING_STATUS);
      }

      return newState;
    }
    case FETCH_CURRENT_USER_REQUEST: {
      const {id} = action.payload;

      return state.set('currentUserId', id)
        .setIn(['byId', id], new User({status: {isFetching: true}}));
    }
    default:
      return state;
  }
}

export const records = {
  Status,
  User
};
