import BSheetCustomTextInput from 'components/BSheetTextInput';
import Button from 'components/Button';
import React, {useEffect, useState} from 'react';
import SelectBank from 'components/SelectBankInput/SelectBank';
import {showToast} from 'utils/Toast';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {UserInformationForm} from 'screens/UserInformationScreen/userInformation.interface';
import {useTranslation} from 'react-i18next';
import {
  accountBankState,
  resetAccountBank,
} from 'redux/features/accountBank/accountBankSlice';
import {
  createAccountBank,
  getMyAccountBank,
} from 'redux/features/accountBank/accountBankAPI';

const FormAccountBankModalContent = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const accountBank = useAppSelector(accountBankState);

  const [form, setForm] = useState<UserInformationForm>({
    accountName: '',
    accountNumber: '',
    accountBank: '',
  });
  const [error, setError] = useState<UserInformationForm>({
    accountName: '',
    accountNumber: '',
    accountBank: '',
  });

  const handleSubmit = async () => {
    if (!!accountBank.data?.id) {
      dispatch(toggleBSheet(false));
      navigation.navigate('UserInformation');
    } else {
      let errorStatus = false;
      console.log(form)
      if (!form.accountName) {
        errorStatus = true;
        setError(prev => ({
          ...prev,
          accountName: t(
            'bank_transfer.account_bank_form.error_account_name_empty',
          ),
        }));
      }

      if (!form.accountBank) {
        errorStatus = true;
        setError(prev => ({
          ...prev,
          accountBank: t(
            'bank_transfer.account_bank_form.error_account_bank_empty',
          ),
        }));
      }

      if (!form.accountNumber) {
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

      const res = await dispatch(
        createAccountBank({
          name_bank: form.accountBank,
          name_rek: form.accountName,
          no_rek: form.accountNumber,
        }),
      );

      if (!res.type.includes('rejected')) {
        showToast({
          title: t('global.alert.success'),
          type: 'success',
          message: t('global.alert.success_change_data'),
        });

        dispatch(toggleBSheet(false));
      }
    }
  };

  useEffect(() => {
    if (!!accountBank.data?.id) {
      setForm(prev => ({
        ...prev,
        accountName: accountBank.data?.nama_rek || '',
        accountNumber: accountBank.data?.no_rek || '',
        accountBank: accountBank.data?.nama_bank || '',
      }));
    }
  }, [!!accountBank.data?.id]);

  useEffect(() => {
    if (accountBank.isUpdateSuccess) {
      dispatch(resetAccountBank());
      dispatch(getMyAccountBank());
    }
  }, [accountBank.isUpdateSuccess]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('bank_transfer.account_bank')}</Text>

      <BSheetCustomTextInput
        title={t('user_information.account_name') as any}
        placeholder={t('detail_order.return_deposit.name_placeholder')}
        onChangeText={v => {
          const filtered = v.replace(/[^A-Za-z\s.'-]/g, '');
          setForm(prev => ({...prev, accountName: filtered}));
          setError(prev => ({
            ...prev,
            accountName: filtered
              ? ''
              : t('detail_order.return_deposit.error_name'),
          }));
        }}
        disabled={!!accountBank.data?.id}
        value={form.accountName}
        errorMessage={error.accountName}
        styleTitle={{
          fontSize: 12,
        }}
      />

      <SelectBank
        value={form.accountBank}
        errorMessage={error.accountBank}
        onSelect={val => {
          setForm(prev => ({...prev, accountBank: val.name}));
          setError(prev => ({
            ...prev,
            accountBank: val.name
              ? ''
              : t('detail_order.return_deposit.error_bank_name'),
          }));
        }}
        disabled={!!accountBank.data?.id}
      />

      <BSheetCustomTextInput
        title={t('detail_order.return_deposit.account_number') as any}
        placeholder={t(
          'detail_order.return_deposit.account_number_placeholder',
        )}
        errorMessage={error.accountNumber}
        onChangeText={v => {
          const filtered = v.replace(/[^0-9]/g, '');
          setForm(prev => ({...prev, accountNumber: filtered}));
          setError(prev => ({
            ...prev,
            accountNumber: v
              ? ''
              : t('detail_order.return_deposit.error_account_number'),
          }));
        }}
        value={form.accountNumber}
        styleTitle={{
          fontSize: 12,
          marginTop: 20,
        }}
        keyboardType="number-pad"
        disabled={!!accountBank.data?.id}
      />

      {!!accountBank.data?.id ? (
        <View style={styles.btnWrapper}>
          <Button
            _theme="navy"
            title={t('global.button.edit_account_bank')}
            onPress={handleSubmit}
            isLoading={accountBank.isLoading}
          />
        </View>
      ) : (
        <View style={styles.btnWrapper}>
          <Button
            _theme="white"
            lineColor="navy"
            title={t('global.button.back')}
            onPress={() => dispatch(toggleBSheet(false))}
            styleWrapper={{flexBasis: '49%'}}
            isLoading={accountBank.isLoading}
          />

          <Button
            _theme="navy"
            title={t('global.button.save')}
            onPress={handleSubmit}
            styleWrapper={{flexBasis: '49%'}}
            isLoading={accountBank.isLoading}
          />
        </View>
      )}
    </View>
  );
};

export default FormAccountBankModalContent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.black,
    marginBottom: 18,
  },
  btnWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
  },
});
