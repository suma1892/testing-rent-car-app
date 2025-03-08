import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import Clipboard from '@react-native-clipboard/clipboard';
import hoc from 'components/hoc';
import OrderDetailModalContent from 'components/OrderDetailModalContent/OrderDetailModalContent';
import React, {useEffect, useState} from 'react';
import Timer from 'utils/timer';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {getVehiclesById} from 'redux/features/vehicles/vehiclesAPI';
import {h1, h2, h4, h5} from 'utils/styles';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
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
  ic_bni,
  ic_bri,
  ic_cimb,
  ic_copy,
  ic_gopay,
  ic_mandiri,
  ic_permata,
} from 'assets/icons';
import {format} from 'date-fns';
import i18n from 'assets/lang/i18n';
import {enUS, id, zhCN} from 'date-fns/locale';
import OrderDetailModalContentSg from 'components/OrderDetailModalContent/OrderDetailModalContentSg';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'VirtualAccount'>;

const VirtualAccountScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector(bookingState).selected;
  const route = useRoute<ProfileScreenRouteProp>();
  const vehicle = useAppSelector(vehiclesState).vehicleById;
  const [seconds, setSeconds] = useState(0);
  const {minuteLeft, secondLeft} = Timer(bookingDetail?.created_at);
  const paymentMethods = useAppSelector(appDataState).payments;

  // console.log('bookingDetail = ', bookingDetail)

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
              {t('bank_transfer.payment_method')}
            </Text>
            {[
              ...Array(
                t(
                  `virtual_account.${route.params?.selectedPayment.code.toLowerCase()}.${index}.step_length`,
                ),
              ).fill(''),
            ].map((x, i) => (
              <View
                key={i}
                style={[{marginVertical: 10, flexDirection: 'row'}]}>
                <Text style={h5}>{i + 1}. </Text>
                <Text style={h5}>
                  {t(
                    `virtual_account.${route.params?.selectedPayment.code.toLowerCase()}.${index}.steps.${i}`,
                    {
                      value: methods.showVa(),
                    },
                  )}
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>
        ),
      });
    },
    secondsToHms: (d: any) => {
      d = Number(d);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);

      const mDisplay = m > 0 ? m : '0';
      const sDisplay = s > 0 ? s : ('0' as any);
      return '0' + mDisplay + ':' + (sDisplay > 9 ? sDisplay : '0' + sDisplay);
    },
    handleOrderDetail: () => {
      showBSheet({
        content:
          bookingDetail?.order_type_id === 7 ||
          bookingDetail?.order_type_id === 2 ? (
            <OrderDetailModalContentSg />
          ) : (
            <OrderDetailModalContent />
          ),
      });
    },
    copyText: () => {
      Clipboard.setString(methods.showVa() as any);
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_copy_text'),
      });
    },
    getPaymentLabel: () => {
      if (bookingDetail?.disbursement?.payment?.code === 'Permata') {
        return bookingDetail?.disbursement?.permata_va_number;
      }

      return bookingDetail?.disbursement?.va_number;
    },
    handleIcon: (ic: string) => {
      switch (ic) {
        case 'bca':
          return ic_bca;
        case 'bni':
          return ic_bni;
        case 'bri':
          return ic_bri;
        case 'mandiri':
          return ic_mandiri;
        case 'permata':
          return ic_permata;
        case 'gopay':
          return ic_gopay;
        case 'cimb niaga':
          return ic_cimb;
        default:
          break;
      }
    },
    showVa: () => {
      // bookingDetail?.disbursement?.payment?.code
      if (bookingDetail?.disbursement?.bill_key)
        return bookingDetail?.disbursement?.bill_key;
      if (bookingDetail?.disbursement?.permata_va_number)
        return bookingDetail?.disbursement?.permata_va_number;
      return bookingDetail?.disbursement?.va_number || '';
    },
  };

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  });

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
              {route.params?.selectedPayment.code} Virtual Account
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    dispatch(
      getPayments({
        total_payment:
          bookingDetail?.type === 'HALF'
            ? Number(bookingDetail?.down_payment || 0)
            : Number(bookingDetail?.total_amount_order || 0),
      }),
    );
  }, [navigation]);

  useEffect(() => {
    if (route.params.transaction_key) {
      dispatch(getOrderById(route.params.transaction_key));
    }
  }, [route.params.transaction_key]);

  useEffect(() => {
    if (bookingDetail?.order_detail?.vehicle_id) {
      dispatch(
        getVehiclesById({
          id: bookingDetail?.order_detail?.vehicle_id,
          support_driver: bookingDetail?.order_detail?.without_driver,
          // start_trip: `${bookingDetail?.order_detail?.start_booking_date} ${bookingDetail?.order_detail?.end_booking_time}`,
          // end_trip: `${bookingDetail?.order_detail?.end_booking_date} ${bookingDetail?.order_detail?.end_booking_time}`,
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

  const selectedPayment = paymentMethods?.find(
    x => x?.id === bookingDetail?.disbursement?.payment_method_id,
  );

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
              {bookingDetail?.expired_time &&
                format(
                  new Date(bookingDetail?.expired_time),
                  'eee, dd MMMM yyyy: HH:mm',
                  {
                    locale:
                      i18n.language === 'id-ID'
                        ? id
                        : i18n.language?.includes('cn')
                        ? zhCN
                        : enUS,
                  },
                )}
            </Text>
          </View>
          <Text style={[h1, {color: theme.colors.blue}]}>
            {/* {methods.secondsToHms(seconds)} */}
            {/* {minutes}:{seconds2 < 10 ? `0${seconds2}` : seconds2} */}
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
                {bookingDetail?.order_type_id === 7 ||
                bookingDetail?.order_type_id === 2
                  ? t('Home.airportTransfer.title')
                  : t('Home.daily.title')}
              </Text>
              <Text style={[h5, {fontSize: 12}]}>
                {/* {`${vehicle.brand_name} ${vehicle.name}`} */}
                {`${bookingDetail?.order_detail?.vehicle?.name}`}
              </Text>
              <Text style={[h5, {fontSize: 12}]}>
                {bookingDetail?.order_detail?.start_booking_date &&
                  format(
                    new Date(bookingDetail?.order_detail?.start_booking_date),
                    'dd MMMM',
                    {
                      locale:
                        i18n.language === 'id-ID'
                          ? id
                          : i18n.language?.includes('cn')
                          ? zhCN
                          : enUS,
                    },
                  )}{' '}
                -{' '}
                {bookingDetail?.order_detail?.end_booking_date &&
                  format(
                    new Date(bookingDetail?.order_detail?.end_booking_date),
                    'dd MMMM',
                    {
                      locale:
                        i18n.language === 'id-ID'
                          ? id
                          : i18n.language?.includes('cn')
                          ? zhCN
                          : enUS,
                    },
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

          <View>
            <View style={[rowCenter, {marginTop: 10}]}>
              <Image
                source={methods.handleIcon(
                  route.params?.selectedPayment.code?.toLowerCase(),
                )}
                style={iconCustomSize(30)}
              />
              <Text style={[h5, {fontSize: 12, marginLeft: 10}]}>
                {bookingDetail?.disbursement?.payment?.code}{' '}
                {t('virtual_account.virtual_account')}
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
              <Text style={[h1]}>{methods.showVa()}</Text>
              <TouchableOpacity onPress={methods.copyText} style={[rowCenter]}>
                <Image
                  source={ic_copy}
                  style={iconCustomSize(12)}
                  resizeMode={'contain'}
                />
                <Text style={[h5, {fontSize: 11, marginLeft: 5}]}>
                  {t('virtual_account.copy')}
                </Text>
              </TouchableOpacity>
            </View>
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

          {/* <View style={styles.lineHorizontal} /> */}
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
                  ? Number(bookingDetail?.down_payment || 0) +
                      Number(selectedPayment?.vat || 0)
                  : bookingDetail?.total_payment,
                bookingDetail?.currency,
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
                `virtual_account.${route.params?.selectedPayment.code.toLowerCase()}_length`,
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
                  `virtual_account.${route.params?.selectedPayment.code.toLowerCase()}.${i}.title`,
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
            _theme="white"
            onPress={async () => {
              try {
                const res: any = await dispatch(
                  getOrderById(route.params.transaction_key!),
                );

                if (res?.payload?.order_status === 'PENDING') {
                  navigation.navigate('MainTab', {screen: 'Booking'});
                } else if (res?.payload?.order_status === 'PAID') {
                  navigation.navigate('InfoPaymentSuccessScreen');
                } else {
                  navigation.navigate('MainTab', {screen: 'Booking'});
                }
              } catch (error) {}
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
  VirtualAccountScreen,
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
  wrapperFee: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey6,
    marginTop: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    paddingBottom: 20,
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
});
