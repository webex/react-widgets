import {createSelector} from 'reselect';

const getNotifications = (state) => state.notifications.get('items');
const getNotificationSettings = (state) => state.notifications.get('settings');

const getUnsentNotifications = createSelector(
  [getNotifications],
  (notifications) =>
    notifications
      .toArray()
      .map((notification) => {
        const {
          username, message, avatar, alertType
        } = notification.details;

        return Object.assign({}, notification, {
          username,
          message,
          avatar,
          alertType
        });
      })
);

const getNotificationDetails = createSelector(
  [getNotificationSettings, getUnsentNotifications],
  (notificationSettings, unsentNotifications) => ({
    isSupported: notificationSettings.get('isSupported'),
    notifications: unsentNotifications,
    permission: notificationSettings.get('permission')
  })
);

export default getNotificationDetails;
