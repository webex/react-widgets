import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {compose} from 'recompose';

import Ringtone, {
  RINGTONE_TYPE_RINGBACK,
  RINGTONE_TYPE_INCOMING
} from '@webex/react-component-ringtone';
import LoadingScreen from '@webex/react-component-loading-screen';
import Notifications from '@webex/react-container-notifications';
import IncomingCall from '@webex/react-component-incoming-call';

import '@webex/components/dist/css/webex-components.css';

import InactiveCall from './components/call-inactive';
import ActiveMeeting from './components/call-active';


import messages from './messages';
import styles from './styles.css';
import getMeetWidgetProps from './selector';
import enhancers from './enhancers';

const injectedPropTypes = {
  avatarId: PropTypes.string,
  avatarImage: PropTypes.string,
  displayName: PropTypes.string,
  call: PropTypes.object,
  meeting: PropTypes.object,
  widgetMeet: PropTypes.object.isRequired
};

export const ownPropTypes = {
  call: PropTypes.object,
  destination: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['email', 'spaceId', 'userId', 'sip', 'pstn'])
  }).isRequired,
  eventNames: PropTypes.object,
  muteNotifications: PropTypes.bool,
  onEvent: PropTypes.func,
  startCall: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
};

export class MeetWidget extends Component {
  constructor() {
    super();
    this.state = {
      escapedAuthentication : false
    };
  }

  
  setEscapedAuthentication = (updatedValue) => {
    this.setState({
      escapedAuthentication: updatedValue
    })
  };
  
  shouldComponentUpdate(nextProps,nextState) {
    return nextProps !== this.props || this.state.escapedAuthentication != nextState.escapedAuthentication
  }

  render() {
    const {
      intl,
      displayName,
      isIncoming,
      avatarImage,
      meeting,
      widgetMeet,
      sdkAdapter
    } = this.props;
    const {formatMessage} = intl;
    const {avatarId} = this.props.spaceDetails;

    if (displayName && sdkAdapter) {
      // Is this an incoming call?
      if (isIncoming) {
        const {
          handleAnswer,
          handleDecline
        } = this.props;

        return (
          <div className={classNames(styles.meetWidgetContainer, 'meet-widget-container')}>
            <IncomingCall
              answerButtonLabel={formatMessage(messages.answerButtonLabel)}
              avatarId={avatarId}
              avatarImage={avatarImage}
              declineButtonLabel={formatMessage(messages.declineButtonLabel)}
              displayName={displayName}
              incomingCallMessage={formatMessage(messages.incomingCallMessage)}
              onAnswerClick={handleAnswer}
              onDeclineClick={handleDecline}
            />
            <Ringtone play type={RINGTONE_TYPE_INCOMING} />
            <Notifications onEvent={this.props.handleEvent} isMuted={this.props.muteNotifications} />
          </div>
        );
      }

      // Is the call active?
      if (!this.state.escapedAuthentication && meeting && widgetMeet.status.hasInitiatedCall) {
        return (
          <div className={classNames(styles.meetWidgetContainer, 'meet-widget-container')}>
            <ActiveMeeting setEscapedAuthentication={this.setEscapedAuthentication} adapter={sdkAdapter} meetingId={meeting.id} />
            <Ringtone play={status.isRinging} type={RINGTONE_TYPE_RINGBACK} />
          </div>
        );
      }

      if (!this.state.escapedAuthentication && widgetMeet.status.hasInitiatedCall) {
        return <LoadingScreen />;
      }

      return (
        <div className={classNames(styles.meetWidgetContainer, 'meet-widget-container')}>
          <InactiveCall
            avatarId={avatarId}
            avatarImage={avatarImage}
            callButtonAriaLabel={formatMessage(messages.callButtonAriaLabel)}
            callButtonLabel={formatMessage(messages.callButtonLabel)}
            displayName={displayName}
            onCallClick={this.props.handleCall}
            setEscapedAuthentication={this.setEscapedAuthentication}
          />
          <Notifications onEvent={this.props.handleEvent} isMuted={this.props.muteNotifications} />
        </div>
      );
    }

    return <LoadingScreen />;
  }
}


MeetWidget.propTypes = {
  ...ownPropTypes,
  ...injectedPropTypes
};


export default compose(
  connect(
    getMeetWidgetProps
  ),
  enhancers
)(MeetWidget);