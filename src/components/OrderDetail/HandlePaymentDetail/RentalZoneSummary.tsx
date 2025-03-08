import moment from 'moment';
import React, {memo} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h4} from 'utils/styles';
import {idrFormatter} from 'utils/functions';
import {OrderBookingZone} from 'types/global.types';
import {orderState} from 'redux/features/order/orderSlice';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {currencyFormat} from 'utils/currencyFormat';
import i18n from 'assets/lang/i18n';

const RentalZoneSummary = () => {
  const {t} = useTranslation();
  const {formDaily} = useAppSelector(appDataState);
  const summaryOrder = useAppSelector(orderState).summaryOrder;

  function getNumber(num: string = ''): any {
    return num?.match(/\d+/g)!?.join('');
  }

  const getZoneLabelPerDay = (data?: OrderBookingZone) => {
    if (!data) return '';

    const zone = [
      data?.detail_driving_location,
      data?.detail_drop_off_zone_location,
      data?.detail_pickup_location,
    ];

    const zoneLabel = zone
      .sort((a, b) => getNumber(a) - getNumber(b))
      ?.map(x => x)
      ?.join(', ');

    return zoneLabel.trim();
  };

  const getOvertimeDurationLabel = (data?: OrderBookingZone) => {
    if (!data) return '';

    const overtime = data?.overtime_duration
      ? `(${t('detail_order.summary.overtime')} - ${data?.overtime_duration} ${
          data?.overtime_duration > 1
            ? t('carDetail.hours')
            : t('carDetail.hour')
        })`
      : '';

    return overtime;
  };

  const getRentalEndTime = (endTime?: string, overtimeDuration?: number) => {
    if (!endTime) return '-';

    if (endTime && !overtimeDuration) {
      return moment(endTime, 'HH:mm').format(
        i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A',
      );
    }

    if (endTime && overtimeDuration) {
      return moment(endTime, 'HH:mm')
        .add(overtimeDuration, 'hours')
        .format(i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A');
    }

    return '-';
  };

  return (
    <>
      <View style={[styles.lineHorizontal, {width: '100%'}]} />
      <Text style={[h1, {marginTop: 20}]}>
        {t('detail_order.rentalZone.rentalArea')}
      </Text>
      {Array.from({length: Number(formDaily?.duration)}, (_, i) => (
        <View
          style={[rowCenter, styles.summaryContainer]}
          key={`rental_summary_${i}`}>
          <View
            style={{
              flexDirection: 'row',
              width: WINDOW_WIDTH / 1.8,
            }}>
            <Text style={[h4, {marginRight: 10, fontSize: 11}]}>
              {t('detail_order.rentalZone.day', {
                value: i + 1,
              })}{' '}
              :
            </Text>

            <View>
              <Text style={[h1, {fontSize: 12}]}>
                {t('detail_order.area')} :
              </Text>
              <Text style={[h4, {marginBottom: 5, fontSize: 12}]}>
                {getZoneLabelPerDay(formDaily.order_booking_zone?.[i]) || '-'}{' '}
                <Text style={[h1, {fontSize: 12}]}>
                  {getOvertimeDurationLabel(formDaily.order_booking_zone?.[i])}
                </Text>
              </Text>

              <Text style={[h1, {fontSize: 12}]}>
                {t('detail_order.summary.endTime')} :
              </Text>
              <Text style={[h4, {marginBottom: 5, fontSize: 12}]}>
                {getRentalEndTime(
                  summaryOrder.order_zone_price?.[i]?.booking_end_time,
                  // summaryOrder.order_zone_price?.[i]?.overtime_duration,
                )}
              </Text>
            </View>
          </View>
          <Text style={[h4, {fontSize: 12}]}>
            {currencyFormat(
              (summaryOrder.order_zone_price?.[i]?.total_price || 0) +
                (summaryOrder.order_zone_price?.[i]
                  ?.driver_stay_overnight_price || 0),
            )}
          </Text>
        </View>
      ))}
    </>
  );
};

export default memo(RentalZoneSummary);

const styles = StyleSheet.create({
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
  summaryContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 15,
  },
});
