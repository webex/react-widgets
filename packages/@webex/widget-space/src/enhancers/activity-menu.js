import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  compose,
  lifecycle,
  setPropTypes,
  withHandlers
} from 'recompose';
import classNames from 'classnames';

import MessageWidget from '@webex/widget-message';
import MeetWidget from '@webex/widget-meet';
import RosterWidget from '@webex/widget-roster';
import FilesWidget from '@webex/widget-files';

import {Icon} from '@momentum-ui/react';
import {getFeature} from '@webex/redux-module-features';

import {
  updateWidgetStatus,
  updateActivityType,
  storeActivityTypes,
  toggleActivityMenuVisible,
  updateSecondaryActivityType
} from '../actions';
import {eventNames} from '../events';
import styles from '../styles.css';

export const ACTIVITY_TYPE_PRIMARY = 'ACTIVITY_TYPE_PRIMARY';
export const ACTIVITY_TYPE_SECONDARY = 'ACTIVITY_TYPE_SECONDARY';
const DEFAULT_ACTIVITY = 'message';

export const propTypes = {
  initialActivity: PropTypes.string
};


/**
 * Builds widget elements from activityTypes list
 *
 * @param {List} activityTypes Immutable List of activity types
 * @param {String} primaryActivityType Active activity type
 * @returns {Array} of Widget elements
 */

function constructActivityWidgets(props) {
  return (activityTypes, primaryActivityType, composerActions) => activityTypes
    .filter((activityType) => activityType.type !== ACTIVITY_TYPE_SECONDARY)
    .map((a) => {
      // Only allow widget if it's available for this space type
      const Widget = a.component;
      const isVisible = primaryActivityType === a.name ? '' : styles.hidden;

      return (
        <div
          className={classNames(`webex-${a.name}-wrapper`, styles.activityComponentWrapper, isVisible)}
          key={a.name}
        >
          <Widget
            {...props}
            composerActions={composerActions}
            eventNames={eventNames}
            injectProvider={false}
            toPerson={props.spaceDetails.toPerson}
          />
        </div>
      );
    });
}

/**
 * Builds secondary widget elements
 *
 * @param {Object} props
 * @returns {Function}
 */
function constructSecondaryActivityWidget(props) {
  return (activityTypes, secondaryActivityType) => {
    if (!secondaryActivityType) {
      return null;
    }

    const secondaryWidgetClassNames = [
      'webex-secondary-widget',
      styles.secondaryWidget,
      // eslint-disable-next-line react/prop-types
      props.secondaryActivitiesFullWidth ? styles.secondaryWidgetFull : styles.secondaryWidgetCover
    ];

    return activityTypes
      .filter((activityType) =>
        activityType.type === ACTIVITY_TYPE_SECONDARY && activityType.name === secondaryActivityType)
      .map((activityType) => {
        const Widget = activityType.component;

        return (
          <div
            className={classNames(secondaryWidgetClassNames)}
            key={activityType.name}
          >
            <Widget
              {...props}
              {...activityType.props}
              eventNames={eventNames}
              injectProvider={false}
            />
          </div>
        );
      });
  };
}

function handleActivityChange(props) {
  return (activity) => {
    if (activity.type === ACTIVITY_TYPE_PRIMARY) {
      props.updateActivityType(activity.name);
    }
    else {
      props.updateSecondaryActivityType(activity.name);
    }
    // Emit Event
    props.onEvent(eventNames.ACTIVITY_CHANGED, activity);
  };
}

function handleSecondaryDismiss(props) {
  return () => props.updateSecondaryActivityType(null);
}

function handleMenuClick(props) {
  return () => props.toggleActivityMenuVisible();
}


function getFeatureFlags(props) {
  const {
    widgetSpace,
    widgetStatus
  } = props;

  if (widgetStatus.get('hasFetchedFeatureFlags') || widgetStatus.get('isFetchingFeatureFlags')) {
    return;
  }
  props.updateWidgetStatus({isFetchingFeatureFlags: true});
  widgetSpace.get('activityTypes').toJS().forEach((activityType) => {
    if (!activityType.feature) {
      return;
    }
    props.getFeature(activityType.feature.type, activityType.feature.key, props.sparkInstance);
  });
  props.updateWidgetStatus({hasFetchedFeatureFlags: true, isFetchingFeatureFlags: false});
}


