import Permissions, {
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions';

import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, RESULTS} from 'react-native-permissions';

const checkCameraPermission = async () => {
  const status: PermissionStatus = await Permissions.request(
    Platform.OS === 'ios'
      ? 'ios.permission.CAMERA'
      : 'android.permission.CAMERA',
  );
  console.log('cam perms = ', status);
  return status === 'granted';
};

const checkLocationPermission = async () => {
  const status: PermissionStatus = await Permissions.request(
    Platform.OS === 'ios'
      ? 'ios.permission.LOCATION_WHEN_IN_USE'
      : 'android.permission.ACCESS_FINE_LOCATION',
  );
  console.log('loc perms = ', status);
  return status === 'granted';
};

const checkMicrophonePermission = async () => {
  const status: PermissionStatus = await Permissions.request(
    Platform.OS === 'ios'
      ? 'ios.permission.MICROPHONE'
      : 'android.permission.RECORD_AUDIO',
  );
  console.log('audio perms = ', status);
  return status === 'granted';
};

const checkInternalPermission = async () => {
  const status: PermissionStatus = await Permissions.request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MEDIA_LIBRARY
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  );
  console.log('status', status);
  return status === 'granted';
};

const checkAllPermissions = async () => {
  try {
    // const cameraPermissionGranted = await checkCameraPermission();
    const locationPermissionGranted = await checkLocationPermission();
    // const microphonePermissionGranted = await checkMicrophonePermission();
    // const internalPermissionGranted = await checkInternalPermission();

    if (
      //   cameraPermissionGranted &&
      locationPermissionGranted
      //   microphonePermissionGranted
      // && internalPermissionGranted
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('err perm = ', error);
  }
};

const isGPSActive = async () => {
  try {
    if (Platform.OS === 'android') {
      // const hasPermission = await PermissionsAndroid.check(
      //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // );

      // if (!hasPermission) {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //   );
      //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      //     return false;
      //   }
      // }

      return new Promise(resolve => {
        Geolocation.getCurrentPosition(
          () => resolve(true), // GPS is active
          error => {
            if (error.code === 2) {
              resolve(false); // GPS is disabled
            } else {
              resolve(false);
            }
          },
          {enableHighAccuracy: true},
        );
      });
    } else {
      const permission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (permission !== RESULTS.GRANTED) {
        return false;
      }

      return new Promise(resolve => {
        Geolocation.getCurrentPosition(
          () => resolve(true), // GPS is active
          error => {
            if (error.code === 2) {
              resolve(false); // GPS is disabled
            } else {
              resolve(false);
            }
          },
          {enableHighAccuracy: true},
        );
      });
    }
  } catch (error) {
    console.error('Error checking GPS status:', error);
    return false;
  }
};

export {
  checkAllPermissions,
  checkCameraPermission,
  checkLocationPermission,
  checkMicrophonePermission,
  isGPSActive,
};
