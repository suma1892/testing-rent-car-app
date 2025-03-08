/* eslint-disable react-hooks/exhaustive-deps */
import {BackHandler, Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import appBar from 'components/AppBar/AppBar';
import {iconCustomSize, rowCenter, WINDOW_HEIGHT} from 'utils/mixins';
import {ic_arrow_left_white, ic_success} from 'assets/icons';
import {h1, h3} from 'utils/styles';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';

const InfoPaymentSuccessScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

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
    <View
      style={{
        flex: 1,
        margin: 20,
      }}>
      <View
        style={{
          alignItems: 'center',
          marginTop: WINDOW_HEIGHT / 5,
        }}>
        <Image source={ic_success} style={[iconCustomSize(280)]} />
        <Text style={[h3, {fontSize: 20, marginTop: 20}]}>
          {t('myBooking.success_payment')}
        </Text>
      </View>

      <Button
        _theme="navy"
        title={t('myBooking.back_to_order')}
        onPress={() => {
          navigation.navigate('MainTab', {screen: 'Booking'});
        }}
        styleWrapper={{
          position: 'absolute',
          bottom: 10,
        }}
      />
    </View>
  );
};

export default InfoPaymentSuccessScreen;
