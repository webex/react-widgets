import {fromJS} from 'immutable';
import {combineReducers} from 'redux';
import conversation from '@webex/redux-module-conversation';
import activity from '@webex/redux-module-activity';
import avatar from '@webex/redux-module-avatar';
import flags from '@webex/redux-module-flags';
import indicators from '@webex/redux-module-indicators';
import {reducer as notifications} from '@webex/react-container-notifications';
import {reducer as messageComposer} from '@webex/react-container-message-composer';
import presence from '@webex/redux-module-presence';
import share from '@webex/redux-module-share';
import spark from '@webex/react-redux-spark';
import features from '@webex/redux-module-features';

import {
  RESET_WIDGET_STATE,
  SET_SCROLL_POSITION,
  UPDATE_WIDGET_STATE
} from './actions';

export const initialState = fromJS({
  deletingActivityId: null,
  isListeningToActivity: false,
  isListeningToBufferState: false,
  isListeningToTyping: false,
  showAlertModal: false,
  showScrollToBottomButton: false,
  hasNewMessage: false,
  scrollPosition: {},
  hasFetchedAdaptiveCardFeature: false
});

export function reducer(state = initialState, action) {
  switch (action.type) {
    case RESET_WIDGET_STATE:
      return initialState;

    case UPDATE_WIDGET_STATE:
      return state.merge(action.payload.state);

    case SET_SCROLL_POSITION:
      return state.set('scrollPosition', action.payload.scrollPosition);

    default:
      return state;
  }
}

export const reducers = {
  activity,
  avatar,
  conversation,
  flags,
  indicators,
  notifications,
  share,
  spark,
  messageComposer,
  features,
  presence,
  widgetMessage: reducer
};

export default combineReducers(reducers);
