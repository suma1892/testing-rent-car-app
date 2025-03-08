import {Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from 'navigator/navigationService';

class NotificationHandler {
  async onNotification(notification) {
    console.log('notification dari handler = ', notification);
    if (notification?.userInteraction) {
      if (notification?.data?.room_name && notification?.data?.entity_id) {
        navigationRef.navigate('ChatRoom', {
          room: {
            name: notification?.data?.room_name,
            room_type: notification?.data?.room_type,
            id: JSON.parse(notification?.data?.entity_id),
            is_active: true,
          },
          type: notification?.data?.room_type,
        });
      }
      return;
    }

    const title = notification?.data?.room_name || notification?.title;
    const body = notification?.message || notification?.notification?.body;

    console.log('title = ', title);
    console.log('body ', body);

    if (typeof this._onNotification === 'function') {
      PushNotification.localNotification({
        ...notification,
        channelId: 'default-channel-id',
        title: title,
        message: body,
        priority: 'high',
      });
    }
  }

  onRegister(token) {
    try {
      if (typeof this._onRegister === 'function') {
        this._onRegister(token);
      }
    } catch (error) {
      Alert.alert('warning2', JSON.stringify(error));
    }
  }

  onAction(notification) {
    //
    //
    //
    console.log('notification action = ', notification);
    if (notification.action === 'Yes') {
      PushNotification.invokeApp(notification);
    }
  }

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError(err) {
    //
  }

  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}

const handler = new NotificationHandler();

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: handler.onRegister.bind(handler),

  // (required) Called when a remote or local notification is opened or received
  onNotification: handler.onNotification.bind(handler),

  // (optional) Called when Action is pressed (Android)
  onAction: handler.onAction.bind(handler),

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: handler.onRegistrationError.bind(handler),

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

export default handler;
