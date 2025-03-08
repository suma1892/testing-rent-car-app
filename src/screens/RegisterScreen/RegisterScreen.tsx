import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import countryCodes from 'utils/country-codes.json';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import React, {FC, useEffect, useState} from 'react';
import SelectCountryCodeModalContent from 'components/SelectCountryCodeModalContent';
import {authState} from 'redux/features/auth/authSlice';
import {checkedEmail} from 'redux/effects';
import {FONT_SIZE_12, FONT_SIZE_20} from 'utils/typography';
import {h1, h2, h3, h4} from 'utils/styles';
import {ic_blue_check, ic_uncheck, ic_wa} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {IParamRegister} from 'types/auth.types';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {saveFormRegister} from 'redux/features/appData/appDataSlice';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface IErrorMessage {
  error_fullname: '';
  error_email: '';
  error_phone?: '';
  error_wa?: '';
}

type registerScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

const RegisterScreen: FC = () => {
  const {t} = useTranslation();
  const route = useRoute<registerScreenRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const errorRegister = useAppSelector(authState).errors;
  const [selected, setSelected] = useState(countryCodes[0]);
  const [selectWa, setSelectWa] = useState<boolean>(false);
  const [activeModalCode, setActiveModalCode] = useState<'code' | 'wa_code'>(
    'code',
  );

  // console.log('roeut=  ', route?.params?.referralCode);
  const [form, setForm] = useState<IParamRegister>({
    fullname: '',
    email: '',
    // phone: '',
    // wa: '',
    // wa_code: '+62',
    // code: countryCodes[0].dial_code,
  });
  const [formError, setFormError] = useState<IErrorMessage>({
    error_fullname: '',
    error_email: '',
    // error_phone: '',
    // error_wa: '',
  });

  useEffect(() => {
    navigation.setOptions(
      appBar({
        // title: 'Home'
      }),
    );
  }, [navigation]);

  useEffect(() => {
    if (!selectWa) return;
    setForm({...form, wa: form.phone, wa_code: form.code});
  }, [selectWa]);

  useEffect(() => {
    // console.log('errorRegister = ', errorRegister);
    const _errorMessage: any = {};
    errorRegister?.detail?.map((x: {field: string; message: string}) => {
      _errorMessage[`error_${x.field}`] = x?.message;
    });
    setFormError(_errorMessage);
  }, [errorRegister]);

  const methods = {
    handleRegister: async () => {
      try {
        const resChecked = await checkedEmail(form.email);

        // console.log('resChecked = ', resChecked);
        if (resChecked?.is_register) {
          showToast({
            message: t('Account.registered_email'),
            title: t('global.alert.warning'),
            type: 'warning',
          });
          return;
        }
        const _errorMessage: any = {};
        let status = true;
        Object.keys(form).map((x, i) => {
          if (!form[x as keyof IParamRegister]) {
            status = false;
            let field = '';
            if (x === 'fullname') {
              field = t('settings.fullName');
            } else if (x === 'email') {
              field = 'Email';
            }
            // else if (x === 'phone') {
            //   field = 'No. handphone';
            // } else {
            //   field = 'No. Whatsapp';
            // }

            _errorMessage[`error_${x}`] = `${field} ${t(
              'register.cannot_empty',
            )}`;
          }
        });
        // if (form?.phone?.length <= 10) {
        //   _errorMessage[`error_${'phone'}`] = t('register.length_phone');
        //   status = false;
        // }
        // if (form?.wa?.length <= 10) {
        //   _errorMessage[`error_${'wa'}`] = t('register.length_phone');
        //   status = false;
        // }
        setFormError(_errorMessage);
        if (status) {
          dispatch(saveFormRegister(form));
          navigation.navigate('RegisterPassword', {
            referralCode: route?.params?.referralCode,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  };

  const handleOpenModalPhoneCode = () => {
    showBSheet({
      content: (
        <SelectCountryCodeModalContent
          headerTitle={t('settings.country_code')}
          data={countryCodes as any}
          onPress={(val: any) => {
            setForm(prev => ({
              ...prev,
              code: val?.dial_code,
              wa_code: val?.dial_code,
            }));
            handleOpenModalPhoneCode();
          }}
        />
      ),
      snapPoint: ['40%', '80%'],
    });
  };
  const handleOpenModalPhoneWaCode = () => {
    showBSheet({
      content: (
        <SelectCountryCodeModalContent
          headerTitle={t('settings.country_code')}
          data={countryCodes as any}
          onPress={(val: any) => {
            setForm(prev => ({
              ...prev,
              wa_code: val?.dial_code,
            }));
            handleOpenModalPhoneWaCode();
          }}
        />
      ),
      snapPoint: ['40%', '80%'],
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <Text style={[h1, styles.textHeader]}>{t('auth.sign_up')}</Text>
      <Text style={[h3, styles.textDesc]}>{t('register.create_account')}</Text>
      <View style={styles.inputWrapper}>
        <CustomTextInput
          placeholder={t('settings.fullname_placeholder')}
          title={t('settings.fullName') as any}
          isImportant
          onChangeText={v => {
            setForm({...form, fullname: v});
            setFormError({...formError, error_fullname: ''});
          }}
          value={form.fullname}
          errorMessage={formError.error_fullname}
          autoCapitalize="words"
        />

        <View style={{marginTop: 18}} />

        <CustomTextInput
          placeholder={t('forgot_password.enter_your_email')}
          title={t('settings.email') as string}
          isImportant
          onChangeText={v => {
            setForm({...form, email: v});
            setFormError({...formError, error_email: ''});
          }}
          value={form.email}
          errorMessage={formError.error_email}
          keyboardType="email-address"
        />
        {/* <Text style={[styles.title, h1]}>
          {t('register.phone_number')}
          <Text style={{color: theme.colors.red}}>{'*'}</Text>
        </Text>
        <View
          style={[
            {justifyContent: 'space-between', flexDirection: 'row', height: 60},
          ]}>
          <View style={{width: '20%', marginTop: 10}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleOpenModalPhoneCode();
                setActiveModalCode('code');
              }}>
              <Text style={styles.buttonText}>
                {!!form?.code && `${form?.code}`}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{width: '75%'}}>
            <CustomTextInput
              placeholder={t('register.enter_phone_number')}
              maxLength={15}
              onChangeText={v => {
                if (selectWa) {
                  setForm({...form, phone: v, wa: v});
                  setFormError({...formError, error_phone: ''});
                  return;
                }
                setForm({...form, phone: v});
                setFormError({...formError, error_phone: ''});
              }}
              value={form.phone}
              errorMessage={formError.error_phone}
              keyboardType="number-pad"
            />
          </View>
        </View> */}

        {/* <View
          style={[rowCenter, {justifyContent: 'space-between', marginTop: 25}]}>
          <Text style={[{fontSize: FONT_SIZE_12}, h1]}>
            Whatsapp <Text style={{color: theme.colors.red}}>{'*'}</Text>
          </Text>
          <TouchableOpacity
            style={[rowCenter]}
            onPress={() => setSelectWa(prev => !prev)}>
            <Image
              source={selectWa ? ic_blue_check : ic_uncheck}
              style={iconSize}
            />
            <Text style={[h4, {marginLeft: 5}]}>
              {t('register.same_as_phone_number')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {justifyContent: 'space-between', flexDirection: 'row', height: 60},
          ]}>
          <View style={{width: '20%', marginTop: 10}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleOpenModalPhoneWaCode();
                setActiveModalCode('wa_code');
              }}>
              <Text style={styles.buttonText}>
                {!!form?.wa_code && `${form?.wa_code}`}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{width: '75%'}}>
            <CustomTextInput
              placeholder={t('register.enter_whatsapp_number')}
              disabled={selectWa}
              maxLength={15}
              onChangeText={v => {
                setForm({...form, wa: v});
                setFormError({...formError, error_wa: ''});
              }}
              value={form.wa}
              errorMessage={formError.error_wa}
              leftIcon={ic_wa}
              keyboardType="number-pad"
            />
          </View>
        </View> */}
      </View>
      <Button
        _theme="navy"
        title={t('global.button.signup')}
        styleWrapper={{marginTop: 40}}
        onPress={methods.handleRegister}
      />

      <Text style={[h2, styles.textRegister]}>
        {t('auth.have_an_account')}?{' '}
        <Text
          style={styles.textRegister2}
          onPress={() =>
            navigation.navigate('Login', {
              referralCode: route?.params?.referralCode,
            })
          }>
          {t('auth.sign_in')}
        </Text>
      </Text>
    </ScrollView>
  );
};

export default hoc(RegisterScreen);

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
  title: {
    fontSize: FONT_SIZE_12,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#efefef',
    height: '90%',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    borderColor: theme.colors.grey5,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
});
