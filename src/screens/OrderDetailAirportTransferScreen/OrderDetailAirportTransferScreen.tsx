import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ic_arrow_left_white,
  ic_baggage,
  ic_exchange,
  ic_pinpoin,
  ic_plane,
  ic_plane2,
} from 'assets/icons';
import appBar from 'components/AppBar/AppBar';
import i18next, {t} from 'i18next';
import {
  appDataState,
  saveFormAirportTransfer,
  saveFormDaily,
} from 'redux/features/appData/appDataSlice';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {h1, h3, h4} from 'utils/styles';
import {FONT_SIZE_10, FONT_SIZE_14} from 'utils/typography';
import SelectLocation from './component/SelectLocation';
import LocationPickerInput from 'components/HomeComponent/AirportLayout/LocationPickerInput';
import useAirportCarSearchForm from 'components/HomeComponent/CarSearchForm/hooks/useAirportCarSearchForm';
import PickupTimeInput from 'components/HomeComponent/CarSearchForm/partials/PickupTimeInput';
import ReactNativeModernDatepicker from 'react-native-modern-datepicker';
import DatePickerComponent from 'components/DatePicker/DatePicker';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import SelectPassengers from './component/SelectPassengers';
import ButtonPayment from './component/ButtonPayment';
import useOrderDetailAirportTransfer from './hooks/useOrderDetailAirportTransfer';
import {getSummaryOrder} from 'redux/features/order/orderAPI';
import moment from 'moment';
import {getIsOutsideOperationalHours} from 'utils/functions';
import PenaltiesWarningModal from 'components/PenaltiesWarningModal/PenaltiesWarningModal';
import {IAirportVehicles} from 'types/airport-vehicles';
import {showBSheet} from 'utils/BSheet';
import SelectedCarCard from './component/SelectedCarCard';
import InputPhoneNumber from 'components/OrderDetail/InputPhoneNumber/InputPhoneNumber';

const OrderDetailAirportTransferScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {formDaily} = useAppSelector(appDataState);
  const {form, setForm, formError, setFormError, handleSearch} =
    useAirportCarSearchForm({reset: Boolean(false)});
  const {formAirportTransfer} = useAppSelector(appDataState);

  // const orderDetailAirportTransfer = useOrderDetailAirportTransfer();

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => {
              dispatch(
                saveFormDaily({
                  ...formDaily,
                  additional_item: [],
                }),
              );
              navigation.goBack();
            }}>
            <Image source={ic_arrow_left_white} style={styles.icon} />
            <Text style={styles.headerText}>{t('detail_order.title')}</Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  const handleSummarizeOrderAirportTransfer = () => {
    const payload: any = {
      order_type_id: 7,
      start_booking_date: formAirportTransfer.pickup_date,
      start_booking_time: formAirportTransfer.pickup_time?.replace(
        /(\d{2})(\d{2})/,
        '$1:$2',
      ),
      sub_service_id: formAirportTransfer?.sub_service_id,
      origin: {
        lat: formAirportTransfer?.pickup_location?.lat,
        long: formAirportTransfer?.pickup_location?.lon,
      },
      destination: {
        lat: formAirportTransfer?.dropoff_location?.lat,
        long: formAirportTransfer?.dropoff_location?.lon,
      },
      rental_delivery_id: formAirportTransfer?.pickup_location?.id,
      rental_return_id: formAirportTransfer?.dropoff_location?.id,
      adult_passenger: formAirportTransfer?.adults || 0,
      child_passenger: formAirportTransfer?.child || 0,
      // large_suitcase: formAirportTransfer?.large_suitcase || 0,
      regular_suitcase: formAirportTransfer?.suitcase || 0,
      location_id: formAirportTransfer?.pickup_location?.location_id,
    };
    console.log('payload airport summary ', payload);
    dispatch(getSummaryOrder(payload));
  };

  // useFocusEffect(useCallback(() => {}, []));

  useEffect(() => {
    handleSummarizeOrderAirportTransfer();

    return () => {};
  }, [
    formAirportTransfer,
    formAirportTransfer.pickup_date,
    formAirportTransfer.pickup_time,
    formAirportTransfer?.airport_transfer_package_id,
    formAirportTransfer.pickup_location?.location_id,
    formAirportTransfer.sub_service_id,
    formAirportTransfer?.adults,
    formAirportTransfer?.child,
    // formAirportTransfer?.large_suitcase,
    formAirportTransfer?.sub_service_id,
    formAirportTransfer?.suitcase,
    formAirportTransfer?.pickup_location?.lat,
    formAirportTransfer?.pickup_location?.lon,
    formAirportTransfer?.dropoff_location?.lat,
    formAirportTransfer?.dropoff_location?.lon,
    formAirportTransfer?.is_switched,
  ]);

  const handleDateChange = useCallback(
    (date: string) => {
      setTimeout(() => {
        dispatch(toggleBSheet({content: <View />, show: false}));
      }, 200);

      // setForm({
      //   ...form,
      //   pickup_date: date,
      //   pickup_time: '',
      // });
      console.log('date ', date);
      console.log('formAirportTransfer ', formAirportTransfer);
      dispatch(
        saveFormAirportTransfer({
          ...formAirportTransfer,
          pickup_date: date,
          pickup_time: '',
        }),
      );
      setFormError({...formError, error_pickup_date: ''});
    },
    [dispatch, form, formError, setForm, setFormError, formAirportTransfer],
  );

  const handleOpenPenaltiesWarningModal = useCallback(
    (item: IAirportVehicles, pickup_time: string) => {
      showBSheet({
        content: (
          <PenaltiesWarningModal
            onOk={() => {
              handleOpenPenaltiesWarningModal(item, '');
              dispatch(
                saveFormAirportTransfer({
                  ...formAirportTransfer,
                  pickup_time: pickup_time,
                }),
              );
            }}
            onCancel={() => handleOpenPenaltiesWarningModal(item, '')}
          />
        ),
        snapPoint: ['40%', '50%'],
      });
    },
    [formAirportTransfer, form],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white,
      }}>
      <ScrollView>
        <View
          style={{
            margin: 20,
          }}>
          <Text style={[h1, {fontSize: FONT_SIZE_14, marginBottom: 20}]}>
            {t('detail_order.title')}
          </Text>

          <SelectedCarCard />

          <InputPhoneNumber form={form} setForm={setForm} />
          <View style={{marginBottom: 20}} />
          <SelectLocation />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey5,
            width: '100%',
          }}
        />

        <View style={{margin: 20}}>
          <Text style={[h1]}>{t('detail_order.tripDetail.title')}</Text>
          <View style={styles.dateContainer}>
            <DatePickerComponent
              mode="date"
              placeholder={t('Home.daily.select_date')}
              title={t('Home.airportTransfer.pickup_date')}
              containerStyle={styles.dropdownHalfWidth}
              value={formAirportTransfer.pickup_date ?? ''}
              snapPoint={['60%', '80%', '100%']}
              onClear={() => {
                dispatch(
                  saveFormAirportTransfer({
                    ...formAirportTransfer,
                    pickup_date: '',
                    pickup_time: '',
                  }),
                );
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
            {/* <Text>{formAirportTransfer?.pickup_time}</Text> */}
            <PickupTimeInput
              form={formAirportTransfer}
              value={formAirportTransfer?.pickup_time}
              setForm={v => {
                console.log('value time ', v);
                // dispatch(saveFormAirportTransfer(v));
              }}
              setCustomValue={v => {
                const condition = 'airport_transfer';

                const operational =
                  formAirportTransfer?.pickup_location?.garages?.[0]?.operational?.find(
                    (x: {service: string}) => x?.service === condition,
                  );

                const isOutsideOperationalHours = getIsOutsideOperationalHours({
                  bookingStartTime: v?.replace(/(\d{2})(\d{2})/, '$1:$2'),
                  bookingEndTime: v?.replace(/(\d{2})(\d{2})/, '$1:$2'),
                  garageOpenTime: operational!.start_time,
                  garageCloseTime: operational!.end_time,
                });

                if (
                  operational?.outside_operational_status &&
                  operational?.service?.includes('airport_transfer') &&
                  operational?.outside_operational_fee > 0 &&
                  isOutsideOperationalHours
                ) {
                  handleOpenPenaltiesWarningModal(
                    formAirportTransfer?.pickup_location as any,
                    v,
                  );
                  return;
                }

                dispatch(
                  saveFormAirportTransfer({
                    ...formAirportTransfer,
                    pickup_time: v,
                  }),
                );
              }}
              formError={formError}
              isAirportTransfer
              title={t('Home.daily.pickup_time') as string}
              setFormError={setFormError}
              onClear={() => {
                dispatch(
                  saveFormAirportTransfer({
                    ...formAirportTransfer,
                    pickup_time: '',
                  }),
                );
              }}
            />
          </View>
          <SelectPassengers />

          <Text style={[h4, {marginVertical: 14}]}>
            {t('detail_order.formDetail.flight_no_title')}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.grey5,
              borderRadius: 8,
              paddingHorizontal: 10,
              ...rowCenter,
            }}>
            <Image source={ic_plane2} style={iconCustomSize(14)} />
            <TextInput
              placeholder={t(
                'translation:detail_order.formDetail.flight_no_placeholder',
              )}
              style={{
                width: '100%',
                ...h4,
                color: theme.colors.black,
                ...(Platform.OS === 'ios' && {paddingVertical: 16}),
              }}
              placeholderTextColor={theme.colors.grey4}
              value={formAirportTransfer?.flight_number}
              onChangeText={value => {
                dispatch(
                  saveFormAirportTransfer({
                    ...formAirportTransfer,
                    flight_number: value,
                  }),
                );
              }}
            />
          </View>
        </View>
      </ScrollView>

      <ButtonPayment form={form} />
    </View>
  );
};

export default OrderDetailAirportTransferScreen;

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  headerText: {
    color: 'white',
    marginLeft: 10,
  },
  exchange: {
    position: 'absolute',
    right: 20,
    top: '44%',
    zIndex: 9,
  },
  dateContainer: {
    justifyContent: 'space-between',
    marginTop: 18,
    flexDirection: 'row',
  },
  dropdownHalfWidth: {
    width: '60%',
  },
  datePickerTitle: {
    marginLeft: 16,
    fontSize: 18,
  },
  datePicker: {
    width: WINDOW_WIDTH,
  },
});
