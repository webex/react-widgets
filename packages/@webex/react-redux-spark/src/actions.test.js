
import {createMockStore, createMockSpark} from '@webex/react-redux-spark-fixtures';

import * as actions from './actions';

describe('actions', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore();
  });

  it('should create an action to update spark status', () => {
    const newState = {
      registered: true,
      authenticated: true
    };

    actions.updateSparkStatus(newState);
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

describe('sdk actions', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore();
  });

  it('should register this device with spark', () => {
    const spark = createMockSpark();

    return mockStore.dispatch(actions.registerDevice(spark))
      .then(() => {
        expect(mockStore.getActions()).toMatchSnapshot();
      });
  });

  it('should unregister this device with spark', () => {
    const spark = createMockSpark();

    return mockStore.dispatch(actions.unregisterDevice(spark))
      .then(() => {
        expect(mockStore.getActions()).toMatchSnapshot();
      });
  });

  it('should handle registration errors', () => {
    const spark = createMockSpark();

    spark.internal.device.register = jest.fn(() => Promise.reject(new Error('invalid token')));

    return mockStore.dispatch(actions.registerDevice(spark))
      .then(() => {
        expect(mockStore.getActions()).toMatchSnapshot();
      });
  });
});