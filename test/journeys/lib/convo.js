/**
 * Unmute message notification
 * @param {Object} spark
 * @param {String} convoId
 * @returns {Object}
 */
export function unmuteMessageNotification(spark, convoId) {
  let activity;

  browser.call(() => spark.internal.conversation.unmuteMessages({
    id: convoId
  }).then((a) => {
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
 * @param {String} convoId
 * @returns {Object}
 */
export function muteMessageNotification(spark, convoId) {
  let activity;

  browser.call(() => spark.internal.conversation.muteMessages({
    id: convoId
  }).then((a) => {
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
 * @param {String} convoId
 * @returns {Object}
 */
export function unmuteMentionsNotification(spark, convoId) {
  let activity;

  browser.call(() => spark.internal.conversation.unmuteMentions({
    id: convoId
  }).then((a) => {
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
 * @param {String} convoId
 * @returns {Object}
 */
export function muteMentionsNotification(spark, convoId) {
  let activity;

  browser.call(() => spark.internal.conversation.muteMentions({
    id: convoId
  }).then((a) => {
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
 * @param {String} convoId
 * @returns {Object}
 */
export function removeAllMuteTags(spark, convoId) {
  let activity;

  browser.call(() => spark.internal.conversation.removeAllMuteTags({
    id: convoId
  }).then((a) => {
    activity = a;

    return activity;
  }).catch((e) => {
    console.error('Unable to remove all mute tags');
    console.error(e);
    throw (e);
  }));

  return activity;
}
