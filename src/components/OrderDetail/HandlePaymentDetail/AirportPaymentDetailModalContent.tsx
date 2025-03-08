import moment from 'moment';
import React, {useMemo} from 'react';
import RowDetail from './RowDetail';
import {airportVehiclesState} from 'redux/features/airportVehicles/airportVehiclesSlice';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {getStartRentalDate} from 'utils/functions';
import {h1} from 'utils/styles';
import {orderState} from 'redux/features/order/orderSlice';
import {StyleSheet, Text, View} from 'react-native';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';

const AirportPaymentDetailModalContent = ({form}: {form: Form}) => {
  const {t} = useTranslation();

  const summaryOrder = useAppSelector(orderState).summaryOrder;
  const airportVehicleById =
    useAppSelector(airportVehiclesState).airportVehicleById;
  const {formAirportTransfer} = useAppSelector(appDataState);

  const max_passenger = airportVehicleById.max_passenger;

  const name = useMemo(() => {
    return airportVehicleById?.category || '-';
  }, [airportVehicleById]);

  const totalDiscount = useMemo(() => {
    return (
      summaryOrder?.order_voucher?.reduce(
        (total, voucher) => total + voucher.discount_price,
        0,
      ) || 0
    );
  }, [summaryOrder]);

  const currency =
    formAirportTransfer?.pickup_location?.location?.currency || '';

  return (
    <View style={styles.container}>
      <Text style={[h1, styles.title]}>{t('detail_order.summary.title')}</Text>
      <BottomSheetScrollView>
        <RowDetail
          title={name}
          titleStyle={h1}
          description={`${max_passenger} ${t(
            'detail_order.summary.passanger',
          )}`}
        />
        <RowDetail
          title={`${t('detail_order.summary.startDate')}`}
          description={getStartRentalDate({
            withDay: false,
            startBookingDate: formAirportTransfer?.pickup_date,
          })}
        />
        <RowDetail
          title={`${t('detail_order.summary.startTime')}`}
          description={moment(formAirportTransfer?.pickup_time, 'HH:mm').format(
            i18next.language?.includes('cn') ? 'HH:mm' : 'hh:mm A',
          )}
        />
        <RowDetail
          title={`${t('detail_order.summary.timezone')}`}
          // description={formAirportTransfer?.pickup_location?.time_zone || '-'}
          description={getIndonesianTimeZoneName({
            lang: i18next.language as any,
            timezone:
              formAirportTransfer?.pickup_location?.time_zone || ('-' as any),
          })}
        />
        <RowDetail
          title={`${t('detail_order.summary.flight_number')}`}
          description={form.flight_number || '-'}
        />

        <View style={[styles.lineHorizontal, styles.fullWidth]} />
        <Text style={[h1, styles.sectionTitle]}>
          {t('detail_order.summary.rentalFee')}
        </Text>

        <RowDetail
          title={`${t('detail_order.summary.price')}`}
          description={`${currencyFormat(
            (summaryOrder?.booking_price || 0) +
              (summaryOrder?.promo_disc || 0),
            currency,
          )} / 1 ${t('detail_order.summary.day')}`}
        />

        <View style={[styles.lineHorizontal, styles.fullWidth]} />
        <Text style={[h1, styles.sectionTitle]}>
          {t('detail_order.summary.otherFee')}
        </Text>

        <RowDetail
          title={`${t('detail_order.summary.serviceFee')}`}
          description={currencyFormat(summaryOrder?.service_fee, currency)}
        />
        <RowDetail
          title={`${t('detail_order.summary.insuranceFee')}`}
          description={currencyFormat(summaryOrder?.insurance_fee, currency)}
        />
        {totalDiscount > 0 && (
          <RowDetail
            title={`${t('detail_order.summary.voucher_discount')}`}
            description={`-${currencyFormat(totalDiscount, currency)}`}
          />
        )}
        {summaryOrder?.one_day_order_charge > 0 && (
          <RowDetail
            title={`${t('detail_order.summary.one_day_charge')}`}
            description={currencyFormat(
              summaryOrder?.one_day_order_charge,
              currency,
            )}
          />
        )}
        {summaryOrder?.promo_disc > 0 && summaryOrder?.promo_name && (
          <RowDetail
            title={summaryOrder?.promo_name}
            description={`-${currencyFormat(
              summaryOrder?.promo_disc,
              currency,
            )}`}
          />
        )}
        {summaryOrder?.outside_operational_charge > 0 && (
          <RowDetail
            title={`${t('detail_order.summary.outside_price')}`}
            description={currencyFormat(
              summaryOrder?.outside_operational_charge,
              currency,
            )}
          />
        )}

        <View style={[styles.lineHorizontal, styles.fullWidth]} />
        <RowDetail
          title={
            form?.type === 'HALF'
              ? 'Total'
              : `${t('detail_order.summary.totalPayment')}`
          }
          titleStyle={styles.totalTitle}
          description={currencyFormat(
            (form?.type === 'HALF'
              ? summaryOrder?.sub_total
              : summaryOrder?.total_payment) || 0,
            currency,
          )}
          descriptionStyle={styles.totalDescription}
        />
        {form?.type === 'HALF' && (
          <RowDetail
            title={`${t('detail_order.summary.paymentDP', {
              value: summaryOrder?.formula_percentage.value,
            })}`}
            titleStyle={styles.totalTitle}
            description={currencyFormat(summaryOrder?.total_dp, currency)}
            descriptionStyle={styles.totalDescription}
          />
        )}
        <View style={styles.bottomSpace} />
      </BottomSheetScrollView>
    </View>
  );
};

export default AirportPaymentDetailModalContent;

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'flex-start', width: '95%'},
  title: {fontSize: 20},
  sectionTitle: {marginTop: 20},
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
  fullWidth: {width: '100%'},
  totalTitle: {
    color: theme.colors.navy,
    fontSize: 15,
    fontWeight: '700',
  },
  totalDescription: {
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpace: {marginBottom: 150},
});
