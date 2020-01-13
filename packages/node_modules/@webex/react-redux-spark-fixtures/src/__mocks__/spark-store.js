// Store for testing
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore
} from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {initialState as mercury} from '@webex/redux-module-mercury';
import reducers, {initialState} from '@webex/react-redux-spark';

import createSpark from '../__fixtures__/spark';


export function createMockStore() {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({
    mercury,
    spark: initialState.set('spark', createSpark())
  });

  return store;
}

export default function createSparkStore() {
  return createStore(
    combineReducers({
      spark: reducers
    }),
    compose([
      applyMiddleware(thunk)
    ])
  );
}
