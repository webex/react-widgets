import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActivityItem from '@webex/react-component-activity-item';
import DaySeparator from '@webex/react-component-day-separator';
import NewMessagesSeparator from '@webex/react-component-new-messages-separator';
import {formatDate, getAdaptiveCardFeatureState} from '@webex/react-component-utils';

import styles from './styles.css';

export const ITEM_TYPE_ACTIVITY = 'ITEM_TYPE_ACTIVITY';
export const ITEM_TYPE_DAY_SEPARATOR = 'ITEM_TYPE_DAY_SEPARATOR';
export const ITEM_TYPE_NEW_MESSAGE_SEPARATOR = 'ITEM_TYPE_NEW_MESSAGE_SEPARATOR';

const REPLY_TYPE = 'reply';

const propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    activity: PropTypes.shape({
      id: PropTypes.string,
      object: PropTypes.shape({
        content: PropTypes.string,
        displayName: PropTypes.string,
        files: PropTypes.shape({
          items: PropTypes.arrayOf(PropTypes.shape({
            image: PropTypes.shape({
              url: PropTypes.string
            }),
            thumbnail: PropTypes.string,
            mimeType: PropTypes.string,
            url: PropTypes.string
          }))
        })
      }),
      actor: PropTypes.object, // Are we even using it?
      published: PropTypes.string,
      verb: PropTypes.string
    }),
    type: PropTypes.string,
    isAdditional: PropTypes.bool,
    hasError: PropTypes.bool,
    isFlagged: PropTypes.bool,
    isSelf: PropTypes.bool,
    isPending: PropTypes.bool
  })),
  newMessagesMessage: PropTypes.string.isRequired,
  onActivityDelete: PropTypes.func.isRequired,
  onActivityFlag: PropTypes.func.isRequired,
  onActivityRetry: PropTypes.func.isRequired,
  features: PropTypes.object.isRequired,
  sdkInstance: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired

};

const defaultProps = {
  activities: []
};


function ActivityList(props) {
  const {
    activities,
    newMessagesMessage,
    onActivityDelete,
    onActivityFlag,
    onActivityRetry,
    features,
    sdkInstance,
    intl
  } = props;
  const items = activities.map((visibleActivity) => {
    switch (visibleActivity.type) {
      case ITEM_TYPE_DAY_SEPARATOR: {
        const {
          fromDate, key, now, toDate
        } = visibleActivity;

        return (
          <div className={classNames(styles.separator, 'activity-list-separator')} key={key}>
            <DaySeparator
              fromDate={fromDate}
              now={now}
              toDate={toDate}
            />
          </div>
        );
      }
      case ITEM_TYPE_ACTIVITY: {
        const {
          activity, currentUser, hasError, isPending, isAdditional, isFlagged, isFlagPending, isSelf, name
        } = visibleActivity;
        const adaptiveCardFeatureState = getAdaptiveCardFeatureState(features);

        return (
          <ActivityItem
            activity={activity.object}
            actor={activity.actor}
            actorId={activity.actor.id}
            currentUser={currentUser}
            hasError={hasError}
            id={activity.id}
            isAdditional={isAdditional}
            isFlagged={isFlagged}
            isFlagPending={isFlagPending}
            isPending={isPending}
            isReply={activity.parent?.type === REPLY_TYPE}
            isSelf={isSelf}
            key={activity.id}
            name={name}
            onActivityDelete={onActivityDelete}
            onActivityFlag={onActivityFlag}
            onActivityRetry={onActivityRetry}
            timestamp={formatDate(activity.published)}
            verb={activity.verb}
            adaptiveCardFeatureState={adaptiveCardFeatureState}
            sdkInstance={sdkInstance}
            intl={intl}
          />
        );
      }
      case ITEM_TYPE_NEW_MESSAGE_SEPARATOR: {
        return <NewMessagesSeparator key={visibleActivity.key} message={newMessagesMessage} />;
      }
      default: {
        return '';
      }
    }
  });

  return (
    <div className={classNames('webex-activity-list', styles.activityList)}>
      {items}
    </div>
  );
}

ActivityList.propTypes = propTypes;
ActivityList.defaultProps = defaultProps;

export default ActivityList;
