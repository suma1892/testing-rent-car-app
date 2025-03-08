import CustomTextInput from 'components/TextInput';
import React, {useCallback, useEffect, useState} from 'react';
import SelectBank from 'components/SelectBankInput/SelectBank';
import {colors, h1} from 'utils/styles';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {ic_edit} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {UserInformationForm} from 'screens/UserInformationScreen/userInformation.interface';
import {useTranslation} from 'react-i18next';
import {
  accountBankState,
  resetAccountBank,
} from 'redux/features/accountBank/accountBankSlice';

type DepositFormProps = {
  onChangeValue: (val: UserInformationForm) => void;
};

const DepositForm = ({onChangeValue}: DepositFormProps) => {
  const {t} = useTranslation();
  const accountBank = useAppSelector(accountBankState);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [disabled, setDisabled] = useState(true);
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

  const handleEdit = () => {
    if (accountBank.data) {
      navigation.navigate('UserInformation');
    } else {
      setDisabled(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAccountBank());
      dispatch(getMyAccountBank());
    }, []),
  );

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

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[h1, {marginBottom: 20}]}>
          {t('detail_order.return_deposit.return_detail')}
        </Text>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Image source={ic_edit} style={styles.editIcon} />
          <Text style={styles.buttonName}>{t('global.button.edit')}</Text>
        </TouchableOpacity>
      </View>

      <CustomTextInput
        title={t('user_information.account_name') as any}
        placeholder={t('detail_order.return_deposit.name_placeholder')}
        onChangeText={v => {
          const filtered = v.replace(/[^A-Za-z\s.'-]/g, '');
          onChangeValue({...form, accountName: filtered});
          setForm(prev => ({...prev, accountName: filtered}));
          setError(prev => ({
            ...prev,
            accountName: filtered
              ? ''
              : t('detail_order.return_deposit.error_name'),
          }));
        }}
        disabled={disabled}
        value={form.accountName}
        errorMessage=""
        styleTitle={{
          fontSize: 12,
        }}
      />

      <SelectBank
        value={form.accountBank}
        errorMessage={error.accountBank}
        onSelect={val => {
          onChangeValue({...form, accountBank: val.name});
          setForm(prev => ({...prev, accountBank: val.name}));
          setError(prev => ({
            ...prev,
            accountBank: val.name
              ? ''
              : t('detail_order.return_deposit.error_bank_name'),
          }));
        }}
        disabled={disabled}
      />

      <CustomTextInput
        title={t('detail_order.return_deposit.account_number') as any}
        placeholder={t(
          'detail_order.return_deposit.account_number_placeholder',
        )}
        errorMessage={error.accountNumber}
        onChangeText={v => {
          const filtered = v.replace(/[^0-9]/g, '');
          onChangeValue({...form, accountNumber: filtered});
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
        disabled={disabled}
      />
    </View>
  );
};

export default DepositForm;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {flexDirection: 'row', alignItems: 'center'},
  editIcon: {width: 18, height: 18},
  buttonName: {
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginLeft: 6,
    fontSize: 12,
  },
});
