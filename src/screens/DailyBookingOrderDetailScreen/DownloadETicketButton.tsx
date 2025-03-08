import DeviceInfo from 'react-native-device-info';
import React from 'react';
import {AirportTransferBookingOrderDetailScreenRouteProp} from 'screens/AirportTransferBookingOrderDetailSgScreen/AirportTransferBookingOrderDetailSgScreen';
import {DailyBookingOrderDetailScreenRouteProp} from './DailyBookingOrderDetailScreen';
import {downloadEticket} from 'redux/features/appData/appDataAPI';
import {h5} from 'utils/styles';
import {ic_download} from 'assets/icons';
import {rowCenter} from 'utils/mixins';
import {
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';

type DownloadETicketProps = {
  route:
    | DailyBookingOrderDetailScreenRouteProp
    | AirportTransferBookingOrderDetailScreenRouteProp;
  show: boolean;
};

const DownloadETicketButton = ({route, show}: DownloadETicketProps) => {
  const {t} = useTranslation();
  const fRequestAndroidPermission = async () => {
    // Refer to https://reactnative.dev/docs/permissionsandroid for further details on permsissions
    try {
      const apiLevel = await DeviceInfo.getApiLevel();

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Get and Ride Permission Request',
          message:
            'App1 needs access to your storage so you can save files to your device.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED || apiLevel > 29) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const handleDownloadETicket = async () => {
    if (Platform.OS === 'android') {
      const permissionGranted = await fRequestAndroidPermission();
      if (!permissionGranted) {
        return;
      }
    }

    await downloadEticket(route.params.transaction_key);
  };

  if (show) {
    return (
      <TouchableOpacity style={rowCenter} onPress={handleDownloadETicket}>
        <Image
          source={ic_download}
          style={{
            height: 20,
            width: 20,
            marginRight: 2,
          }}
        />
        <Text style={[h5, {color: 'white', marginRight: 16}]}>
          {t('myBooking.download-e-ticket')}
        </Text>
      </TouchableOpacity>
    );
  }

  return null;
};

export default DownloadETicketButton;
