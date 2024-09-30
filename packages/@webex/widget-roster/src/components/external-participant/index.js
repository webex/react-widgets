import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Icon} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  message: PropTypes.string.isRequired
};

function ExternalParticipantMessage({message}) {
  return (
    <div className={classNames('webex-has-external', styles.external)}>
      <div className={classNames('webex-has-external-icon', styles.externalIcon)}>
        <Icon color="yellow" name="icon-external-user_20" />
      </div>
      <div>{message}</div>
    </div>
  );
}

ExternalParticipantMessage.propTypes = propTypes;

export default ExternalParticipantMessage;

