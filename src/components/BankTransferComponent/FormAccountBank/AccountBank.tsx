import Button from 'components/Button';
import FormAccountBankModalContent from './FormAccountBankModalContent';
import React, {useEffect} from 'react';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {ic_account_bank} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

const AccountBank = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const accountBank = useAppSelector(accountBankState);

  const handleOpenForm = () => {
    showBSheet({
      snapPoint: ['60%', '60%'],
      content: <FormAccountBankModalContent />,
    });
  };

  // useEffect(() => {
  //   dispatch(getMyAccountBank());
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={ic_account_bank} style={styles.iconAccountBank} />
        <Text style={styles.accountBankTitle}>
          {t('bank_transfer.account_bank')}
        </Text>
      </View>

      <Text style={styles.description}>
        {t('bank_transfer.account_bank_description')}
      </Text>

      {/* <Button
        _theme="orange"
        title={
          !!accountBank.data?.id
            ? t('global.button.view_account_bank')
            : t('global.button.form_account_bank')
        }
        onPress={handleOpenForm}
      /> */}
    </View>
  );
};

export default AccountBank;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF1DE',
    width: '100%',
    padding: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F1A33A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconAccountBank: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  accountBankTitle: {
    fontFamily: 'Inter-Bold',
    color: theme.colors.black,
    fontSize: 12,
  },
  description: {
    marginVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: theme.colors.black,
    lineHeight: 20,
  },
});
