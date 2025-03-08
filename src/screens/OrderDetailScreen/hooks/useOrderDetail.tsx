/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {Form} from '../orderDetailScreen.interface';
import {getAdditionalRequests} from 'redux/features/additionalRequests/additionalRequestAPI';
import {getReferrer} from 'redux/features/user/userAPI';
import {getSummaryOrder} from 'redux/features/order/orderAPI';
import {IPayloadSummary} from 'types/order';
import {showToast} from 'utils/Toast';
import {t} from 'i18next';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {voucherState} from 'redux/features/voucher/voucherSlice';
import {
  getGarages,
  getShuttle,
  getUser,
} from 'redux/features/appData/appDataAPI';

const useOrderDetail = () => {
  const dispatch = useAppDispatch();
  const {formDaily, formAirportTransfer, voucher_ids, sub_service_type} =
    useAppSelector(appDataState);
  const voucherData = useAppSelector(voucherState);
  const voucherIds = voucherData?.data?.map(_voucher => _voucher?.id);
  const {userProfile} = useAppSelector(appDataState);

  const [form, setForm] = useState<Form>({
    taking_location: null,
    return_location: null,
    special_request: '',
    custom_delivery_detail_location: '',
    custom_return_detail_location: '',
    jam_sewa: '',
    flight_number: '',
    type: 'FULL',
    pasengger_number: 0,
    custom_pickup_detail_location: '',
    point: '0',
    code: userProfile?.phone_code || '+62',
    phone: userProfile?.phone || '',
    baggage: '',
  });

  const isAirportTransfer = sub_service_type === 'Airport Transfer';

  useEffect(() => {
    setForm({
      ...form,
      code: userProfile?.phone_code || '+62',
      phone: userProfile?.phone || '',
    });

    return () => {};
  }, [userProfile?.phone]);

  const handleSummarizeOrderWithDriver = () => {
    const endTime = formDaily?.end_booking_time;
    const endDate = formDaily?.end_booking_date;

    const _vouchers = [...(voucher_ids || [])];
    const payload: IPayloadSummary = {
      order_type_id: 1,
      end_booking_date: endDate,
      end_booking_time: endTime,
      start_booking_date: moment(formDaily.start_trip).format('YYYY-MM-DD'),
      start_booking_time: formDaily.start_booking_time,
      vehicle_id: formDaily.vehicle_id,
      vehicle_category_id: formDaily.vehicle_category_id,
      pasengger_number: form.pasengger_number,
      order_booking_zone: formDaily.order_booking_zone?.map(x => ({
        day: x?.day,
        drop_off_zone_id: x?.drop_off_zone_id,
        pick_up_zone_id: x?.pick_up_zone_id,
        driving_zone_id: x?.driving_zone_id,
        overtime_duration: x?.overtime_duration,
        is_driver_stay_overnight: x?.is_driver_stay_overnight,
        booking_start_time: `${
          x?.booking_start_time.slice(0, x?.booking_start_time.length / 2) +
          ':' +
          x?.booking_start_time.slice(-x?.booking_start_time.length / 2)
        }`,
        booking_end_time: `${
          x?.booking_end_time.slice(0, x?.booking_end_time.length / 2) +
          ':' +
          x?.booking_end_time.slice(-x?.booking_end_time.length / 2)
        }`,
      })),
      without_driver: 0,
      voucher_ids: _vouchers,
      location_id: formDaily?.location_id,
      // sub_services_id: formDaily?.sub_service_id,
      sub_services_id: formDaily?.facility_id as number,
      addons: formDaily?.additional_item?.map(x => ({
        id: x?.id,
        varieties: x?.varieties?.map(y => ({
          id: y?.id,
          quantity: y?.input_order,
        })),
      })),
    };

    if (form?.point !== '0') {
      payload.point = parseInt(form.point || '0', 10);
    }

    dispatch(getSummaryOrder(payload));
  };

  const handleSummarizeOrderWithoutDriver = async () => {
    const startBookingTime = moment(formDaily.start_booking_time, 'HH:mm');
    const endBookingTime = moment(formDaily.end_booking_time, 'HH:mm');
    const overtime = endBookingTime.diff(startBookingTime, 'hour', true);
    const roundedOvertime = Math.ceil(overtime);
    const _vouchers = [...(voucher_ids || [])];

    const payload: IPayloadSummary = {
      order_type_id: 1,
      end_booking_date: moment(formDaily.end_trip).format('YYYY-MM-DD'),
      end_booking_time: formDaily.end_booking_time,
      start_booking_date: moment(formDaily.start_trip).format('YYYY-MM-DD'),
      start_booking_time: formDaily.start_booking_time,
      vehicle_id: formDaily.vehicle_id,
      rental_delivery_id: form.taking_location?.id || undefined,
      rental_return_id: form.return_location?.id || undefined,
      without_driver: 1,
      overtime: roundedOvertime,
      voucher_ids: _vouchers,
      location_id: formDaily?.location_id,
      sub_services_id: formDaily?.facility_id as number,
      pasengger_number: form.pasengger_number,
      addons: formDaily?.additional_item?.map(x => ({
        id: x?.id,
        varieties: x?.varieties?.map(y => ({
          id: y?.id,
          quantity: y?.input_order,
        })),
      })),
    };

    if (form?.point !== '0') {
      payload.point = parseInt(form.point || '0', 10);
    }
    await dispatch(getSummaryOrder(payload));
  };

  const handleSummarizeOrderAirportTransfer = () => {
    let _vouchers = [...(voucher_ids || [])];
    if (voucher_ids?.length > 0) {
      const isActiveVoucher = voucherIds?.find(voucherId =>
        voucher_ids?.find(x => x === voucherId),
      );
      if (!isActiveVoucher || isActiveVoucher === undefined) {
        showToast({
          message: t('voucher.alert_voucher'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        _vouchers = [];
      }
    }

    const payload: any = {
      order_type_id: 2,
      start_booking_date: formAirportTransfer.pickup_date,
      start_booking_time: formAirportTransfer.pickup_time,
      airport_transfer_package_id:
        formAirportTransfer?.airport_transfer_package_id,
      voucher_ids: _vouchers,
      location_id: formAirportTransfer.pickup_location?.location_id,
      sub_services_id: formAirportTransfer.sub_service_id,
      addons: formDaily?.additional_item?.map(x => ({
        id: x?.id,
        varieties: x?.varieties?.map(y => ({
          id: y?.id,
          quantity: y?.input_order,
        })),
      })),
    };
    if (form?.point !== '0') {
      payload.point = parseInt(form.point || '0', 10);
    }
    dispatch(getSummaryOrder(payload));
  };

  useFocusEffect(
    useCallback(() => {
      if (isAirportTransfer) {
        handleSummarizeOrderAirportTransfer();
      } else {
        if (formDaily.with_driver) {
          handleSummarizeOrderWithDriver();
        } else {
          handleSummarizeOrderWithoutDriver();
        }
      }
    }, [
      form.return_location?.id,
      form.taking_location?.id,
      formDaily?.order_booking_zone,
      form.type,
      form.pasengger_number,
      voucher_ids,
      form?.point,
      formDaily?.additional_item,
    ]),
  );

  useEffect(() => {
    dispatch(getUser());
    dispatch(getReferrer());

    if (!isAirportTransfer) {
      dispatch(getGarages(formDaily.location_id));
      dispatch(getShuttle(formDaily.location_id));
      const params = new URLSearchParams({
        limit: '100',
        page: '1',
        location_id: formDaily.location_id?.toString(),
        loc_time_id: formDaily.selected_location?.time_zone_identifier,
        start_booking_date: formDaily?.start_booking_date,
        start_booking_time: moment(
          formDaily?.start_booking_time,
          'HH:mm',
        ).format('h:mm:ss'),
      }).toString();

      dispatch(getAdditionalRequests(params));
    }
  }, []);

  return {
    form,
    setForm,
  };
};

export default useOrderDetail;
