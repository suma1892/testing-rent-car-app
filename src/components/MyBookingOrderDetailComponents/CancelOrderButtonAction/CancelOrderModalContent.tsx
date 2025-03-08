import BSheetCustomTextInput from 'components/BSheetTextInput';
import Button from 'components/Button';
import React, {useEffect, useState} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import CustomTextInput from 'components/TextInput';
import SelectBank from 'components/SelectBankInput/SelectBank';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {showToast} from 'utils/Toast';

type Form = {
  name: string;
  bank: string;
  bank_account_number: string;
  cancelation_reason: string;
};

type CancelOrderModalContentProps = {
  onSubmit: (val: Form) => void;
};

const CancelOrderModalContent: React.FC<CancelOrderModalContentProps> = ({
  onSubmit,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userProfile} = useAppSelector(appDataState);
  const accountBank = useAppSelector(accountBankState);

  const [formCancel, setFormCancel] = useState({
    cancelation_reason: '',
    accountName: '',
    accountNumber: '',
    accountBank: '',
  });

  useEffect(() => {
    dispatch(getUser());
    dispatch(getMyAccountBank());
  }, []);

  useEffect(() => {
    if (!!accountBank.data?.id) {
      setFormCancel(prev => ({
        ...prev,
        accountName: accountBank.data?.nama_rek || '',
        accountNumber: accountBank.data?.no_rek || '',
        accountBank: accountBank.data?.nama_bank || '',
      }));
    }
  }, [!!accountBank.data?.id]);

  return (
    <View style={styles.bsheetWrapper}>
      <BottomSheetScrollView>
        <Text style={[h1, {fontSize: 20}]}>
          {t('detail_order.reason_cancellation')}
        </Text>
        <View style={{marginVertical: 20, width: '100%'}}>
          <Text style={[h1, {fontSize: 12}]}>
            {t('detail_order.write_reason_cancellation')}
          </Text>

          <View style={{marginBottom: 20}} />

          <BSheetCustomTextInput
            placeholder={t('detail_order.return_deposit.name_placeholder')}
            title={t('myBooking.refund_process.name') as any}
            value={formCancel?.accountName}
            onChangeText={v => setFormCancel({...formCancel, accountName: v})}
          />

          <SelectBank
            value={formCancel.accountBank}
            onSelect={val => {
              setFormCancel(prev => ({...prev, accountBank: val.name}));
            }}
            titleStyle={{...h1}}
          />
          <View style={{marginBottom: 20}} />
          <BSheetCustomTextInput
            placeholder={t(
              'detail_order.return_deposit.account_number_placeholder',
            )}
            title={t('detail_order.return_deposit.account_number')}
            value={formCancel?.accountNumber}
            onChangeText={v => setFormCancel({...formCancel, accountNumber: v})}
          />

          <View style={{marginBottom: 20}} />

          <BSheetCustomTextInput
            multiline={true}
            title={t('detail_order.write_reason_cancellation')}
            placeholder={t('detail_order.write_description') as any}
            style={{
              height: 100,
              paddingRight: 15,
            }}
            maxLength={150}
            onChangeText={v =>
              setFormCancel({...formCancel, cancelation_reason: v})
            }
            value={formCancel.cancelation_reason}
          />
        </View>
        <View style={[styles.btnWrapper]}>
          <Button
            _theme="white"
            title={t('global.button.back')}
            onPress={() => {
              dispatch(toggleBSheet(false));
            }}
            styleWrapper={{width: '48%', borderWidth: 1, borderColor: 'navy'}}
          />

          <Button
            _theme="navy"
            title={t('global.button.yesNext')}
            onPress={() => {
              // name: formCancel?.accountName || '',
              //   bank: formCancel?.accountBank || '',
              //   bank_account_number: formCancel?.accountNumber || '',
              //   ...formCancel
              console.log('formCancel ', formCancel);
              if (
                !formCancel?.accountName ||
                !formCancel?.accountBank ||
                !formCancel?.accountNumber ||
                !formCancel?.cancelation_reason
              ) {
                showToast({
                  title: t('global.alert.warning'),
                  message: t('global.alert.cancellation_failed'),
                  type: 'warning',
                });
                return;
              }
              console.log('loloss')
              // return
              onSubmit({
                name: formCancel?.accountName || '',
                bank: formCancel?.accountBank || '',
                bank_account_number: formCancel?.accountNumber || '',
                ...formCancel,
              });
            }}
            styleWrapper={{width: '48%'}}
          />
        </View>
      </BottomSheetScrollView>
    </View>
  );
};

export default CancelOrderModalContent;

const styles = StyleSheet.create({
  bsheetWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: '5%',
    width: '100%',
  },
  formWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  btnWrapper: {
    // position: 'absolute',
    // bottom: 40,
    // left: 16,
    // right: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
