import Button from 'components/Button';
import PasswordValidationModalContent from './PasswordValidationModalContent';
import React, {Dispatch, SetStateAction} from 'react';
import {showBSheet} from 'utils/BSheet';
import {UserInformationForm} from 'screens/UserInformationScreen/userInformation.interface';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

type ButtonActionProps = {
  isEdit: boolean;
  onEditButtonClick: () => void;
  onSubmit: (val: string) => void;
  form: UserInformationForm;
  setError: Dispatch<SetStateAction<UserInformationForm>>;
};

const ButtonAction = ({
  isEdit,
  onEditButtonClick,
  onSubmit,
  form: accountBankForm,
  setError,
}: ButtonActionProps) => {
  const {t} = useTranslation();

  const handleSubmit = () => {
    let errorStatus = false;
    if (!accountBankForm.accountName) {
      errorStatus = true;
      setError(prev => ({
        ...prev,
        accountName: t(
          'bank_transfer.account_bank_form.error_account_name_empty',
        ),
      }));
    }

    if (!accountBankForm.accountBank) {
      errorStatus = true;
      setError(prev => ({
        ...prev,
        accountBank: t(
          'bank_transfer.account_bank_form.error_account_bank_empty',
        ),
      }));
    }

    if (!accountBankForm.accountNumber) {
      errorStatus = true;
      setError(prev => ({
        ...prev,
        accountNumber: t(
          'bank_transfer.account_bank_form.error_account_number_empty',
        ),
      }));
    }

    if (errorStatus) {
      return;
    }

    handleValidatePassword();
  };

  const handleValidatePassword = () => {
    showBSheet({
      snapPoint: ['35%', '35%'],
      content: <PasswordValidationModalContent onSubmit={onSubmit} />,
    });
  };

  return (
    <View>
      {isEdit ? (
        <Button
          _theme="navy"
          title={t('global.button.save')}
          onPress={handleSubmit}
        />
      ) : (
        <Button
          _theme="white"
          lineColor="navy"
          title={t('global.button.edit')}
          onPress={onEditButtonClick}
        />
      )}
    </View>
  );
};

export default ButtonAction;
