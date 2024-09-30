import {fromJS, Record} from 'immutable';
import {reducers as message} from '@webex/widget-message';
import {reducers as meet} from '@webex/widget-meet';
import {reducers as roster} from '@webex/widget-roster';
import errors from '@webex/redux-module-errors';
import features from '@webex/redux-module-features';
import mercury from '@webex/redux-module-mercury';
import media from '@webex/redux-module-media';
import spaces from '@webex/redux-module-spaces';
import users from '@webex/redux-module-users';

import {
  FETCHING_SPACE_DETAILS,
  RELOAD_WIDGET,
  STORE_ACTIVITY_TYPES,
  STORE_DESTINATION,
  STORE_SPACE_DETAILS,
  TOGGLE_ACTIVITY_MENU_VISIBLE,
  UPDATE_ACTIVITY_MENU_VISIBLE,
  UPDATE_ACTIVITY_TYPE,
  UPDATE_ACTIVITY_TYPE_SECONDARY,
  UPDATE_WIDGET_STATUS
} from './actions';

const Status = Record({
  activityMenuVisible: false,
  hasError: false,
  hasFetchedFeatureFlags: false,
  isFetchingFeatureFlags: false,
  isFetchingSpaceDetails: false,
  shouldReloadWidget: false
});

const Destination = Record({
  id: null,
  type: null
});

export const initialState = fromJS({
  activityTypes: [],
  destination: null,
  error: null,
  primaryActivityType: null,
  secondaryActivityType: null,
  spaceDetails: null,
  status: new Status()
});

export function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ACTIVITY_MENU_VISIBLE:
      return state.set('activityMenuVisible', action.payload.isActivityMenuVisible);

    case UPDATE_ACTIVITY_TYPE:
      return state.set('primaryActivityType', action.payload.type)
        .set('secondaryActivityType', null)
        .setIn(['status', 'activityMenuVisible'], false);

    case UPDATE_ACTIVITY_TYPE_SECONDARY:
      return state.set('secondaryActivityType', action.payload.type)
        .setIn(['status', 'activityMenuVisible'], false);

    case TOGGLE_ACTIVITY_MENU_VISIBLE:
      return state.setIn(['status', 'activityMenuVisible'], !state.getIn(['status', 'activityMenuVisible']));

    case FETCHING_SPACE_DETAILS:
      return state.setIn(['status', 'isFetchingSpaceDetails'], true);

    case STORE_SPACE_DETAILS:
      return state.setIn(['status', 'isFetchingSpaceDetails'], false)
        .set('spaceDetails', fromJS(Object.assign({}, action.payload.details)));

    case STORE_ACTIVITY_TYPES: {
      return state.set('activityTypes', fromJS(action.payload.activityTypes));
    }

    case STORE_DESTINATION: {
      return state.set('destination', new Destination(action.payload));
    }

    case UPDATE_WIDGET_STATUS: {
      return state.mergeIn(['status'], action.payload.status);
    }

    case RELOAD_WIDGET: {
      return state.setIn(['status', 'shouldReloadWidget'], false)
        .set('destination', null)
        .set('spaceDetails', null);
    }

    default:
      return state;
  }
}

const reducers = {
  ...message,
  ...meet,
  ...roster,
  errors,
  features,
  users,
  mercury,
  media,
  spaces,
  widgetSpace: reducer
};

export default reducers;
