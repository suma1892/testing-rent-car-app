import ButtonSaveRentalZone from './ButtonSaveRentalZone';
import DriverAccomodationAlert from './DriverAccomodationAlert';
import moment from 'moment';
import OvertimeModalContent from './OvertimeModalContent';
import PenaltiesWarningAlert from './PenaltiesWarningAlert';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import RentalBadge from './RentalBadge';
import RentalTimeInput from './RentalTimeInput';
import SelectZoneInput from './SelectZoneInput/SelectZoneInput';
import {addDays, format} from 'date-fns';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {enUS, id, zhCN} from 'date-fns/locale';
import {getIsOutsideOperationalHours} from 'utils/functions';
import {h1, h4} from 'utils/styles';
import {ic_arrow_right, ic_calendar} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OrderBookingZone} from 'types/global.types';
import {orderState} from 'redux/features/order/orderSlice';
import {RentalZoneFormProps} from '../rentalZoneComponent.interface';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';

const RentalZoneForm = ({
  i,
  selectedId,
  onSave,
  showBadge,
}: RentalZoneFormProps) => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const formDaily = useAppSelector(appDataState).formDaily;
  const {listZone, listRentalZone} = useAppSelector(orderState);
  const [selectedDropdown, setSelectedDropdown] = useState(selectedId || -1);
  const {vehicleById} = useAppSelector(vehiclesState);
  const condition = 'with_driver';
  const operational = vehicleById?.garage_data?.operational?.find(
    x => x?.service === condition,
  );

  const initialFormState = useMemo(() => {
    return {
      day: 1,
      date: '',
      detail_drop_off_zone_location: `${t(
        'detail_order.rentalZone.choose_dropoff_zone',
      )}`,
      detail_pickup_location: `${t(
        'detail_order.rentalZone.choose_pickup_zone',
      )}`,
      detail_driving_location: `${t(
        'detail_order.rentalZone.choose_rental_area',
      )}`,
      driving_zone_id: 0,
      driving_zone_name: '',
      driving_zone_price: 0,
      drop_off_zone_id: 0,
      drop_off_zone_name: '',
      drop_off_zone_price: 0,
      pick_up_zone_id: 0,
      pick_up_zone_name: '',
      pick_up_zone_price: 0,
      jam_sewa: '',
      total_price: 0,
      booking_end_time: formDaily?.end_booking_time?.replace(':', ''),
      booking_start_time: formDaily?.start_booking_time?.replace(':', ''),
      overtime_duration: 0,
      tanggal_sewa: moment(formDaily?.start_booking_date)
        .add(i, 'day')
        .format('YYYY/MM/DD'),
      is_driver_stay_overnight: false,
      driver_stay_overnight_price: 0,
      pickup_list_zone_id: 0,
      drop_off_list_zone_id: 0,
      driving_list_zone_id: 0,
      zone_name: {
        pick_up_zone: '',
        driving_zone: '',
        drop_off_zone: '',
      },
      is_operational_hours_agreement: false,
    };
  }, [formDaily?.end_booking_time, formDaily?.start_booking_time]);

  const [form, setForm] = useState<OrderBookingZone>(initialFormState);

  const handleSaveRentalZone = useCallback(() => {
    onSave({
      ...form,
      day: i + 1,
      date: format(
        addDays(new Date(formDaily?.start_booking_date), i),
        'yyyy-MM-dd',
      ),
    });
    setSelectedDropdown(-1);
  }, [form, i, formDaily?.start_booking_date]);

  useEffect(() => {
    if (formDaily.order_booking_zone?.length) {
      const currentOrderBookingZone = formDaily?.order_booking_zone?.[i];

      if (currentOrderBookingZone) {
        const drivingZone =
          listZone?.list_zones?.find(
            zone => zone?.zone_id === currentOrderBookingZone?.driving_zone_id,
          )?.name || '';
        const dropOffZone =
          listZone?.list_zones?.find(
            zone => zone?.zone_id === currentOrderBookingZone?.drop_off_zone_id,
          )?.name || '';
        const pickUpZone =
          listZone?.list_zones?.find(
            zone => zone?.zone_id === currentOrderBookingZone?.pick_up_zone_id,
          )?.name || '';

        setForm(prev => ({
          ...prev,
          ...(currentOrderBookingZone || {}),
          driving_zone_name: drivingZone,
          drop_off_zone_name: dropOffZone,
          pick_up_zone_name: pickUpZone,
        }));
      }
    }
  }, [formDaily.order_booking_zone, i, listZone?.list_zones]);

  const showAkomodasiDriver = formDaily?.duration - 1 !== i;

  const isOutsideOperationalHours = useMemo(() => {
    const validateOperationalHours = getIsOutsideOperationalHours({
      bookingStartTime:
        form.booking_start_time.slice(0, 2) +
        ':' +
        form.booking_start_time.slice(2),
      bookingEndTime:
        form.booking_end_time.slice(0, 2) +
        ':' +
        form.booking_end_time.slice(2),
      garageOpenTime: operational!.start_time,
      garageCloseTime: operational!.end_time,
      withDriver: true,
    });

    if (
      formDaily.with_driver &&
      operational!.outside_operational_status &&
      operational!.service.includes('with_driver') &&
      operational!.outside_operational_fee > 0 &&
      validateOperationalHours
    ) {
      return true;
    }

    setForm(prev => ({...prev, is_operational_hours_agreement: false}));
    return false;
  }, [form.booking_start_time, form.booking_end_time, operational]);

  const showConfirmOvertime = useCallback(() => {
    if (form.overtime_duration) {
      showBSheet({
        snapPoint: ['65%', '80%'],
        content: (
          <OvertimeModalContent
            onOk={() => {
              handleSaveRentalZone();
              dispatch(toggleBSheet(false));
            }}
            onCancel={() => dispatch(toggleBSheet(false))}
          />
        ),
      });
      return;
    }
    handleSaveRentalZone();
  }, [form]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[rowCenter, styles.boxWrapper]}
        onPress={() => {
          if (selectedDropdown === i) {
            setSelectedDropdown(-1);
            return;
          }
          setSelectedDropdown(i);
        }}>
        <View style={[rowCenter]}>
          <Image source={ic_calendar} style={iconSize} />
          <Text style={[h4, {fontSize: 16, marginLeft: 15}]}>
            {t('detail_order.rentalZone.day', {value: i + 1})}{' '}
            <Text style={{marginHorizontal: 20, fontSize: 7}}> ● </Text>
            <Text style={[h1]}>
              {' '}
              {format(
                addDays(new Date(formDaily?.start_booking_date), i),
                'dd MMMM yyyy',
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
          </Text>

          <RentalBadge form={form} show={showBadge} />
        </View>
        <Image
          source={ic_arrow_right}
          style={iconCustomSize(12)}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {selectedDropdown === i && (
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: theme.colors.grey5,
          }}>
          <SelectZoneInput
            // data={listRentalZone}
            label={t('detail_order.rentalZone.pickup') as string}
            placeholder={`${form.detail_pickup_location}`}
            onChange={val => {
              setForm(prev => ({
                ...prev,
                zone_name: {
                  ...prev.zone_name,
                  pick_up_zone: val.name_zone,
                },
                pick_up_zone_id: val.zone_id,
                pick_up_zone_name: val.name,
                detail_pickup_location: `${val.name} (${val.name_zone})`,
                pickup_list_zone_id: val.id,
              }));
            }}
            modalHeaderTitle={t('detail_order.rentalZone.pickup_zone')}
          />
          <SelectZoneInput
            // data={listRentalZone}
            label={t('detail_order.rentalZone.dropoff') as string}
            placeholder={`${form.detail_drop_off_zone_location}`}
            onChange={val => {
              setForm(prev => ({
                ...prev,
                zone_name: {
                  ...prev.zone_name,
                  drop_off_zone: val.name_zone,
                },
                drop_off_zone_id: val.zone_id,
                drop_off_zone_name: val.name,
                detail_drop_off_zone_location: `${val.name} (${val.name_zone})`,
                drop_off_list_zone_id: val.id,
              }));
            }}
            modalHeaderTitle={t('detail_order.rentalZone.dropoff_zone')}
          />
          <SelectZoneInput
            label={t('detail_order.rentalZone.myRentalZone')}
            placeholder={`${form?.detail_driving_location}`}
            data={listRentalZone
              ?.slice()
              ?.filter(
                ({category}) =>
                  !!category?.find(
                    ({category_name}) =>
                      category_name === vehicleById?.category?.name,
                  ),
              )
              .sort((a, b) => a?.name?.localeCompare(b?.name))}
            onChange={val => {
              setForm(prev => ({
                ...prev,
                zone_name: {
                  ...prev.zone_name,
                  driving_zone: val.name,
                },
                driving_zone_id: val.id,
                driving_zone_name: val.name,
                detail_driving_location: `${val.name} ${
                  val?.name_zone ? `(${val.name_zone})` : ''
                }`,
                driving_list_zone_id: 0,
              }));
            }}
            modalHeaderTitle={t('detail_order.rentalZone.rental_area')}
          />

          <View
            style={[
              rowCenter,
              {justifyContent: 'space-between', marginTop: 10},
            ]}>
            <RentalTimeInput
              value={form?.booking_start_time}
              onSelect={val => {
                const startHour = val?.slice(0, 2);
                const rentalDuration = vehicleById?.rental_duration;
                const endHour = Number(startHour) + Number(rentalDuration);

                setForm(prev => ({
                  ...prev,
                  booking_start_time: val,
                  overtime_duration: 0,
                  booking_end_time: `${
                    endHour > 24
                      ? '0000'
                      : endHour + prev.booking_start_time?.slice(2)
                  }`,
                }));
              }}
              onClear={() => {
                setForm(prev => ({
                  ...prev,
                  booking_start_time: '',
                  overtime_duration: 0,
                }));
              }}
            />
            <RentalTimeInput
              value={form?.booking_end_time}
              title={t('Home.daily.rent_end_time') as string}
              isEndTime
              startTime={form?.booking_start_time}
              onSelect={val => {
                const startHour = form.booking_start_time?.slice(0, 2);
                const endHour = val?.slice(0, 2);
                const totalBookingTime = Number(endHour) - Number(startHour);
                const rentalDuration = vehicleById?.rental_duration;

                if (val === '2230') {
                  setForm(prev => ({
                    ...prev,
                    booking_end_time: '2200',
                    overtime_duration:
                      totalBookingTime > Number(rentalDuration)
                        ? totalBookingTime - Number(rentalDuration)
                        : 0,
                  }));
                } else {
                  setForm(prev => ({
                    ...prev,
                    booking_end_time: val,
                    overtime_duration:
                      totalBookingTime > Number(rentalDuration)
                        ? totalBookingTime - Number(rentalDuration)
                        : 0,
                  }));
                }
              }}
              onClear={() => {
                setForm(prev => ({
                  ...prev,
                  booking_end_time: '',
                  overtime_duration: 0,
                }));
              }}
            />
          </View>

          <DriverAccomodationAlert
            show={showAkomodasiDriver}
            value={Boolean(form.is_driver_stay_overnight)}
            onChange={val =>
              setForm(prev => ({...prev, is_driver_stay_overnight: val}))
            }
          />

          <PenaltiesWarningAlert
            show={isOutsideOperationalHours}
            value={Boolean(form.is_operational_hours_agreement)}
            onChange={val =>
              setForm(prev => ({...prev, is_operational_hours_agreement: val}))
            }
          />

          <ButtonSaveRentalZone
            form={form}
            isOutsideOperationalHours={isOutsideOperationalHours}
            onClick={showConfirmOvertime}
          />
        </View>
      )}
    </View>
  );
};

export default memo(RentalZoneForm);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  boxWrapper: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    justifyContent: 'space-between',
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
  borderBottom: {
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cost: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  overtimeWrapper: {
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 7,
  },
  overtimeItem: {
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#666',
    width: '90%',
  },
});
