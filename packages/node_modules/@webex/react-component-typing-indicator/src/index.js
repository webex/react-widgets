import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

/**
 * Typing indicator component
 * @returns {Object}
 */
function TypingIndicator() {
  return (
    <div className={classNames('webex-typing-background', styles.background)}>
      <div className={classNames('webex-typing-indicator', styles.typingIndicator)}>
        <div className={classNames('webex-sq', styles.sq)} />
        <div className={classNames('webex-sq', styles.sq)} />
        <div className={classNames('webex-sq', styles.sq)} />
      </div>
    </div>
  );
}

export default TypingIndicator;
