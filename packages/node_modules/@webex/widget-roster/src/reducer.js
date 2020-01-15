import {fromJS} from 'immutable';
import {combineReducers} from 'redux';

import avatar from '@webex/redux-module-avatar';
import conversation from '@webex/redux-module-conversation';
import users from '@webex/redux-module-users';
import search from '@webex/redux-module-search';
import media from '@webex/redux-module-media';
import spark from '@webex/react-redux-spark';

import {
  UPDATE_WIDGET_STATE,
  VIEW_MAIN
} from './actions';

export const initialState = fromJS({
  currentView: VIEW_MAIN,
  searchTerm: ''
});

export function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_WIDGET_STATE:
      return state.merge(fromJS(action.payload.state));

    default:
      return state;
  }
}

export const reducers = {
  avatar,
  conversation,
  users,
  spark,
  search,
  media,
  widgetRoster: reducer
};

export default combineReducers(reducers);
