import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  content: PropTypes.string,
  displayName: PropTypes.string,
  renderedComponent: PropTypes.object
};

const defaultProps = {
  content: '',
  displayName: '',
  renderedComponent: null
};


function ActivityText({content, displayName, renderedComponent}) {
  if (renderedComponent) {
    return (
      <a className={classNames('webex-activity-text', styles.activityText)} tabIndex={0}>
        {renderedComponent}
      </a>
    );
  }

  if (content) {
    const htmlContent = {__html: content || displayName};
    // regex to add target="_blank" to all anchor tags that don't have target="_blank", href="mailto:", or href="tel:"
    htmlContent.__html = htmlContent.__html.replace(/<a(?![^>]*target="_blank"|\s*href\s*=\s*["'](?:mailto:|tel:))([^>]*)>/gi, '<a target="_blank"$1>');

    return (
      <a
        className={classNames('webex-activity-text', styles.activityText)}
        // eslint-disable-reason content is considered safe from server
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={htmlContent}
        tabIndex={0}
      />
    );
    /* eslint-enable react/no-danger */
  }

  return (
    <a className={classNames('webex-activity-text', styles.activityText)} tabIndex={0}>
      {displayName}
    </a>
  );
}

ActivityText.propTypes = propTypes;
ActivityText.defaultProps = defaultProps;

export default ActivityText;
