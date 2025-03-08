import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import DeleteAccountAction from 'components/ProfileComponent/DeleteAccountAction';
import FileExistCard from 'components/MyProfileComponent/FileExistCard/FileExistCard';
import hoc from 'components/hoc';
import ModalLoading from 'components/Loading/ModalLoading';
import PasswordConfirmationModalContent from 'components/MyProfileComponent/PasswordConfirmationModalContent/PasswordConfirmationModalContent';
import ProfileTextInput from 'components/MyProfileComponent/ProfileTextInput/ProfileTextInput';
import React, {useEffect, useMemo, useState} from 'react';
import UploadIdentityImageInput from './components/UploadIdentityImageInput/UploadIdentityImageInput';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {editUser} from 'redux/features/user/userAPI';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1, h4} from 'utils/styles';
import {ic_arrow_left_white, ic_warning} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {setUserData, userState} from 'redux/features/user/userSlice';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const {userProfile, isLoading: userProfileLoading} =
    useAppSelector(appDataState);
  const user = useAppSelector(userState);
  const {t} = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    phone_code: '',
    phone: '',
    email: '',
    wa_number: '',
    photo_ktp: '',
    photo_license: '',
  });
  const [formError, setFormError] = useState<ProfileForm>({
    name: '',
    phone_code: '',
    phone: '',
    email: '',
    wa_number: '',
    photo_ktp: '',
    photo_license: '',
  });
  const [temporaryFileUpload, setTemporaryFileUpload] =
    useState<TemporaryFileUpload>({
      photo_ktp: '',
      photo_license: '',
    });

  const methods = {
    handleValidate: () => {
      const _errorMessage: any = {};
      let status = true;
      if (!form.name) {
        _errorMessage['name'] = t('settings.error_name');
        status = false;
      }

      // if (!form.phone) {
      //   _errorMessage['phone'] = t('settings.error_phone');
      //   status = false;
      // }
      // if (form?.phone?.length <= 8) {
      //   _errorMessage['phone'] = t('detail_order.min_phone');
      //   status = false;
      // }

      if (!form.email) {
        _errorMessage['email'] = t('settings.error_email');
        status = false;
      }

      if (!temporaryFileUpload.photo_ktp && !form.photo_ktp) {
        _errorMessage['photo_ktp'] = t('settings.error_ktp');
        status = false;
      }

      if (!temporaryFileUpload.photo_license && !form.photo_license) {
        _errorMessage['photo_license'] = t('settings.error_photo_license');
        status = false;
      }

      setFormError({..._errorMessage});

      if (!status) {
        setLoading(false);
        return;
      }

      methods.showPasswordConfirmationModal();
    },
    handleSubmit: async (password: string) => {
      setLoading(true);

      const _errorMessage: any = {};
      let status = true;
      if (!password) {
        _errorMessage['password'] = t('reset_password.enter_your_password');
        status = false;
      }

      setFormError({..._errorMessage});

      if (!status) {
        setLoading(false);
        return;
      }

      let formData = {
        ...form,
        email: userProfile.email,
        phone_code: form?.phone_code?.includes('+')
          ? form?.phone_code
          : `+${form?.phone_code}`,
        code: form?.phone_code?.includes('+')
          ? form?.phone_code
          : `+${form?.phone_code}`,
        photo_profile: userProfile.photo_profile,
        photo_ktp: temporaryFileUpload.photo_ktp || form.photo_ktp,
        photo_license: temporaryFileUpload.photo_license || form.photo_license,
      };

      if (!form?.phone) {
        delete formData.phone;
        delete formData.phone_code;
        delete formData.code;
      }

      // console.log('formdata', formData);
      await dispatch(editUser({...formData, password}));
      await dispatch(editUser({...formData, password}));
      dispatch(toggleBSheet(false));
      setLoading(false);
    },
    showPasswordConfirmationModal: () => {
      showBSheet({
        snapPoint: ['35%', '35%'],
        content: (
          <PasswordConfirmationModalContent
            loading={loading}
            onSubmit={password => {
              methods.handleSubmit(password);
            }}
          />
        ),
      });
    },
  };

  useEffect(() => {
    dispatch(getUser());

    const backAction = () => {
      dispatch(setUserData({photo_ktp: '', photo_license: ''}));
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user.isUpdateSuccess) {
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_change_profile_data'),
      });

      // dispatch(setUserData({photo_ktp: '', photo_license: ''}));
      dispatch(toggleBSheet(false));
      dispatch(getUser());
      // setTimeout(() => {
      //   navigation.goBack();
      // }, 500);
    }
  }, [user.isUpdateSuccess]);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('settings.profile')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  useEffect(() => {
    if (userProfile.id) {
      setForm(prev => ({
        ...prev,
        name: userProfile.name,
        phone_code: userProfile.phone_code,
        code: userProfile.phone_code,
        phone: userProfile.phone,
        email: userProfile.email,
        wa_number: userProfile.wa_number,
        photo_ktp: userProfile?.personal_info?.need_review_ktp
          ? ''
          : userProfile?.personal_info?.ktp,
        photo_license: userProfile?.personal_info?.need_review_sim
          ? ''
          : userProfile.personal_info?.sim,
      }));
    }
  }, [userProfile]);

  useEffect(() => {
    if (user.data?.photo_ktp || user.data?.photo_license) {
      setTemporaryFileUpload(prev => ({
        photo_ktp: user.data?.photo_ktp || '',
        photo_license: user.data?.photo_license || '',
      }));
    }
  }, [user.data?.photo_ktp, user.data?.photo_license]);

  const isDisabled = useMemo(() => {
    if (form.photo_ktp || form.photo_license) {
      return (
        // form.name === userProfile.name ||
        temporaryFileUpload.photo_ktp === form.photo_ktp ||
        temporaryFileUpload.photo_license === form.photo_license
      );
    }

    return (
      !form.name ||
      !temporaryFileUpload.photo_ktp ||
      !temporaryFileUpload.photo_license
    );
  }, [
    form.name,
    form.photo_ktp,
    form.photo_license,
    temporaryFileUpload.photo_ktp,
    temporaryFileUpload.photo_license,
    userProfile.name,
  ]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <ModalLoading visible={userProfileLoading} />

      <View style={{marginBottom: 20}}>
        <ProfileTextInput
          label={t('settings.fullName')}
          placeholder={t('settings.fullNamePlaceholder')}
          onChangeText={(v: string) => {
            setForm({...form, name: v});
            setFormError({...formError, name: ''});
          }}
          value={form.name}
          errorMessage={formError.name}
          maxLength={100}
        />

        <ProfileTextInput
          label={t('settings.email')}
          placeholder={t('forgot_password.enter_email')}
          keyboardType="email-address"
          onChangeText={(v: string) => {
            setForm({...form, email: v});
            setFormError({...formError, email: ''});
          }}
          editable={false}
          value={form.email}
          errorMessage={formError.email}
        />

        <ProfileTextInput
          label={t('register.phone_number')}
          placeholder={t('register.enter_phone_number')}
          type="phone_number"
          onChangeText={(code: string, v: string) => {
            setForm({...form, phone_code: code, phone_code: code, phone: v});
            setFormError({...formError, phone: ''});
          }}
          value={form.phone}
          errorMessage={formError.phone}
          defaultCode={form?.phone_code}
          maxLength={15}
        />

        <View style={styles.identityAlertContainer}>
          <Image
            source={ic_warning}
            style={iconCustomSize(14)}
            resizeMode="contain"
          />
          <Text style={styles.identityAlertDescription}>
            {t('profile.identity_alert') as string}
          </Text>
        </View>

        <View style={[rowCenter]}>
          <Text style={[h1, {fontSize: 12, marginTop: 15}]}>
            {t('Account.id_card_photo')}
          </Text>
        </View>
        {form.photo_ktp ? (
          <FileExistCard
            label="foto-ktp.jpg"
            onRemoveImage={() => {
              setForm({...form, photo_ktp: ''});
            }}
          />
        ) : (
          <UploadIdentityImageInput
            type="ktp"
            temporaryFileUpload={temporaryFileUpload}
            setTemporaryFileUpload={setTemporaryFileUpload}
            formError={formError}
            setFormError={setFormError}
          />
        )}
        <View style={[rowCenter]}>
          <Text style={[h1, {fontSize: 12, marginTop: 15}]}>
            {t('Account.license_photo')}
          </Text>
        </View>
        {form?.photo_license ? (
          <FileExistCard
            label="foto-sim.jpg"
            onRemoveImage={() => {
              setForm({...form, photo_license: ''});
            }}
          />
        ) : (
          <UploadIdentityImageInput
            type="sim"
            temporaryFileUpload={temporaryFileUpload}
            setTemporaryFileUpload={setTemporaryFileUpload}
            formError={formError}
            setFormError={setFormError}
          />
        )}
      </View>

      <Button
        _theme="navy"
        onPress={methods.handleValidate}
        title={t('global.button.save')}
        isLoading={loading}
        disabled={isDisabled}
      />
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey6,
          marginVertical: 20,
        }}
      />
      <DeleteAccountAction />
    </ScrollView>
  );
};

export default hoc(ProfileScreen, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: '5%',
    // justifyContent: 'space-between',
  },
  passwordModalContainer: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  headerTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  identityAlertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#FFF7EA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.orange,
  },
  identityAlertDescription: {
    ...h4,
    fontSize: 12,
    marginLeft: 5,
    lineHeight: 13,
    width: '90%',
    color: theme.colors.black,
  },
});
