import appBar from 'components/AppBar/AppBar';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import PopupImage from 'components/PopupImage';
import React, {useCallback, useEffect} from 'react';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Clipboard} from '@react-native-clipboard/clipboard/dist/Clipboard';
import {currencyFormat} from 'utils/currencyFormat';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {h1, h2, h4, h5} from 'utils/styles';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {orderState} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ic_arrow_left_white,
  ic_arrow_right,
  ic_bca,
  ic_copy,
} from 'assets/icons';
import Button from 'components/Button';

type BankTransferScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProofTransfer'
>;

const ProofTransferScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<BankTransferScreenRouteProp>();
  const selectedPayment = route?.params?.selectedPayment;

  const dispatch = useAppDispatch();
  const {isSelectedLoading, selected} = useAppSelector(bookingState);
  const summaryOrder = useAppSelector(orderState).summaryOrder;
  // const paymentMethods = useAppSelector(appDataState).payments;
  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() =>
              navigation.navigate('MainTab', {screen: 'Booking'} as any)
            }>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('bank_transfer.bank_transfer')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    dispatch(
      getPayments({
        total_payment: calcTotalPayment()!,
      }),
    );
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTab', {screen: 'Booking'} as any);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // useEffect(() => {
  //   if (route.params.transaction_key) {
  //     dispatch(getOrderById(route.params.transaction_key));
  //   }
  //   dispatch(getMyAccountBank());
  // }, [route.params.transaction_key]);

  useFocusEffect(
    useCallback(() => {
      // if (route.params.transaction_key) {
      dispatch(getOrderById(route?.params?.transaction_key!));
      // }
      dispatch(getMyAccountBank());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params?.transaction_key]),
  );

  const methods = {
    handleFAQ: (index: number) => {
      showBSheet({
        content: (
          <BottomSheetScrollView
            contentContainerStyle={{
              width: '100%',
              flexGrow: 1,
              paddingHorizontal: '5%',
            }}>
            <Text style={[h1, {marginVertical: 16, fontSize: 18}]}>
              {t('instant_payment.payment_instruction')}
            </Text>
            {[
              ...Array(
                t(
                  `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}.${index}.step_length`,
                ),
              ).fill(''),
            ].map((x, i) => (
              <View
                key={i}
                style={[{marginVertical: 10, flexDirection: 'row'}]}>
                <Text style={h5}>{i + 1}. </Text>
                <Text style={h5}>
                  {t(
                    `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}.${index}.steps.${i}`,
                  )}
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>
        ),
      });
    },
    copyText: (text: string) => {
      Clipboard.setString(text);
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_copy_text'),
      });
    },
  };

  const calcTotalPayment = () => {
    let sum = 0;
    if (selected?.type === 'HALF') {
      sum = summaryOrder?.total_dp;
    } else if (selected?.type === 'FULL') {
      sum = selected?.total_amount_order;
    }

    return sum;
  };
  // const selectedPayment = paymentMethods?.find(
  //   x => x?.id === selectedPayment.payment_method_id,
  // );

  if (isSelectedLoading) return <Loading />;
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <AccountBank /> */}

        <Text style={[h1, {marginTop: 20}]}>
          {t('bank_transfer.make_payment')}
        </Text>

        <View style={[rowCenter, {marginTop: 10}]}>
          <Image
            source={ic_bca}
            style={iconCustomSize(30)}
            resizeMode={'contain'}
          />
          <Text style={[h5, {fontSize: 12, marginLeft: 10}]}>
            {t('bank_transfer.bca_transfer')}
          </Text>
        </View>

        <View
          style={[
            rowCenter,
            {
              justifyContent: 'space-between',
              backgroundColor: theme.colors.cloud,
              padding: 10,
            },
          ]}>
          <Text style={[h1]}>8650710089</Text>
          <TouchableOpacity onPress={() => methods.copyText('8650710089')}>
            <Image source={ic_copy} style={iconSize} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>

        <Text style={[h5, {fontSize: 12, marginTop: 10, marginBottom: 5}]}>
          {t('bank_transfer.account_name')}
        </Text>

        <View
          style={[
            rowCenter,
            {
              justifyContent: 'space-between',
              backgroundColor: theme.colors.cloud,
              padding: 10,
            },
          ]}>
          <Text style={[h1]}>KREATIF TRANSPORTASI GEMILANG PT</Text>
        </View>

        <View style={styles.wrapperFee}>
          <View style={[rowCenter, {justifyContent: 'space-between'}]}>
            <Text style={[h4]}>{t('bank_transfer.total_price')}</Text>
            <Text style={[h2]}>
              {currencyFormat(calcTotalPayment(), selected?.currency)}
            </Text>
          </View>

          <View
            style={[
              rowCenter,
              {justifyContent: 'space-between', marginTop: 10},
            ]}>
            <Text style={[h4]}>{t('bank_transfer.service_fee')}</Text>
            <Text style={[h2]}>
              {currencyFormat(selectedPayment?.vat, selected?.currency)}
            </Text>
          </View>
        </View>

        <View style={styles.lineHorizontal} />
        <Text style={[h1, {marginTop: 20, marginBottom: 10}]}>
          {t('bank_transfer.total_payment')}
        </Text>

        <View
          style={[
            {
              backgroundColor: theme.colors.cloud,
              padding: 10,
            },
          ]}>
          <Text style={[h2]}>
            {currencyFormat(
              calcTotalPayment() + selectedPayment?.vat,
              selected?.currency,
            )}
          </Text>
        </View>

        <View style={styles.lineHorizontal} />

        <Text style={[h1, {marginTop: 20}]}>
          {t('virtual_account.payment_Instruction')}
        </Text>

        {[
          ...Array(
            t(
              `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}_length`,
            ),
          ).fill(''),
        ].map((x, i) => (
          <TouchableOpacity
            style={[
              styles.HowToWrapper,
              rowCenter,
              {justifyContent: 'space-between'},
            ]}
            key={i.toString()}
            onPress={() => methods.handleFAQ(i)}>
            <Text style={h4}>
              {t(
                `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}.${i}.title`,
              )}
            </Text>
            <Image
              source={ic_arrow_right}
              style={iconCustomSize(10)}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ))}

        {/* <PopupImage
          value={
            selected?.disbursement_reconfirmation?.length > 0
              ? selected?.disbursement_reconfirmation[
                  selected?.disbursement_reconfirmation.length - 1
                ]?.reconfirmation_image
              : selected?.disbursement?.disbursement_confirmation_image!
          }
        /> */}

        {/* <Button
          _theme="navy"
          onPress={() => {
            navigation.navigate('MainTab', {screen: 'Booking'});
          }}
          title={t('myBooking.check_order')}
          styleWrapper={{
            marginTop: 26,
            borderWidth: 1,
            borderColor: theme.colors.black,
          }}
        /> */}

        {/* <Button
          _theme="white"
          onPress={async () => {
            try {
              const res: any = await dispatch(
                getOrderById(route.params.transaction_key!),
              );

              if (res?.payload?.order_status === 'CHECKOUT') {
                navigation.navigate('MainTab', {screen: 'Booking'} as any);
              } else if (res?.payload?.order_status === 'RECONFIRMATION') {
                navigation.navigate('UploadBankTransfer', route.params);
              } else if (res?.payload?.order_status === 'PAID') {
                navigation.navigate('InfoPaymentSuccessScreen');
              } else {
                navigation.navigate('MainTab', {screen: 'Booking'} as any);
              }
            } catch (error) {
              navigation.navigate('MainTab', {screen: 'Booking'} as any);
            }
            // if (selected?.order_status === 'RECONFIRMATION') {
            //   navigation.navigate('UploadBankTransfer', route.params);
            // }
            // if (selected?.order_status === 'CHECKOUT') {
            //   navigation.navigate('MainTab', {screen: 'Booking'});
            // }
          }}
          title={
            selected?.order_status === 'RECONFIRMATION'
              ? t('myBooking.reupload')
              : t('myBooking.check_order')
          }
          disabled={isSelectedLoading}
          styleWrapper={{
            marginTop: 26,
            borderWidth: 1,
            borderColor: theme.colors.black,
          }}
        /> */}
      </ScrollView>
    </View>
  );
};

export default hoc(
  ProofTransferScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  guardWrapper: {
    backgroundColor: theme.colors.cloud,
    padding: 17,
    marginTop: 23,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 20,
  },
  HowToWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  wrapperFee: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey6,
    marginTop: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    paddingBottom: 20,
  },
});
