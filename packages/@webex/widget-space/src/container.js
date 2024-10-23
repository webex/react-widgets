import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';
import {compose} from 'recompose';
import {Button, Icon} from '@momentum-ui/react';

import TitleBar from '@webex/react-component-title-bar';
import LoadingScreen from '@webex/react-component-loading-screen';
import Timer from '@webex/react-component-timer';
import ErrorDisplay from '@webex/react-component-error-display';

import {unregisterDevice} from '../../react-redux-spark/src/actions';

import ActivityMenu from './components/activity-menu';

import {storeDestination} from './actions';
import messages from './messages';

import './momentum.scss';
import styles from './styles.css';

import enhancers from './enhancers';

import {propTypes as activityMenuPropTypes} from './enhancers/activity-menu';

const injectedPropTypes = {
  activityTypes: PropTypes.array.isRequired,
  call: PropTypes.object,
  conversation: PropTypes.object.isRequired,
  currentActivity: PropTypes.string,
  errors: PropTypes.object.isRequired,
  sparkInstance: PropTypes.object,
  widgetSpace: PropTypes.object.isRequired
};

export const ownPropTypes = {
  composerActions: PropTypes.shape({
    attachFiles: PropTypes.bool
  }),
  customActivityTypes: PropTypes.object,
  destinationId: PropTypes.string,
  destinationType: PropTypes.oneOf(['email', 'userId', 'spaceId', 'sip', 'pstn']),
  muteNotifications: PropTypes.bool,
  secondaryActivitiesFullWidth: PropTypes.bool,
  setCurrentActivity: PropTypes.string,
  spaceActivities: PropTypes.shape({
    files: PropTypes.bool,
    meet: PropTypes.bool,
    message: PropTypes.bool,
    people: PropTypes.bool
  }),
  startCall: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  disablePresence: PropTypes.bool,
  disableFlags: PropTypes.bool,
  showSubmitButton: PropTypes.bool,
  sendMessageOnReturnKey: PropTypes.bool,
  ...activityMenuPropTypes,
  ...injectedPropTypes
};

const defaultProps = {
  composerActions: {
    attachFiles: true
  },
  customActivityTypes: undefined,
  destinationId: null,
  destinationType: null,
  muteNotifications: false,
  secondaryActivitiesFullWidth: true,
  setCurrentActivity: '',
  spaceActivities: {
    files: true,
    meet: true,
    message: true,
    people: true
  },
  startCall: false,
  disablePresence: false,
  disableFlags: false,
  showSubmitButton: false,
  sendMessageOnReturnKey: true
};

export class SpaceWidget extends Component {
  componentWillUnmount() {
    const {sparkInstance} = this.props;

    // Make sure we unregister device when unmouting this component
    this.props.unregisterDevice(sparkInstance);
  }

