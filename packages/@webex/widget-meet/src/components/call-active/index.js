import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  WebexInMeeting,
  WebexMeetingControlBar,
  WebexDataProvider
} from '@webex/components';

import styles from './styles.css';

const ActiveMeeting = ({setEscapedAuthentication, adapter, meetingId}) => {
  const controls = () => ['mute-audio', 'mute-video', 'share-screen', 'leave-meeting'];

  return (
    <WebexDataProvider adapter={adapter}>
      <div className={classNames(styles.callContainer, 'call-container', 'wxc-theme-light')}>
        <WebexInMeeting
          meetingID={meetingId}
          style={{flex: 1}}
          setEscapedAuthentication={setEscapedAuthentication}
        />
        <WebexMeetingControlBar
          className={styles.callControls}
          meetingID={meetingId}
          controls={controls}
        />
      </div>
    </WebexDataProvider>
  );
};

ActiveMeeting.propTypes = {
  adapter: PropTypes.object.isRequired,
  meetingId: PropTypes.string.isRequired
};

export default ActiveMeeting;
