import {fromJS, Record} from 'immutable';

import {
  FETCH_TEAMS,
  STORE_TEAMS,
  STORE_TEAMS_ERROR
} from './actions';

const Team = Record({
  id: null,
  color: '',
  generalConversationId: null,
  displayName: '',
  description: '',
  status: {
    isArchived: false
  }
});

const Status = Record({
  isFetching: false,
  hasFetched: false,
  error: undefined
});

export const initialState = fromJS({
  byId: {},
  status: new Status()
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS: {
      return state.setIn(['status', 'isFetching'], true);
    }
    case STORE_TEAMS: {
      const teams = {};

      action.payload.teams.forEach((t) => {
        teams[t.id] = new Team(t);
      });

      return state
        .mergeIn(['byId'], teams)
        .set('status', new Status({
          isFetching: false,
          hasFetched: true,
          error: undefined
        }));
    }
    case STORE_TEAMS_ERROR: {
      return state
        .set('status', new Status({
          isFetching: false,
          hasFetched: false,
          error: action.payload.error
        }));
    }
    default:
      return state;
  }
}

