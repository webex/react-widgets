/* eslint-disable-reason needed for component tests */
/* eslint-disable no-param-reassign */

import {Notifications} from './container';
import browserUtilities from './browserUtils';

function displayNotification(component, notification) {
  component.props.notifications = [notification];
  component.props.permission = browserUtilities.PERMISSION_GRANTED;
  browserUtilities.isBrowserHidden = jest.fn(() => true);
  browserUtilities.spawnNotification = jest.fn(() => ({
    addEventListener: jest.fn()
  }));

  component.displayNotifications();
}


describe('Notifications component', () => {
  let component;
  let props;
  let notificationSent;
  let setNotificationPermission;
  let setNotificationSupported;
  let onEvent;
  let notification;

  beforeEach(() => {
    notificationSent = jest.fn();
    setNotificationPermission = jest.fn();
    setNotificationSupported = jest.fn();
    onEvent = jest.fn();
    props = {
      isSupported: false,
      notifications: [],
      onEvent,
      permission: null,
      isMuted: false,
      notificationSent,
      setNotificationPermission,
      setNotificationSupported
    };
    notification = {
      username: 'username',
      message: 'message',
      avatar: 'avatar',
      notificationId: 'abc123',
      alertType: 'full'
    };
    component = new Notifications(props);
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });

  it('should set supported true if true', () => {
    browserUtilities.isNotificationSupported = () => true;
    component.componentDidUpdate();
    expect(setNotificationSupported).toBeCalledWith(true);
  });

  it('should not set supported true if false', () => {
    browserUtilities.isNotificationSupported = () => false;
    component.componentDidUpdate();
    expect(setNotificationSupported).not.toBeCalledWith(true);
  });

  it('should request permissions and set result if supported', () => {
    component.requestPermission = jest.fn();
    component.props.isSupported = true;
    component.componentDidUpdate();
    expect(component.requestPermission).toBeCalled();
  });

  it('should request permissions and set result', () => {
    browserUtilities.requestPermissionForNotifications = jest.fn(() => browserUtilities.PERMISSION_GRANTED);
    component.requestPermission(() => {
      expect(setNotificationPermission).toBeCalledWith(browserUtilities.PERMISSION_GRANTED);
    });
  });

  it('should mark notification as sent after displaying', () => {
    component.props.notifications = [notification];
    component.permission = browserUtilities.PERMISSION_GRANTED;
    component.displayNotifications();
    expect(notificationSent).toBeCalled();
  });

  it('should display the notification if the browser is hidden', () => {
    displayNotification(component, notification);
    expect(browserUtilities.spawnNotification).toBeCalled();
  });

  it('should not display the notification if isMuted is true', () => {
    component.props.isMuted = true;
    displayNotification(component, notification);
    expect(browserUtilities.spawnNotification).not.toBeCalled();
  });

  it('should not display the notification if alertType is none', () => {
    notification.alertType = 'none';
    displayNotification(component, notification);
    expect(browserUtilities.spawnNotification).not.toBeCalled();
  });

  it('should trigger onEvent when notification is created', () => {
    displayNotification(component, notification);
    expect(onEvent).toBeCalled();
  });
});
