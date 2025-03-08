import BSheetPasswordTextInput from 'components/MyProfileComponent/BSheetPasswordTextInput/BSheetPasswordTextInput';
import Button from 'components/Button';
import React, {useState} from 'react';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {h2} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type Form = {
  password: string;
};

type PasswordValidationModalContentProps = {
  onSubmit: (val: string) => void;
};

const PasswordValidationModalContent = ({
  onSubmit,
}: PasswordValidationModalContentProps) => {
  const {t} = useTranslation();
  const accountBank = useAppSelector(accountBankState);

  const [form, setForm] = useState<Form>({
    password: '',
  });
  const [formError, setFormError] = useState<Form>({
    password: '',
  });

  return (
    <View style={styles.passwordModalContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text textBreakStrategy="simple" style={h2}>
            {t('Account.password')}
          </Text>
        </View>
      </View>

      <BSheetPasswordTextInput
        label={t('Account.insert_password_to_update')!}
        placeholder={t('Account.your_password')}
        onChangeText={v => {
          setForm({...form, password: v});
          setFormError({...formError, password: ''});
        }}
        errorMessage={formError.password}
      />

      <Button
        _theme="navy"
        onPress={() => {
          if (form.password) {
            onSubmit(form.password);
          } else {
            setFormError({
              password: t(
                'bank_transfer.account_bank_form.error_password_empty',
              ),
            });
          }
        }}
        title={t('global.button.confirm')}
        isLoading={accountBank.isLoading}
      />
    </View>
  );
};

export default PasswordValidationModalContent;

const styles = StyleSheet.create({
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
});
