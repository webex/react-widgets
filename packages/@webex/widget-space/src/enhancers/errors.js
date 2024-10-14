import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {bindActionCreators} from 'redux';
import {addError, removeError} from '@webex/redux-module-errors';
import {validateAndDecodeId, isUuid} from '@webex/react-component-utils';

import messages from '../messages';

import {destinationTypes} from '../constants';

import {ACTIVITY_TYPE_PRIMARY} from './activity-menu';

function checkForMercuryErrors(props) {
  const {
    errors,
    intl,
    mercury
  } = props;
  // Add Mercury disconnect error
  const mercuryError = 'mercury.disconnect';
  const isMercuryConnected = mercury.getIn(['status', 'connected']);
  const isMercuryDisconnected = !isMercuryConnected && mercury.getIn(['status', 'hasConnected']);
  const hasError = errors.get('hasError');
  const hasMercuryError = errors.get('errors').has(mercuryError);
  const hasNoMercuryError = !hasError || !hasMercuryError;

  if (isMercuryDisconnected && hasNoMercuryError) {
    // Create UI Error
    const {formatMessage} = intl;

    props.addError({
      id: mercuryError,
      displayTitle: formatMessage(messages.errorConnection),
      displaySubtitle: formatMessage(messages.reconnecting),
      temporary: true
    });
  }
  if (isMercuryConnected && hasMercuryError) {
    props.removeError(mercuryError);
  }
}

/**
 * Checks for SDK device registration errors
 * @param {Object} props
 */
function checkForRegistrationErrors(props) {
  const {
    errors,
    sparkState,
    spark
  } = props;

  const {formatMessage} = props.intl;

  const registerErrorId = 'spark.register';

  if (sparkState.get('registerError') && (!errors.get('hasError') || !errors.get('errors').has(registerErrorId))) {
    const error = spark.get('error');
    let displaySubtitle = formatMessage(messages.unknownError);

    if (error.statusCode === 401) {
      displaySubtitle = formatMessage(messages.errorBadToken);
    }
    props.addError({
      id: registerErrorId,
      displayTitle: formatMessage(messages.unableToLoad),
      displaySubtitle,
      temporary: false,
      code: error.statusCode
    });
  }
}

/**
 * Verifies the destination provided is valid
 * @param {Object} props
 */
function checkForDestinationErrors(props) {
  const {
    currentUser,
    destination,
    destinationId,
    destinationType,
    errors
  } = props;
  const {formatMessage} = props.intl;

  // Destination type and id are required
  const missingDestinationErrorId = 'space.error.missingDestination';

  if (
    !destinationId && !destinationType &&
    (!errors.get('hasError') || !errors.get('errors').has(missingDestinationErrorId))
  ) {
    // No destination found
    props.addError({
      id: missingDestinationErrorId,
      displayTitle: formatMessage(messages.unableToLoad),
      displaySubtitle: formatMessage(messages.unknownDestination),
      temporary: false
    });
  }

  // Cannot start a space with yourself
  const toSelfErrorId = 'space.error.toSelf';

  if (
    destination &&
    currentUser && currentUser.id && currentUser.email &&
    (!errors.get('hasError') || !errors.get('errors').has(toSelfErrorId))
  ) {
    // Check for to user being self
    if (
      destination.type === destinationTypes.EMAIL && currentUser.email === destination.id
      || destination.type === destinationTypes.USERID && validateAndDecodeId(destination.id).id === currentUser.id
    ) {
      props.addError({
        id: toSelfErrorId,
        displayTitle: formatMessage(messages.unableToLoad),
        displaySubtitle: formatMessage(messages.errorToSelf),
        temporary: false
      });
    }
  }

  // Cannot start a space to a UUID destination ID
  const invalidDestinationErrorId = 'space.error.invalidDestination';

  if (
    destinationId && isUuid(destinationId) &&
    (!errors.get('hasError') || !errors.get('errors').has(invalidDestinationErrorId))
  ) {
    // No destination found
    props.addError({
      id: invalidDestinationErrorId,
      displayTitle: formatMessage(messages.unableToLoad),
      displaySubtitle: formatMessage(messages.invalidDestination),
      temporary: false
    });
  }
}

/**
 * Verifies the prop based activity types are valid
 * @param {Object} props
 */
function checkActivityTypes(props) {
  const {
    activityTypes,
    errors,
    initialActivity
  } = props;
  const {formatMessage} = props.intl;

  if (activityTypes && activityTypes.length > 0) {
    const invalidActivityId = 'ciscospark.container.space.error.invalidActivity';
    const defaultActivity = 'message';
    let validActivity = false;

    if (activityTypes.some((activity) => activity.name === initialActivity)
    || activityTypes.some((activity) => activity.name === defaultActivity)
    || activityTypes[0] && activityTypes[0].name && activityTypes[0].type === ACTIVITY_TYPE_PRIMARY
    ) {
      validActivity = true;
    }
    if (!validActivity && !errors.get('errors').has(invalidActivityId)) {
      props.addError({
        id: invalidActivityId,
        displayTitle: formatMessage(messages.disabledInitialActivity),
        temporary: false
      });
    }
    if (validActivity && errors.get('errors').has(invalidActivityId)) {
      props.removeError(invalidActivityId);
    }
  }
}

/**
 * Verifies the prop based messaging options are valid
 * @param {Object} props
 */
function checkCanSendMessage(props) {
  const {
    activityTypes,
    errors,
    showSubmitButton,
    sendMessageOnReturnKey
  } = props;
  const {formatMessage} = props.intl;
  const defaultActivity = 'message';

  if (activityTypes && activityTypes.length > 0) {
    const invalidMessagingId = 'ciscospark.container.space.error.invalidSendMessageConfiguration';
    const hasEnabledMessaging = activityTypes.some((activity) => activity.name === defaultActivity);
    const hasErrorCurrently = errors.get('errors').has(invalidMessagingId);

    if (hasEnabledMessaging && !showSubmitButton && !sendMessageOnReturnKey && !hasErrorCurrently) {
      props.addError({
        id: invalidMessagingId,
        displayTitle: formatMessage(messages.invalidSendMessageConfiguration),
        temporary: false
      });
    }

    if (hasEnabledMessaging && (showSubmitButton || sendMessageOnReturnKey) && hasErrorCurrently) {
      props.removeError(invalidMessagingId);
    }
  }
}

function checkForErrors(props) {
  checkForMercuryErrors(props);
  checkForRegistrationErrors(props);
  checkForDestinationErrors(props);
  checkActivityTypes(props);
  checkCanSendMessage(props);
}

export default compose(
  connect(
    (state) => state,
    (dispatch) => bindActionCreators({
      addError,
      removeError
    }, dispatch)
  ),
  lifecycle({
    componentWillMount() {
      checkForErrors(this.props);
    },
    componentWillReceiveProps: (nextProps) => {
      checkForErrors(nextProps);
    }
  })
);
