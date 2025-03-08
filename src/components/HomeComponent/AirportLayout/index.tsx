import Button from 'components/Button';
import DatePickerComponent from 'components/DatePicker/DatePicker';
import LocationPickerInput from './LocationPickerInput';
import moment from 'moment';
import PickupTimeInput from '../CarSearchForm/partials/PickupTimeInput';
import React, {useCallback, useEffect} from 'react';
import ReactNativeModernDatepicker from 'react-native-modern-datepicker';
import useAirportCarSearchForm from '../CarSearchForm/hooks/useAirportCarSearchForm';
import {h1, h3} from 'utils/styles';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {StyleSheet, Text, View} from 'react-native';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  getAirportLocation,
  getAirportLocationZone,
} from 'redux/features/rentalLocation/rentalLocationAPI';
import {getIndonesianTimeZoneName, theme} from 'utils';
import i18next from 'i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {getIsOutsideOperationalHours} from 'utils/functions';
import {
  appDataState,
  saveFormAirportTransfer,
} from 'redux/features/appData/appDataSlice';
import {useNavigation} from '@react-navigation/native';
import PenaltiesWarningModal from 'components/PenaltiesWarningModal/PenaltiesWarningModal';
import {IAirportVehicles} from 'types/airport-vehicles';
import {showBSheet} from 'utils/BSheet';
import {getUnclaimedVoucherList} from 'redux/features/voucher/voucherAPI';
import {format} from 'date-fns';
import {resetAccountBank} from 'redux/features/accountBank/accountBankSlice';
import {authState, logout} from 'redux/features/auth/authSlice';
import {resetSelected} from 'redux/features/myBooking/myBookingSlice';
import {resetNotification} from 'redux/features/notifications/notificationSlice';
import {resetDisbursementStatus} from 'redux/features/order/orderSlice';
import {resetUser} from 'redux/features/user/userSlice';
import {showToast} from 'utils/Toast';

interface AirportLayoutProps {
  reset?: boolean;
  isListAirportCar?: boolean;
}

