import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {bindActionCreators} from 'redux';
import {addError, removeError} from '@webex/redux-module-errors';

import messages from '../messages';


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
      const {
        call,
        destination,
        intl
      } = this.props;

      if (!call && (!destination || destination && !destination.id || !destination.type)) {
        const {formatMessage} = intl;

        this.props.addError({
          id: 'widgetMeet.to',
          displayTitle: formatMessage(messages.callErrorBadToPropTitle),
          displaySubtitle: formatMessage(messages.callErrorBadToPropMessage),
          temporary: false
        });
      }
    },
    componentWillReceiveProps({
      call
    }) {
      if (call && call.error && !this.props.error) {
        // Call has an error
        this.props.catchCallError(call.error);
        this.props.handleHangup();
      }
    }
  })
);
