import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import getMeetingsWidgetProps from './selector';
import enhancers from './enhancers';
import handlers from './handlers';

import MeetingsWidget from './components/MeetingsWidget';

// Props injected via selector.js
const injectedPropTypes = {
  destination: PropTypes.shape({
    avatarId: PropTypes.string,
    avatarImage: PropTypes.string,
    callButtonAriaLabel: PropTypes.string,
    callButtonLabel: PropTypes.string,
    displayName: PropTypes.string
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
  meetingStatus: PropTypes.object
};

// Action props from handlers.js
const handlerPropTypes = {
  onLeaveMeeting: PropTypes.func,
  onStartMeeting: PropTypes.func
};

// Props via the main react component
export const ownPropTypes = {
  destinationId: PropTypes.string.isRequired,
  destinationType: PropTypes.oneOf(['email', 'spaceId', 'userId', 'sip', 'pstn']).isRequired
};

export class ConnectedMeetingsWidget extends Component {
  // Component missing functionality?
  // We are utilizing the "lifecycle" methods from recompose to reduce the
  // amount of code in the main component.
  // These files live in the "enhancers" folder.
  // Note: these could be eventually replaced by react hooks,
  // but are enhancers for consistency with the other widgets.

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  }

  render() {
    const {
      destination,
      error,
      isReady,
      meeting,
      meetingMedia,
      meetingStatus
    } = this.props;

    return (
      <MeetingsWidget
        destination={destination}
        error={error}
        isReady={isReady}
        meeting={meeting}
        meetingMedia={meetingMedia}
        meetingStatus={meetingStatus}
        onJoinClick={this.props.onStartMeeting}
        onLeaveClick={this.props.onLeaveMeeting}
      />
    );
  }
}

ConnectedMeetingsWidget.propTypes = {
  ...injectedPropTypes,
  ...handlerPropTypes,
  ...ownPropTypes
};


export default compose(
  connect(
    getMeetingsWidgetProps
  ),
  ...enhancers,
  handlers
)(ConnectedMeetingsWidget);
