import React from 'react';
import PropTypes from 'prop-types';
import {wrapDisplayName} from 'recompose';

import SparkComponent from './component';

import styles from './styles.css';

const propTypes = {
  accessToken: PropTypes.string,
  guestToken: PropTypes.string
};

const defaultProps = {
  accessToken: '',
  guestToken: ''
};

const injectSpark = (name) => (BaseComponent) => {
  function WithSpark(props) {
    return (
      <div className={styles.wrapper}>
        <SparkComponent {...props} name={name} />
        <BaseComponent {...props} name={name} />
      </div>
    );
  }
  WithSpark.propTypes = propTypes;
  WithSpark.defaultProps = defaultProps;
  WithSpark.displayName = wrapDisplayName(BaseComponent, 'WithSpark');

  return WithSpark;
};

export {
  injectSpark as default,
  injectSpark as withSpark
};
