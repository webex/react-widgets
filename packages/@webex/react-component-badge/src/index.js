import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.node
};

const defaultProps = {
  tooltip: false
};

/**
 * Badge is supplemental, non-clickable component used to help bring attention to an item or object.
 * @param {object} props
 * @returns {object}
 * @constructor
 */
function Badge({children, tooltip}) {
  return (
    <span className={classNames('webex-badge', styles.badge)}>
      { tooltip &&
        <div className={classNames('webex-badge-tooltip', styles.tooltip)}>
          <div className={classNames('webex-badge-text', styles.tooltipText)}>
            {tooltip}
          </div>
        </div>
      }
      <div className={classNames('webex-badge-count', styles.count)}>
        {children}
      </div>
    </span>
  );
}

Badge.propTypes = propTypes;
Badge.defaultProps = defaultProps;

export default Badge;
