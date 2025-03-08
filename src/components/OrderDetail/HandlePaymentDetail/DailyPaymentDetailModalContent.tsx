import moment from 'moment';
import React, {useMemo} from 'react';
import RentalZoneSummary from './RentalZoneSummary';
import RowDetail from './RowDetail';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {enUS, id, zhCN} from 'date-fns/locale';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {getStartRentalDate} from 'utils/functions';
import {h1} from 'utils/styles';
import {orderState} from 'redux/features/order/orderSlice';
import {StyleSheet, Text, View} from 'react-native';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {format, addHours, parse, differenceInCalendarDays} from 'date-fns';

const PaymentDetailModalContent = ({form}: {form: Form}) => {
  const {t, i18n} = useTranslation();

  const {vehicleById: vehicle} = useAppSelector(vehiclesState);
  const {summaryOrder} = useAppSelector(orderState);
  const {formDaily} = useAppSelector(appDataState);

  const {max_passanger = 0, brand_name, name: vehicleName} = vehicle || {};
  const vehicleNameFormatted = brand_name
    ? `${brand_name}${vehicleName ? ` ${vehicleName}` : ''}`
    : '-';

  const parsedStartDate = useMemo(
    () => parse(formDaily?.start_booking_date, 'yyyy-MM-dd', new Date()),
    [formDaily?.start_booking_date],
  );
  const parsedEndDate = useMemo(
    () => parse(formDaily?.end_booking_date, 'yyyy-MM-dd', new Date()),
    [formDaily?.end_booking_date],
  );

  const dayDifference = useMemo(
    () => differenceInCalendarDays(parsedEndDate, parsedStartDate),
    [parsedEndDate, parsedStartDate],
  );

  const totalDiscount = useMemo(
    () =>
      summaryOrder?.order_voucher?.reduce(
        (total: number, voucher: {discount_price: number}) =>
          total + voucher.discount_price,
        0,
      ) || 0,
    [summaryOrder?.order_voucher],
  );

  const rentalEndDate = useMemo(() => {
    if (formDaily?.with_driver) {
      const lastEndTime =
        summaryOrder?.order_zone_price?.[formDaily?.duration - 1]
          ?.booking_end_time;

      let result = format(
        new Date(formDaily?.start_booking_date),
        'd MMMM yyyy',
        {
          // locale: i18n.language.includes('id') ? id : enUS,
          locale:
            i18n.language === 'id-ID'
              ? id
              : i18n.language?.includes('cn')
              ? zhCN
              : enUS,
        },
      );

      if (lastEndTime) {
        const endBookingDateParsed = parse(
          `${formDaily?.end_booking_date} ${lastEndTime}`,
          'yyyy-MM-dd HH:mm',
          new Date(),
        );

        const finalEndTime = format(
          addHours(
            endBookingDateParsed,
            summaryOrder?.order_zone_price?.[formDaily?.duration - 1]
              ?.overtime_duration || 0,
          ),
          'hh:mm',
        );

        if (finalEndTime === '12:00') {
          const initialEndTime = new Date(
            `${formDaily?.end_booking_date} ${formDaily?.end_booking_time}`,
          );

          result = format(initialEndTime, 'd MMMM yyyy', {
            // locale: i18n.language.includes('id') ? id : enUS,
            locale:
              i18n.language === 'id-ID'
                ? id
                : i18n.language?.includes('cn')
                ? zhCN
                : enUS,
          });
        } else {
          result = format(
            addHours(
              endBookingDateParsed,
              summaryOrder?.order_zone_price?.[formDaily?.duration - 1]
                ?.overtime_duration || 0,
            ),
            'd MMMM yyyy',
            {
              // locale: i18n.language.includes('id') ? id : enUS,
              locale:
                i18n.language === 'id-ID'
                  ? id
                  : i18n.language?.includes('cn')
                  ? zhCN
                  : enUS,
            },
          );
        }
      }

      return result;
    }

    const initialEndTime = new Date(
      `${formDaily?.end_booking_date} ${formDaily?.end_booking_time}`,
    );

    return format(initialEndTime, 'd MMMM yyyy', {
      // locale: i18n.language.includes('id') ? id : enUS,
      locale:
        i18n.language === 'id-ID'
          ? id
          : i18n.language?.includes('cn')
          ? zhCN
          : enUS,
    });
  }, [
    formDaily?.end_booking_date,
    formDaily?.end_booking_time,
    summaryOrder?.over_time_hour,
    i18n.language,
  ]);

  const overtimePrice = useMemo(() => {
    const result = formDaily?.with_driver
      ? summaryOrder?.order_zone_price?.reduce(
          (acc, zone) => acc + zone.overtime_price,
          0,
        ) || 0
      : summaryOrder?.over_time_price || 0;

    return currencyFormat(result, formDaily?.selected_location?.currency);
  }, [formDaily?.with_driver, summaryOrder]);

  return (
    <View style={styles.container}>
      <Text style={[styles.textTitle, {fontSize: 18}]}>
        {t('detail_order.summary.title')}
      </Text>
      <BottomSheetScrollView>
        <RowDetail
          title={vehicleNameFormatted}
          titleStyle={h1}
          description={`${max_passanger} ${t(
            'detail_order.summary.passanger',
          )}`}
        />
        {!formDaily?.with_driver && (
          <>
            <RowDetail
              title={`${t('detail_order.tripDetail.deliveryLocation')}`}
              description={form.taking_location?.name || '-'}
            />
            <RowDetail
              title={`${t('detail_order.tripDetail.returnLocation')}`}
              description={form.return_location?.name || '-'}
            />
            <View style={styles.lineHorizontal} />
          </>
        )}
        <RowDetail
          title={`${t('detail_order.summary.startDate')}`}
          description={getStartRentalDate({
            withDay: false,
            startBookingDate: formDaily?.start_booking_date,
          })}
        />
        <RowDetail
          title={`${t('detail_order.summary.startTime')}`}
          description={moment(formDaily?.start_booking_time, 'HH:mm').format(
            i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A',
          )}
        />
        <RowDetail
          title={`${t('detail_order.summary.endDate')}`}
          description={rentalEndDate}
        />
        {!formDaily?.with_driver && (
          <RowDetail
            title={`${t('detail_order.summary.endTime')}`}
            description={moment(formDaily?.end_booking_time, 'HH:mm').format(
              i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A',
            )}
          />
        )}
        <RowDetail
          title={`${t('detail_order.summary.timezone')}`}
          // description={`${formDaily?.selected_location?.time_zone}`}
          description={getIndonesianTimeZoneName({
            lang: i18n.language as any,
            timezone: formDaily?.selected_location?.time_zone as any,
          })}
        />
        {!formDaily?.with_driver && (
          <RowDetail
            title={t('detail_order.overtime') as string}
            description={
              summaryOrder?.over_time_hour > 0
                ? `${
                    summaryOrder?.over_time_hour > 1
                      ? `${summaryOrder?.over_time_hour} ${t(
                          'carDetail.hours',
                        )}`
                      : `${summaryOrder?.over_time_hour} ${t('carDetail.hour')}`
                  }`
                : t('carDetail.no_overtime')
            }
          />
        )}
        {formDaily?.with_driver && <RentalZoneSummary />}
        <View style={styles.lineHorizontal} />
        <Text style={[styles.textTitle, {marginTop: 15}]}>
          {t('detail_order.summary.rentalFee')}
        </Text>
        <RowDetail
          title={`${t('detail_order.summary.price')}`}
          description={`${currencyFormat(
            (summaryOrder?.booking_price || 0) +
              (summaryOrder?.promo_disc || 0),
            formDaily?.selected_location?.currency,
          )} (${
            formDaily?.with_driver ? formDaily?.duration : dayDifference
          } ${t('detail_order.summary.day')})`}
        />
        {!formDaily?.with_driver && (
          <>
            <RowDetail
              title={`${t('detail_order.summary.delivery_fee')}`}
              description={currencyFormat(
                summaryOrder?.rental_delivery_fee,
                formDaily?.selected_location?.currency,
              )}
            />
            <RowDetail
              title={`${t('detail_order.summary.return_cost')}`}
              description={currencyFormat(
                summaryOrder?.rental_return_fee,
                formDaily?.selected_location?.currency,
              )}
            />
          </>
        )}

        {formDaily?.additional_item?.map((x, i) => (
          <RowDetail
            title={`${x?.name} (${x?.varieties?.[0]?.color}) x ${x?.varieties?.[0]?.input_order}`}
            description={`${currencyFormat(
              x?.unit_price *
                x?.varieties?.[0]?.input_order *
                (formDaily?.with_driver ? formDaily?.duration : dayDifference),
              formDaily?.selected_location?.currency,
            )} (${
              formDaily?.with_driver ? formDaily?.duration : dayDifference
            } ${t('detail_order.summary.day')})`}
            key={i}
          />
        ))}
        <View style={styles.lineHorizontal} />
        <Text style={[styles.textTitle, {marginTop: 15}]}>
          {t('detail_order.summary.otherFee')}
        </Text>
        <RowDetail
          title={t('detail_order.overtime') as string}
          description={overtimePrice}
        />
        <RowDetail
          title={`${t('detail_order.summary.serviceFee')}`}
          description={currencyFormat(
            summaryOrder?.service_fee,
            formDaily?.selected_location?.currency,
          )}
        />
        <RowDetail
          title={`${t('detail_order.summary.insuranceFee')}`}
          description={currencyFormat(
            summaryOrder?.insurance_fee,
            formDaily?.selected_location?.currency,
          )}
        />
        {totalDiscount > 0 && (
          <RowDetail
            title={`${t('detail_order.summary.voucher_discount')}`}
            description={
              '-' +
              currencyFormat(
                totalDiscount,
                formDaily?.selected_location?.currency,
              )
            }
          />
        )}
        {Boolean(summaryOrder?.exced_max_passenger_charge) && (
          <RowDetail
            title={`${t('detail_order.summary.additionalPassengerFee')}`}
            description={currencyFormat(
              summaryOrder?.exced_max_passenger_charge!,
              formDaily?.selected_location?.currency,
            )}
          />
        )}
        <RowDetail
          title={t('detail_order.deposit') as string}
          description={currencyFormat(
            summaryOrder?.deposit,
            formDaily?.selected_location?.currency,
          )}
        />
        {!formDaily?.with_driver && (
          <RowDetail
            title={`${t('detail_order.summary.deposit_etoll')}`}
            description={currencyFormat(
              summaryOrder?.deposit_e_toll!,
              formDaily?.selected_location?.currency,
            )}
          />
        )}
        {summaryOrder?.one_day_order_charge > 0 && (
          <RowDetail
            title={`${t('detail_order.summary.one_day_charge')}`}
            description={currencyFormat(
              summaryOrder?.one_day_order_charge,
              formDaily?.selected_location?.currency,
            )}
          />
        )}
        {summaryOrder?.promo_disc > 0 && summaryOrder?.promo_name && (
          <RowDetail
            title={summaryOrder?.promo_name}
            description={`-${currencyFormat(
              summaryOrder?.promo_disc,
              formDaily?.selected_location?.currency,
            )}`}
          />
        )}
        {summaryOrder?.outside_operational_charge > 0 && (
          <RowDetail
            title={`${t('detail_order.summary.outside_price')}`}
            description={currencyFormat(
              summaryOrder?.outside_operational_charge,
              formDaily?.selected_location?.currency,
            )}
          />
        )}
        <View style={styles.lineHorizontal} />
        <RowDetail
          title={
            form?.type === 'HALF'
              ? t('detail_order.summary.total')
              : `${t('detail_order.summary.totalPayment')}`
          }
          titleStyle={styles.totalTitleStyle}
          description={currencyFormat(
            form?.type === 'HALF'
              ? summaryOrder?.sub_total
              : summaryOrder?.total_payment,
            formDaily?.selected_location?.currency,
          )}
          descriptionStyle={styles.totalDescriptionStyle}
        />
        {form?.type === 'HALF' && (
          <RowDetail
            title={`${t('detail_order.summary.paymentDP', {
              value: summaryOrder?.formula_percentage.value,
            })}`}
            titleStyle={styles.totalTitleStyle}
            description={currencyFormat(
              summaryOrder?.total_dp,
              formDaily?.selected_location?.currency,
            )}
            descriptionStyle={styles.totalDescriptionStyle}
          />
        )}
        <View style={{marginBottom: 150}} />
      </BottomSheetScrollView>
    </View>
  );
};

export default PaymentDetailModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 15,
    width: '100%',
  },
  totalTitleStyle: {
    color: theme.colors.navy,
    fontSize: 15,
    fontWeight: '700',
  },
  totalDescriptionStyle: {
    fontSize: 15,
    fontWeight: '700',
  },
  textTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
});
