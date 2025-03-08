import Button from 'components/Button';
import FailedDeleteAccountModalContent from './FailedDeleteAccountModalContent';
import PasswordConfirmationModalContent from 'components/MyProfileComponent/PasswordConfirmationModalContent/PasswordConfirmationModalContent';
import React, {useState} from 'react';
import {checkTransaction, matchingPassword} from 'redux/effects';
import {colors, h3} from 'utils/styles';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {StyleSheet, Text, View} from 'react-native';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const DeleteAccountAction = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitPassword = async (password: string) => {
    try {
      setIsLoading(true);
      const res = await matchingPassword({password});

      if (res?.is_match) {
        const transaction = await checkTransaction();
        dispatch(toggleBSheet(false));

        if (transaction?.is_have_dependent_transaction) {
          showFailedDeleteAccountModal();
        } else {
          navigation.navigate('DeleteAccountConfirmation');
        }
      } else {
        if (res?.data?.message === 'password is not match') {
          showToast({
            message: t('delete_account.password_not_match'),
            type: 'error',
            title: t('global.alert.error'),
          });
          return;
        }
        showToast({
          message:
            res?.data?.message || t('global.alert.please_login_to_continue'),
          type: 'error',
          title: t('global.alert.error'),
        });
      }
    } catch (error) {
      console.log('error handleSubmitPassword', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showFailedDeleteAccountModal = () => {
    showBSheet({
      snapPoint: ['60%', '60%'],
      content: <FailedDeleteAccountModalContent />,
    });
  };

  const showPasswordConfirmationModal = () => {
    showBSheet({
      snapPoint: ['35%', '35%'],
      content: (
        <PasswordConfirmationModalContent
          loading={isLoading}
          onSubmit={handleSubmitPassword}
        />
      ),
    });
  };

  return (
    <View style={styles.deleteAccountContainer}>
      <Text style={[h3, {marginBottom: 5}]}>
        {t('settings.delete_account')}
      </Text>
      <Text style={styles.deleteAccountDesc}>
        {t('settings.delete_account_desc')}
      </Text>
      <Button
        _theme="red"
        onPress={showPasswordConfirmationModal}
        title={t('global.button.delete_account')}
        lineColor="#FF5757"
        isLoading={isLoading}
      />
    </View>
  );
};

export default DeleteAccountAction;

const styles = StyleSheet.create({
  deleteAccountContainer: {
    marginTop: 30,
    padding: 10,
    elevation: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  deleteAccountDesc: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 15,
  },
});
