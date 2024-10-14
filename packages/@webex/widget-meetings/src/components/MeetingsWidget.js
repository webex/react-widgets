import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LoadingScreen from '@webex/react-component-loading-screen';
import ErrorDisplay from '@webex/react-component-error-display';

import ActiveMeeting from './ActiveMeeting';
import InactiveMeeting from './InactiveMeeting';

// Momentum-UI base styling
import './momentum.scss';
import styles from './MeetingsWidget.css';

const propTypes = {
  destination: PropTypes.shape({
    avatarId: PropTypes.string,
    avatarImage: PropTypes.string,
    callButtonAriaLabel: PropTypes.string,
    callButtonLabel: PropTypes.string,
    displayName: PropTypes.string,
    joinButtonAriaLabel: PropTypes.string,
    joinButtonLabel: PropTypes.string
  }),
  error: PropTypes.shape({
    displayTitle: PropTypes.string,
    displaySubtitle: PropTypes.string,
    temporary: PropTypes.bool
  }),
  isReady: PropTypes.bool,
  meeting: PropTypes.object,
  meetingMedia: PropTypes.shape({
    localVideoStream: PropTypes.object,
    remoteVideoStream: PropTypes.object
  }),
  meetingStatus: PropTypes.object,
  onJoinClick: PropTypes.func.isRequired,
  onLeaveClick: PropTypes.func.isRequired
};

const defaultProps = {
  destination: {},
  error: undefined,
  isReady: false,
  meeting: undefined,
  meetingMedia: {},
  meetingStatus: {}
};

function MeetingsWidget(props) {
  const {
    destination,
    error,
    isReady,
    meeting,
    meetingMedia,
    meetingStatus,
    onJoinClick,
    onLeaveClick
  } = props;

  let main;

  if (error) {
    const {
      displayTitle,
      displaySubtitle,
      temporary
    } = error;

    main = (
      <div className={classNames(['webex-meetings-widget-error', styles.errorWrapper])}>
        <ErrorDisplay
          secondaryTitle={displaySubtitle}
          title={displayTitle}
          transparent={temporary}
        />
      </div>
    );
  }
  else if (isReady) {
    if (meeting && meetingStatus.joined) {
      main = (
        <ActiveMeeting
          localVideoStream={meetingMedia.localVideoStream}
          onLeaveClick={onLeaveClick}
          remoteVideoStream={meetingMedia.remoteVideoStream}
        />
      );
    }
    else {
      main = (
        <InactiveMeeting
          avatarId={destination.avatarId}
          onJoinClick={onJoinClick}
          avatarImage={destination.avatarImage}
          joinButtonAriaLabel={destination.joinButtonAriaLabel}
          joinButtonLabel={destination.joinButtonLabel}
          displayName={destination.displayName}
        />
      );
    }
  }
  else {
    main = (
      <LoadingScreen />
    );
  }

  return (
    <div className={classNames(['webex-meetings-widget', 'md', styles.meetingsWidget])}>
      { main }
    </div>
  );
}

MeetingsWidget.propTypes = propTypes;
MeetingsWidget.defaultProps = defaultProps;

export default MeetingsWidget;
