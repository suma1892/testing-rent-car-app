import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import ChangePasswordTextInput from 'components/MyProfileComponent/ChangePasswordTextInput/ChangePasswordTextInput';
import hoc from 'components/hoc';
import React, {useEffect, useState} from 'react';
import {changePassword} from 'redux/features/user/userAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {passwordValidation} from 'utils/functions';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {userState} from 'redux/features/user/userSlice';
import {useTranslation} from 'react-i18next';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

type ChangePasswordForm = {
  old_password: string;
  new_password: string;
  pass_confirmation: string;
};

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const userUpdateStatus = useAppSelector(userState).isChangePasswordSuccess;
  const {t} = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<ChangePasswordForm>({
    old_password: '',
    new_password: '',
    pass_confirmation: '',
  });
  const [formError, setFormError] = useState<ChangePasswordForm>({
    old_password: '',
    new_password: '',
    pass_confirmation: '',
  });

  const methods = {
    handleSubmit: async () => {
      setLoading(true);

      const _errorMessage: any = {};
      let status = true;
      if (!form.old_password) {
        _errorMessage['old_password'] = t('forgot_password.enter_old_password');
        status = false;
      }

      if (!form.new_password) {
        _errorMessage['new_password'] = t('forgot_password.enter_new_password'); //'Masukkan password baru';
        status = false;
      }

      if (!form.pass_confirmation) {
        _errorMessage['pass_confirmation'] =
          // 'Masukkan konfirmasi password baru';
          t('forgot_password.enter_confirm_password');
        status = false;
      }

      setFormError({..._errorMessage});

      if (!status) {
        setLoading(false);
        return;
      }

      const validated = passwordValidation(
        form.new_password,
        form.pass_confirmation,
      );

      if (!validated) {
        if (form.new_password !== form.pass_confirmation) {
          showToast({
            title: t('global.alert.failed'),
            type: 'error',
            message: t(
              'global.alert.password_and_confirmation_password_do_not_match',
            ),
          });
        } else {
          showToast({
            title: t('global.alert.failed'),
            type: 'warning',
            message: t('global.alert.password_length'),
          });
        }

        setLoading(false);
        return;
      }

      await dispatch(changePassword(form));
      setLoading(false);
    },
  };

  useEffect(() => {
    if (userUpdateStatus) {
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_change_password'),
      });
      navigation.goBack();
    }
  }, [userUpdateStatus]);

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
              {t('settings.changePassword')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <View>
        <ChangePasswordTextInput
          label={t('settings.oldPassword')}
          placeholder={t('settings.oldPasswordPlaceholder')}
          onChangeText={v => {
            setForm({...form, old_password: v});
            setFormError({...formError, old_password: ''});
          }}
          value={form.old_password}
          errorMessage={formError.old_password}
        />

        <ChangePasswordTextInput
          label={t('settings.newPassword')}
          placeholder={t('settings.newPasswordPlaceholder')}
          onChangeText={v => {
            setForm({...form, new_password: v});
            setFormError({...formError, new_password: ''});
          }}
          value={form.new_password}
          errorMessage={formError.new_password}
        />

        <ChangePasswordTextInput
          label={t('settings.confirmPassword')}
          placeholder={t('settings.confirmPasswordPlaceholder')}
          onChangeText={v => {
            setForm({...form, pass_confirmation: v});
            setFormError({...formError, pass_confirmation: ''});
          }}
          value={form.pass_confirmation}
          errorMessage={formError.pass_confirmation}
        />
      </View>

      <Button
        _theme="navy"
        onPress={methods.handleSubmit}
        title={t('global.button.save')}
        isLoading={loading}
        disabled={
          !form.old_password || !form.new_password || !form.pass_confirmation
        }
      />
    </ScrollView>
  );
};

export default hoc(
  ChangePasswordScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: '5%',
    justifyContent: 'space-between',
  },
});
