import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose, lifecycle, withHandlers} from 'recompose';

import {
  acceptIncomingCall,
  placeCall,
  declineIncomingCall,
  hangupCall
} from '@webex/redux-module-media';
import {createNotification} from '@webex/react-container-notifications';
import {addError, removeError} from '@webex/redux-module-errors';
import {constructHydraId, hydraTypes} from '@webex/react-component-utils';

import messages from '../messages';
import {
  updateWidgetStatus,
  storeMeetDetails
} from '../actions';

import {destinationTypes} from '../';


/**
 * Catches a call error and creates a system error
 * @param {*} props
 * @param {Object} props.call expects to have a call object
 * @param {Object} props.call.error call should have an error to process
 * @returns {Function} a recompose handler
 */
function catchCallError(props) {
  return () => {
    const error = props.call.error || {};
    const callErrorId = 'spark.call';
    const {formatMessage} = props.intl;
    const actionTitle = formatMessage(messages.okButtonLabel);
    let displayTitle;
    let displaySubtitle;

    switch (error.name) {
      case 'DevicesNotFoundError':
        displayTitle = formatMessage(messages.callErrorDeviceNotFound);
        break;
      case 'NotAllowedError':
        displayTitle = formatMessage(messages.callErrorNotAllowed);
        break;
      case 'SecurityError':
        displayTitle = formatMessage(messages.callErrorSecurity);
        break;
      default:
        displayTitle = formatMessage(messages.callErrorUnknownMessage);
        displaySubtitle = `(${error.name} ${error.message})`;
    }
    props.addError({
      actionTitle,
      code: error.name,
      id: callErrorId,
      displayTitle,
      displaySubtitle,
      onAction: () => props.removeError(callErrorId),
      temporary: true
    });
  };
}

function handleAnswer(props) {
  const cleanUp = () => props.updateWidgetStatus({hasInitiatedCall: false});

  return () => {
    const {call, sdkAdapter, destinationId} = props;

    props.updateWidgetStatus({hasInitiatedCall: true});
    props.acceptIncomingCall(call, {sdkAdapter, destinationId, cleanUp})
      .then(({id: callId}) => props.storeMeetDetails({callId}));
  };
}

function handleDecline(props) {
  return () => {
    const {call, sdkAdapter} = props;

    props.declineIncomingCall(call, sdkAdapter);
  };
}

function handleHangup(props) {
  return () => {
    const {
      call
    } = props;

    props.hangupCall({call: call.instance, id: call.id});
  };
}

function handleCall(props) {
  const cleanUp = () => props.updateWidgetStatus({hasInitiatedCall: false});

  return () => {
    const {
      sdkAdapter,
      widgetMeet
    } = props;
    const {
      toType,
      toValue
    } = widgetMeet;

    let destination = toValue;
    const callOptions = {
      constraints: {
        audio: true,
        video: true
      },
      offerOptions: {
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      }
    };

    switch (toType) {
      case destinationTypes.USERID:
        destination = constructHydraId(hydraTypes.PEOPLE, toValue);
        break;
      case destinationTypes.SPACEID:
        destination = toValue;
        break;
      case destinationTypes.PSTN:
        callOptions.constraints.video = false;
        callOptions.offerOptions.offerToReceiveVideo = false;
        break;
      default:
        break;
    }
    props.updateWidgetStatus({hasInitiatedCall: true});
    props.placeCall(sdkAdapter, {destination, options: callOptions, cleanUp})
      .then(({id}) => {
        props.storeMeetDetails({callId: id});
      });
  };
}

function handleCallNotification(props) {
  return (incomingCall, fromPersonName) => {
    const {
      intl,
      avatarImage
    } = props;
    const {formatMessage} = intl;
    const details = {
      username: fromPersonName,
      message: formatMessage(messages.incomingCallMessage),
      avatar: avatarImage
    };

    props.createNotification(incomingCall.id, details);
  };
}

export default compose(
  connect(
    null,
    (dispatch) => bindActionCreators({
      createNotification,
      acceptIncomingCall,
      declineIncomingCall,
      placeCall,
      hangupCall,
      updateWidgetStatus,
      storeMeetDetails,
      addError,
      removeError
    }, dispatch)
  ),
  withHandlers({
    handleAnswer,
    handleDecline,
    handleHangup,
    handleCall,
    handleCallNotification,
    catchCallError
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const {
        call,
        displayName,
        widgetMeet,
        currentUser,
        startCall,
        isIncoming
      } = nextProps;

      if (call) {
        const prevCall = this.props.call;

        // Check if this is a new initiated call and is incoming
        if (
          call.isInitiated &&
          (!prevCall || !prevCall.isInitiated) &&
          isIncoming
        ) {
          nextProps.handleCallNotification(call, displayName);
        }
      }

      if (
        (widgetMeet.toValue || call) &&
        currentUser &&
        !widgetMeet.status.hasOpenWithCall &&
        (startCall === true || startCall === '' || startCall === 'true') &&
        nextProps.sdkAdapter
      ) {
        nextProps.updateWidgetStatus({hasOpenWithCall: true});
        nextProps.handleCall();
      }
    },
    componentWillUnmount() {
      if (this.props.isActive) {
        this.props.handleHangup();
      }
    }
  })
);
