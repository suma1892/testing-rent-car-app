import Button from 'components/Button';
import RadioButton from 'components/RadioButton/RadioButton';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  WINDOW_WIDTH,
} from '@gorhom/bottom-sheet';
import {h1} from 'utils/styles';
import {ic_cancel_one_way_confirm, ic_close} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {useTranslation} from 'react-i18next';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {cancelOrderOneWay} from 'redux/effects';
import {IOrder} from 'types/my-booking.types';
import {useNavigation} from '@react-navigation/native';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {showBSheet} from 'utils/BSheet';
import {FONT_WEIGHT_REGULAR} from 'utils/typography';

const CancelTask = ({data}: {data: IOrder}) => {
  const {t} = useTranslation();
  const [reason, setReason] = useState();
  const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const cancelModalRef = useRef<BottomSheetModal>(null);
  const [loader, setLoader] = useState(false);
  const snapPoints = useMemo(() => ['75%', '75%'], []);

  const handleShowCancelModal = useCallback(() => {
    // cancelModalRef.current?.present();
    showBSheet({
      content: (
        <View
          style={{
            width: WINDOW_WIDTH,
            alignItems: 'center',
          }}>
          <Image
            source={ic_cancel_one_way_confirm}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: FONT_WEIGHT_REGULAR,
              textAlign: 'center',
            }}>
            Apakah anda yakin{'\n'}akan membatalkan pesanan?
          </Text>

          <View
            style={{
              width: WINDOW_WIDTH - 50,
            }}>
            <Button
              _theme="navy"
              onPress={() => {
                handleShowCancelModal();
                setTimeout(() => {
                  cancelModalRef.current?.present();
                }, 100);
              }}
              title="Iya, Lanjutkan"
              styleWrapper={{marginTop: 20}}
            />
            <Button
              _theme="white"
              onPress={handleShowCancelModal}
              title="Kembali"
              styleWrapper={{marginTop: 10}}
            />
          </View>
        </View>
      ),
      snapPoint: ['50%', '50%'],
    });
  }, []);

  // const handleShowCancelModalConfirm = useCallback(() => {
  //   // cancelModalRef.current?.present();
  //   showBSheet({
  //     content: (
  //       <View
  //         style={{
  //           width: WINDOW_WIDTH,
  //           alignItems: 'center',
  //         }}>
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             fontWeight: FONT_WEIGHT_REGULAR,
  //             textAlign: 'center',
  //           }}>
  //           Alasan Pembatalan Order
  //         </Text>

  //         <TextInput
  //           style={styles.textArea}
  //           placeholder={t('one_way.type_description')}
  //           value={description}
  //           onChangeText={setDescription}
  //           placeholderTextColor={theme.colors.grey5}
  //         />

  //         <View
  //           style={{
  //             width: WINDOW_WIDTH - 50,
  //           }}>
  //           <Button
  //             _theme="navy"
  //             onPress={handleCancelOrder}
  //             title="Kirim"
  //             styleWrapper={{marginTop: 20}}
  //           />
  //           <Button
  //             _theme="white"
  //             onPress={handleShowCancelModalConfirm}
  //             title="Kembali"
  //             styleWrapper={{marginTop: 10}}
  //           />
  //         </View>
  //       </View>
  //     ),
  //     snapPoint: ['50%', '50%'],
  //   });
  // }, [description, handleCancelOrder, t]);

  const ITEMS = [
    {
      name: t('one_way.cancel_reason.long_wait'),
      value: 1,
    },
    {
      name: t('one_way.cancel_reason.cannot_contacted'),
      value: 2,
    },
    {
      name: t('one_way.cancel_reason.change_destination'),
      value: 3,
    },
    {
      name: t('one_way.cancel_reason.change_rent_type'),
      value: 4,
    },
    {
      name: t('one_way.cancel_reason.other'),
      value: 5,
    },
  ];

  const handleCancelOrder = async () => {
    if (!description) {
      showToast({
        message: t('one_way.cancel_reason.cancel_message_empty'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      return;
    }
    // let _reason = '';
    // if (reason === 5) {
    //   _reason = description;
    // } else {
    //   _reason = ITEMS.find(x => x?.value === reason)?.name;
    // }
    console.log('data?.disbursement = ', data?.disbursement);
    // return
    setLoader(true);

    const res = await cancelOrderOneWay({
      transactionKey: data?.transaction_key,
      bank: data?.disbursement?.sender_bank_name,
      bank_account_number:
        data?.disbursement?.account_number ||
        data?.disbursement?.payment?.account_number,
      cancelation_reason: description,
      name: data?.user_name,
    });
    console.log('data cancel = ', res);
    if (res?.status === 200) {
      showToast({
        message: t('one_way.success_cancel'),
        title: t('global.alert.success'),
        type: 'success',
      });
      navigation.goBack();
    } else {
      showToast({
        message: t('one_way.failed_cancel'),
        title: t('global.alert.success'),
        type: 'warning',
      });
    }
    setLoader(false);
    setTimeout(() => {
      cancelModalRef?.current?.close();
    }, 1000);
  };

  return (
    <>
      <Button
        _theme="red"
        lineColor="red"
        title={t('global.button.cancel')}
        onPress={handleShowCancelModal}
        styleWrapper={{
          width: '100%',
          alignSelf: 'center',
          marginTop: 10,
          marginBottom: 20,
        }}
      />

      <BottomSheetModal
        ref={cancelModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <View style={styles.modalContent}>
          {/* <View style={styles.headerContainer}>
            <Text style={[h1, {fontSize: 20}]}>
              {t('one_way.cancel_order')}
            </Text>
            <TouchableOpacity onPress={() => cancelModalRef?.current?.close()}>
              <Image source={ic_close} style={iconCustomSize(17)} />
            </TouchableOpacity>
          </View>

          <RadioButton
            items={ITEMS}
            value={reason}
            type={2}
            onChange={x => {
              if (x === reason) {
                setReason('');
              } else {
                setReason(x);
              }
            }}
          />

          {Number(reason) === 5 && (
            <TextInput
              style={styles.textArea}
              placeholder={t('one_way.type_description')}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={theme.colors.grey5}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              _theme="navy"
              title={t('global.button.confirm')}
              styleWrapper={{marginTop: 20}}
              onPress={handleCancelOrder}
              isLoading={loader}
            />
          </View> */}
          <View
            style={{
              // width: WINDOW_WIDTH,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: FONT_WEIGHT_REGULAR,
                textAlign: 'center',
              }}>
              Alasan Pembatalan Order
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder={t('one_way.type_description')}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={theme.colors.grey5}
            />

            <View
              style={{
                width: WINDOW_WIDTH - 50,
              }}>
              <Button
                _theme="navy"
                onPress={handleCancelOrder}
                title="Kirim"
                styleWrapper={{marginTop: 20}}
              />
              <Button
                _theme="white"
                onPress={() => cancelModalRef.current?.close()}
                title="Kembali"
                styleWrapper={{marginTop: 10}}
              />
            </View>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
};

export default CancelTask;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    margin: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 6,
    height: 100,
    width: WINDOW_WIDTH - 50,
    marginTop: 20,
    textAlignVertical: 'top',
    color: theme.colors.black,
  },
});