const AirportLayout: React.FC<AirportLayoutProps> = ({
  reset,
  isListAirportCar,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authState).auth;

  const {form, setForm, formError, setFormError, handleSearch} =
    useAirportCarSearchForm({reset: reset});
  const {formAirportTransfer, sub_service_type} = useAppSelector(appDataState);
  const navigation = useNavigation();
  const handleDateChange = useCallback(
    (date: string) => {
      setTimeout(() => {
        dispatch(toggleBSheet({content: <View />, show: false}));
      }, 200);

      console.log('date  ', date);
      setForm({
        ...form,
        pickup_date: date,
        pickup_time: '',
      });
      setFormError({...formError, error_pickup_date: ''});
    },
    [dispatch, form, formError, setForm, setFormError],
  );

  const handleLogoutAndReset = useCallback(() => {
    showToast({
      message: t('global.alert.please_login_to_continue'),
      type: 'error',
      title: t('global.alert.error'),
    });
    navigation.navigate('Login');
    dispatch(logout());
    dispatch(resetAccountBank());
    dispatch(resetDisbursementStatus());
    dispatch(resetUser());
    dispatch(resetNotification());
    dispatch(resetSelected());
  }, [dispatch, navigation, t]);

  const checkSearch = () => {
    if (!auth?.access_token) {
      handleLogoutAndReset();
      return;
    }

    // console.log('form ', JSON.stringify(form));
    const condition = 'airport_transfer';

    const operational = form?.pickup_location?.garages?.[0]?.operational?.find(
      (x: any) => x?.service === condition,
    );

    const isOutsideOperationalHours = getIsOutsideOperationalHours({
      bookingStartTime: form?.pickup_time?.replace(/(\d{2})(\d{2})/, '$1:$2'),
      bookingEndTime: form?.pickup_time?.replace(/(\d{2})(\d{2})/, '$1:$2'),
      garageOpenTime: operational!?.start_time,
      garageCloseTime: operational!?.end_time,
    });

    // return;
    console.log(
      'isOutsideOperationalHours ',
      isOutsideOperationalHours,
      operational,
    );
    // return
    if (
      operational?.outside_operational_status &&
      operational?.service?.includes('airport_transfer') &&
      operational?.outside_operational_fee > 0 &&
      isOutsideOperationalHours
    ) {
      handleOpenPenaltiesWarningModal(form?.pickup_location as any);
      return;
    } else {
      handleSearch();
    }
  };

  const handleOpenPenaltiesWarningModal = useCallback(
    (item: IAirportVehicles) => {
      showBSheet({
        content: (
          <PenaltiesWarningModal
            onOk={() => {
              // handleOpenPenaltiesWarningModal(item);
              showBSheet({content: <View />});
              console.log(
                'masuk sini ',
                form?.pickup_location?.location?.is_special_airport_transfer,
              );
              // if (
              //   !form?.pickup_location?.location?.is_special_airport_transfer
              // ) {
              //   console.log('masuk sini');
              handleSearch();
              //   return;
              // }
              console.log('asd123');
              // return
              // navigation.navigate('OrderDetailAirportTransfer');

              dispatch(
                getUnclaimedVoucherList({
                  is_reedemed: 1,
                  order_type: 'airport_transfer',
                  start_date: moment(formAirportTransfer?.pickup_date).format(
                    'YYYY-MM-DD',
                  ),
                  end_date: moment(formAirportTransfer?.pickup_date).format(
                    'YYYY-MM-DD',
                  ),
                }),
              );
            }}
            onCancel={() => showBSheet({content: <View />})}
          />
        ),
        snapPoint: ['60%', '60%'],
      });
    },
    [formAirportTransfer, form, form?.pickup_location],
  );

  useEffect(() => {
    dispatch(getAirportLocation({}));
    dispatch(getAirportLocationZone({}));
  }, []);

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, {duration: 700}),
  }));

  useEffect(() => {
    opacity.value = 1;
    return () => {
      opacity.value = 0;
    };
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LocationPickerInput
        form={form}
        setForm={setForm}
        formError={formError}
        setFormError={setFormError}
        isListAirportCar={isListAirportCar}
      />

      <View style={styles.dateContainer}>
        <DatePickerComponent
          mode="date"
          placeholder={t('Home.daily.select_date')}
          title={t('Home.airportTransfer.pickup_date')}
          containerStyle={styles.dropdownHalfWidth}
          value={form.pickup_date ?? ''}
          snapPoint={['60%', '60%', '80%']}
          onClear={() => {
            setForm(prev => ({
              ...prev,
              pickup_date: '',
              tanggal_pengembalian: '',
            }));
          }}
          content={
            <View>
              <Text style={[h1, styles.datePickerTitle]}>
                {t('Home.airportTransfer.pickup_date')}
              </Text>
              <ReactNativeModernDatepicker
                style={styles.datePicker}
                minimumDate={moment().add(2, 'days').format('YYYY-MM-DD')}
                // minimumDate={'2025-01-06'}
                current={form?.pickup_date?.replace(/\//g, '-')}
                selected={form?.pickup_date?.replace(/\//g, '-')}
                onDateChange={handleDateChange}
                mode={'calendar'}
                isMandarin={i18next.language === 'cn'}
              />
            </View>
          }
          errorMessage={formError.error_pickup_date}
        />
        <PickupTimeInput
          form={form}
          setForm={setForm}
          formError={formError}
          isAirportTransfer
          title={t('Home.daily.pickup_time') as string}
          setFormError={setFormError}
          onClear={() => {
            setForm(prev => ({
              ...prev,
              jam_sewa: '',
              jam_pengembalian: '',
              pickup_time: '',
            }));
          }}
        />
      </View>
      <Text style={[h3, styles.textInfo]}>
        {t('Home.daily.format_time_24_hours', {
          value:
            form?.pickup_location?.time_zone ||
            form?.dropoff_location?.time_zone
              ? `- ${
                  // form?.pickup_location?.time_zone ||
                  // form?.dropoff_location?.time_zone
                  getIndonesianTimeZoneName({
                    timezone:
                      form?.pickup_location?.time_zone ||
                      form?.dropoff_location?.time_zone,
                    lang: i18next.language,
                  } as any)
                }`
              : '',
        })}
      </Text>
      <Button
        _theme="orange"
        title={t('global.button.confirm')}
        onPress={checkSearch}
        styleWrapper={styles.searchButton}
      />
    </Animated.View>
  );
};

export default AirportLayout;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    padding: 12,
    borderRadius: 8,
  },
  locationContainer: {
    ...rowCenter,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    justifyContent: 'space-between',
    marginTop: 18,
    flexDirection: 'row',
  },
  dropdownHalfWidth: {
    width: '60%',
  },
  iconExchange: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    left: '47%',
    zIndex: 100,
    bottom: '15%',
  },
  datePickerTitle: {
    marginLeft: 16,
    fontSize: 18,
  },
  datePicker: {
    width: WINDOW_WIDTH,
  },
  textInfo: {
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  searchButton: {
    marginTop: 12,
  },
});
