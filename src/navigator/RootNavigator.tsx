import BsheetMain from 'components/BSheet/BsheetMain';
import Config from 'react-native-config';
import deviceInfoModule from 'react-native-device-info';
import GlobalLoader from 'components/GlobalLoader/GlobalLoader';
import MainStackNavigator from './MainStackNavigator';
import messaging from '@react-native-firebase/messaging';
import NotifService from '../../NotifService';
import PushNotification from 'react-native-push-notification';
import React, {useEffect} from 'react';
import Toast from 'components/Toast/Toast';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {createPlayer} from 'redux/effects';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigationService';
import {Platform, SafeAreaView} from 'react-native';
import {useAppSelector} from 'redux/hooks';
import {utilsState} from '../redux/features/utils/utilsSlice';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
  RESULTS,
} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

if (__DEV__) {
  const originalConsoleLog = console.log;

  console.log = function (message, ...optionalParams) {
    const isIgnored =
      message?.includes?.('received') ||
      message?.includes?.('moved to') ||
      message?.includes?.('sending');

    if (typeof message === 'string' && isIgnored) {
      return; // Abaikan log
    }

    originalConsoleLog(message, ...optionalParams);
  };
} else {
  console.log = () => {};
}

const inAppUpdates = new SpInAppUpdates(
  true, // isDebug
);

const Router: React.FC = () => {
  const loader = useAppSelector(utilsState).isShowLoader;
  const toastState = useAppSelector(utilsState);
  const bsheetState = useAppSelector(utilsState).isShowBSHeet;

  const linking: any = {
    prefixes: [`${Config.APP_URL}`, 'getandride://'],
    config: {
      screens: {
        ReferralCodeDeeplink: 'referral/:referralCode',
        MainTab: {
          screens: {
            Booking: 'order-list',
          },
        },
        Auth: 'home',
      },
    },
  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('FCM token is not available.');
        return null;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  };

  const requestPermissions = async () => {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await checkMultiple([
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]);
    return result;
  };

  const permission = async () => {
    const checkPermission = await checkNotificationPermission();

    if (Platform.OS === 'android') {
      if (
        checkPermission['android.permission.POST_NOTIFICATIONS'] !==
          RESULTS.GRANTED ||
        checkPermission['android.permission.ACCESS_COARSE_LOCATION'] !==
          RESULTS.GRANTED ||
        checkPermission['android.permission.ACCESS_FINE_LOCATION'] !==
          RESULTS.GRANTED
      ) {
        await requestPermissions();
      }
    } else {
      if (
        checkPermission['ios.permission.LOCATION_ALWAYS'] !== RESULTS.GRANTED ||
        checkPermission['ios.permission.LOCATION_WHEN_IN_USE'] !==
          RESULTS.GRANTED
      ) {
        await requestPermissions();
      }
    }
  };

  const handleNotifService = async () => {
    const fcmToken = await getFcmToken();

    console.log('fcmToken = ', fcmToken);
    const onRegister = async () => {
      await createPlayer({
        token: fcmToken,
      });
    };

    const onNotif = (notif: {userInteraction: boolean}) => {
      if (notif.userInteraction === false) {
        PushNotification.localNotification({
          ...notif,
          largeIcon: '',
          smallIcon: 'ic_launcher',
          message: '',
        });
      }
    };

    const notif = new NotifService(onRegister, onNotif);
    notif.resetBadgeCount();
    try {
      notif.createDefaultChannels();
    } catch (error) {
      console.log('err = ', error);
    }
  };

  useEffect(() => {
    checkVersion();
    handleNotifService();
    permission();
    console.log('App ID (Bundle Identifier):', DeviceInfo.getBundleId());

    return () => {};
  }, []);

  const checkVersion = async () => {
    const curVersion = await deviceInfoModule.getVersion();
    console.log('curr = ', curVersion);
    inAppUpdates.checkNeedsUpdate({curVersion: curVersion}).then(result => {
      if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === 'android') {
          updateOptions = {
            updateType: IAUUpdateKind.IMMEDIATE,
          };
        }
        inAppUpdates.startUpdate(updateOptions);
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <BottomSheetModalProvider>
          <MainStackNavigator />
        </BottomSheetModalProvider>
        <BottomSheetModalProvider>
          {bsheetState && <BsheetMain />}
        </BottomSheetModalProvider>
      </NavigationContainer>
      {<GlobalLoader isShow={loader} />}
      <Toast
        message={toastState.messageToast}
        title={toastState.titleToast}
        type={toastState.typeToast}
        show={toastState.isShowToast}
      />
    </SafeAreaView>
  );
};

export default Router;
