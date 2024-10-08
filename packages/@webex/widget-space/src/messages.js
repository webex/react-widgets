/*
 * WidgetSpace Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  errorConnection: {
    id: 'ciscospark.container.space.error.connection',
    defaultMessage: 'Connection unavailable.'
  },
  errorNotFound: {
    id: 'ciscospark.container.space.error.notfound',
    defaultMessage: 'Either the Space does not exist or you don\'t have permission to view this Space'
  },
  errorBadToken: {
    id: 'ciscospark.container.space.error.badtoken',
    defaultMessage: 'Error: Bad or Invalid Access Token'
  },
  errorToSelf: {
    id: 'ciscospark.container.space.error.toself',
    defaultMessage: 'Error: You Cannot Open a Space with Yourself'
  },
  badSpaceId: {
    id: 'ciscospark.container.space.error.badid',
    defaultMessage: 'Error: Invalid Space ID'
  },
  disabledInitialActivity: {
    id: 'ciscospark.container.space.error.invalidActivity',
    defaultMessage: 'Error: The selected initial activity is invalid'
  },
  invalidSendMessageConfiguration: {
    id: 'ciscospark.container.space.error.invalidSendMessageConfiguration',
    defaultMessage: 'Error: The current configuration will not allow for sending messages'
  },
  unableToLoad: {
    id: 'ciscospark.container.space.error.unabletoload',
    defaultMessage: 'Unable to Load Space'
  },
  unknownDestination: {
    id: 'ciscospark.container.space.error.unknownDestination',
    defaultMessage: 'Please provide a Space ID or To Person'
  },
  invalidDestination: {
    id: 'ciscospark.container.space.error.invalidDestination',
    defaultMessage: 'Destination IDs must be fully encoded (not a UUID)'
  },
  unknownError: {
    id: 'ciscospark.container.space.error.unknown',
    defaultMessage: 'There was a problem loading space'
  },
  reconnecting: {
    id: 'ciscospark.container.space.error.reconnecting',
    defaultMessage: 'Reconnecting...'
  },
  errorConversation: {
    id: 'ciscospark.container.space.error.noConversation',
    defaultMessage: 'Conversation Not Available'
  },
  noAbilityToStartMeeting: {
    id: 'ciscospark.container.space.error.noAbilityToStartMeetingTooltip',
    defaultMessage: 'Your account currently does not have the ability to start a meeting.'
  }
});
