import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import hoc from 'components/hoc';
import moment from 'moment';
import OrderDetailModalContent from 'components/OrderDetailModalContent/OrderDetailModalContent';
import QRCode from 'react-native-qrcode-svg';
import React, {useEffect, useState} from 'react';
import Timer from 'utils/timer';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {getVehiclesById} from 'redux/features/vehicles/vehiclesAPI';
import {h1, h2, h3, h4, h5} from 'utils/styles';
import {
  ic_arrow_left_white,
  ic_arrow_right,
  ic_bca,
  ic_bni,
  ic_bri,
  ic_gopay,
  ic_mandiri,
  ic_permata,
  ic_qris,
} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {orderState} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {
  BackHandler,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getOrderDisbursement} from 'redux/effects';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {appDataState} from 'redux/features/appData/appDataSlice';

// const TIMER = 299;

type ProfileScreenRouteProp = RouteProp<RootStackParamList, any>;

interface Disbursement {
  created_at: string;
  disbursement_confirmation_image: string;
  id: number;
  order_id: number;
  payment_method_id: number;
  qr_code: string;
  transaction_id: string;
  updated_at: string;
  vat: number;
}

const InstantPaymentScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<ProfileScreenRouteProp>();
  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector(bookingState).selected;
  const vehicle = useAppSelector(vehiclesState).vehicleById;
  const disbursements = useAppSelector(orderState).disbursements;
  const {minuteLeft, secondLeft} = Timer(bookingDetail?.created_at);
  const [detailDistbursment, setDetailDistbursment] = useState<Disbursement>();
  const paymentMethods = useAppSelector(appDataState).payments;
  // console.log('disbursements = ', disbursements);
  // const [seconds, setSeconds] = useState(TIMER);

  const getDetailDistbursment = async () => {
    try {
      const res = await getOrderDisbursement(disbursements?.transaction_key);
      setDetailDistbursment(res);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleIcon = (ic: string) => {
    switch (ic) {
      case 'BCA':
        return ic_bca;
      case 'BNI':
        return ic_bni;
      case 'BRI':
        return ic_bri;
      case 'Mandiri':
        return ic_mandiri;
      case 'Permata':
        return ic_permata;
      case 'Gopay':
        return ic_gopay;
      case 'QRIS':
        return ic_qris;
      default:
        break;
    }
  };

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
                  `instant_payment.${route.params?.selectedPayment.code.toLowerCase()}.${index}.step_length`,
                ),
              ).fill(''),
            ]?.map((x, i) => (
              <View
                key={i}
                style={[{marginVertical: 10, flexDirection: 'row'}]}>
                <Text style={h5}>{i + 1}. </Text>
                <Text style={h5}>
                  {t(
                    `instant_payment.${route.params?.selectedPayment.code.toLowerCase()}.${index}.steps.${i}`,
                  )}
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>
        ),
      });
    },
    handleOrderDetail: () => {
      showBSheet({
        content: <OrderDetailModalContent />,
      });
    },
  };

  // console.log('route.params?.selectedPayment.code = ', route.params?.selectedPayment.code)

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.navigate('MainTab', {screen: 'Booking'})}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {route.params?.selectedPayment.code}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    // dispatch(getPayments(bookingDetail?.total_payment!));
  }, [navigation]);

  useEffect(() => {
    getDetailDistbursment();
    return () => {};
  }, [disbursements]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTab', {screen: 'Booking'});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (route.params?.transaction_key) {
      dispatch(getOrderById(route.params.transaction_key));
    }
  }, [route.params?.transaction_key]);

  useEffect(() => {
    dispatch(
      getPayments({
        total_payment:
          bookingDetail?.type === 'HALF'
            ? Number(bookingDetail?.down_payment)
            : Number(bookingDetail?.total_amount_order),
      }),
    );
    return () => {};
  }, [bookingDetail]);

  useEffect(() => {
    if (bookingDetail?.order_detail?.vehicle_id) {
      dispatch(
        getVehiclesById({
          id: bookingDetail?.order_detail?.vehicle_id,
          support_driver: bookingDetail?.order_detail?.without_driver,
          start_trip:
            `${bookingDetail?.order_detail?.start_booking_date} ${bookingDetail?.order_detail?.end_booking_time}`
              ?.split(':')
              ?.slice(0, 2)
              ?.join(':'),
          end_trip:
            `${bookingDetail?.order_detail?.end_booking_date} ${bookingDetail?.order_detail?.end_booking_time}`
              ?.split(':')
              ?.slice(0, 2)
              ?.join(':'),
        }),
      );
    }
  }, [bookingDetail?.order_detail?.vehicle_id]);

  const selectedPayment = paymentMethods?.find(
    x => x?.id === bookingDetail?.disbursement?.payment_method_id,
  );

  // console.log('selectedPayment = ', selectedPayment);
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView>
        <View
          style={{
            padding: 16,
            backgroundColor: theme.colors.cloud,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={[h1]}>{t('bank_transfer.finish_before')}</Text>
            <Text style={[h4, {marginTop: 10, fontSize: 12}]}>
              {moment(bookingDetail?.expired_time).format('ddd, DD MMMM YYYY')}
            </Text>
          </View>
          <Text style={[h1, {color: theme.colors.blue}]}>
            {`${
              (minuteLeft > 9 ? minuteLeft.toString() : `0${minuteLeft}`) +
              ':' +
              (secondLeft > 9 ? secondLeft.toString() : `0${secondLeft}`)
            }`}
          </Text>
        </View>

        <View
          style={{
            margin: 16,
          }}>
          <TouchableOpacity
            onPress={methods.handleOrderDetail}
            style={[
              rowCenter,
              {
                justifyContent: 'space-between',
                backgroundColor: theme.colors.cloud,
                padding: 16,
              },
            ]}>
            <View>
              <Text style={[h1, {color: theme.colors.navy, fontSize: 12}]}>
                {t('Home.daily.title')}
              </Text>
              <Text style={[h5, {fontSize: 12}]}>
                {`${vehicle.brand_name} ${vehicle.name}`}
              </Text>
              <Text style={[h5, {fontSize: 12}]}>
                {moment(bookingDetail?.order_detail?.start_booking_date).format(
                  'DD MMMM',
                )}{' '}
                -{' '}
                {moment(bookingDetail?.order_detail?.end_booking_date).format(
                  'DD MMMM',
                )}{' '}
                {bookingDetail?.order_detail?.start_booking_time}
              </Text>
            </View>
            <Image
              source={ic_arrow_right}
              style={iconCustomSize(10)}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View style={styles.lineHorizontal} />

          <Text style={[h1, {marginTop: 20}]}>
            {t('bank_transfer.make_payment')}
          </Text>

          <View style={[rowCenter, {marginTop: 10}]}>
            <Image
              source={handleIcon(route.params?.selectedPayment.code)}
              style={iconCustomSize(30)}
            />
            <Text style={[h5, {fontSize: 12, marginLeft: 10}]}>
              {route.params?.selectedPayment.code}
            </Text>
          </View>

          <View style={styles.wrapperFee}>
            <View style={[rowCenter, {justifyContent: 'space-between'}]}>
              <Text style={[h4]}>{t('bank_transfer.total_price')}</Text>
              <Text style={[h2]}>
                {currencyFormat(
                  bookingDetail?.type === 'HALF'
                    ? bookingDetail?.down_payment || 0
                    : bookingDetail?.total_amount_order || 0,
                  bookingDetail?.currency,
                )}
              </Text>
            </View>

            <View
              style={[
                rowCenter,
                {justifyContent: 'space-between', marginTop: 10},
              ]}>
              <Text style={[h4]}>{t('bank_transfer.service_fee')}</Text>
              <Text style={[h2]}>
                {currencyFormat(selectedPayment?.vat, bookingDetail?.currency)}
              </Text>
            </View>
          </View>

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
                bookingDetail?.type === 'HALF'
                  ? (bookingDetail?.down_payment || 0) +
                      (selectedPayment?.vat || 0)
                  : bookingDetail?.total_payment,
                bookingDetail?.currency,
              )}
            </Text>
          </View>
          <View style={styles.lineHorizontal} />

          <View
            style={[
              rowCenter,
              {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.cloud,
                padding: 10,
              },
            ]}>
            {/* <Image
            source={ic_qr}
            style={iconCustomSize(140)}
            resizeMode={'contain'}
          /> */}
            <QRCode
              value={detailDistbursment?.qr_code}
              logo={{uri: detailDistbursment?.qr_code}}
              logoSize={300}
              size={300}
              logoBackgroundColor="transparent"
            />
          </View>

          {route.params?.selectedPayment.code?.toLowerCase() === 'gopay' && (
            <Button
              _theme="navy"
              onPress={() => Linking.openURL(disbursements?.deep_link!)}
              title={t('virtual_account.open_app')}
              styleWrapper={{
                marginTop: 26,
              }}
            />
          )}

          <Text style={[h1, {marginTop: 20}]}>
            {t('virtual_account.payment_Instruction')}
          </Text>

          {[
            ...Array(
              t(
                `instant_payment.${route.params?.selectedPayment.code.toLowerCase()}_length`,
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
                  `instant_payment.${route.params?.selectedPayment.code.toLowerCase()}.${i}.title`,
                )}
              </Text>
              <Image
                source={ic_arrow_right}
                style={iconCustomSize(10)}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          ))}

          {/* <Button
            _theme="navy"
            onPress={() => navigation.navigate('MainTab', {screen: 'Booking'})}
            title={t('myBooking.back_to_order')}
            styleWrapper={{
              marginTop: 26,
            }}
          /> */}
          {/* <Button
            _theme="white"
            onPress={async () => {
              try {
                const res: any = await dispatch(
                  getOrderById(route.params?.transaction_key!),
                );
                // console.log('res = ', res);
                if (res?.payload?.order_status === 'PENDING') {
                  navigation.navigate('MainTab', {screen: 'Booking'});
                } else if (res?.payload?.order_status === 'PAID') {
                  navigation.navigate('InfoPaymentSuccessScreen');
                } else {
                  navigation.navigate('MainTab', {screen: 'Booking'});
                }
              } catch (error) {
                navigation.navigate('MainTab', {screen: 'Booking'});
              }
            }}
            title={t('myBooking.check_order')}
            styleWrapper={{
              marginTop: 26,
              borderWidth: 1,
              borderColor: theme.colors.black,
            }}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default hoc(
  InstantPaymentScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
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
