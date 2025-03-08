import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import React, {FC, useEffect, useState} from 'react';
import {authLogin} from 'redux/features/auth/authAPI';
import {authState} from 'redux/features/auth/authSlice';
import {FONT_SIZE_12, FONT_SIZE_20} from 'utils/typography';
import {h1, h2, h3} from 'utils/styles';
import {IParamLogin} from 'types/auth.types';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import messaging from '@react-native-firebase/messaging';

import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createPlayer} from 'redux/effects';
interface IErrorMessage {
  error_email: string;
  error_password: string;
}

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<LoginScreenRouteProp>();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAppSelector(authState);

  const [form, setForm] = useState<IParamLogin>({
    // email: __DEV__ ? 'sumaalbaroh1892@gmail.com' : '', // sumaalbaroh1892@gmail.com
    // password: __DEV__ ? 'password.1' : '', // password.1
    email: __DEV__ ? 'trisnaavr@gmail.com' : '',
    password: __DEV__ ? 'testing123' : '',
    // email: __DEV__ ? 'ferry.novian02@gmail.com' : '',
    // password: __DEV__ ? 'password1' : '',
    // email: 'jstreblo@bizimalem-support.de',
    // password: '12345678',
  });
  const [formError, setFormError] = useState<IErrorMessage>({
    error_email: '',
    error_password: '',
  });

  useEffect(() => {
    navigation.setOptions(
      appBar({
        // title: 'Home'
      }),
    );
  }, [navigation]);

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        return token;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  };

  const methods = {
    handleLogin: async () => {
      try {
        Keyboard.dismiss();

        const _errorMessage: any = {};
        let status = true;
        // Object.keys(form).map((x, _) => {
        //   if (!form[x as keyof IParamLogin]) {
        //     status = false;
        //     console.log('pas ', x.charAt(0).toUpperCase() + x.slice(1));
        //     _errorMessage[`error_${x}`] = t('auth.error', {
        //       value: x.charAt(0).toUpperCase() + x.slice(1),
        //     });
        //   }
        // });
        if (!form?.password) {
          _errorMessage['error_password'] = t('auth.error', {
            value: t('Account.password'),
          });
        }
        if (!form?.email) {
          _errorMessage['error_email'] = t('auth.error', {
            value: t('settings.email'),
          });
        }
        setFormError(_errorMessage);
        if (status) {
          // dispatch(toggleLoader(true));
          setIsLoading(true);

          // setTimeout(async () => {
          await dispatch(authLogin(form));
          setIsLoading(false);
          // dispatch(toggleLoader(false));
          const fcmToken = await getFcmToken();
          await createPlayer({
            token: fcmToken,
          });
          // }, 1500);
        }
      } catch (error) {
        // dispatch(toggleLoader(false));
        showToast({
          message: t('global.alert.error_occurred'),
          title: t('global.alert.warning'),
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
  };

  useEffect(() => {
    if (auth.isSignIn) {
      navigation.navigate((route.params?.previousScreen || 'MainTab') as any);
      if (route?.params?.referralCode) {
        navigation.navigate('ReferralCodeDeeplink', {
          referralCode: route?.params?.referralCode!,
        });
      }
    }
  }, [auth.isSignIn]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <Text style={[h1, styles.textHeader]}>{t('auth.sign_in')}</Text>
      <Text style={[h3, styles.textDesc]}>
        {t('auth.enter_email_to_login')}
      </Text>
      <View style={styles.inputWrapper}>
        <CustomTextInput
          placeholder={t('auth.enter_email')}
          title={t('settings.email') as string}
          onChangeText={v => {
            setForm({...form, email: v});
            setFormError({...formError, [`error_email`]: ''});
          }}
          value={form.email}
          errorMessage={formError.error_email}
          keyboardType="email-address"
          autoCapitalize="none"
          isImportant
        />

        <View style={{marginTop: 18}} />

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
          autoCapitalize="none"
          isImportant
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={[h2, styles.textFPass]}>
            {t('forgot_password.forgot_password')}?
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        _theme="navy"
        title={t('global.button.login')}
        styleWrapper={{marginTop: 40}}
        isLoading={isLoading}
        onPress={methods.handleLogin}
      />
      <Text style={[h2, styles.textRegister]}>
        {t('auth.do_not_have_an_account')}?{' '}
        <Text
          style={styles.textRegister2}
          onPress={() => navigation.navigate('Register')}>
          {t('auth.sign_up_now')}
        </Text>
      </Text>
    </ScrollView>
  );
};

export default hoc(LoginScreen);

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
