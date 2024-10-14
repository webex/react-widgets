export const ADD_NOTIFICATION = 'notifications/ADD_NOTIFICATION';
export const DELETE_NOTIFICATION = 'notifications/DELETE_NOTIFICATION';
export const UPDATE_NOTIFICATION_SETTING = 'notifications/UPDATE_NOTIFICATION_SETTING';


function addNotification(notification) {
  return {
    type: ADD_NOTIFICATION,
    payload: {
      notification
    }
  };
}

function deleteNotification(notificationId) {
  return {
    type: DELETE_NOTIFICATION,
    payload: {
      notificationId
    }
  };
}

function updateNotificationSetting(setting) {
  return {
    type: UPDATE_NOTIFICATION_SETTING,
    payload: {
      setting
    }
  };
}

/**
 * Creates a new notification for processing
 *
 * @param {string} notificationId
 * @param {object} details
 * @param {string} details.message
 * @param {string} details.avatar
 * @param {string} details.username
 * @returns {function}
 */
export function createNotification(notificationId, details) {
  return (dispatch) => dispatch(addNotification({notificationId, details}));
}

/**
 * Updates an existing notification to indicate that it was sent
 *
 * @param {string} notificationId
 * @returns {function}
 */
export function notificationSent(notificationId) {
  return (dispatch) => dispatch(deleteNotification(notificationId));
}

/**
 * Changes the permission type after we've request notification
 * permissions from the user
 *
 * @param {String} permission
 * @returns {function}
 */
export function setNotificationPermission(permission) {
  return (dispatch) => dispatch(updateNotificationSetting({permission}));
}

/**
 * Changes the setting for if native notifications are supported
 * by the user's device/browser
 *
 * @export
 * @param {bool} isSupported
 * @returns {function}
 */
export function setNotificationSupported(isSupported) {
  return (dispatch) => dispatch(updateNotificationSetting({isSupported}));
}
