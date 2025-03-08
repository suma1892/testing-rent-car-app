import analytics from '@react-native-firebase/analytics';
import Button from 'components/Button';
import moment from 'moment';
import React, {useMemo, useState} from 'react';
import store from 'redux/store';
import {createOrder} from 'redux/features/order/orderAPI';
import {editUser} from 'redux/features/user/userAPI';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {format, parse, subHours} from 'date-fns';
import {getLocationId} from 'redux/effects';
import {ic_car_rent} from 'assets/icons';
import {Image, Linking, Text, View} from 'react-native';
import {orderState} from 'redux/features/order/orderSlice';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {userState} from 'redux/features/user/userSlice';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {
  appDataState,
  setSelectedVoucher,
} from 'redux/features/appData/appDataSlice';
import {
  setErrorVoucher,
  voucherState,
} from 'redux/features/voucher/voucherSlice';

type ButtonNextPaymentProps = {
  disabled: boolean;
  isAirportLocation: boolean;
  form: Form;
  isOneWay?: boolean;
  checkFunc?: () => void;
};

const ButtonNextPayment = ({
  disabled,
  isAirportLocation,
  form,
  isOneWay,
  checkFunc,
}: ButtonNextPaymentProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {
    formDaily,
    formAirportTransfer,
    voucher_ids,
    userProfile,
    globalConfig,
    sub_service_type,
  } = useAppSelector(appDataState);
  const vehicleById = useAppSelector(vehiclesState).vehicleById;
  const summaryOrder = useAppSelector(orderState).summaryOrder;
  const voucherData = useAppSelector(voucherState);
  const referrer = useAppSelector(userState)?.referrer;
  const voucherIds = voucherData?.data?.map(_voucher => _voucher?.id);

  const [loader, setLoader] = useState(false);

  const orderWaConfigValue = useMemo(() => {
    if (globalConfig.length) {
      return (
        globalConfig.find(config => config.key === 'order_wa')?.value || 'false'
      );
    }

    return 'false';
  }, [globalConfig]);

  const handleRedirectToWhatsApp = () => {
    try {
      const url = `whatsapp://send?phone=6281262511511&text=Hi Get Ride Currently i'm looking for a ${
        vehicleById?.brand_name
      } ${vehicleById?.name} car rental ${
        formDaily?.with_driver ? 'with driver' : 'without key driver'
      } for ${moment(formDaily?.start_booking_date).format(
        'MMMM do YYYY',
      )} to ${moment(formDaily?.start_booking_date).format('MMMM do YYYY')} ${
        formDaily?.location
      } Bali area. Is the car available on that date? thank you.`;
      Linking.openURL(url).catch(err => {
        let message = err?.message;
        if (
          message?.includes(
            `Could not open URL '${url}': No Activity found to handle Intent`,
          )
        ) {
          message = t('global.alert.error_redirect_to_whatsapp');
        }

        showToast({
          title: t('global.alert.failed'),
          type: 'error',
          message,
        });
      });
      return;
    } catch (error) {
      console.log('error handleRedirectToWhatsApp: ', error);
    }
  };

  const handleOrderAirportTransfer = async () => {
    let locId: any = {};
    try {
      locId = await getLocationId(
        Number(formAirportTransfer?.pickup_location?.location_id),
      );

      if (
        !form?.custom_pickup_detail_location ||
        !form?.flight_number ||
        !form?.baggage
      ) {
        showToast({
          message: t('detail_order.warning_form'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        return;
      }

      if (form?.phone?.length <= 8) {
        showToast({
          message: t('detail_order.min_phone'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        // status = false;
        return;
      }

      if (voucher_ids?.length > 0) {
        const error_voucher_message =
          store.getState().voucher?.error_voucher_message;

        const isActiveVoucher = voucherIds?.find(voucherId =>
          voucher_ids?.find(x => x === voucherId),
        );
        if (
          !isActiveVoucher ||
          isActiveVoucher === undefined ||
          error_voucher_message
        ) {
          showToast({
            message: error_voucher_message || t('voucher.alert_voucher'),
            title: t('global.alert.warning'),
            type: 'warning',
          });

          store.dispatch(
            setErrorVoucher(
              error_voucher_message || (t('voucher.alert_voucher') as string),
            ),
          );
          return;
        }
      }

      const formData: any = {
        order_type_id: 2,
        user_name: userProfile.name,
        phone_number: form?.phone,
        phone_country_code: form?.code,
        wa_number: form?.phone,
        email: userProfile.email,
        currency: formAirportTransfer?.pickup_location?.location?.currency,
        booking_price: summaryOrder.booking_price,
        price_per_day: summaryOrder?.price_per_day || 0,
        service_fee: summaryOrder.service_fee,
        insurance_fee: summaryOrder.insurance_fee,
        total_payment: summaryOrder.total_payment,
        refferal_code: '',
        deposit: summaryOrder.deposit,
        type: form.type,
        remainder: form.type === 'FULL' ? 0 : summaryOrder?.remainder,
        down_payment: form.type === 'FULL' ? 0 : summaryOrder?.total_dp,
        rental_delivery_fee: summaryOrder.rental_delivery_fee || 0,
        rental_return_fee: summaryOrder.rental_return_fee || 0,
        airport_transfer_package_id:
          formAirportTransfer?.airport_transfer_package_id,
        referral_code: referrer?.referral_code,
        outside_operational_charge:
          summaryOrder?.outside_operational_charge || 0,
        order_detail: {
          vehicle_id: parseInt(
            globalConfig?.find(x => x?.key === 'airport_vehicle_id')?.value ||
              '0',
            10,
          ),
          is_take_from_rental_office: false,
          start_booking_date: formAirportTransfer.pickup_date,
          start_booking_time: formAirportTransfer.pickup_time,
          location_id: formAirportTransfer?.pickup_location?.location_id,
          loc_time_id: locId?.time_zone_identifier,
          end_booking_date: formAirportTransfer.pickup_date,
          end_booking_time: formAirportTransfer.pickup_time,
          rental_delivery_location: formAirportTransfer?.pickup_location?.name,
          rental_delivery_location_detail:
            form?.custom_delivery_detail_location,
          rental_return_location: formAirportTransfer?.dropoff_location?.name,
          rental_return_location_detail: form.custom_pickup_detail_location,
          landing_time: `${
            form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
            ':' +
            form.jam_sewa.slice(-form.jam_sewa.length / 2)
          }`,
          flight_number: form.flight_number || '',
          without_driver: false,
          baggage: parseInt(form?.baggage, 10),
        },
      };

      if (summaryOrder?.promotion?.id) {
        formData.promotion_id = summaryOrder?.promotion?.id;
      }
      if (summaryOrder?.order_voucher?.length > 0) {
        formData.order_voucher = [...summaryOrder?.order_voucher];
      }
      if (summaryOrder?.point !== 0 || summaryOrder?.point !== undefined) {
        formData.point = summaryOrder?.point;
      }

      setLoader(true);
      const resEditProfile: any = await dispatch(
        editUser({
          ...userProfile,
          phone: form?.phone,
          code: form?.code?.includes('+')
            ? form?.code
            : `+${form?.code}` || '+62',
          phone_code: form?.code?.includes('+')
            ? form?.code
            : `+${form?.code}` || '+62',
          wa_code: form?.code?.includes('+')
            ? form?.code
            : `+${form?.code}` || '+62',
        }),
      );
      if (resEditProfile?.error?.message?.toLowerCase() === 'rejected') {
        setLoader(false);
        return;
      }

      const res = await dispatch(createOrder(formData as any));
      setLoader(false);

      if (res.type.includes('rejected')) {
        return;
      }

      navigation.navigate('PaymentMethod', {
        transaction_key: res.payload.data.order.transaction_key,
      });
      dispatch(setSelectedVoucher([]));
      await analytics().logEvent('booking_airport_transfer', {
        id: new Date().toString(),
        item: 'Daily',
        description: ['airport_transfer'],
      });
    } catch (error) {}
  };

  const handleOrderWithDriver = async () => {
    if (
      Number(formDaily?.duration) !== formDaily?.order_booking_zone?.length ||
      (form?.pasengger_number || 0) <= 0 ||
      !form?.baggage
    ) {
      showToast({
        message: t('detail_order.warning_form'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      return;
    }
    if (form?.phone?.length <= 8) {
      showToast({
        message: t('detail_order.min_phone'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      // status = false;
      return;
    }

    if (voucher_ids?.length > 0) {
      const error_voucher_message =
        store.getState().voucher?.error_voucher_message;
      const isActiveVoucher = voucherIds?.find(voucherId =>
        voucher_ids?.find(x => x === voucherId),
      );
      if (
        !isActiveVoucher ||
        isActiveVoucher === undefined ||
        error_voucher_message
      ) {
        showToast({
          message: error_voucher_message || t('voucher.alert_voucher'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        store.dispatch(
          setErrorVoucher(
            error_voucher_message || (t('voucher.alert_voucher') as string),
          ),
        );
        // _vouchers = [];
        return;
      }
    }
    const bookingZones = formDaily?.order_booking_zone?.map(
      (bookingZone, i) => {
        const bookingEndTime = format(
          subHours(
            parse(bookingZone?.booking_end_time, 'HHmm', new Date()),
            bookingZone?.overtime_duration || 0,
          ),
          'HH:mm',
        );

        return {
          date: bookingZone?.date,
          detail_drop_off_location: bookingZone?.detail_drop_off_zone_location,
          detail_pickup_location: bookingZone?.detail_pickup_location,
          detail_driving_location: bookingZone?.detail_driving_location,
          driving_zone_id: bookingZone?.driving_zone_id,
          drop_off_zone_id: bookingZone?.drop_off_zone_id,
          pickup_zone_id: bookingZone?.pick_up_zone_id,
          pickup_zone_price:
            summaryOrder?.order_zone_price?.[i]?.pick_up_zone_price || 0,
          drop_off_zone_price:
            summaryOrder?.order_zone_price?.[i]?.drop_off_zone_price || 0,
          driving_zone_price:
            summaryOrder?.order_zone_price?.[i]?.driving_zone_price || 0,
          total_price: summaryOrder?.order_zone_price?.[i]?.total_price || 0,
          booking_end_time: bookingEndTime,
          booking_start_time: `${
            bookingZone?.booking_start_time.slice(
              0,
              bookingZone?.booking_start_time.length / 2,
            ) +
            ':' +
            bookingZone?.booking_start_time.slice(
              -bookingZone?.booking_start_time.length / 2,
            )
          }`,
          overtime_duration: bookingZone?.overtime_duration,
          pickup_list_zone_id: bookingZone?.pickup_list_zone_id,
          drop_off_list_zone_id: bookingZone?.drop_off_list_zone_id,
          driving_list_zone_id: bookingZone?.driving_list_zone_id,
          is_driver_stay_overnight: bookingZone?.is_driver_stay_overnight,
          driver_stay_overnight_price:
            summaryOrder?.order_zone_price?.[i]?.driver_stay_overnight_price ||
            0,
          outside_operational_charge:
            summaryOrder?.order_zone_price?.[i]?.outside_operational_charge ||
            0,
        };
      },
    );

    const formData: any = {
      order_type_id: 1,
      user_name: userProfile.name,
      // phone_number: userProfile.phone,
      phone_number: form?.phone,
      wa_number: form?.phone,
      currency: formDaily?.selected_location?.currency,
      phone_country_code: form?.code,
      email: userProfile.email,
      booking_price: summaryOrder.booking_price,
      service_fee: summaryOrder.service_fee,
      insurance_fee: summaryOrder.insurance_fee,
      total_payment: summaryOrder.total_payment,
      refferal_code: '',
      deposit: summaryOrder.deposit,
      exceed_passenger_price: summaryOrder?.exced_max_passenger_charge,
      referral_code: referrer?.referral_code,
      type: form.type,
      remainder: form.type === 'FULL' ? 0 : summaryOrder?.remainder,
      down_payment: form.type === 'FULL' ? 0 : summaryOrder?.total_dp,
      rental_delivery_fee: summaryOrder.rental_delivery_fee || 0,
      rental_return_fee: summaryOrder.rental_return_fee || 0,
      order_zone_total_price: summaryOrder.order_zone_total_price || 0,
      price_per_day: summaryOrder?.price_per_day || 0,
      order_detail: {
        vehicle_id: summaryOrder.vehicle_id,
        is_take_from_rental_office: false,
        location_id: formDaily?.location_id,
        loc_time_id: formDaily.selected_location?.time_zone_identifier,
        end_booking_date: summaryOrder.end_booking_date,
        end_booking_time: summaryOrder.end_booking_time,
        start_booking_date: summaryOrder.start_booking_date,
        start_booking_time: summaryOrder.start_booking_time,
        rental_delivery_location: '',
        rental_delivery_location_detail: '',
        rental_return_location: '',
        rental_return_location_detail: '',
        without_driver: false,
        booking_zones: bookingZones,
        passenger_number: form.pasengger_number,
        baggage: parseInt(form?.baggage, 10),
      },
      outside_operational_charge: summaryOrder?.outside_operational_charge || 0,
      addons: formDaily?.additional_item?.map(x => ({
        id: x?.id,
        varieties: x?.varieties?.map(y => ({
          id: y?.id,
          quantity: y?.input_order,
        })),
      })),
    };

    if (summaryOrder?.promotion?.id) {
      formData.promotion_id = summaryOrder?.promotion?.id;
    }

    if (summaryOrder?.order_voucher?.length > 0) {
      formData.order_voucher = [...summaryOrder?.order_voucher];
    }

    if (summaryOrder?.point !== 0) {
      formData.point = summaryOrder?.point;
    }
    setLoader(true);
    const resEditProfile: any = await dispatch(
      editUser({
        ...userProfile,
        phone: form?.phone,
        code: form?.code?.includes('+')
          ? form?.code
          : `+${form?.code}` || '+62',
        phone_code: form?.code?.includes('+')
          ? form?.code
          : `+${form?.code}` || '+62',
        wa_code: form?.code?.includes('+')
          ? form?.code
          : `+${form?.code}` || '+62',
      }),
    );
    if (resEditProfile?.error?.message?.toLowerCase() === 'rejected') {
      setLoader(false);
      return;
    }

    const res = await dispatch(createOrder(formData as any));
    setLoader(false);
    if (res.type.includes('rejected')) {
      return;
    }

    navigation.navigate('PaymentMethod', {
      transaction_key: res.payload.data.order.transaction_key,
    });
    dispatch(setSelectedVoucher([]));
    await analytics().logEvent('booking_with_driver', {
      id: new Date().toString(),
      item: 'Daily',
      description: ['with_driver'],
    });
  };

  const handleOrderWithoutDriver = async () => {
    let status = true;
    if (formDaily.with_driver) {
      status = formDaily?.duration === formDaily?.booking_zones?.length;
    } else {
      if (isAirportLocation) {
        if (
          !form.flight_number ||
          !form.jam_sewa ||
          !form.custom_delivery_detail_location
        ) {
          status = false;
        }
      }

      if (
        (!isAirportLocation && !form.custom_delivery_detail_location) ||
        !form.custom_return_detail_location ||
        !form.return_location ||
        !form?.baggage ||
        (form?.pasengger_number || 0) <= 0
      ) {
        status = false;
      }
    }
    if (form?.phone?.length <= 8) {
      showToast({
        message: t('detail_order.min_phone'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      // status = false;
      return;
    }

    if (!status) {
      showToast({
        message: t('detail_order.warning_form'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      return;
    }
    if (voucher_ids?.length > 0) {
      const error_voucher_message =
        store.getState().voucher?.error_voucher_message;

      const isActiveVoucher = voucherIds?.find(voucherId =>
        voucher_ids?.find(x => x === voucherId),
      );
      if (
        !isActiveVoucher ||
        isActiveVoucher === undefined ||
        error_voucher_message
      ) {
        showToast({
          message: error_voucher_message || t('voucher.alert_voucher'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        store.dispatch(
          setErrorVoucher(
            error_voucher_message || (t('voucher.alert_voucher') as string),
          ),
        );
        return;
      }
    }

    const overTime =
      summaryOrder?.over_time_hour < 0 ? 0 : summaryOrder?.over_time_hour;
    const bookingEndTime = format(
      subHours(
        parse(formDaily.end_booking_time, 'HH:mm', new Date()),
        overTime,
      ),
      'HH:mm',
    );

    const formData: any = {
      booking_price: summaryOrder.booking_price,
      service_fee: summaryOrder.service_fee,
      currency: formDaily?.selected_location?.currency,
      rental_delivery_fee: summaryOrder.rental_delivery_fee || 0,
      rental_return_fee: summaryOrder.rental_return_fee || 0,
      insurance_fee: summaryOrder.insurance_fee,
      email: userProfile.email,
      order_type_id: 1,
      // phone_number: userProfile.phone,
      phone_number: form?.phone,
      phone_country_code: form?.code,
      deposit: summaryOrder.deposit,
      deposit_e_toll: summaryOrder?.deposit_e_toll,
      total_payment: summaryOrder.total_payment,
      user_name: userProfile.name,
      referral_code: referrer?.referral_code,
      price_per_day: summaryOrder?.price_per_day || 0,
      wa_number: form?.phone,
      exceed_passenger_price: summaryOrder?.exced_max_passenger_charge,
      order_detail: {
        without_driver: true,
        end_booking_date: formDaily.end_booking_date,
        end_booking_time: bookingEndTime,
        is_take_from_rental_office: false,
        vehicle_id: summaryOrder.vehicle_id,
        passenger_number: form.pasengger_number,
        location_id: formDaily?.location_id,
        loc_time_id: formDaily.selected_location?.time_zone_identifier,
        start_booking_date: summaryOrder.start_booking_date,
        start_booking_time: summaryOrder.start_booking_time,
        rental_return_location: form.return_location?.name!,
        rental_return_location_detail: form.custom_return_detail_location,
        rental_delivery_location: form.taking_location?.name!,
        rental_delivery_location_detail: form.custom_delivery_detail_location,
        flight_number: isAirportLocation ? form.flight_number : '',
        landing_time: isAirportLocation
          ? `${
              form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
              ':' +
              form.jam_sewa.slice(-form.jam_sewa.length / 2)
            }`
          : '',
        additionals: [],
        baggage: parseInt(form?.baggage, 10),
      },
      type: form.type,
      remainder: form.type === 'FULL' ? 0 : summaryOrder?.remainder,
      down_payment: form.type === 'FULL' ? 0 : summaryOrder?.total_dp,
      over_time: overTime,
      over_time_price: summaryOrder?.over_time_price,
      addons: formDaily?.additional_item?.map(x => ({
        id: x?.id,
        varieties: x?.varieties?.map(y => ({
          id: y?.id,
          quantity: y?.input_order,
        })),
      })),
      outside_operational_charge: summaryOrder?.outside_operational_charge || 0,
    };

    if (summaryOrder?.promotion?.id) {
      formData.promotion_id = summaryOrder?.promotion?.id;
    }
    if (summaryOrder?.order_voucher?.length > 0) {
      formData.order_voucher = [...summaryOrder?.order_voucher];
    }

    if (summaryOrder?.point !== 0) {
      formData.point = summaryOrder?.point;
    }
    // console.log('formData = ', JSON.stringify(formData));
    // return;
    setLoader(true);
    const resEditProfile: any = await dispatch(
      editUser({
        ...userProfile,
        phone: form?.phone,
        code: form?.code?.includes('+')
          ? form?.code
          : `+${form?.code}` || '+62',
        phone_code: form?.code?.includes('+')
          ? form?.code
          : `+${form?.code}` || '+62',
        wa_code: form?.code?.includes('+')
          ? form?.code
          : `+${form?.code}` || '+62',
      }),
    );
    if (resEditProfile?.error?.message?.toLowerCase() === 'rejected') {
      setLoader(false);
      return;
    }
    // setLoader(true);
    const res = await dispatch(createOrder(formData as any));

    setLoader(false);
    if (res.type.includes('rejected')) {
      return;
    }

    navigation.navigate('PaymentMethod', {
      transaction_key: res.payload.data.order.transaction_key,
    });
    dispatch(setSelectedVoucher([]));
    await analytics().logEvent('booking_without_driver', {
      id: new Date().toString(),
      item: 'Daily',
      description: ['without_driver'],
    });
  };

  const handleOrderOneWay = async () => {
    const formData: any = {
      booking_price: summaryOrder.booking_price,
      service_fee: summaryOrder.service_fee,
      rental_delivery_fee: summaryOrder.rental_delivery_fee || 0,
      rental_return_fee: summaryOrder.rental_return_fee || 0,
      insurance_fee: summaryOrder.insurance_fee,
      email: userProfile.email,
      order_type_id: 1,
      // phone_number: userProfile.phone,
      phone_number: userProfile?.phone,
      phone_country_code: userProfile?.phone_code,
      deposit: summaryOrder.deposit,
      deposit_e_toll: summaryOrder?.deposit_e_toll,
      total_payment: summaryOrder.total_payment,
      user_name: userProfile.name,
      referral_code: referrer?.referral_code,
      price_per_day: summaryOrder?.price_per_day || 0,
      wa_number: userProfile?.phone,
      exceed_passenger_price: summaryOrder?.exced_max_passenger_charge,
      order_detail: {
        package_id: form?.package_id,
        origin: {
          lat: form?.origin_lat,
          long: form?.origin_long,
        },
        destination: {
          lat: form?.destination_lat,
          long: form?.destination_long,
        },
      },
      type: 'FULL',
      remainder: 0,
      down_payment: 0,
      addons: [],
      outside_operational_charge: 0,
    };
    console.log('formData = ', formData);
    // return;
    setLoader(true);

    // setLoader(true);
    const res = await dispatch(createOrder(formData as any));

    setLoader(false);
    if (res.type.includes('rejected')) {
      return;
    }

    navigation.navigate('PaymentMethod', {
      transaction_key: res.payload.data.order.transaction_key,
    });
    dispatch(setSelectedVoucher([]));
    await analytics().logEvent('booking_one_way', {
      id: new Date().toString(),
      item: 'Daily',
      description: ['one_way'],
    });
  };

  const showPopupConfirm = () => {
    showBSheet({
      snapPoint: ['65%', '80%'],
      content: (
        <View
          style={{
            alignItems: 'center',
            margin: 20,
            width: '90%',
          }}>
          <Image
            source={ic_car_rent}
            style={{width: 170, height: 170, marginBottom: 50}}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
            }}>
            {t('detail_order.overtime_confirmation_header')}
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              fontWeight: '400',
              lineHeight: 20,
              textAlign: 'center',
            }}>
            {t('detail_order.confirm_popup_desc')}
          </Text>

          <Button
            _theme="navy"
            onPress={() => {
              dispatch(toggleBSheet(false));

              if (isOneWay) {
                const res = checkFunc();
                if (res) handleOrderOneWay();
                return;
              }

              if (orderWaConfigValue === 'true') {
                handleRedirectToWhatsApp();
                return;
              }

              if (sub_service_type === 'Airport Transfer') {
                handleOrderAirportTransfer();
                return;
              }

              if (formDaily.with_driver) {
                if (!userProfile?.personal_info?.ktp) {
                  showToast({
                    message: t('global.alert.license'),
                    title: t('global.alert.warning'),
                    type: 'warning',
                  });
                  navigation.navigate('Profile', {
                    prev_screen: 'without_driver',
                  });
                  return;
                }
                handleOrderWithDriver();
                return;
              } else {
                if (
                  !userProfile?.personal_info?.ktp ||
                  !userProfile?.personal_info?.sim
                ) {
                  showToast({
                    message: t('global.alert.license'),
                    title: t('global.alert.warning'),
                    type: 'warning',
                  });
                  navigation.navigate('Profile', {
                    prev_screen: 'without_driver',
                  });
                  return;
                }
                handleOrderWithoutDriver();
                return;
              }
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

  return (
    <Button
      _theme="navy"
      disabled={disabled}
      isLoading={loader}
      title={t('global.button.nextPayment')}
      onPress={showPopupConfirm}
    />
  );
};

export default ButtonNextPayment;
