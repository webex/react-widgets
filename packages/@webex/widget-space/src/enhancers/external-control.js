import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import {bindActionCreators} from 'redux';
import {addError, removeError} from '@webex/redux-module-errors';

import {eventNames} from '../events';

import {ACTIVITY_TYPE_PRIMARY, ACTIVITY_TYPE_SECONDARY} from './activity-menu';

function changeCurrentActivity(props) {
  const {
    activityTypes,
    setCurrentActivity
  } = props;

  // Check if activity is valid
  const toActivity = activityTypes.find((activity) => activity.name === setCurrentActivity);

  if (toActivity) {
    if (toActivity.type === ACTIVITY_TYPE_PRIMARY) {
      props.updateActivityType(setCurrentActivity);
    }
    if (toActivity.type === ACTIVITY_TYPE_SECONDARY) {
      // Secondary activities need to have the menu opened
      props.updateSecondaryActivityType(setCurrentActivity);
    }
    // Emit Event
    props.onEvent(eventNames.ACTIVITY_CHANGED, toActivity);
  }
}

function checkForExternalTrigger(nextProps, currentProps) {
  const {
    setCurrentActivity
  } = nextProps;

  // Change Current Activity
  if (setCurrentActivity && setCurrentActivity !== currentProps.setCurrentActivity) {
    changeCurrentActivity(nextProps);
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
    componentWillReceiveProps(nextProps) {
      checkForExternalTrigger(nextProps, this.props);
    }
  })
);
