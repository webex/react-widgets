import {initialState, reducer} from './reducer';
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

describe('widget-space redux reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle FETCHING_SPACE_DETAILS', () => {
    expect(reducer(initialState, {
      type: FETCHING_SPACE_DETAILS
    })).toMatchSnapshot();
  });

  it('should handle RELOAD_WIDGET', () => {
    const modifiedState = initialState.setIn(['status', 'shouldReloadWidget'], true);

    expect(reducer(modifiedState, {
      type: RELOAD_WIDGET
    })).toMatchSnapshot();
  });

  it('should handle STORE_ACTIVITY_TYPES', () => {
    expect(reducer(initialState, {
      type: STORE_ACTIVITY_TYPES,
      payload: {
        activityTypes: ['a', 'b', 'c']
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_DESTINATION', () => {
    expect(reducer(initialState, {
      type: STORE_DESTINATION,
      payload: {
        id: 'abc@123.net',
        type: 'EMAIL'
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_SPACE_DETAILS', () => {
    const modifiedState = initialState.setIn(['status', 'isFetchingSpaceDetails'], true);

    expect(reducer(modifiedState, {
      type: STORE_SPACE_DETAILS,
      payload: {
        id: 'abc@123.net',
        type: 'EMAIL'
      }
    })).toMatchSnapshot();
  });

  it('should handle TOGGLE_ACTIVITY_MENU_VISIBLE', () => {
    expect(reducer(initialState, {
      type: TOGGLE_ACTIVITY_MENU_VISIBLE
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_ACTIVITY_MENU_VISIBLE', () => {
    expect(reducer(initialState, {
      type: UPDATE_ACTIVITY_MENU_VISIBLE,
      payload: {
        isActivityMenuVisible: true
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_ACTIVITY_TYPE', () => {
    const modifiedState = initialState.setIn(['status', 'activityMenuVisible'], true);

    expect(reducer(modifiedState, {
      type: UPDATE_ACTIVITY_TYPE,
      payload: {
        type: 'MEET'
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_ACTIVITY_TYPE_SECONDARY', () => {
    const modifiedState = initialState.setIn(['status', 'activityMenuVisible'], true);

    expect(reducer(modifiedState, {
      type: UPDATE_ACTIVITY_TYPE_SECONDARY,
      payload: {
        type: 'ROSTER'
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_WIDGET_STATUS', () => {
    expect(reducer(initialState, {
      type: UPDATE_WIDGET_STATUS,
      payload: {
        status: {
          activityMenuVisible: false
        }
      }
    })).toMatchSnapshot();
  });
});
