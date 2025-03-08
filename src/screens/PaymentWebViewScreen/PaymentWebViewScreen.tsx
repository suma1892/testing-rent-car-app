/* eslint-disable react-hooks/exhaustive-deps */
import {BackHandler, Image, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import appBar from 'components/AppBar/AppBar';
import {rowCenter} from 'utils/mixins';
import {ic_arrow_left_white} from 'assets/icons';
import {h1} from 'utils/styles';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';

const PaymentWebViewScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const redirect_url = route?.params?.redirect_url;
  // route?.params?.order?.payload?.data?.disbursement?.redirect_url;

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() =>
              navigation.navigate('MainTab', {
                screen: 'Booking',
              } as any)
            }>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('global.button.back')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTab', {
        screen: 'Booking',
      } as any);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <WebView
      source={{uri: redirect_url}}
      onNavigationStateChange={navState => {
        if (navState.url.includes('success')) {
          // navigation.navigate('MainTab', {screen: 'Booking'} as any);
          navigation.navigate('InfoPaymentSuccessScreen');
          showToast({
            message: t('myBooking.message_success_payment'),
            title: t('global.alert.success'),
            type: 'success',
          });
        } else if (navState.url.includes('fail')) {
          navigation.navigate('MainTab', {screen: 'Booking'} as any);
          showToast({
            message: t('myBooking.message_failed_payment'),
            title: t('global.alert.failed'),
            type: 'error',
          });
        }
      }}
    />
  );
};

export default PaymentWebViewScreen;
