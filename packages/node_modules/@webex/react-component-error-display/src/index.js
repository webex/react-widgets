import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  actionTitle: PropTypes.string,
  onAction: PropTypes.func,
  secondaryTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  transparent: PropTypes.bool
};

const defaultProps = {
  actionTitle: '',
  onAction: () => {},
  secondaryTitle: '',
  transparent: false
};


function ErrorDisplay({
  actionTitle,
  onAction,
  secondaryTitle,
  title,
  transparent
}) {
  function handleAction(e) {
    e.preventDefault();
    onAction();
  }

  return (
    <div className={classNames('webex-error-display', styles.errorDisplay, {[styles.transparent]: transparent})}>
      <div className={classNames('webex-error-content', styles.content)}>
        <div className={classNames('webex-error-title', styles.errorTitle, styles.contentItem)}>
          {title}
        </div>
        {
          secondaryTitle &&
          <div className={classNames('webex-error-title-secondary', styles.secondaryTitle, styles.contentItem)}>
            {secondaryTitle}
          </div>
        }
        {
          actionTitle && onAction &&
          <button
            className={classNames('webex-link-button', styles.linkButton)}
            onClick={handleAction}
            onKeyPress={handleAction}
          >
            {actionTitle}
          </button>
        }
      </div>
    </div>
  );
}

ErrorDisplay.propTypes = propTypes;
ErrorDisplay.defaultProps = defaultProps;

export default ErrorDisplay;
