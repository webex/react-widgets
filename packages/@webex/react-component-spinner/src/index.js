import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  bright: PropTypes.bool
};

const defaultProps = {
  bright: false
};

function Spinner({bright}) {
  return <div className={classNames('webex-spinner', styles.spinner, {[styles.bright]: bright})} />;
}

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;

export default Spinner;
