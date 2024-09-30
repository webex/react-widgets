import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  message: PropTypes.string.isRequired
};

function Cover({message}) {
  return (
    <div className={classNames('webex-cover-message', styles.message)}>
      <div className={classNames('webex-cover-message-title', styles.title)}>
        {message}
      </div>
    </div>
  );
}

Cover.propTypes = propTypes;

export default Cover;
