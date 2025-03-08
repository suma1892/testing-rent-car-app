import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {ic_exchange, ic_mercu, ic_pinpoin, ic_plane2} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize, WINDOW_HEIGHT} from 'utils/mixins';
import {h1, h4, h3} from 'utils/styles';
import {FONT_SIZE_10} from 'utils/typography';
import LocationModalContent from 'components/DropdownLocation/LocationModalContent';
import {showBSheet} from 'utils/BSheet';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  appDataState,
  saveFormAirportTransfer,
} from 'redux/features/appData/appDataSlice';
import {getLocationId} from 'redux/effects';
import useAirportCarSearchForm from 'components/HomeComponent/CarSearchForm/hooks/useAirportCarSearchForm';
import {AIRPORT_LOCATION_DEFAULT} from 'utils/constants';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const SelectLocation = () => {
  const {airportData, airportZoneData} = useAppSelector(rentalLocationState);
  const {t} = useTranslation();
  // data={form.is_switched ? airportData : (airportZoneData as any)}
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {form, setForm, formError, setFormError, handleSearch} =
    useAirportCarSearchForm({reset: false});
  const {formAirportTransfer} = useAppSelector(appDataState);

  const toggleDropdownPickup = useCallback(() => {
    showBSheet({
      content: (
        <LocationModalContent
          data={(formAirportTransfer?.is_switched
            ? airportData
            : airportZoneData
          ).filter(x => x?.location?.is_special_airport_transfer)}
          onItemPress={handleSelectPickUpLocation}
        />
      ),
    });
  }, [
    airportData,
    formAirportTransfer?.is_switched,
    formAirportTransfer?.pickup_location?.name,
  ]);

  const toggleDropdownDropoff = useCallback(() => {
    showBSheet({
      content: (
        <LocationModalContent
          data={dropOffLocationData?.filter(
            x => x?.location?.is_special_airport_transfer,
          )}
          onItemPress={handleSelectDropOffLocation}
        />
      ),
    });
  }, [
    airportData,
    formAirportTransfer,
    formAirportTransfer?.pickup_location,
    formAirportTransfer?.pickup_location?.display_name,
    formAirportTransfer?.is_switched,
    formAirportTransfer?.dropoff_location?.name,
  ]);

  const handleSelectPickUpLocation = useCallback(
    async (location: any) => {
      console.log('location = ', location?.name);
      const res = await getLocationId(location?.location_id);
      if (
        location?.location_id !==
        formAirportTransfer?.dropoff_location?.location_id
      ) {
        dispatch(
          saveFormAirportTransfer({
            ...formAirportTransfer,
            dropoff_location: AIRPORT_LOCATION_DEFAULT,
            pickup_location: {
              ...location,
              time_zone: res?.time_zone,
              time_zone_identifier: res?.time_zone_identifier,
            },
          }),
        );
      } else {
        dispatch(
          saveFormAirportTransfer({
            ...formAirportTransfer,
            pickup_location: {
              ...location,
              // name: formAirportTransfer?.pickup_location?.name,
              time_zone: res?.time_zone,
              time_zone_identifier: res?.time_zone_identifier,
            },
          }),
        );
      }
      setFormError({
        ...formError,
        error_pickup_location: '',
        error_dropoff_location: '',
      });
      toggleDropdownPickup();
    },
    [
      dispatch,
      formAirportTransfer,
      formError,
      formAirportTransfer.is_switched,
      setForm,
      setFormError,
    ],
  );

  const handleSelectDropOffLocation = useCallback(
    async (location: any) => {
      // console.log('location = ', location);
      // if (location?.is_extra) {
      //   // setForm({
      //   //   ...form,
      //   //   pickup_location: AIRPORT_LOCATION_DEFAULT,
      //   //   dropoff_location: location,
      //   // });
      //   dispatch(
      //     saveFormAirportTransfer({
      //       ...formAirportTransfer,
      //       pickup_location: AIRPORT_LOCATION_DEFAULT,
      //       dropoff_location: location,
      //     }),
      //   );
      // } else {
      //   // setForm({...form, dropoff_location: location});
      //   dispatch(
      //     saveFormAirportTransfer({
      //       ...formAirportTransfer,
      //       dropoff_location: location,
      //     }),
      //   );
      // }
      // setFormError({
      //   ...formError,
      //   error_dropoff_location: '',
      //   error_pickup_location: '',
      // });
      // toggleDropdownDropoff();

      // console.log('location = ', location);
      const res = await getLocationId(location?.location_id);

      // console.log('location = ', location);
      if (
        location?.location_id !==
        formAirportTransfer?.pickup_location?.location_id
      ) {
        console.log('mas8k iff');
        dispatch(
          saveFormAirportTransfer({
            ...formAirportTransfer,
            pickup_location: AIRPORT_LOCATION_DEFAULT,
            dropoff_location: {
              ...location,
              time_zone: res?.time_zone,
              time_zone_identifier: res?.time_zone_identifier,
            },
          }),
        );
      } else {
        // console.log('masuk else')
        console.log(
          'handleSelectDropOffLocation ',
          formAirportTransfer?.pickup_location,
        );
        dispatch(
          saveFormAirportTransfer({
            ...formAirportTransfer,
            dropoff_location: {
              ...location,
              // name: formAirportTransfer?.dropoff_location?.name,
              time_zone: res?.time_zone,
              time_zone_identifier: res?.time_zone_identifier,
            },
          }),
        );
      }
      setFormError({
        ...formError,
        error_pickup_location: '',
        error_dropoff_location: '',
      });
      toggleDropdownPickup();
    },
    [
      dispatch,
      formAirportTransfer,
      formError,
      setForm,
      setFormError,
      formAirportTransfer?.pickup_location,
    ],
  );

  const dropOffLocationData = useMemo(() => {
    if (!!formAirportTransfer.pickup_location?.location_id) {
      if (formAirportTransfer.is_switched) {
        return airportZoneData.filter(
          data =>
            data.location_id ===
            formAirportTransfer.pickup_location?.location_id,
        );
      }

      return airportData.filter(
        data =>
          data.location_id === formAirportTransfer.pickup_location?.location_id,
      );
    }

    return [];
  }, [
    formAirportTransfer.is_switched,
    formAirportTransfer.pickup_location?.location_id,
  ]);

  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.colors.grey5,
          borderRadius: 8,
          padding: 12,
          height: WINDOW_HEIGHT / 8,
        }}>
        <TouchableOpacity style={[rowCenter]} onPress={toggleDropdownPickup}>
          <Image
            source={formAirportTransfer.is_switched ? ic_mercu : ic_pinpoin}
            style={iconCustomSize(18)}
          />
          <View style={{marginLeft: 8}}>
            <Text style={[h1]}>{t('myBooking.pickup')}</Text>
            <Text style={[h4, {fontSize: FONT_SIZE_10}]}>
              {formAirportTransfer?.pickup_location?.name}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey5,
            marginVertical: 12.5,
          }}
        />

        <TouchableOpacity
          style={{alignSelf: 'center', padding: 0}}
          onPress={() =>
            navigation.navigate('SelectMapLocation', {prev_screen: 'pickup'})
          }>
          <Text style={[h3, {fontSize: FONT_SIZE_10, textAlign: 'center'}]}>
            {formAirportTransfer?.pickup_location?.display_name ||
              t('detail_order.formDetail.add_location_details')}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.exchange}
        onPress={() => {
          dispatch(
            saveFormAirportTransfer({
              ...formAirportTransfer,
              pickup_location: formAirportTransfer?.dropoff_location,
              dropoff_location: formAirportTransfer?.pickup_location,
              is_switched: !formAirportTransfer?.is_switched,
              meet_and_greet_name: ''
              
            }),
          );
        }}>
        <Image source={ic_exchange} style={iconCustomSize(30)} />
      </TouchableOpacity>
      <View style={{marginVertical: 10}} />
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.colors.grey5,
          borderRadius: 8,
          padding: 12,
          height: WINDOW_HEIGHT / 8,
        }}>
        <TouchableOpacity style={[rowCenter]} onPress={toggleDropdownDropoff}>
          <Image
            source={!formAirportTransfer.is_switched ? ic_mercu : ic_pinpoin}
            style={iconCustomSize(18)}
          />
          <View style={{marginLeft: 8}}>
            <Text style={[h1]}>{t('myBooking.dropoff')}</Text>
            <Text style={[h4, {fontSize: FONT_SIZE_10}]}>
              {formAirportTransfer?.dropoff_location?.name}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#CBCBCB',
            marginVertical: 12.5,
          }}
        />

        <TouchableOpacity
          style={{alignSelf: 'center', padding: 0}}
          onPress={() =>
            navigation.navigate('SelectMapLocation', {prev_screen: 'dropoff'})
          }>
          <Text style={[h3, {fontSize: FONT_SIZE_10, textAlign: 'center'}]}>
            {formAirportTransfer?.dropoff_location?.display_name ||
              t('detail_order.formDetail.add_location_details')}
          </Text>
        </TouchableOpacity>
      </View>

      {formAirportTransfer?.pickup_location?.airport_location_type?.name ===
        'airport' && (
        <>
          <Text style={[h4, {marginVertical: 14}]}>
            {t('detail_order.formDetail.meet_greet_name')}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.grey5,
              borderRadius: 8,
              paddingHorizontal: 10,
              ...rowCenter,
            }}>
            <TextInput
              placeholder={t(
                'detail_order.formDetail.meet_greet_name_placeholder',
              )}
              style={{
                width: '100%',
                padding: 10,
                ...h4,
                color: theme.colors.black,
              }}
              placeholderTextColor={theme.colors.grey5}
              value={formAirportTransfer?.meet_and_greet_name}
              onChangeText={value => {
                dispatch(
                  saveFormAirportTransfer({
                    ...formAirportTransfer,
                    meet_and_greet_name: value,
                  }),
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default memo(SelectLocation);

const styles = StyleSheet.create({
  exchange: {
    position: 'absolute',
    right: 20,
    top: WINDOW_HEIGHT / 8.3,
    zIndex: 9,
  },
});