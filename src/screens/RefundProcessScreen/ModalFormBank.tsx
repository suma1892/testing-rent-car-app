import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ic_account_bank, ic_close2} from 'assets/icons';
import {theme} from 'utils';
import {
  iconCustomSize,
  rowCenter,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'utils/mixins';
import CustomTextInput from 'components/TextInput';
import SelectBank from 'components/SelectBankInput/SelectBank';
import {t} from 'i18next';
import {UserInformationForm} from 'screens/UserInformationScreen/userInformation.interface';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {RefundStatus} from 'types/refund.types';
import Button from 'components/Button';
import {h1} from 'utils/styles';
import {updateRefundOrder} from 'redux/effects';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';

const ModalFormBank = ({
  status,
  id,
  onRefresh,
}: {
  status: RefundStatus;
  id: number;
  onRefresh: () => void;
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const {t} = useTranslation();

  const snapPoints = useMemo(() => ['60%', '80%'], []);
  const accountBank = useAppSelector(accountBankState);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<UserInformationForm>({
    accountName: '',
    accountNumber: '',
    accountBank: '',
  });

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      sheetRef.current?.close();
    }
  }, []);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<UserInformationForm>({
    accountName: '',
    accountNumber: '',
    accountBank: '',
  });

  const handleSubmit = async () => {
    try {
      const formData = {
        customer_bank_account_name: form.accountName.trim(),
        customer_bank_name: form.accountBank,
        customer_bank_number: form.accountNumber,
        id: id,
      };
      if (
        !formData?.customer_bank_account_name ||
        !formData?.customer_bank_name ||
        !formData?.customer_bank_number
      ) {
        showToast({
          title: t('global.alert.warning'),
          type: 'warning',
          message: t('global.alert.cancellation_failed'),
        });
        return;
      }
      setIsLoading(true);
      const res = await updateRefundOrder(formData);
      console.log('res ', res);
      if (res) {
        showToast({
          title: t('global.alert.success'),
          type: 'success',
          message: t('global.alert.success_change_data'),
        });
        sheetRef.current?.close();
        sheetRef.current?.dismiss();
      }
    } catch (error) {
      showToast({
        title: t('global.alert.warning'),
        type: 'warning',
        message: t('global.alert.failed'),
      });
      console.log(error);
    } finally {
      setIsLoading(false);
      sheetRef.current?.close();
      sheetRef.current?.dismiss();
      setForm({
        accountName: '',
        accountNumber: '',
        accountBank: '',
      });
      onRefresh();
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
    dispatch(getMyAccountBank());
  }, []);

  return (
    <View style={{marginTop: 40, flex: 1}}>
      {status === 'REQUEST_CHANGE' && (
        <Button
          _theme="orange"
          onPress={() => {
            sheetRef.current?.present();
          }}
          title={t('myBooking.refund_process.fill_data')}
        />
      )}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <View style={styles.modalBackground}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 4,
            }}>
            <View style={[rowCenter, {justifyContent: 'space-between'}]}>
              <View style={[rowCenter]}>
                <Image source={ic_account_bank} style={iconCustomSize(28)} />
                <Text style={[h1, {marginLeft: 12}]}>
                  {t('myBooking.refund_process.account_bank')}
                </Text>
              </View>

              <TouchableOpacity onPress={() => sheetRef.current?.dismiss()}>
                <Image
                  source={ic_close2}
                  style={[
                    iconCustomSize(25),
                    {tintColor: theme.colors.grey4, resizeMode: 'contain'},
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginBottom: 20}} />

            <CustomTextInput
              placeholder={t('myBooking.refund_process.full_name_placeholder')}
              title={t('myBooking.refund_process.full_name')}
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
              value={form.accountName}
              errorMessage={error.accountName}
              styleTitle={{
                fontSize: 12,
              }}
            />

            <CustomTextInput
              placeholder={t(
                'myBooking.refund_process.account_bank_placeholder',
              )}
              title={t('myBooking.refund_process.account_bank')}
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
            />

            <Button
              _theme="navy"
              onPress={handleSubmit}
              title={t('myBooking.refund_process.save')}
              isLoading={isLoading}
              styleWrapper={{marginTop: 36}}
            />
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default ModalFormBank;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '80%',
    height: '80%',
  },
});
