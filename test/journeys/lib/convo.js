/**
 * Unmute message notification
 * @param {Object} spark
 * @param {String} convo
 */
export function unmuteMessageNotification(spark, convo) {
  browser.call(() => spark.internal.conversation.unmuteMessages(convo)
    .catch((e) => {
      console.error('Unable to unmute message notification');
      console.error(e);
      throw (e);
    }));
}

/**
 * Mute message notification
 * @param {Object} spark
 * @param {String} convo
 */
export function muteMessageNotification(spark, convo) {
  browser.call(() => spark.internal.conversation.muteMessages(convo)
    .catch((e) => {
      console.error('Unable to mute message notification');
      console.error(e);
      throw (e);
    }));
}

/**
 * Unmute mentions notification
 * @param {Object} spark
 * @param {String} convo
 */
export function unmuteMentionsNotification(spark, convo) {
  browser.call(() => spark.internal.conversation.unmuteMentions(convo)
    .catch((e) => {
      console.error('Unable to unmute mentions notification');
      console.error(e);
      throw (e);
    }));
}

/**
 * Mute mentions notification
 * @param {Object} spark
 * @param {String} convo
 */
export function muteMentionsNotification(spark, convo) {
  browser.call(() => spark.internal.conversation.muteMentions(convo)
    .catch((e) => {
      console.error('Unable to mute mentions notification');
      console.error(e);
      throw (e);
    }));
}

/**
 * Remove mutes
 * @param {Object} spark
 * @param {String} convo
 */
export function removeAllMuteTags(spark, convo) {
  browser.call(() => spark.internal.conversation.removeAllMuteTags(convo)
    .catch((e) => {
      console.error('Unable to remove all mute tags');
      console.error(e);
      throw (e);
    }));
}
