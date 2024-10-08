import {combineReducers} from 'redux';

import conversation from '@webex/redux-module-conversation';
import share from '@webex/redux-module-share';

export const reducers = {
  conversation,
  share
};

export default combineReducers(reducers);
