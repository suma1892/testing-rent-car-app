import Button from 'components/Button';
import RadioButton from 'components/RadioButton/RadioButton';
import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {h1, h4} from 'utils/styles';
import {
  ic_arrow_left,
  ic_blue_check,
  ic_check,
  ic_close,
  ic_uncheck,
} from 'assets/icons';
import {
  iconCustomSize,
  rowCenter,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'utils/mixins';

import {showToast} from 'utils/Toast';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {img_cancel_order} from 'assets/images';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {showBSheet} from 'utils/BSheet';
import {cancelOrder} from 'redux/features/order/orderAPI';
import {appDataState} from 'redux/features/appData/appDataSlice';
import ModalSuccessCancelOrder from 'components/ModalSuccessCancelOrder/ModalSuccessCancelOrder';
import {getOrders} from 'redux/features/myBooking/myBookingAPI';
import {theme} from 'utils';
import {FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_16} from 'utils/typography';
import {getMarkerBoxStyle} from 'react-native-render-html/lib/typescript/elements/ListElement';
import ModalSuccessRefundOrder from 'components/ModalSuccessCancelOrder/ModalSuccessRefundOrder';

type CancelTaskProps = {
  transactionKey: string;
};

const SelectionCancelTask = ({transactionKey}: CancelTaskProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isChecklist, setIsChecklist] = useState(false);

  const cancelModalRef = useRef<BottomSheetModal>(null);
  const tncRef = useRef<BottomSheetModal>(null);
  const {userProfile} = useAppSelector(appDataState);

  const snapPoints = useMemo(() => ['75%', '75%'], []);
  const dispatch = useAppDispatch();
  const [showModalSuccess, setShowModalSuccess] = useState(false);

  const handleShowCancelModal = useCallback(() => {
    cancelModalRef.current?.present();
  }, []);

  const showPopupCancelOrder = () => {
    showBSheet({
      snapPoint: ['60%', '60%'],
      content: (
        <View
          style={{
            alignItems: 'center',
            margin: 20,
            width: '90%',
          }}>
          <Image
            source={img_cancel_order}
            style={{width: 170, height: 170, marginBottom: 50}}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              fontWeight: '400',
              lineHeight: 20,
              textAlign: 'center',
            }}>
            {t('myBooking.cancel_order_desc')}
          </Text>

          <Button
            _theme="navy"
            onPress={() => {
              dispatch(toggleBSheet(false));
              setTimeout(() => {
                // handleCancelOrder();
                handleShowCancelModal();
              }, 100);
            }}
            title={t('global.button.yesNext')}
            styleWrapper={{width: '90%', marginTop: 20}}
          />
          <Button
            _theme="white"
            onPress={() => {
              dispatch(toggleBSheet(false));
            }}
            title={t('global.button.cancel')}
            styleWrapper={{
              width: '90%',
              marginTop: 20,
              borderWidth: 1,
              borderColor: '#666',
            }}
          />
        </View>
      ),
    });
  };

  const ITEMS = [
    {
      name: t('myBooking.cancel_reason.waiting_too_long'),
      value: 1,
    },
    {
      name: t('myBooking.cancel_reason.cannot_be_contacted'),
      value: 2,
    },
    {
      name: t('myBooking.cancel_reason.change_destination'),
      value: 3,
    },
    {
      name: t('myBooking.cancel_reason.change_rental_type'),
      value: 4,
    },
    {
      name: t('myBooking.cancel_reason.other'),
      value: 5,
    },
  ];

  const handleCancelTask = async () => {
    const res = await dispatch(
      cancelOrder({
        name: userProfile?.name || '',
        bank: userProfile?.account_bank?.nama_bank || '',
        bank_account_number: userProfile?.account_bank?.no_rek || '',
        transaction_key: transactionKey,
        cancelation_reason: description,
      }),
    );

    if (res?.type.includes('fulfilled')) {
      dispatch(toggleBSheet(false));
      setShowModalSuccess(true);
      return;
    }
    showToast({
      message: t('global.alert.cancellation_failed'),
      title: t('global.alert.error_occurred'),
      type: 'warning',
    });

  };

  return (
    <>
      <Button
        _theme="red"
        lineColor="red"
        title={t('global.button.cancelOrder')}
        onPress={showPopupCancelOrder}
        styleWrapper={{
          width: '100%',
          alignSelf: 'center',
          marginBottom: 20,
        }}
      />

      <BottomSheetModal
        ref={tncRef}
        index={0}
        snapPoints={['100%', '100%']}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              // backgroundColor: theme.colors.navy,
              padding: 15,
              ...rowCenter,
            }}
            onPress={() => tncRef.current?.dismiss()}>
            <Image
              source={ic_arrow_left}
              style={[iconCustomSize(20), {tintColor: theme.colors.black}]}
            />
            <Text
              style={[
                h1,
                {
                  fontSize: FONT_SIZE_16,
                  color: theme.colors.black,
                  marginLeft: 10,
                },
              ]}>
              {/* {t('detail_order.overtime_confirmation_desc2')} */}
              {t('myBooking.cancel_term.title')}
            </Text>
          </TouchableOpacity>
          <BottomSheetScrollView style={{padding: 10}}>
            <View style={{paddingHorizontal: 5}}>

              <Text style={[h4, {marginVertical: 10}]}>
                {t('myBooking.cancel_term.desc')}
              </Text>

              {[...Array(3)].map((x, i) => (
                <View style={{flexDirection: 'row', width: '90%'}}>
                  <Text style={[h1, {marginRight: 10}]}>●</Text>

                  <Text style={[h1, {marginBottom: 10}]}>
                    {t(
                      `myBooking.cancel_term.cancel_desc_title${i + 1}` as any,
                    )}
                    <Text style={[h4, {lineHeight: 18}]}>
                      {t(
                        `myBooking.cancel_term.cancel_desc_desc${i + 1}` as any,
                      )}
                    </Text>
                  </Text>
                </View>
              ))}

              <Text style={[h4, {marginVertical: 10}]}>
                {t('myBooking.refund_process.title')}
              </Text>

              {[...Array(4)].map((x, i) => (
                <View style={{flexDirection: 'row', width: '90%'}}>
                  <Text style={[h1, {marginRight: 10}]}>●</Text>

                  <Text style={[h1, {marginBottom: 10}]}>
                    {t(
                      `myBooking.refund_process.refund_process_title${
                        i + 1
                      }` as any,
                    )}
                    <Text style={[h4, {lineHeight: 18}]}>
                      {t(
                        `myBooking.refund_process.refund_process_desc${
                          i + 1
                        }` as any,
                      )}
                    </Text>
                  </Text>
                </View>
              ))}

              <View
                style={[
                  rowCenter,
                  {
                    justifyContent: 'space-between',
                    marginTop: 20,
                    marginBottom: WINDOW_HEIGHT / 6,
                  },
                ]}>
                <Button
                  _theme="white"
                  onPress={() => {
                    setIsChecklist(false);
                    tncRef.current?.dismiss();
                  }}
                  title="Don't Agree"
                  styleWrapper={{
                    borderWidth: 1,
                    borderColor: theme.colors.navy,
                    borderRadius: 4,
                    width: WINDOW_WIDTH / 2.3,
                  }}
                />

                <Button
                  _theme="navy"
                  onPress={() => {
                    setIsChecklist(true);
                    tncRef.current?.dismiss();
                  }}
                  title="Agree"
                  styleWrapper={{
                    width: WINDOW_WIDTH / 2.3,
                  }}
                />
              </View>
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>

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
          <View style={styles.headerContainer}>
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
                setDescription('');
              } else {
                console.log('x = ', x);
                setReason(x);
                if (x !== 5) {
                  setDescription(
                    ITEMS.find(item => item.value === x)?.name || '-',
                  );
                } else {
                  setDescription('');
                }
              }
            }}
          />

          {Number(reason) === 5 && (
            <TextInput
              style={styles.textArea}
              placeholder={t('myBooking.cancel_reason.other_placeholder')}
              value={description}
              placeholderTextColor={theme.colors.grey5}
              onChangeText={setDescription}
            />
          )}

          <TouchableOpacity
            style={[rowCenter, {marginTop: 20}]}
            onPress={() => tncRef.current?.present()}>
            <Image
              source={isChecklist ? ic_blue_check : ic_uncheck}
              style={iconCustomSize(20)}
            />
            <Text style={[h4, {marginLeft: 4}]}>
              {t('myBooking.cancel_order_term')}{' '}
              <Text style={[h1]}>{t('myBooking.cancel_order_term_bold')}</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button
              _theme="navy"
              title={t('global.button.confirm')}
              styleWrapper={{marginTop: 20}}
              onPress={handleCancelTask}
              disabled={!isChecklist || !Boolean(description)}
              isLoading={isLoading}
            />
          </View>
        </View>
        <ModalSuccessRefundOrder
          visible={showModalSuccess}
          setVisible={setShowModalSuccess}
          onFinish={() => {
            dispatch(toggleBSheet(false));
            // navigation.goBack();
            dispatch(getOrders(2));
          }}
        />
      </BottomSheetModal>
    </>
  );
};

export default memo(SelectionCancelTask);

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
    textAlignVertical: 'top',
    color: theme.colors.black,
  },
});
