import React, {Component} from 'react';
import {
  applyMiddleware,
  combineReducers,
  createStore,
  compose
} from 'redux';
import {Provider} from 'react-redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import sparkReducer from '@webex/react-redux-spark';
import usersReducer from '@webex/redux-module-users';

import {REMOVE_WIDGET} from './withRemoveWidget';

function constructReducers(reducers) {
  const rootReducers = reducers;

  rootReducers.spark = sparkReducer;
  rootReducers.users = usersReducer;
  const widgetReducer = combineReducers(rootReducers);

  return (state, action) => {
    if (action.type === REMOVE_WIDGET) {
      return undefined;
    }
    if (widgetReducer) {
      return widgetReducer(state, action);
    }

    return state;
  };
}

/**
 * HOC for injecting an initial Redux state from reducers and enhancers
 * @param {Object} options
 * @param {Object} options.reducers object of reducers
 * @returns {Function} creates a wrapped React component
 */
export default function withInitialState({reducers = {}}) {
  // eslint-disable-reason redux devtools extension is required name (https://github.com/zalmoxisus/redux-devtools-extension#usage)
  // eslint-disable-next-line no-underscore-dangle
  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__ || (() => (noop) => noop);
  const middlewares = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger({
      level: 'info',
      duration: true,
      collapsed: false,
      logErrors: true
    });

    middlewares.push(logger);
  }


  return (BaseComponent) => {
    class WithInitialState extends Component {
      constructor(props) {
        super(props);
        this.widgetReducer = constructReducers(reducers);
        this.store = createStore(this.widgetReducer, compose(
          applyMiddleware(...middlewares),
          devtools()
        ));
      }

      render() {
        const {props} = this;

        // Do not inject provider if spark object already exists in props
        if (props.spark) {
          return <BaseComponent {...props} />;
        }

        return (
          <Provider store={this.store}>
            <BaseComponent {...props} />
          </Provider>
        );
      }
    }
    WithInitialState.propTypes = {
      spark: PropTypes.object
    };

    WithInitialState.defaultProps = {
      spark: undefined
    };

    return WithInitialState;
  };
}
