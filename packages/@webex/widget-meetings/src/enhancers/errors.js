import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {bindActionCreators} from 'redux';
import {addError, removeError} from '@webex/redux-module-errors';

import messages from '../messages';

function checkForSDKErrors(props) {
  const {
    errors,
    sdkState,
    sdkInstance
  } = props;
  const {formatMessage} = props.intl;
  const registerErrorId = 'sdk.register';

  if (sdkState.registerError && (!errors.get('hasError') || !errors.get('errors').has(registerErrorId))) {
    const error = sdkInstance.get('error');
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
    destinationId,
    destinationType,
    errors
  } = props;
  const {formatMessage} = props.intl;
  const missingDestinationErrorId = 'meetings.missingDestination';

  if ((!destinationId || !destinationType) && (!errors.get('hasError')
      || !errors.get('errors').has(missingDestinationErrorId))) {
    props.addError({
      id: missingDestinationErrorId,
      displayTitle: formatMessage(messages.missingDestination),
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
      checkForSDKErrors(this.props);
      checkForPropsErrors(this.props);
    },
    componentWillReceiveProps: (nextProps) => {
      checkForSDKErrors(nextProps);
      checkForPropsErrors(nextProps);
    }
  })
);
