import Button from 'components/Button';
import React, {FC} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {authRegister} from 'redux/features/auth/authAPI';
import {FONT_SIZE_20} from 'utils/typography';
import {h1, h3} from 'utils/styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const sentOtp = ({referralCode}: {referralCode?: string}) => {
  const {t} = useTranslation();
  const userData = useAppSelector(appDataState).userData;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const methods = {
    handleSentOtp: async () => {
      const res = await dispatch(authRegister(userData));
      if (res.type.includes('rejected')) {
        // console.log(JSON.stringify(res));
        if (
          res.payload?.detail?.find(
            (x: any) =>
              x.field === 'password' || x.field === 'password_confirmation',
          )
        ) {
          navigation.navigate('RegisterPassword');
          return;
        }
        navigation.navigate('Register');
        return;
      }

      navigation.push('RegisterVerification', {
        page: 'inputOtp',
        referralCode: referralCode,
      });
    },
  };

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
      }}>
      <Text style={[h3, {marginTop: 24}]}>
        {t('register.send_otp_code_to')}{' '}
        {userData?.registration_type === 'email'
          ? t('settings.email')
          : 'Nomor'}{' '}
        :
      </Text>
      <Text style={[h1, styles.textPhone]}>
        {userData?.registration_type === 'email'
          ? userData.email
          : userData.registration_type === 'phone'
          ? userData.phone
          : userData.wa}
      </Text>
      <Button
        _theme="navy"
        title={t('global.button.send_otp')}
        onPress={methods.handleSentOtp}
      />
    </View>
  );
};

export default sentOtp;

const styles = StyleSheet.create({
  textPhone: {
    fontSize: FONT_SIZE_20,
    marginTop: 20,
    marginBottom: 64,
  },
});
