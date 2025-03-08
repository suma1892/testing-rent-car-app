import DropdownLocation from 'components/DropdownLocation/DropdwonLocation';
import React, {Dispatch, SetStateAction, useCallback, useMemo} from 'react';
import {AIRPORT_LOCATION_DEFAULT} from 'utils/constants';
import {getLocationId} from 'redux/effects';
import {ic_exchange, ic_mercu, ic_pinpoin} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {
  IForm,
  IFormError,
} from '../CarSearchForm/hooks/useAirportCarSearchForm';

type LocationPickerInputProps = {
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  formError: IFormError;
  setFormError: Dispatch<SetStateAction<IFormError>>;
  isListAirportCar?: boolean;
};

const LocationPickerInput = ({
  form,
  setForm,
  formError,
  setFormError,
  isListAirportCar,
}: LocationPickerInputProps) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {searchHistory} = useAppSelector(appDataState);
  const {airportData, airportZoneData} = useAppSelector(rentalLocationState);

  const handleSelectPickUpLocation = useCallback(
    async (location: any) => {
      console.log('form ', form);
      const res = await getLocationId(location?.location_id);

      // if (location?.location_id !== form?.dropoff_location?.location_id) {
      setForm(prev => ({
        ...prev,
        dropoff_location: AIRPORT_LOCATION_DEFAULT,
        pickup_location: {
          ...location,
          time_zone: res?.time_zone,
          time_zone_identifier: res?.time_zone_identifier,
        },
      }));
      // } else {
      //   setForm({
      //     ...form,
      //     pickup_location: {
      //       ...location,
      //       time_zone: res?.time_zone,
      //       time_zone_identifier: res?.time_zone_identifier,
      //     },
      //   });
      // }
      setFormError({
        ...formError,
        error_pickup_location: '',
        error_dropoff_location: '',
      });
    },
    [dispatch, form, formError, form.is_switched, setForm, setFormError],
  );

  const handleSelectDropOffLocation = useCallback(
    (location: any) => {
      if (location?.is_extra) {
        setForm({
          ...form,
          pickup_location: AIRPORT_LOCATION_DEFAULT,
          dropoff_location: location,
        });
      } else {
        setForm({...form, dropoff_location: location});
      }
      setFormError({
        ...formError,
        error_dropoff_location: '',
        error_pickup_location: '',
      });
    },
    [dispatch, form, formError, setForm, setFormError],
  );

  const dropOffLocationData = useMemo(() => {
    if (!!form.pickup_location?.location_id) {
      if (form.is_switched) {
        return airportZoneData.filter(
          data => data.location_id === form.pickup_location?.location_id,
        );
      }

      return airportData.filter(
        data => data.location_id === form.pickup_location?.location_id,
      );
    }

    return [];
  }, [form.is_switched, form.pickup_location?.location_id]);

  return (
    <View style={styles.locationContainer}>
      <DropdownLocation
        onSelect={handleSelectPickUpLocation}
        selected={form.pickup_location}
        errorMessage={formError.error_pickup_location}
        containerStyle={styles.dropdownHalfWidth}
        title={t('detail_order.tripDetail.pickupLocation') as string}
        leftIcon={form.is_switched ? ic_mercu : ic_pinpoin}
        data={
          isListAirportCar
            ? (form.is_switched
                ? airportData
                : (airportZoneData as any)
              )?.filter(
                x =>
                  isListAirportCar && !x?.location?.is_special_airport_transfer,
              )
            : form.is_switched
            ? airportData
            : (airportZoneData as any)
        }
        placeholder={
          form.is_switched
            ? `${t('Home.daily.airport_placeholder')}`
            : `${t('Home.daily.pickup_location_placeholder')}`
        }
      />
      <TouchableOpacity
        onPress={() => {
          setForm(prev => ({
            ...prev,
            dropoff_location: prev?.pickup_location,
            pickup_location: prev?.dropoff_location,
            is_switched: !prev?.is_switched,
          }));
        }}
        style={styles.iconExchange}>
        <Image source={ic_exchange} style={iconCustomSize(30)} />
      </TouchableOpacity>
      <DropdownLocation
        onSelect={handleSelectDropOffLocation}
        selected={form.dropoff_location}
        errorMessage={formError.error_dropoff_location}
        containerStyle={[styles.dropdownHalfWidth, {marginTop: 16}]}
        title={t('detail_order.summary.deliveryLocation') as string}
        leftIcon={!form.is_switched ? ic_mercu : ic_pinpoin}
        data={
          isListAirportCar
            ? dropOffLocationData?.filter(
                x =>
                  isListAirportCar && !x?.location?.is_special_airport_transfer,
              )
            : dropOffLocationData
        }
        placeholder={
          form.is_switched
            ? `${t('Home.daily.pickup_location_placeholder')}`
            : `${t('Home.daily.airport_placeholder')}`
        }
      />
    </View>
  );
};

export default LocationPickerInput;

const styles = StyleSheet.create({
  locationContainer: {
    // ...rowCenter,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  dropdownHalfWidth: {
    width: '100%',
  },
  iconExchange: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    right: '5%',
    zIndex: 100,
    bottom: '35%',
  },
});
