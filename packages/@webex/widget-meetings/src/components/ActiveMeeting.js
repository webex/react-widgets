import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Video from '@webex/react-component-video';
import ButtonControls from '@webex/react-component-button-controls';

import styles from './ActiveMeeting.css';

const propTypes = {
  localVideoStream: PropTypes.object,
  onLeaveClick: PropTypes.func.isRequired,
  remoteVideoStream: PropTypes.object
};

const defaultProps = {
  localVideoStream: undefined,
  remoteVideoStream: undefined
};

function ActiveMeeting(
  {
    localVideoStream,
    remoteVideoStream,
    onLeaveClick
  }
) {
  const controls = [];

  controls.push({
    accessibilityLabel: 'Hangup',
    buttonType: 'cancel',
    callControl: true,
    onClick: onLeaveClick
  });

  return (
    <div>
      {
        localVideoStream &&
        <div className={classNames(styles.localVideo, 'webex-meeting-active-local-video')}>
          <Video audioMuted srcObject={localVideoStream} />
        </div>
      }
      {
        remoteVideoStream && remoteVideoStream.active &&
        <Video srcObject={remoteVideoStream} />
      }
      <div className={classNames(styles.meetingControls, 'webex-meeting-active-controls')}>
        <ButtonControls buttons={controls} showLabels={false} />
      </div>
    </div>
  );
}

ActiveMeeting.propTypes = propTypes;
ActiveMeeting.defaultProps = defaultProps;

export default ActiveMeeting;

