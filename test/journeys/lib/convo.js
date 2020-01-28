/**
 * Unmute message notification
 * @param {Object} spark
 * @param {String} convo
 * @returns {Object}
 */
export function unmuteMessageNotification(spark, convo) {
  let activity;

  browser.call(() => spark.internal.conversation.unmuteMessages(convo)
    .then((a) => {
      activity = a;

      return activity;
    }).catch((e) => {
      console.error('Unable to unmute message notification');
      console.error(e);
      throw (e);
    }));

  return activity;
}

/**
 * Mute message notification
 * @param {Object} spark
 * @param {String} convo
 * @returns {Object}
 */
export function muteMessageNotification(spark, convo) {
  let activity;

  browser.call(() => spark.internal.conversation.muteMessages(convo)
    .then((a) => {
      activity = a;

      return activity;
    }).catch((e) => {
      console.error('Unable to mute message notification');
      console.error(e);
      throw (e);
    }));

  return activity;
}

/**
 * Unmute mentions notification
 * @param {Object} spark
 * @param {String} convo
 * @returns {Object}
 */
export function unmuteMentionsNotification(spark, convo) {
  let activity;

  browser.call(() => spark.internal.conversation.unmuteMentions(convo)
    .then((a) => {
      activity = a;

      return activity;
    }).catch((e) => {
      console.error('Unable to unmute mentions notification');
      console.error(e);
      throw (e);
    }));

  return activity;
}

/**
 * Mute mentions notification
 * @param {Object} spark
 * @param {String} convo
 * @returns {Object}
 */
export function muteMentionsNotification(spark, convo) {
  let activity;

  browser.call(() => spark.internal.conversation.muteMentions(convo)
    .then((a) => {
      activity = a;

      return activity;
    }).catch((e) => {
      console.error('Unable to mute mentions notification');
      console.error(e);
      throw (e);
    }));

  return activity;
}

/**
 * Remove mutes
 * @param {Object} spark
 * @param {String} convo
 * @returns {Object}
 */
export function removeAllMuteTags(spark, convo) {
  let activity;

  browser.call(() => spark.internal.conversation.removeAllMuteTags(convo)
    .then((a) => {
      activity = a;

      return activity;
    }).catch((e) => {
      console.error('Unable to remove all mute tags');
      console.error(e);
      throw (e);
    }));

  return activity;
}