  render() {
    const {props} = this;
    const {
      activityTypes,
      call,
      conversation,
      currentActivity,
      composerActions,
      sparkInstance,
      spaceDetails,
      errors,
      widgetSpace,
      widgetStatus
    } = props;
    const {formatMessage} = props.intl;
    let errorElement;

    if (errors.get('hasError') || conversation.getIn(['status', 'error'])) {
      let widgetError = errors.get('errors').first();

      if (!widgetError) {
        widgetError = {
          displaySubtitle: conversation.getIn(['status', 'error', 'description']),
          temporary: false,
          title: formatMessage(messages.errorConversation)
        };
      }
      errorElement = (
        <div className={classNames('webex-error-wrapper', styles.errorWrapper)}>
          <ErrorDisplay
            secondaryTitle={widgetError.displaySubtitle}
            title={widgetError.displayTitle}
            transparent={widgetError.temporary}
            {...widgetError}
          />
        </div>
      );
    }
    if (sparkInstance && spaceDetails) {
      // Construct widgets
      const primaryActivityType = widgetSpace.get('primaryActivityType');
      const secondaryActivityType = widgetSpace.get('secondaryActivityType');
      const widgets = props.constructActivityWidgets(activityTypes, primaryActivityType, composerActions);
      const secondaryWidget = props.constructSecondaryActivityWidget(activityTypes, secondaryActivityType);
      const {avatarId, title = 'Loading...'} = spaceDetails;
      const callStartTime = (call?.activeParticipantsCount > 0) ? call?.startTime : null;

      let menuButton;
      const {preferredWebexSite} = sparkInstance.meetings;
      let isMeetButtonDisabled = false;

      if (props.destinationType === 'spaceId' && activityTypes.some((activity) => activity.name === 'meet')) {
        isMeetButtonDisabled = !preferredWebexSite;
      }

      const errorElementSpace = (
        <div className={classNames('webex-error-wrapper', styles.errorWrapper)}>
          <ErrorDisplay
            transparent={false}
            title={formatMessage(messages.noAbilityToStartMeeting)}
          />
        </div>
      );

      if (activityTypes) {
        menuButton = [];
        activityTypes.forEach((at) => {
          if (at.name === 'meet') {
            menuButton.push((
              <span
                className={classNames(`webex-tab-${at.name}`, styles.tabMeet)}
                title={isMeetButtonDisabled ? formatMessage(messages.noAbilityToStartMeeting) : ''}
              >
                <Button
                  ariaLabel={at.displayName}
                  circle={!call}
                  id={styles.huddle}
                  color="green"
                  size={25}
                  disabled={isMeetButtonDisabled}
                  onClick={() => props.handleActivityChange(at)}
                >
                  <Icon name={`icon-${at.buttonType}_16`} style={{paddingRight: callStartTime ? '0.5rem' : 'inherit'}} />
                  {callStartTime && <Timer startTime={callStartTime} />}
                </Button>
              </span>
            ));
          }
          else {
            const tabActive = currentActivity === at.name;

            menuButton.push((
              <button
                aria-label={at.displayName}
                onClick={() => props.handleActivityChange(at)}
                className={classNames(`webex-tab-${at.name}`, styles.tabOther, {[styles.tabActive]: tabActive})}
                disabled={tabActive}
              >
                {at.displayName}
              </button>
            ));
          }
        });
      }

      return (
        <div className={classNames('webex-space-widget', 'md', styles.spaceWidget)}>
          { errorElement }
          {
            widgetStatus.get('activityMenuVisible') &&
            <div className={classNames('webex-activity-menu-wrapper', styles.activityMenuWrapper)}>
              <ActivityMenu
                activityTypes={activityTypes}
                onChange={props.handleActivityChange}
                onExit={props.handleMenuClick}
                showExitButton
              />
            </div>
          }
          {
            secondaryWidget
          }
          <div className={classNames('webex-title-bar-wrapper', styles.titleBarWrapper)}>
            <TitleBar avatarId={avatarId} name={title} type={spaceDetails.type}>
              {
                callStartTime &&
                <div className={classNames('webex-title-bar-call-timer', styles.callTimer)}>
                  <Timer startTime={callStartTime} />
                </div>
              }
            </TitleBar>
          </div>
          <div className={classNames('webex-tabs', styles.tabContainer)}>
            {menuButton}
          </div>
          <div className={classNames('webex-widget-body', styles.widgetBody)}>
            {(isMeetButtonDisabled && currentActivity === 'meet') ? errorElementSpace : widgets}
          </div>
        </div>
      );
    }
    if (errors.get('hasError')) {
      return errorElement;
    }

    return <LoadingScreen />;
  }
}

SpaceWidget.propTypes = ownPropTypes;
SpaceWidget.defaultProps = defaultProps;


export default compose(
  connect(
    null,
    (dispatch) => bindActionCreators({
      storeDestination,
      unregisterDevice
    }, dispatch)
  ),
  ...enhancers
)(SpaceWidget);