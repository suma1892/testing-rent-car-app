/* eslint-disable react-hooks/rules-of-hooks */
import Button from 'components/Button';
import OtpInputs from 'react-native-otp-inputs';
import React, {FC, useEffect, useState} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {
  authRegister,
  authRegisterConfirmation,
} from 'redux/features/auth/authAPI';
import {authState} from 'redux/features/auth/authSlice';
import {h1, h5} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {showToast} from 'utils/Toast';
const TIMER = 299;

const inputOtp = ({referralCode}: {referralCode?: string}) => {
  const {t} = useTranslation();
  const [seconds, setSeconds] = useState(TIMER);
  const userData = useAppSelector(appDataState).userData;
  const dispatch = useAppDispatch();
  const token = useAppSelector(authState).token;
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  });

  const methods = {
    resendOtp: () => {
      setSeconds(TIMER);
      dispatch(authRegister(userData));
    },
    secondsToHms: (d: any) => {
      d = Number(d);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);

      const mDisplay = m > 0 ? m : '0';
      const sDisplay = s > 0 ? s : '0';
      return (
        '0' + mDisplay + ':' + (sDisplay > '9' ? sDisplay : '0' + sDisplay)
      );
    },
    handleConfirmationOTp: async () => {
      console.log(token, otp);
      setLoader(true);
      const res = await dispatch(
        authRegisterConfirmation({
          session: token.session,
          token: otp,
        }),
      );
      setLoader(false);

      if (res?.meta?.requestStatus === 'fulfilled') {
        showToast({
          message: t('register.success_register'),
          title: t('global.alert.success'),
          type: 'success',
        });
        navigation.navigate('MainTab');
        if (referralCode) {
          navigation.navigate('ReferralCodeDeeplink', {
            referralCode: referralCode,
          });
        } else {
          // navigation.navigate('ReferralCode', {});
        }
      }
    },
  };

  return (
    <View style={{width: '100%'}}>
      <OtpInputs
        numberOfInputs={6}
        handleChange={code => setOtp(code)}
        // value={otp}
        autofillFromClipboard={false}
        style={styles.otpWrapper}
        inputStyles={styles.textOtp}
        inputContainerStyles={styles.inputContainerStyles}
      />
      {seconds !== 0 && (
        <Text style={[h1, styles.textTime]}>
          ({methods.secondsToHms(seconds)})
        </Text>
      )}
      {seconds === 0 && (
        <Text style={[h5, styles.textResend2]}>
          {t('register.have_not_received_otp')}{' '}
          <Text style={styles.textResend} onPress={methods.resendOtp}>
            {t('register.resend')}
          </Text>
        </Text>
      )}
      <Button
        _theme="navy"
        disabled={otp.length <= 5}
        title={t('contact-us.btn.send')}
        isLoading={loader}
        onPress={methods.handleConfirmationOTp}
        styleWrapper={{
          marginTop: 44,
        }}
      />
    </View>
  );
};

export default inputOtp;

const styles = StyleSheet.create({
  textTime: {
    color: theme.colors.blue,
    textAlign: 'center',
    marginTop: 24,
  },
  textOtp: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    color: theme.colors.black,
    borderWidth: 1,
    fontWeight: '700',
    borderColor: theme.colors.grey5,
    textAlign: 'center',
  },
  otpWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
  },
  inputContainerStyles: {
    width: '15%',
    alignItems: 'center',
    height: 50,
  },
  textResend: {
    color: theme.colors.blue,
    fontWeight: '700',
  },
  textResend2: {textAlign: 'center', marginTop: 24},
});
