import Geolocation from 'react-native-geolocation-service';
import {Alert, Linking} from 'react-native';
import {checkAllPermissions} from './permissions';
import {request} from 'react-native-permissions';
import {showToast} from './Toast';

const getLocationAsync = async (param: {need_permission?: boolean}) => {
  if (param?.need_permission) {
    const permissions = await checkAllPermissions();
    console.log('permission = ', permissions);
    if (!permissions) {
      showToast({
        message:
          'Get&Ride memerlukan izin untuk camera, lokasi, dan audio, untuk keperluan absensi, pelaporan, dan inisialisasi wajah',
        title: 'Warning',
        type: 'warning',
        // show: true
      });
      return;
    }
  }
  await request('android.permission.ACCESS_COARSE_LOCATION');

  return new Promise(async (resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('geloc = ', position);
        resolve(position.coords);
      },
      error => {
        reject(error);
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );
  });
};

const checkMockedLocation = async () => {
  const permissions = await checkAllPermissions();
  if (!permissions) {
    showToast({
      message:
        'Get&Ride memerlukan izin untuk camera, lokasi, dan audio, untuk keperluan absensi, pelaporan, dan inisialisasi wajah',
      title: 'Warning',
      type: 'warning',
      // show: true
    });
    return;
    Alert.alert(
      'warning',
      'Get&Ride memerlukan izin untuk camera, lokasi, dan audio, untuk keperluan absensi dengan titik lokasi akurat, pelaporan dengan menyertakan file gambar, dan inisialisasi wajah',
      [
        {
          text: 'batal',
          onPress: () => {},
        },
        {
          text: 'Buka Pengaturan',
          onPress: () => Linking.openURL('app-settings:'),
        },
      ],
    );
    return;
  }

  await request('android.permission.ACCESS_COARSE_LOCATION');

  return new Promise(async (resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position.mocked);
      },
      error => {
        reject(false);
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

export {getLocationAsync, checkMockedLocation};
