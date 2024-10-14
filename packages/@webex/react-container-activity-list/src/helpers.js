const REPLY_TYPE = 'reply';

export const isReplyActivity = (activity) => activity.parent?.type === REPLY_TYPE;

export const VISIBLE_ACTIVITY_VERBS = {
  tombstone: {},
  share: {
    objectTypes: ['content']
  },
  post: {
    objectTypes: ['comment']
  },
  create: {
    objectTypes: ['conversation']
  },
  update: {
    objectTypes: ['locusSessionSummaryParticipant', 'locusSessionSummary']
  },
  add: {
    objectTypes: ['person']
  },
  leave: {
    objectTypes: ['person']
  }
};

export const LYRA_SPACE_TYPE = 'LYRA_SPACE';

/**
 * Determines if an activity object is a visible activity
 * @param {object} activity
 * @returns {bool}
 */
export function isActivityVisible(activity) {
  if (activity.object) {
    const {
      type
    } = activity.object;

    // Do not show activity if its object type is 'LYRA_SPACE'
    if (type === LYRA_SPACE_TYPE) {
      return false;
    }
  }
  if (!Object.prototype.hasOwnProperty.call(VISIBLE_ACTIVITY_VERBS, activity.verb)) {
    return false;
  }
  const verb = VISIBLE_ACTIVITY_VERBS[activity.verb];

  if (verb.objectTypes) {
    if (verb.objectTypes.indexOf(activity.object.objectType) === -1) {
      return false;
    }
  }

  return true;
}
