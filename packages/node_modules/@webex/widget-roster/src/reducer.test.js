import {initialState, reducer} from './reducer';
import {UPDATE_WIDGET_STATE} from './actions';

describe('widget-roster reducer tests', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle UPDATE_WIDGET_STATE', () => {
    expect(reducer(initialState, {
      type: UPDATE_WIDGET_STATE,
      payload: {
        state: {
          searchTerm: 'Carmen Sandiago'
        }
      }
    })).toMatchSnapshot();
  });
});
