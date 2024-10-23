import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@webex/react-component-button';
import Timer from '@webex/react-component-timer';

import styles from './styles.css';

function JoinCallButton({callStartTime, onJoinClick}) {
  return (
    <div className={classNames('webex-join-call', styles.join)}>
      <Button
        accessibilityLabel="Join Call"
        buttonClassName={classNames('webex-join-call-button', styles.joinButton)}
        label="Join"
        onClick={onJoinClick}
      />
      <div className={classNames('webex-join-call-duration', styles.duration)}>
        <Timer startTime={callStartTime} />
      </div>
    </div>
  );
}

JoinCallButton.propTypes = {
  callStartTime: PropTypes.number.isRequired,
  onJoinClick: PropTypes.func.isRequired
};

export default JoinCallButton;