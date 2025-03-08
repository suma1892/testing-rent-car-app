import Button from 'components/Button';
import OtpInputs from 'react-native-otp-inputs';
import React, {useState} from 'react';
import {forgotPasswordState} from 'redux/features/forgotPassword/forgotPasswordSlice';
import {resetPasswordOtpConfirmation} from 'redux/effects';
import {showToast} from 'utils/Toast';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const ForgotPasswordOtpInputScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const forgotPassword = useAppSelector(forgotPasswordState);

  const [otp, setOtp] = useState('');

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
      }}>
      <View
        style={{
          width: '100%',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
          }}>
          {t('Account.confirmation')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
          }}>
          {t('Account.confirm_desc')}
        </Text>
      </View>
      <OtpInputs
        numberOfInputs={6}
        handleChange={code => setOtp(code)}
        autofillFromClipboard={false}
        style={styles.otpWrapper}
        inputStyles={styles.textOtp}
        inputContainerStyles={styles.inputContainerStyles}
      />

      <Button
        title={t('contact-us.btn.send')}
        onPress={async () => {
          try {
            const res = await resetPasswordOtpConfirmation({
              session: forgotPassword.data?.session || '',
              token: otp,
            });
            if (res) {
              navigation.navigate('ResetPassword', {
                session: forgotPassword.data?.session || '',
                token: otp,
              });
            }
          } catch (error) {
            console.warn(error);
          }
        }}
        _theme="navy"
        styleWrapper={{
          marginTop: 30,
        }}
      />
    </View>
  );
};

export default ForgotPasswordOtpInputScreen;

const styles = StyleSheet.create({
  textOtp: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    fontWeight: '700',
    color: theme.colors.black,
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
});
