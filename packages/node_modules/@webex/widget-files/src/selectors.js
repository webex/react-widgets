import {createSelector} from 'reselect';
import moment from 'moment';
import {getActivitiesFromThreadAndNonThreadCollections} from '@webex/redux-module-conversation';

const getShare = (state) => state.share;

const getConversationThreadActivities = (state) => state.conversation.get('threadActivities');
const getConversationNonThreadActivities = (state) => state.conversation.get('sortNonThreadActivities');

/**
 * Formats the published date to the format specified for content display
 * @param {String} dateString
 * @returns {String}
 */
function formatDate(dateString) {
  return moment(dateString).format('M/D/YY');
}

/**
 * Creates an array of "content" activities and their data from the share module
 * @param {Array} rawActivities An array of conversation activities
 * @param {Object} share The redux share module
 * @returns {Array}
 */
function getFileShareActivities(rawActivities, share) {
  const fileShares = [];

  rawActivities.filter((activity) => activity.verb === 'share')
    .forEach((activity) => {
      if (activity.object.files && activity.object.files.items.length) {
        activity.object.files.items.forEach((fileItem) => {
          let isFetching = false;
          let objectUrl;

          if (fileItem.image) {
            const thumbnail = fileItem.mimeType === 'image/gif' ? share.getIn(['files', fileItem.url]) : share.getIn(['files', fileItem.image.url]);

            if (thumbnail) {
              isFetching = thumbnail.get('isFetching');
              objectUrl = thumbnail.get('objectUrl');
            }
          }
          const fileShare = {
            actor: activity.actor,
            activityId: activity.id,
            item: {
              ...fileItem,
              isFetching,
              objectUrl
            },
            published: new Date(activity.published),
            timestamp: formatDate(activity.published)
          };

          fileShares.push(fileShare);
        });
      }
    });

  return fileShares;
}

/**
 * Combines the threaded and non threaded activities by using the convo redux module
 * helper function
 */
const getConversationActivities = createSelector(
  [
    getConversationThreadActivities,
    getConversationNonThreadActivities
  ],
  getActivitiesFromThreadAndNonThreadCollections
);


const getFilesWidgetProps = createSelector(
  [getConversationActivities, getShare],
  (conversationActivities, share) => {
    const fileShares = getFileShareActivities(conversationActivities, share);

    return {
      // Sort by newest content first
      fileShares: fileShares.sort((a, b) => b.published - a.published)
    };
  }
);

export default getFilesWidgetProps;
