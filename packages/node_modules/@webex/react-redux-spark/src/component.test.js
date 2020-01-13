import React from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';

import {createMockStore} from '@webex/react-redux-spark-fixtures';

import SparkConnectedComponent, {SparkComponent} from './component';

describe('spark component', () => {
  let spark, sparkComponent;

  beforeEach(() => {
    spark = {
      authorization: 'authorization',
      logger: 'logger',
      meetings: 'meetings',
      people: 'people',
      phone: 'phone',
      rooms: 'rooms',
      internal: {
        conversation: 'conversation',
        feature: 'feature',
        flag: 'flag',
        mercury: 'mercury',
        presence: 'presence',
        search: 'search',
        team: 'team'
      },
      listenToAndRun: jest.fn()
    };
    sparkComponent = new SparkComponent({
      spark,
      storeSparkInstance: jest.fn(),
      updateSparkStatus: jest.fn(),
      addError: jest.fn()
    });
  });

  describe('#verifyPlugins()', () => {
    it('verifies all plugins to be injected properly to webex SDK instance', () => {
      sparkComponent.verifyPlugins(spark);
      expect(sparkComponent.props.addError).not.toHaveBeenCalled();
    });

    it('throws an error if one of the external plugin is not injected properly', () => {
      delete spark.logger;
      sparkComponent.verifyPlugins(spark);
      expect(sparkComponent.props.addError).toHaveBeenCalled();
    });

    it('throws an error if one of the internal plugin is not injected properly', () => {
      delete spark.internal.mercury;
      sparkComponent.verifyPlugins(spark);
      expect(sparkComponent.props.addError).toHaveBeenCalled();
    });
  });

  describe('#storeSDKInstance()', () => {
    beforeEach(() => {
      sparkComponent.setupDevice = jest.fn();
    });

    it('stores the SDK instance if verification is true', () => {
      sparkComponent.validateSDKInstance = jest.fn(() => true);
      sparkComponent.storeSDKInstance(spark);
      expect(sparkComponent.props.storeSparkInstance).toHaveBeenCalled();
    });

    it('does not store the SDK instance if verification is false', () => {
      sparkComponent.validateSDKInstance = jest.fn(() => false);
      sparkComponent.storeSDKInstance(spark);
      expect(sparkComponent.props.storeSparkInstance).not.toHaveBeenCalled();
    });
  });

  describe('#validateSDKInstance()', () => {
    describe('when verifyPlugins is true', () => {
      beforeEach(() => {
        sparkComponent.verifyPlugins = jest.fn(() => true);
      });

      it('returns true if the instance is an object', () => {
        expect(sparkComponent.validateSDKInstance(spark)).toBe(true);
      });

      it('returns false if the instance is not an object', () => {
        expect(sparkComponent.validateSDKInstance(undefined)).toBe(false);
      });
    });

    describe('when verifyPlugins is false', () => {
      beforeEach(() => {
        sparkComponent.verifyPlugins = jest.fn(() => false);
      });

      it('returns false if the instance is an object', () => {
        expect(sparkComponent.validateSDKInstance(spark)).toBe(false);
      });

      it('returns false if the instance is not an object', () => {
        expect(sparkComponent.validateSDKInstance(undefined)).toBe(false);
      });
    });
  });

  it('renders correctly', () => {
    const store = createMockStore();
    const component = renderer.create(
      <Provider store={store}>
        <SparkConnectedComponent
          spark={spark}
          storeSparkInstance={jest.fn()}
          updateSparkStatus={jest.fn()}
          addError={jest.fn()}
        />
      </Provider>
    );

    expect(component.toTree()).toMatchSnapshot();
  });

  afterEach(() => {
    spark = null;
    sparkComponent = null;
  });
});
