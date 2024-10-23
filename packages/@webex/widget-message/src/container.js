import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import {debounce, has, throttle, filter} from 'lodash';
import {autobind} from 'core-decorators';
import {compose} from 'recompose';

import {checkMaxFileSize, constructFiles, API_ACTIVITY_VERB, CARD_CONTAINS_IMAGE, ACTIVITY_OBJECT_CONTENT_CATEGORY_IMAGES} from '@webex/react-component-utils';

import {fetchAvatarsForUsers} from '@webex/redux-module-avatar';

import {
  acknowledgeActivityOnServer,
  createConversation,
  getConversation,
  loadMissingActivities,
  loadPreviousMessages,
  resetConversation
} from '@webex/redux-module-conversation';

import {
  fetchFlags,
  flagActivity,
  removeFlagFromServer
} from '@webex/redux-module-flags';

import {setTyping} from '@webex/redux-module-indicators';

import {
  addFiles,
  removeInflightActivity,
  retryFailedActivity
} from '@webex/redux-module-activity';

import {
  subscribeToPresenceUpdates,
  unsubscribeFromPresenceUpdates
} from '@webex/redux-module-presence';


import ConfirmationModal from '@webex/react-component-confirmation-modal';
import Cover from '@webex/react-component-cover';
import LoadingScreen from '@webex/react-component-loading-screen';
import ActivityList from '@webex/react-container-activity-list';
import MessageComposer from '@webex/react-container-message-composer';
import ReadReceipts from '@webex/react-container-read-receipts';
import ScrollingActivity from '@webex/react-container-scrolling-activity';
import ErrorDisplay from '@webex/react-component-error-display';

import wrapConversationMercury from '@webex/react-hoc-conversation-mercury';

import Notifications, {createNotification} from '@webex/react-container-notifications';

import {Button, Icon} from '@momentum-ui/react';

import enhancers from './enhancers';

import {
  confirmDeleteActivity,
  deleteActivityAndDismiss,
  hideDeleteModal,
  resetWidgetState,
  setScrolledUp,
  setScrollPosition,
  showScrollToBottomButton,
  updateHasNewMessage,
  updateWidgetState
} from './actions';

import styles from './styles.css';
import messages from './messages';

import getMessageWidgetProps from './selector';
import {eventNames as defaultEventNames} from './events';

import {handleConversationActivityEvent} from './helpers';

import {destinationTypes} from './';

const injectedPropTypes = {
  avatar: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  activitiesStatus: PropTypes.shape({
    isLoadingHistoryUp: PropTypes.bool
  }).isRequired,
  conversation: PropTypes.object.isRequired,
  composerActions: PropTypes.shape({
    attachFiles: PropTypes.bool
  }).isRequired,
  flags: PropTypes.object.isRequired,
  sparkInstance: PropTypes.object,
  widgetMessage: PropTypes.object.isRequired,
  acknowledgeActivityOnServer: PropTypes.func.isRequired,
  addFiles: PropTypes.func.isRequired,
  confirmDeleteActivity: PropTypes.func.isRequired,
  createConversation: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  deleteActivityAndDismiss: PropTypes.func.isRequired,
  fetchAvatarsForUsers: PropTypes.func.isRequired,
  fetchFlags: PropTypes.func.isRequired,
  flagActivity: PropTypes.func.isRequired,
  getConversation: PropTypes.func.isRequired,
  hideDeleteModal: PropTypes.func.isRequired,
  loadMissingActivities: PropTypes.func.isRequired,
  loadPreviousMessages: PropTypes.func.isRequired,
  oldestPublishedDate: PropTypes.string.isRequired,
  removeFlagFromServer: PropTypes.func.isRequired,
  retryFailedActivity: PropTypes.func.isRequired,
  removeInflightActivity: PropTypes.func.isRequired,
  setScrollPosition: PropTypes.func.isRequired,
  setScrolledUp: PropTypes.func.isRequired,
  setTyping: PropTypes.func.isRequired,
  showScrollToBottomButton: PropTypes.func.isRequired,
  updateHasNewMessage: PropTypes.func.isRequired,
  updateWidgetState: PropTypes.func.isRequired,
  space: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  getFeature: PropTypes.func.isRequired,
  participants: PropTypes.array.isRequired,
  activities: PropTypes.object.isRequired,
  conversationId: PropTypes.string,
  disablePresence: PropTypes.bool
};

