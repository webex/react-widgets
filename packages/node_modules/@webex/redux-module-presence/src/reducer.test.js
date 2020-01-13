import reducer, {initialState} from './reducer';
import {
  SET_ERROR,
  SET_PRESENCE_STATUS,
  UPDATE_MODULE_STATUS
} from './actions';

describe('spark reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle SET_ERROR', () => {
    expect(reducer(initialState, {
      type: SET_ERROR,
      payload: {
        error: {
          id: 'abc-123',
          mock: true
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle SET_PRESENCE_STATUS', () => {
    expect(reducer(initialState, {
      type: SET_PRESENCE_STATUS,
      payload: {
        status: {
          'abc-123': {
            status: 'dnd'
          }
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_MODULE_STATUS', () => {
    expect(reducer(initialState, {
      type: UPDATE_MODULE_STATUS,
      payload: {
        status: {
          isSettingUserStatus: true
        }
      }
    })).toMatchSnapshot();
  });
});
