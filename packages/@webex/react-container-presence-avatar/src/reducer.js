import {combineReducers} from 'redux';

import avatar from '@webex/redux-module-avatar';
import presence from '@webex/redux-module-presence';

export const reducers = {
  avatar,
  presence
};

export default combineReducers(reducers);