export const ownPropTypes = {
  destination: PropTypes.shape({
    // Email or Hydra ID
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['email', 'spaceId', 'userId'])
  }).isRequired,
  hasAcknowledgementsDisabled: PropTypes.bool,
  muteNotifications: PropTypes.bool,
  onEvent: PropTypes.func,
  eventNames: PropTypes.object,
  showSubmitButton: PropTypes.bool,
  sendMessageOnReturnKey: PropTypes.bool
};

const fetchMoreActivitiesIfNecessary = ({
  activitiesStatus, conversation, firstActivity,
  loadPreviousMessages: lpm, sparkInstance, setScrollPosition: ssp,
  oldestPublishedDate
}, activityList) => {
  if (activityList?.isScrolledToTop() && firstActivity.verb !== 'create' && !activitiesStatus.isLoadingHistoryUp) {
    // Store scroll position before loading messages so the window
    // doesn't jump after they load
    ssp({scrollTop: activityList.getScrollTop()});
    lpm(
      conversation.get('url'),
      oldestPublishedDate,
      sparkInstance
    );
  }
};

/**
 * MessageWidget Container
 * @extends Component
 */
export class MessageWidget extends Component {
  /**
   * Check if activity list should scroll to bottom
   *
   * @param {object} props
   * @param {object} prevProps
   * @returns {boolean}
   */
  static shouldScrollToBottom(props, prevProps) {
    const {
      activityCount
    } = props;
    const prevActivitiesCount = prevProps.activityCount;

    if (activityCount && prevActivitiesCount === 0) {
      // Always scroll to the bottom when activities first load
      return true;
    }

    // Otherwise, don't scroll if we have scrolled up
    let shouldScrollToBottom = true;

    if (props.widgetMessage.get('hasScrolledUp')) {
      shouldScrollToBottom = false;
    }

    return shouldScrollToBottom;
  }

  constructor(props) {
    super(props);
    this.handleScroll = throttle(this.handleScroll, 250);
    this.handleMouseMove = debounce(this.handleMouseMove, 500, {
      leading: true,
      trailing: false
    });
  }

  componentDidMount() {
    this.eventNames = Object.assign({}, defaultEventNames, this.props.eventNames);

    // To support changing destinations, we must reset the stores when mounting
    // so previous conversations to other destinations aren't displayed
    this.props.resetWidgetState();

    // If our widget is instantiated with all the props loaded,
    // we can setup the conversation
    this.establishConversation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // This needs to fire here because props are loaded async via redux
    this.establishConversation(nextProps, this.props);
  }

  shouldComponentUpdate(nextProps) {
    const {props} = this;

    return nextProps.conversation !== props.conversation
      || nextProps.flags !== props.flags
      || nextProps.indicators !== props.indicators
      || nextProps.share !== props.share
      || nextProps.user !== props.user
      || nextProps.widgetMessage !== props.widgetMessage
      || nextProps.activity !== props.activity
      || nextProps.features !== props.features;
  }

