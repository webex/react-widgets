import {OrderedMap} from 'immutable';

/**
 * @typedef {Object} Activity
 * @typedef {String} ParentId
 */

/**
 * @param {Object.<ParentId, Activity[]>} threadActivities
 *   a map of parent activity IDs to a collection of reply activities
 * @param {Activity[]} sortNonThreadActivities collection of non-reply activities
 * @returns {Activity[]} combined collection of activities
 */
// eslint-disable-next-line import/prefer-default-export
export const getActivitiesFromThreadAndNonThreadCollections = (
  threadActivities = {},
  sortNonThreadActivities = []
) => {
  const finalList = [];
  let start = 0;

  for (let i = 0; i < sortNonThreadActivities.length; i += 1) {
    if (threadActivities[sortNonThreadActivities[i].id]) {
      // The current activity is a parent activity
      // Grab the replies and insert them after the parent.

      // This grabs all of the activities prior to the current activity
      // that were not parent activities.
      finalList.push(...sortNonThreadActivities.slice(start, i + 1));

      // This grabs all of the replies to the current parent activity
      finalList.push(...threadActivities[sortNonThreadActivities[i].id]);

      // Set start to the next activity
      start = i + 1;
    }
  }
  finalList.push(...sortNonThreadActivities.slice(start));

  return new OrderedMap(finalList.map((activity) => [activity.url, activity]));
};
