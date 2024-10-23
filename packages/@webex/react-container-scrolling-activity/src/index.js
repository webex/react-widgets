import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import injectScrollable from '@webex/react-hoc-scrollable';

import {Loading} from '@momentum-ui/react';

import styles from './styles.css';

const injectedPropTypes = {
  children: PropTypes.node.isRequired
};

const propTypes = {
  isLoadingHistoryUp: PropTypes.bool,
  ...injectedPropTypes
};

const defaultProps = {
  isLoadingHistoryUp: false
};

export function ScrollingActivity({
  isLoadingHistoryUp,
  children
}) {
  let spinnerUp;

  const spinner = (
    <div className={classNames('webex-spinner-container', styles.spinnerContainer)}>
      <Loading />
    </div>
  );

  if (isLoadingHistoryUp) {
    spinnerUp = spinner;
  }

  return (
    <div>
      {spinnerUp}
      {children}
    </div>
  );
}

ScrollingActivity.propTypes = propTypes;
ScrollingActivity.defaultProps = defaultProps;

export default injectScrollable(ScrollingActivity);