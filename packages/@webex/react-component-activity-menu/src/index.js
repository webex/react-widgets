import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Button, Icon} from '@momentum-ui/react';
import ButtonControls from '@webex/react-component-button-controls';

import styles from './styles.css';

const propTypes = {
  buttons: PropTypes.array.isRequired,
  onExit: PropTypes.func,
  showExitButton: PropTypes.bool
};

const defaultProps = {
  onExit: () => {},
  showExitButton: false
};


function ActivityMenu(props) {
  const {
    buttons,
    onExit,
    showExitButton
  } = props;

  function handleExit(e) {
    e.preventDefault();
    onExit();
  }

  return (
    <div className={classNames('webex-activity-menu', styles.activityMenu)}>
      {
        showExitButton &&
        <div className={classNames('webex-activity-menu-exit', styles.menuExit)}>
          <Button
            ariaLabel="Exit"
            circle
            onClick={handleExit}
          >
            <Icon name="icon-cancel_16" />
          </Button>
        </div>
      }
      <div className={classNames('webex-main-menu', styles.mainMenu)}>
        <ButtonControls buttons={buttons} showLabels />
      </div>
    </div>
  );
}

ActivityMenu.propTypes = propTypes;
ActivityMenu.defaultProps = defaultProps;

export default ActivityMenu;