export default compose(
  connect(
    (state) => state,
    (dispatch) => bindActionCreators({
      getFeature,
      updateWidgetStatus,
      updateActivityType,
      storeActivityTypes,
      toggleActivityMenuVisible,
      updateSecondaryActivityType
    }, dispatch)
  ),
  setPropTypes(propTypes),
  withHandlers({
    handleSecondaryDismiss,
    handleMenuClick,
    handleActivityChange,
    constructActivityWidgets,
    constructSecondaryActivityWidget
  }),
  lifecycle({
    componentWillMount() {
      const {
        props
      } = this;
      // Store activity types used in widget

      const DEFAULT_ACTIVITY_TYPES = [
        {
          displayName: 'Messages',
          name: 'message',
          buttonClassName: styles.messageButton,
          buttonType: 'chat',
          component: MessageWidget,
          spaceTypes: ['group', 'direct'],
          type: ACTIVITY_TYPE_PRIMARY
        },
        {
          displayName: 'Content',
          name: 'files',
          buttonClassName: styles.filesButton,
          buttonType: 'files',
          component: FilesWidget,
          spaceTypes: ['direct', 'group'],
          type: ACTIVITY_TYPE_PRIMARY,
          props: {
            onClickClose: props.handleSecondaryDismiss,
            onClickMenu: props.handleMenuClick
          }
        },
        {
          displayName: 'People',
          name: 'people',
          buttonClassName: styles.peopleButton,
          buttonType: {color: 'mint', icon: <Icon name="icon-people_28" />},
          component: RosterWidget,
          spaceTypes: ['direct', 'group'],
          type: ACTIVITY_TYPE_PRIMARY,
          props: {
            onClickClose: props.handleSecondaryDismiss,
            onClickMenu: props.handleMenuClick
          }
        },
        {
          displayName: 'Call',
          name: 'meet',
          buttonClassName: styles.meetButton,
          buttonType: 'camera',
          component: MeetWidget,
          spaceTypes: ['direct', 'group'],
          type: ACTIVITY_TYPE_PRIMARY
        }
      ];

      let activityTypes = DEFAULT_ACTIVITY_TYPES;

      if (typeof props.customActivityTypes === 'object') {
        activityTypes = activityTypes.concat(props.customActivityTypes);
      }
      props.storeActivityTypes(activityTypes);
    },
    componentWillReceiveProps(nextProps) {
      const {
        activityTypes,
        spaceDetails,
        sparkInstance,
        sparkState,
        initialActivity,
        call
      } = nextProps;
      const {props} = this;

      // Set the initial activity once we get space details
      if (sparkInstance
        && sparkState.get('authenticated')
        && sparkState.get('registered')
        && !sparkState.get('hasError')) {
        getFeatureFlags(nextProps);
      }
      if (!props.spaceDetails && spaceDetails) {
        if (activityTypes.find((a) => a.name === initialActivity)) {
          props.updateActivityType(initialActivity);
        }
        // if default activity is available
        else if (activityTypes.find((a) => a.name === DEFAULT_ACTIVITY)) {
          props.updateActivityType(DEFAULT_ACTIVITY);
        }
        // use first available activity in activity list
        else {
          props.updateActivityType(activityTypes[0].name);
        }
      }

      const prevCall = props.call;
      const hasMeet = activityTypes.some((activity) => activity.name === 'meet');
      const hasMessage = activityTypes.some((activity) => activity.name === 'message');

      // Switch to Meet if ringing
      if (hasMeet && call && !prevCall && !call.get('isDeclined')) {
        nextProps.updateActivityType('meet');
      }

      // Reset back to message view after call ends
      if (hasMessage && prevCall && !call) {
        nextProps.updateActivityType('message');
      }
    }
  })
);
