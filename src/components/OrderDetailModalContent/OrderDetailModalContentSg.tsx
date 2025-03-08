import React, {useEffect, useState} from 'react';
import {colors, h1} from 'utils/styles';
import {
  getOrderStatus,
  getPaymentLabel,
  getStartRentalDate,
  getTimezoneOffset,
  idrFormatter,
} from 'utils/functions';
import {ic_pinpoin} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_car_2} from 'assets/images';
import {isFuture} from 'date-fns';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import i18n from 'assets/lang/i18n';
import {currencyFormat} from 'utils/currencyFormat';
import i18next from 'i18next';
import { getIndonesianTimeZone, getIndonesianTimeZoneName } from 'utils';

const OrderDetailModalContentSg: React.FC = () => {
  const {t} = useTranslation();
  const bookingDetail = useAppSelector(state => state.myBooking);
  const garages = useAppSelector(state => state.garages.data);
  const vehicle = useAppSelector(state => state.vehicles).vehicleById;

  const {selected} = bookingDetail;

  const [orderState, setOrderState] = useState<string>('');

  useEffect(() => {
    setOrderState(selected?.order_status as any);

    if (
      (selected?.order_status?.toLowerCase() == 'pending' &&
        !isFuture(new Date(selected?.expired_time))) ||
      (selected?.order_status?.toLowerCase() == 'reconfirmation' &&
        !isFuture(new Date(selected?.expired_time)))
    ) {
      setOrderState('FAILED');
    }
  }, [selected?.order_status, selected?.expired_time]);

  return (
    <View style={{paddingHorizontal: '5%'}}>
      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('detail_order.order_no')}</Text>
          <Text style={styles.boldText}>{selected?.order_key}</Text>
        </View>

        {/* <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.paymentMethod')}</Text>
          <Text style={styles.boldText}>
            {getPaymentLabel(selected?.disbursement)}
          </Text>
        </View> */}
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.totalPrice')}</Text>
          <Text style={styles.boldText}>
            {currencyFormat(
              selected?.type === 'HALF'
                ? selected?.down_payment
                : selected?.total_payment,
              selected?.currency,
            )}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.order_date')}</Text>
          <Text style={styles.boldText}>
            {getStartRentalDate({
              withDay: true,
              startBookingDate: selected?.created_at,
              dateFormat: 'd MMM yyyy',
            })}
          </Text>
        </View>

        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('virtual_account.status')}</Text>
          <Text style={styles.boldText}>
            {getOrderStatus({
              _order_status: orderState,
              lang: i18n.language,
            })}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.paymentMethod')}</Text>
          <Text style={styles.boldText}>
            {/* {getPaymentLabel(selected?.disbursement)} */}
            {selected?.disbursement?.payment?.code}{' '}
            {/* {selected?.disbursement?.payment?.method}{' '} */}
            {selected?.disbursement?.bill_key}
          </Text>
        </View>

        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.car')}</Text>
          <Text style={styles.boldText}>
            {/* {vehicle?.brand_name
              ? `${vehicle?.brand_name}${
                  vehicle?.name ? ` ${vehicle?.name}` : ''
                }`
              : '-'} */}
            {`${bookingDetail?.selected?.order_detail?.vehicle?.name}`}
          </Text>
        </View>
      </View>
      <View style={styles.dashedLine} />

      <Text style={[h1, {fontSize: 14}]}>{t('myBooking.travel_detail')}</Text>

      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.delivery_date')}</Text>
          <Text style={styles.boldText}>
            {getStartRentalDate({
              withDay: true,
              startBookingDate: selected?.order_detail?.start_booking_date,
              dateFormat: 'd MMM yyyy',
            })}
          </Text>
        </View>

        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.delivery_time')}</Text>
          <Text style={styles.boldText}>
            {selected?.order_detail?.start_booking_time}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('detail_order.summary.timezone')}</Text>
          <Text style={styles.boldText}>
            {/* {getTimezoneOffset(selected?.order_detail?.loc_time_id)} */}
            {/* {getIndonesianTimeZone(selected?.order_detail?.loc_time_id)} */} SGT
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.pickup')}</Text>
          <Text style={styles.boldText}>
            {selected?.order_detail?.rental_delivery_location}
          </Text>
        </View>

        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>{t('myBooking.dropoff')}</Text>
          <Text style={styles.boldText}>
            {selected?.order_detail?.rental_return_location}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>
            {t('detail_order.tripDetail.location_details')}
          </Text>
          <Text style={styles.boldText}>
            {selected?.order_detail?.rental_delivery_location_detail}
          </Text>
        </View>

        <View style={{flexBasis: '50%'}}>
          <Text style={styles.text}>
            {t('detail_order.tripDetail.location_details')}
          </Text>
          <Text style={styles.boldText}>
            {selected?.order_detail?.rental_return_location_detail}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailModalContentSg;

const styles = StyleSheet.create({
  descriptionContainer: {
    // padding: '5%',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 12,
    color: '#000000',
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 5,
  },
  dashedLine: {
    borderColor: colors.gray700,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 20,
  },
  solidLine: {
    borderColor: colors.gray700,
    borderWidth: 0.5,
  },
  roundedImage: {
    borderRadius: 100,
    width: 48,
    height: 48,
    backgroundColor: 'red',
    overflow: 'hidden',
    marginRight: 10,
  },
  imgCar: {
    width: 48,
    height: 48,
  },
});
