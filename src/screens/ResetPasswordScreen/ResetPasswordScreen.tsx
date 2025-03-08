import Button from 'components/Button';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import React, {FC, useEffect, useState} from 'react';
import {FONT_SIZE_12, FONT_SIZE_20} from 'utils/typography';
import {forgotPasswordReset} from 'redux/features/forgotPassword/forgotPasswordAPI';
import {forgotPasswordState} from 'redux/features/forgotPassword/forgotPasswordSlice';
import {h1, h3} from 'utils/styles';
import {IParamsResetPassword} from 'types/forgot-password.types';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

interface IErrorMessage {
  error_password: string;
  error_password_confirmation: string;
}

type ResetPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  'ResetPassword'
>;

const ResetPasswordScreen: FC = () => {
  const {t} = useTranslation();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const forgotPassword = useAppSelector(forgotPasswordState);

  const [form, setForm] = useState<IParamsResetPassword>({
    password: '',
    password_confirmation: '',
  });
  const [formError, setFormError] = useState<IErrorMessage>({
    error_password: '',
    error_password_confirmation: '',
  });

  useEffect(() => {
    if (forgotPassword.status === 'success_reset') {
      showToast({
        message: t('global.alert.success_change_password_login_again'),
        title: t('global.alert.success'),
        type: 'success',
      });
      navigation.navigate('Login');
    }
  }, [forgotPassword, navigation, t]);

  const handleConfirmPassword = async () => {
    const errorMessage: IErrorMessage = {
      error_password: '',
      error_password_confirmation: '',
    };
    let status = true;

    Object.keys(form).forEach(key => {
      if (!form[key as keyof IParamsResetPassword]) {
        status = false;
        errorMessage[`error_${key}` as keyof IErrorMessage] = t(
          `reset_password.error_${key}`,
        );
      }
    });

    setFormError(errorMessage);

    if (status) {
      dispatch(toggleLoader(true));

      try {
        dispatch(
          forgotPasswordReset({...form, session: route?.params?.session}),
        );
      } catch (error) {
        showToast({
          message: t('global.alert.error_occurred'),
          title: t('global.alert.warning'),
          type: 'error',
        });
      } finally {
        dispatch(toggleLoader(false));
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <Text style={[h1, styles.textHeader]}>
        {t('reset_password.reset_password')}
      </Text>
      <Text style={[h3, styles.textDesc]}>
        {t('reset_password.reset_your_password')}
      </Text>
      <View style={styles.inputWrapper}>
        <CustomTextInput
          placeholder={t('reset_password.enter_your_password')}
          title={`${t('Account.password')}`}
          isImportant
          secureTextEntry
          onChangeText={value => {
            setForm(prevForm => ({...prevForm, password: value}));
            setFormError(prevError => ({...prevError, error_password: ''}));
          }}
          value={form.password}
          errorMessage={formError.error_password}
        />
        <View style={{marginTop: 18}} />
        <CustomTextInput
          placeholder={t('auth.confirm_your_password')}
          title={`${t('auth.password_confirmation')}`}
          isImportant
          secureTextEntry
          onChangeText={value => {
            setForm(prevForm => ({...prevForm, password_confirmation: value}));
            setFormError(prevError => ({
              ...prevError,
              error_password_confirmation: '',
            }));
          }}
          value={form.password_confirmation}
          errorMessage={formError.error_password_confirmation}
        />
        <View style={{marginTop: 18}} />
      </View>
      <Button
        _theme="navy"
        title={t('global.button.save')}
        styleWrapper={{marginTop: 40}}
        onPress={handleConfirmPassword}
      />
    </ScrollView>
  );
};

export default hoc(ResetPasswordScreen);

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
});
