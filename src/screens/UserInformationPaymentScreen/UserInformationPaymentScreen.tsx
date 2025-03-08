import appBar from 'components/AppBar/AppBar';
import ButtonAction from 'components/UserInformationComponent/ButtonAction/ButtonAction';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {useEffect, useState} from 'react';
import SelectBank from 'components/SelectBankInput/SelectBank';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {UserInformationForm} from './userInformation.interface';
import {useTranslation} from 'react-i18next';
import {
  createAccountBank,
  getMyAccountBank,
  updateAccountBank,
} from 'redux/features/accountBank/accountBankAPI';
import AccountBank from 'components/BankTransferComponent/FormAccountBank/AccountBank';
import Button from 'components/Button';
import {showBSheet} from 'utils/BSheet';
import PasswordValidationModalContent from 'components/UserInformationComponent/ButtonAction/PasswordValidationModalContent';

const UserInformationScreen = () => {
  const route = useRoute();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const accountBank = useAppSelector(accountBankState);

  const [isEdit, setIsEdit] = useState(false);
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

  const handleSubmit = async (password: string) => {
    try {
      const formData = {
        name_rek: form.accountName.trim(),
        name_bank: form.accountBank,
        no_rek: form.accountNumber,
        password,
      };

      // if (!!accountBank.data?.id) {
      //   dispatch(updateAccountBank({...formData, id: accountBank.data?.id}));
      // } else {
      const res = await dispatch(createAccountBank(formData));
      if (res.type.includes('fulfilled')) {
        route?.params?.func();
      }

      // }
    } catch (error) {
      console.log(error);
    }
  };

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
              {t('Account.menu_5')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  // useEffect(() => {
  //   dispatch(getMyAccountBank());
  // }, []);

  // useEffect(() => {
  //   if (accountBank.isUpdateSuccess) {
  //     showToast({
  //       title: t('global.alert.success'),
  //       type: 'success',
  //       message: t('global.alert.success_change_data'),
  //     });

  //     dispatch(toggleBSheet(false));
  //     setTimeout(() => {
  //       navigation.goBack();
  //     }, 500);
  //   }
  // }, [accountBank.isUpdateSuccess]);

  // useEffect(() => {
  //   if (!!accountBank.data?.id) {
  //     setForm(prev => ({
  //       ...prev,
  //       accountName: accountBank.data?.nama_rek || '',
  //       accountNumber: accountBank.data?.no_rek || '',
  //       accountBank: accountBank.data?.nama_bank || '',
  //     }));
  //   }
  // }, [!!accountBank.data?.id]);
  const handleValidatePassword = () => {
    showBSheet({
      snapPoint: ['35%', '35%'],
      content: <PasswordValidationModalContent onSubmit={handleSubmit} />,
    });
  };

  if (accountBank.isLoading) return <Loading />;
  return (
    <View style={styles.container}>
      <View>
        <AccountBank />
        <CustomTextInput
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
          // disabled={!isEdit}
          value={form.accountName}
          errorMessage={error.accountName}
          styleTitle={{
            fontSize: 12,
            marginTop: 20,
          }}
        />

        <CustomTextInput
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
          // disabled={!isEdit}
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
          // disabled={!isEdit}
        />
      </View>

      {/* <ButtonAction
        isEdit={isEdit}
        onEditButtonClick={() => setIsEdit(true)}
        onSubmit={handleSubmit}
        form={form}
        setError={setError}
      /> */}
      <Button
        _theme="navy"
        disabled={
          !form?.accountBank || !form?.accountName || !form?.accountNumber
        }
        title="Simpan Dan Lanjutkan"
        onPress={handleValidatePassword}
      />
    </View>
  );
};

export default hoc(
  UserInformationScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    paddingBottom: 38,
    paddingTop: 24,
  },
});
