import Button from 'components/Button';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import React, {FC, useEffect, useState} from 'react';
import {FONT_SIZE_12, FONT_SIZE_20} from 'utils/typography';
import {forgotPasswordRequest} from 'redux/features/forgotPassword/forgotPasswordAPI';
import {forgotPasswordState} from 'redux/features/forgotPassword/forgotPasswordSlice';
import {h1, h3} from 'utils/styles';
import {IParamForgotPasswordRequest} from 'types/forgot-password.types';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

interface IErrorMessage {
  error_email: string;
}

const ForgotPasswordScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const forgotPassword = useAppSelector(forgotPasswordState);

  const [form, setForm] = useState<IParamForgotPasswordRequest>({
    email: '',
  });
  const [formError, setFormError] = useState<IErrorMessage>({
    error_email: '',
  });

  const methods = {
    handleSendEmail: async () => {
      const _errorMessage: any = {};
      dispatch(forgotPasswordRequest(form));
    },
  };

  useEffect(() => {
    if (forgotPassword.status === 'loading_request') {
      dispatch(toggleLoader(true));
    }

    if (forgotPassword.status === 'failed_request') {
      dispatch(toggleLoader(false));
    }

    if (forgotPassword.status === 'success_request') {
      dispatch(toggleLoader(false));
      navigation.navigate('ForgotPasswordOtpInput');
    }
  }, [forgotPassword.status]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <Text style={[h1, styles.textHeader]}>
        {t('forgot_password.forgot_password')}
      </Text>
      <Text style={[h3, styles.textDesc]}>
        {t('forgot_password.enter_email_to_reset_password')}
      </Text>
      <View style={styles.inputWrapper}>
        <CustomTextInput
          placeholder={t('forgot_password.enter_email')}
          title={t('settings.email') as string}
          onChangeText={v => {
            setForm({...form, email: v});
            setFormError({...formError, [`error_email`]: ''});
          }}
          value={form.email}
          errorMessage={formError.error_email}
          keyboardType="default"
          autoCapitalize="none"
          isImportant
        />

        <View style={{marginTop: 18}} />
      </View>
      <Button
        _theme="navy"
        title={t('global.button.send_email')}
        styleWrapper={{marginTop: 40}}
        onPress={methods.handleSendEmail}
        isLoading={forgotPassword.status === 'loading_request'}
        disabled={!form.email}
      />
    </ScrollView>
  );
};

export default hoc(ForgotPasswordScreen);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  textHeader: {
    fontSize: FONT_SIZE_20,
    color: theme.colors.navy,
  },
  textDesc: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.black,
    marginTop: 12,
  },
  inputWrapper: {
    marginTop: 26,
  },
  textFPass: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.blue,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  textOpsiLogin: {
    alignSelf: 'center',
    marginTop: 37,
  },
  iconWrapper: {
    alignSelf: 'center',
    marginTop: 20,
    width: '30%',
    justifyContent: 'space-between',
  },
  textRegister: {
    fontSize: FONT_SIZE_12,
    alignSelf: 'center',
    marginTop: 20,
  },
  textRegister2: {
    color: theme.colors.blue,
  },
});
