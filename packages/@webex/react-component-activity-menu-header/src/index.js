import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Button, Icon} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  activityTypes: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  title: PropTypes.string
};

const defaultProps = {
  title: ''
};

function ActivityMenuHeader({
  activityTypes,
  onClose,
  onMenuClick,
  title
}) {
  const displayMenu = activityTypes && activityTypes.length > 2;

  return (
    <div className={classNames('webex-widget-header', styles.widgetHeader)}>
      { onClose &&
        <div className={classNames('webex-widget-close', styles.menuButton)}>
          <Icon
            ariaLabel="Close"
            name="icon-cancel_18"
            onClick={onClose}
          />
        </div>
      }
      <div className={classNames('webex-widget-title', styles.widgetTitle)}>
        {title}
      </div>
      <div className={classNames('webex-widget-menu', styles.menuButton)}>
        { displayMenu && onMenuClick &&
          <Button
            ariaLabel="Main Menu"
            circle
            onClick={onMenuClick}
            size={32}
          >
            <Icon color="black" name="icon-activities_16" />
          </Button>
        }
      </div>
    </div>
  );
}

ActivityMenuHeader.propTypes = propTypes;
ActivityMenuHeader.defaultProps = defaultProps;

export default ActivityMenuHeader;