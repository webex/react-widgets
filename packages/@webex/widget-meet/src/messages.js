/*
 * WidgetMeet Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  answerButtonLabel: {
    id: 'ciscospark.container.meet.button.answer',
    defaultMessage: 'Answer'
  },
  callButtonAriaLabel: {
    id: 'ciscospark.container.meet.button.aria.call',
    defaultMessage: 'Start Call'
  },
  callButtonLabel: {
    id: 'ciscospark.container.meet.button.call',
    defaultMessage: 'Call'
  },
  declineButtonLabel: {
    id: 'ciscospark.container.meet.button.decline',
    defaultMessage: 'Decline'
  },
  hangupButtonLabel: {
    id: 'ciscospark.container.meet.button.hangup',
    defaultMessage: 'Hangup'
  },
  okButtonLabel: {
    id: 'ciscospark.container.meet.button.ok',
    defaultMessage: 'Ok'
  },
  callErrorDeviceNotFound: {
    id: 'ciscospark.container.meet.message.deviceNotFound',
    defaultMessage: 'Webex cannot find your camera. Please check your browser settings, and that your camera is accessible, and try again.'
  },
  callErrorNotAllowed: {
    id: 'ciscospark.container.meet.message.errorNotAllowed',
    defaultMessage: 'Webex cannot access your camera. Please check your browser settings and try again.'
  },
  callErrorSecurity: {
    id: 'ciscospark.container.meet.message.errorSecurity',
    defaultMessage: 'Video Calling is supported on secure (HTTPS) sites only.'
  },
  callErrorUnknownMessage: {
    id: 'ciscospark.container.meet.message.errorUnknown',
    defaultMessage: 'Webex cannot connect your call. Please try again.'
  },
  callErrorBadToPropTitle: {
    id: 'ciscospark.container.meet.message.errorBadToPropTitle',
    defaultMessage: 'Invalid or missing details'
  },
  callErrorBadToPropMessage: {
    id: 'ciscospark.container.meet.message.errorBadToPropMessage',
    defaultMessage: 'Please provide a valid email address, user ID, SIP uri, space ID, or call object'
  },
  callPersonPrefix: {
    id: 'ciscospark.container.meet.message.callPerson',
    defaultMessage: 'Call'
  },
  incomingCallMessage: {
    id: 'ciscospark.container.meet.message.incomingCall',
    defaultMessage: 'Incoming call'
  },
  noWebRTCBrowserSupportMessage: {
    id: 'ciscospark.container.meet.message.noWebRTCBrowserSupport',
    defaultMessage: 'Video calling is not yet supported in your browser.'
  },
  useSupportedBrowserMessage: {
    id: 'ciscospark.container.meet.message.useSupportedBrowser',
    defaultMessage: 'For the best experience, use the latest version of Chrome or Firefox.'
  }
});
