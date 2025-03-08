import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import OtpInputs from 'react-native-otp-inputs';
import React, {useEffect, useState} from 'react';
import {confirmOTPAccountDeletion} from 'redux/effects';
import {deleteAccountState} from 'redux/features/deleteAccount/deleteAccountSlice';
import {h1, h5} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {logout} from 'redux/features/auth/authSlice';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const TIMER = 299;

const DeleteAccountOtpScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {otp: deleteAccountOtp} = useAppSelector(deleteAccountState);
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(TIMER);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }
  }, [seconds]);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image source={ic_arrow_left_white} style={styles.icon} />
            <Text style={[h1, styles.backText]}>{t('global.button.back')}</Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  const resendOtp = () => setSeconds(TIMER);

  const secondsToHms = (d: number) => {
    const m = Math.floor(d / 60)
      .toString()
      .padStart(2, '0');
    const s = (d % 60).toString().padStart(2, '0');
    return `0${m}:${s}`;
  };

  const handleOtpSubmit = async () => {
    try {
      const session = deleteAccountOtp?.session || '';
      const res = await confirmOTPAccountDeletion({session, token: otp});

      if (res) {
        dispatch(logout());
        navigation.navigate('SuccessDeleteAccount');
      } else {
        showToast({
          message: t('Account.invalid_otp'),
          title: t('global.alert.warning'),
          type: 'error',
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('delete_account.verification')}</Text>
        <Text style={[h5, styles.subtitle]}>
          {t('delete_account.verification_desc')}
        </Text>
      </View>
      <OtpInputs
        numberOfInputs={6}
        handleChange={setOtp}
        autofillFromClipboard={false}
        style={styles.otpWrapper}
        inputStyles={styles.textOtp}
        inputContainerStyles={styles.inputContainer}
      />
      <Text style={[h1, styles.textTime]}>{secondsToHms(seconds)}</Text>
      {seconds === 0 && (
        <Text style={[h5, styles.textResend2]}>
          {t('register.have_not_received_otp')}{' '}
          <Text style={styles.textResend} onPress={resendOtp}>
            {t('register.resend')}
          </Text>
        </Text>
      )}
      <Button
        title={t('contact-us.btn.send')}
        onPress={handleOtpSubmit}
        _theme="navy"
        styleWrapper={styles.buttonWrapper}
      />
    </View>
  );
};

export default DeleteAccountOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  textContainer: {width: '100%', alignItems: 'center'},
  title: {fontSize: 20, fontWeight: '700'},
  subtitle: {fontSize: 14, textAlign: 'center'},
  otpWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
  },
  textOtp: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    fontWeight: '700',
    borderColor: theme.colors.grey5,
    color: theme.colors.black,
    textAlign: 'center',
  },
  inputContainer: {width: '15%', alignItems: 'center', height: 50},
  buttonWrapper: {marginTop: 30},
  textTime: {color: theme.colors.blue, textAlign: 'center', marginTop: 24},
  textResend: {color: theme.colors.blue, fontWeight: '700'},
  textResend2: {textAlign: 'center', marginTop: 24},
  icon: {height: 20, width: 20, marginLeft: 16},
  backText: {color: 'white', marginLeft: 10},
});
