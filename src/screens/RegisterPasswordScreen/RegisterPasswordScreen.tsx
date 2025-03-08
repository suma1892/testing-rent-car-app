import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import React, {FC, useEffect, useState} from 'react';
import {authState} from 'redux/features/auth/authSlice';
import {FONT_SIZE_12, FONT_SIZE_20} from 'utils/typography';
import {h1, h3} from 'utils/styles';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  appDataState,
  saveFormRegister,
} from 'redux/features/appData/appDataSlice';
import {RootStackParamList} from 'types/navigator';

interface IErrorMessage {
  error_password: string;
  error_password_confirmation: string;
}

interface IPasswordForm {
  password: string;
  password_confirmation: string;
}
type registerScreenRouteProp = RouteProp<
  RootStackParamList,
  'RegisterPassword'
>;

const RegisterPasswordScreen: FC = () => {
  const route = useRoute<registerScreenRouteProp>();

  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(appDataState).userData;
  const errorRegister = useAppSelector(authState).errors;

  const [form, setForm] = useState<IPasswordForm>({
    password: '',
    password_confirmation: '',
  });
  const [formError, setFormError] = useState<IErrorMessage>({
    error_password: '',
    error_password_confirmation: '',
  });

  useEffect(() => {
    navigation.setOptions(
      appBar({
        // title: 'Home'
      }),
    );
  }, [navigation]);

  useEffect(() => {
    const _errorMessage: any = {};
    errorRegister?.detail?.map((x: {field: string; message: string}) => {
      _errorMessage[`error_${x.field}`] = x?.message;
    });
    setFormError(_errorMessage);
  }, [errorRegister]);

  const validatePassword = (str: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(str);
  };

  const methods = {
    handleRegister: async () => {
      try {
        const _errorMessage: any = {};
        let status = true;
        Object.keys(form).map((x, i) => {
          if (!form[x as keyof IPasswordForm]) {
            status = false;
            _errorMessage[`error_${x}`] = `${x} ${t(
              'contact-us.error.required',
            )}`;
          }
        });
        setFormError(_errorMessage);
        if (form.password !== form.password_confirmation) {
          setFormError({
            ...formError,
            error_password_confirmation: t(
              'register.error_confirmation_password',
            ),
          });
          return;
        }
        if (!validatePassword(form?.password)) {
          setFormError({
            ...formError,
            error_password: t('register.error_validate_password'),
          });
          return;
        }
        if (!validatePassword(form?.password_confirmation)) {
          setFormError({
            ...formError,
            error_password_confirmation: t('register.error_validate_password'),
          });
          return;
        }
        if (status) {
          dispatch(saveFormRegister({...userData, ...form}));
          navigation.navigate('RegisterVerification', {
            page: 'selectMethod',
            referralCode: route?.params?.referralCode,
          });
        }
      } catch (error) {}
    },
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <Text style={[h1, styles.textHeader]}>
        {t('register.create_password')}
      </Text>
      <Text style={[h3, styles.textDesc]}>{t('register.create_account')}</Text>
      <View style={styles.inputWrapper}>
        <CustomTextInput
          placeholder={t('auth.enter_your_password')}
          title={t('Account.password') as any}
          secureTextEntry
          onChangeText={v => {
            setForm({...form, password: v});
            setFormError({...formError, [`error_password`]: ''});
          }}
          value={form.password}
          errorMessage={formError.error_password}
          isImportant
        />

        <View style={{marginTop: 18}} />

        <CustomTextInput
          placeholder={t('auth.confirm_your_password')}
          title={`${t('auth.password_confirmation')}`}
          secureTextEntry
          onChangeText={v => {
            setForm({...form, password_confirmation: v});
            setFormError({...formError, [`error_password_confirmation`]: ''});
          }}
          value={form.password_confirmation}
          errorMessage={formError.error_password_confirmation}
          isImportant
        />
      </View>
      <Button
        _theme="navy"
        title={t('global.button.next')}
        styleWrapper={{marginTop: 40}}
        onPress={methods.handleRegister}
      />
    </ScrollView>
  );
};

export default hoc(RegisterPasswordScreen);

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
    color: theme.colors.grey5,
    marginTop: 12,
  },
  inputWrapper: {
    marginTop: 26,
  },
  title: {
    fontSize: FONT_SIZE_12,
    marginTop: 20,
  },
});
