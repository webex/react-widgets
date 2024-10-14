/*
 * WidgetRecents Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  errorBadToken: {
    id: 'webex.container.meetings.error.badtoken',
    defaultMessage: 'Error: Bad or Invalid Access Token'
  },
  missingDestination: {
    id: 'webex.container.meetings.error.missingDestination',
    defaultMessage: 'Error: Destination ID and Type Required'
  },
  unableToLoad: {
    id: 'webex.container.meetings.error.unabletoload',
    defaultMessage: 'Unable to Load Meeting'
  },
  unknownError: {
    id: 'webex.container.meetings.error.unknown',
    defaultMessage: 'There was a problem loading meeting'
  }
});