  componentWillUpdate(nextProps) {
    const {props} = this;

    if (this.activityList
      && nextProps.activityCount !== props.activityCount) {
      this.scrollHeight = this.activityList.getScrollHeight();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      props,
      activityList
    } = this;
    const {formatMessage} = this.props.intl;

    fetchMoreActivitiesIfNecessary(props, activityList);

    if (activityList) {
      const {
        activityCount,
        firstActivity
      } = props;
      let objectType;
      const prevActivitiesCount = prevProps.activityCount;
      const previousFirstActivity = prevProps.firstActivity;
      const lastActivityFromPrev = prevProps.lastActivity;
      const lastActivityFromThis = props.lastActivity;

      if (lastActivityFromThis) {
        objectType = lastActivityFromThis.object ? lastActivityFromThis.object.objectType : undefined;
      }

      // If new activity comes in
      if (lastActivityFromPrev
        && lastActivityFromThis
        && activityCount !== prevActivitiesCount
        && lastActivityFromPrev.id !== lastActivityFromThis.id
        && props.currentUser.id !== lastActivityFromThis.actor.id
        && objectType !== 'locusSessionSummary'
      ) {
        // Send notification of new message
        const avatars = props.avatar.get('items');
        let cardsLength = 0;
        let message;

        if (lastActivityFromThis.object) {
          message = lastActivityFromThis.object.displayName;

          if (lastActivityFromThis.object.cards && lastActivityFromThis.object.cards.length > 0) {
            cardsLength = lastActivityFromThis.object.cards.length;
            const sharedCardsNotificationMessage = formatMessage(messages.sharedCards, {cardsLength});

            if (lastActivityFromThis.verb === API_ACTIVITY_VERB.POST) {
              message = sharedCardsNotificationMessage;
            }
            else if (lastActivityFromThis.verb === API_ACTIVITY_VERB.SHARE && lastActivityFromThis.object.files
              && lastActivityFromThis.object.files.items
              && lastActivityFromThis.object.contentCategory === ACTIVITY_OBJECT_CONTENT_CATEGORY_IMAGES) {
              const cardImagesLength
            = lastActivityFromThis.object.files.items.filter((item) => item.type === CARD_CONTAINS_IMAGE).length;
              const itemsLength = lastActivityFromThis.object.files.items.length;
              const sharedPhotosNotificationMessage
            = formatMessage(messages.sharedPhotos, {imagesLength: itemsLength - cardImagesLength});

              message
            = cardImagesLength === itemsLength
                  ? sharedCardsNotificationMessage
                  : sharedPhotosNotificationMessage;
            }
          }
        }
        const details = {
          username: lastActivityFromThis.actor.displayName,
          message,
          avatar: avatars.get(lastActivityFromThis.actor.id),
          alertType: lastActivityFromThis.alertType
        };

        props.createNotification(lastActivityFromThis.id, details);
      }
      this.updateScroll(firstActivity, previousFirstActivity, prevProps.widgetMessage.get('scrollPosition').scrollTop);

      if (MessageWidget.shouldScrollToBottom(props, prevProps)) {
        activityList.scrollToBottom();
      }
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeFromPresenceUpdates(this.props.participants.map((p) => p.id), this.props.sparkInstance);
  }

  /**
   * Processes the activities and fetches avatars for users
   * that have not been fetched yet
   *
   * @param {Object} props
   *
   */
  static getAvatarsFromActivityActors(props) {
    const {
      sparkInstance
    } = props;
    const participants = filter(props.activities, 'actor').map((activity) => activity.actor.id);

    if (participants.length === 0) {
      return;
    }
    props.fetchAvatarsForUsers(participants, sparkInstance);
  }

  /**
   * Store activity list from child component
   *
   * @param {Object} ref
   * @returns {undefined}
   */
  @autobind
  getActivityList(ref) {
    this.activityList = ref;
  }

  /**
   * Once a conversation has been established, setup
   * actions need to happen for app state
   *
   * @param {any} conversation
   * @param {any} nextProps
   *
   */
  setupConversationActions(conversation, nextProps) {
    const {
      flags, sparkInstance, space, widgetMessage, conversationId
    } = nextProps;
    const {props} = this;

    if (!widgetMessage.get('isListeningToActivity')) {
      this.listenToNewActivity(space, sparkInstance);
    }
    if (!widgetMessage.get('isListeningToTyping')) {
      this.listenToTypingEvents(conversationId, sparkInstance);
    }
    if (!flags.getIn(['status', 'hasFetched']) && !flags.getIn(['status', 'isFetching']) && !this.props.disableFlags) {
      nextProps.fetchFlags(sparkInstance);
    }
    // We only want to fetch avatars when a new activity is seen
    const {activityCount} = nextProps;
    const prevActivitiesCount = props.activityCount;

    if (activityCount && activityCount !== prevActivitiesCount) {
      MessageWidget.getAvatarsFromActivityActors(nextProps);
    }
    if (nextProps.participants) {
      const userIds = nextProps.participants.map((p) => p.id);

      if (!this.props.disablePresence) {
        this.props.subscribeToPresenceUpdates(userIds, sparkInstance);
      }
    }
    if (!widgetMessage.get('isListeningToBufferState')) {
      this.listenToBufferState(conversation.get('url'), sparkInstance);
    }
  }


  /**
   * Update scroll position when activity list changes
   * @param {object} firstActivity
   * @param {object} previousFirstActivity
   * @param {number} prevScrollTop
   */
  updateScroll(firstActivity, previousFirstActivity, prevScrollTop) {
    const {activityList} = this;

    MessageWidget.getAvatarsFromActivityActors(this.props);
    if (firstActivity && previousFirstActivity && firstActivity.id !== previousFirstActivity.id) {
      activityList.setScrollTop(activityList.getScrollHeight() - this.scrollHeight + prevScrollTop);
    }
  }

  /**
   * Attempts to fetch and establish a conversation
   *
   * @param {object} props
   * @param {object} prevProps
   *
   * @memberOf MessageWidget
   *
   */
  establishConversation(props, prevProps) {
    const {
      destination,
      sparkInstance,
      sparkState,
      conversation,
      conversationId
    } = props;

    const {
      authenticated,
      registered
    } = sparkState;

    // Check if Spark instance and connections have been established
    if (sparkInstance && authenticated) {
      // Check if destination has changed
      if (
        destination && prevProps && prevProps.destination &&
        (destination.id !== prevProps.destination.id || destination.type !== prevProps.destination.type)
      ) {
        props.resetConversation();
        props.resetWidgetState();

        return;
      }

      // Check if conversation has been retrieved
      if (registered && !conversationId && !conversation.getIn(['status', 'isFetching'])) {
        if (destination.type === destinationTypes.SPACEID) {
          props.getConversation(destination.id, sparkInstance);
        }
        if (destination.type === destinationTypes.EMAIL || destination.type === destinationTypes.USERID) {
          props.createConversation([destination.id], sparkInstance);
        }
      }
    }
    // Setup once we have a conversation
    if (conversationId) {
      this.setupConversationActions(conversation, props);
    }
  }

  /**
   * Setup listeners for typing events
   *
   * @param {String} conversationId
   * @param {Object} sparkInstance
   * @returns {undefined}
   */
  listenToTypingEvents(conversationId, sparkInstance) {
    const {props} = this;

    props.updateWidgetState({isListeningToTyping: true});
    sparkInstance.internal.mercury.on('event:status.start_typing', (event) => {
      if (event.data.conversationId === conversationId) {
        props.setTyping(event.data.actor.id, true);
      }
    });

    sparkInstance.internal.mercury.on('event:status.stop_typing', (event) => {
      if (event.data.conversationId === conversationId) {
        props.setTyping(event.data.actor.id, false);
      }
    });
  }

  /**
   * Setup listeners for new activities
   *
   * @param {String} space
   * @param {Object} sparkInstance
   * @returns {undefined}
   */
  listenToNewActivity(space, sparkInstance) {
    const {props} = this;
    const {handleEvent} = this;
    const {currentUser} = props;

    if (currentUser) {
      props.updateWidgetState({isListeningToActivity: true});
      sparkInstance.internal.mercury.on('event:conversation.activity', (event) => {
        handleConversationActivityEvent(event, this.eventNames, currentUser.id, space, {
          handleEvent,
          removeInflightActivity: props.removeInflightActivity,
          updateHasNewMessage: props.updateHasNewMessage
        });
      });
    }
  }

  /**
   * Listens for mercury buffer state events and
   * fires off actions based on them
   * @param {string} conversationUrl
   * @param {object} sparkInstance
   * @returns {undefined}
   */
  @autobind
  listenToBufferState(conversationUrl, sparkInstance) {
    const {props} = this;

    props.updateWidgetState({isListeningToBufferState: true});

    sparkInstance.internal.mercury.on('event:mercury.buffer_state', (event) => {
      const {
        lastActivity
      } = props;

      if (has(event, 'data.bufferState.conversation') && event.data.bufferState.conversation === 'UNKNOWN') {
        // Mercury does not contain enough information about the conversation, refetch
        const sinceDate = lastActivity && lastActivity.published || null;

        props.loadMissingActivities(conversationUrl, sinceDate, sparkInstance);
      }
    });
  }

  @autobind
  acknowledgeLastActivity() {
    const {
      props
    } = this;
    const {
      conversation,
      hasAcknowledgementsDisabled,
      lastActivity,
      sparkInstance
    } = props;

    if (conversation.get('lastAcknowledgedActivityId') !== lastActivity.id) {
      if (!hasAcknowledgementsDisabled) {
        props.acknowledgeActivityOnServer(conversation, lastActivity, sparkInstance);
      }
    }
  }

  /**
   * Scroll activityList to bottom
   *
   * @returns {undefined}
   */
  @autobind
  handleScrollToBottom() {
    this.activityList.scrollToBottom();
  }

  /**
   * Additional actions after submitting a message
   *
   * @returns {undefined}
   */
  @autobind
  handleMessageSubmit() {
    this.activityList.scrollToBottom();
  }

  /**
   * Event handler in case one isn't provided
   * @param {string} name
   * @param {object} data
   */
  @autobind
  handleEvent(name, data) {
    const {onEvent} = this.props;

    if (typeof onEvent === 'function') {
      this.props.onEvent(name, data);
    }
  }

  @autobind
  handleMouseMove() {
    const {
      activityList
    } = this;

    if (activityList.isScrolledToBottom()) {
      this.acknowledgeLastActivity();
    }
  }

  /**
   * Flag or unflag activity by Id
   *
   * @param {String} activityId
   * @returns {undefined}
   */
  @autobind
  handleActivityFlag(activityId) {
    const {props} = this;
    const {
      activities,
      flags,
      sparkInstance
    } = props;
    const activity = Object.values(activities).find((act) => act.id === activityId);

    if (activity) {
      const foundFlag = flags.getIn(['flags', activity.url]);

      if (foundFlag && !foundFlag.get('isInFlight')) {
        props.removeFlagFromServer(foundFlag, sparkInstance);
      }
      else if (!foundFlag) {
        props.flagActivity(activity, sparkInstance);
      }
    }
  }

  /**
   * Displays modal confirming activity delete
   *
   * @param {String} activityId
   * @returns {undefined}
   */
  @autobind
  handleActivityDelete(activityId) {
    const {props} = this;

    props.confirmDeleteActivity(activityId);
  }

  /**
   * Does the actual deletion of the activity after confirmation modal
   *
   * @returns {undefined}
   */
  @autobind
  handleConfirmActivityDelete() {
    const {props} = this;
    const {
      activities,
      conversation,
      sparkInstance,
      widgetMessage
    } = props;

    const activityId = widgetMessage.get('deletingActivityId');

    const activity = Object.values(activities).find((act) => act.id === activityId);

    if (activity) {
      props.deleteActivityAndDismiss(conversation, activity, sparkInstance);
    }
    else {
      props.hideDeleteModal();
    }
  }


  /**
   * Dismisses the confirmation modal
   *
   * @returns {undefined}
   */
  @autobind
  handleCancelActivityDelete() {
    this.props.hideDeleteModal();
  }

  @autobind
  handleActivityRetry(activityId) {
    const {props} = this;
    const {
      activity,
      sparkInstance
    } = this.props;
    const failedActivity = activity.getIn(['activityFailures', activityId]);

    return props.retryFailedActivity(failedActivity, sparkInstance);
  }

  /**
   * Adds dropped file into activity store
   *
   * @param {array} acceptedFiles
   * @returns {undefined}
   */
  @autobind
  handleFileDrop(acceptedFiles) {
    const {props} = this;
    const {
      activity,
      conversation,
      sparkInstance
    } = props;
    const files = constructFiles(acceptedFiles);

    if (files.length && checkMaxFileSize(files, props.addError, props.removeError)) {
      props.addFiles(conversation, activity, files, sparkInstance);
    }
  }

  /**
   * Perform actions when activity list scrolls
   *
   * @returns {undefined}
   */
  @autobind
  handleScroll() {
    const {
      props,
      activityList
    } = this;

    if (activityList.isScrolledToBottom()) {
      props.setScrolledUp(false);
      if (document.hasFocus()) {
        this.acknowledgeLastActivity();
      }
    }
    else {
      props.setScrolledUp(true);
    }

    fetchMoreActivitiesIfNecessary(props, activityList);
  }

  /**
   * Renders the conversation area of the widget
   *
   * @returns {object}
   */
  render() {
    const {props} = this;
    const {
      conversation,
      conversationId,
      composerActions,
      sparkInstance,
      currentUser,
      muteNotifications,
      widgetMessage,
      features,
      showSubmitButton,
      sendMessageOnReturnKey
    } = props;
    const {formatMessage} = this.props.intl;

    if (conversation && conversationId) {
      const isLoadingHistoryUp = conversation.getIn(['status', 'isLoadingHistoryUp']);
      const displayName = conversation.get('displayName');

      return (
        <Dropzone
          activeClassName={styles.activeDropzone}
          className={styles.dropzone}
          disabled={!composerActions.attachFiles}
          disableClick
          disablePreview
          onDrop={this.handleFileDrop}
        >
          <div className={classNames('webex-widget-message-main-area', styles.mainArea)} onMouseMove={this.handleMouseMove}>
            <div className={classNames('webex-activity-list-wrapper', styles.activityListWrapper)}>
              <ScrollingActivity
                isLoadingHistoryUp={isLoadingHistoryUp}
                onScroll={this.handleScroll}
                ref={this.getActivityList}
              >
                {
                  currentUser &&
                  <ActivityList
                    newMessagesMessage={formatMessage(messages.newMessagesMessage)}
                    onActivityDelete={this.handleActivityDelete}
                    onActivityFlag={this.handleActivityFlag}
                    onActivityRetry={this.handleActivityRetry}
                    features={features}
                    sdkInstance={sparkInstance}
                    intl={this.props.intl}
                  />
                }
                <div className={classNames('webex-indicators', styles.indicators)}><ReadReceipts /></div>
              </ScrollingActivity>
              {
                widgetMessage.get('showScrollToBottomButton') &&
                <div className={classNames('webex-scroll-to-bottom', styles.scrollToBottom)}>
                  <Button
                    ariaLabel={formatMessage(messages.scrollToBottom)}
                    circle
                    color={widgetMessage.get('hasNewMessage') ? 'blue' : ''}
                    onClick={this.handleScrollToBottom}
                    size={32}
                  >
                    <Icon
                      color={widgetMessage.get('hasNewMessage') ? 'white' : ''}
                      name="icon-arrow-down_16"
                    />
                  </Button>
                </div>
              }
            </div>
            <div className={classNames('webex-message-composer-wrapper', styles.messageComposerWrapper)}>
              <MessageComposer
                composerActions={composerActions}
                conversation={conversation}
                onSubmit={this.handleMessageSubmit}
                placeholder={formatMessage(messages.messageComposerPlaceholder, {displayName})}
                showMentions
                sparkInstance={sparkInstance}
                showSubmitButton={showSubmitButton}
                sendMessageOnReturnKey={sendMessageOnReturnKey}
              />
            </div>
          </div>
          {
            widgetMessage.get('showAlertModal') &&
            <ConfirmationModal
              actionButtonLabel={formatMessage(messages.deleteButtonLabel)}
              body={formatMessage(messages.deleteAlertBody)}
              cancelButtonLabel={formatMessage(messages.cancelButtonLabel)}
              onClickActionButton={this.handleConfirmActivityDelete}
              onClickCancelButton={this.handleCancelActivityDelete}
              title={formatMessage(messages.deleteAlertTitle)}
            />
          }
          <Notifications onEvent={this.handleEvent} isMuted={muteNotifications} />
          <Cover message={formatMessage(messages.dropzoneCoverMessage)} />
        </Dropzone>
      );
    }
    if (conversation && conversation.getIn(['status', 'error'])) {
      return (
        <ErrorDisplay
          secondaryTitle={conversation.getIn(['status', 'error', 'description'])}
          title={formatMessage(messages.errorConversation)}
        />
      );
    }

    return <LoadingScreen />;
  }
}

MessageWidget.propTypes = {
  ...ownPropTypes,
  ...injectedPropTypes
};

MessageWidget.defaultProps = {
  showSubmitButton: false,
  sendMessageOnReturnKey: true
};

const ConnectedMessageWidget = wrapConversationMercury(MessageWidget);

export default compose(
  connect(
    getMessageWidgetProps,
    (dispatch) => bindActionCreators({
      acknowledgeActivityOnServer,
      addFiles,
      confirmDeleteActivity,
      createConversation,
      createNotification,
      deleteActivityAndDismiss,
      fetchAvatarsForUsers,
      fetchFlags,
      flagActivity,
      getConversation,
      hideDeleteModal,
      loadMissingActivities,
      loadPreviousMessages,
      removeFlagFromServer,
      removeInflightActivity,
      resetConversation,
      resetWidgetState,
      retryFailedActivity,
      setScrollPosition,
      setScrolledUp,
      setTyping,
      showScrollToBottomButton,
      subscribeToPresenceUpdates,
      unsubscribeFromPresenceUpdates,
      updateHasNewMessage,
      updateWidgetState
    }, dispatch)
  ),
  ...enhancers
)(ConnectedMessageWidget);