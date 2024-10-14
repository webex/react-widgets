import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {bindActionCreators} from 'redux';
import {addError, removeError} from '@webex/redux-module-errors';

import messages from '../messages';

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

function checkForErrors(props) {
  const {
    errors,
    sparkState,
    spark
  } = props;
  const {formatMessage} = props.intl;
  const registerErrorId = 'spark.register';

  if (sparkState.registerError && (!errors.get('hasError') || !errors.get('errors').has(registerErrorId))) {
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

function checkForPropsErrors(props) {
  const {
    errors,
    enableUserProfile,
    enableUserProfileMenu
  } = props;
  const missingUserProfilePropErrorId = 'missingUserProfilePropErrorId';

  if ((enableUserProfileMenu && !enableUserProfile) && (!errors.get('hasError')
      || !errors.get('errors').has(missingUserProfilePropErrorId))) {
    props.addError({
      id: missingUserProfilePropErrorId,
      displayTitle: 'You must enable the userProfile property if the userProfileMenu property is enabled',
      temporary: false
    });
  }
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
      checkForMercuryErrors(this.props);
      checkForPropsErrors(this.props);
    },
    componentWillReceiveProps: (nextProps) => {
      checkForMercuryErrors(nextProps);
      checkForErrors(nextProps);
      checkForPropsErrors(nextProps);
    }
  })
);
