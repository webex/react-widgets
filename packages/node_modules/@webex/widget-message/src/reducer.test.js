import {initialState, reducer} from './reducer';
import {
  RESET_WIDGET_STATE,
  SET_SCROLL_POSITION,
  UPDATE_WIDGET_STATE
} from './actions';

describe('widget-message redux reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle RESET_WIDGET_STATE', () => {
    expect(reducer({badState: true}, {
      type: RESET_WIDGET_STATE
    })).toMatchSnapshot();
  });

  it('should handle SET_SCROLL_POSITION', () => {
    expect(reducer(initialState, {
      type: SET_SCROLL_POSITION,
      payload: {
        scrollPosition: 0
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_WIDGET_STATE', () => {
    expect(reducer(initialState, {
      type: UPDATE_WIDGET_STATE,
      payload: {
        state: {
          mocked: true
        }
      }
    })).toMatchSnapshot();
  });
});
