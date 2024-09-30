import {Record} from 'immutable';

import mercury from '@webex/redux-module-mercury';
import users from '@webex/redux-module-users';
import spaces from '@webex/redux-module-spaces';
import errors from '@webex/redux-module-errors';
import features from '@webex/redux-module-features';
import media from '@webex/redux-module-media';
import teams from '@webex/redux-module-teams';
import avatar from '@webex/redux-module-avatar';
import activities from '@webex/redux-module-activities';
import presence from '@webex/redux-module-presence';

import {UPDATE_SPACE_KEYWORD_FILTER, UPDATE_STATUS} from './actions';

const Status = Record({
  isFetchingInitialSpaces: false,
  hasFetchedInitialSpaces: false,
  isFetchingAllSpaces: false,
  hasFetchedAllSpaces: false,
  isFetchingRecentSpaces: false,
  hasFetchedRecentSpaces: false,
  isFetchingTeams: false,
  hasFetchedTeams: false,
  isFetchingAvatars: false,
  hasFetchedAvatars: false,
  isListeningForNewActivity: false,
  hasFetchedGroupMessageNotificationFeature: false,
  hasFetchedMentionNotificationFeature: false,
  isScrolledToTop: true
});

const RecentsWidget = Record({
  incomingCall: null,
  keyword: null,
  spaceType: null,
  status: new Status()
});

export const initialState = new RecentsWidget();

export function reducer(state = new RecentsWidget(), action) {
  switch (action.type) {
    case UPDATE_STATUS:
      return state.mergeIn(['status'], action.payload.status);
    case UPDATE_SPACE_KEYWORD_FILTER:
      return state.setIn(['keyword'], action.payload.keyword ? action.payload.keyword.trim() : '');
    default:
      return state;
  }
}

const reducers = {
  avatar,
  activities,
  errors,
  features,
  media,
  mercury,
  presence,
  spaces,
  teams,
  users,
  widgetRecents: reducer
};

export default reducers;
