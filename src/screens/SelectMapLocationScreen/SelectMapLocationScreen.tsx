import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {theme} from 'utils';
import {LeafletView} from 'react-native-leaflet-view';
import {ic_pinpoin} from 'assets/icons';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import BottomSheet from '@gorhom/bottom-sheet';
import ListLocation from './component/ListLocation';
import useAirportCarSearchForm from 'components/HomeComponent/CarSearchForm/hooks/useAirportCarSearchForm';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {getLocationAsync} from 'utils/getLocation';
import {getDetailsFromCoordinates} from 'redux/effects';
import {ILocation} from 'types/location.types';
import Button from 'components/Button';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  appDataState,
  saveFormAirportTransfer,
} from 'redux/features/appData/appDataSlice';
import {RootStackParamList} from 'types/navigator';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';
export type ScreenRouteProp = RouteProp<
  RootStackParamList,
  'SelectMapLocation'
>;

const SelectMapLocationScreen = () => {
  const {t} = useTranslation();
  const bottomSheetFormRef = useRef<BottomSheet>(null);
  const {form, setForm, formError, setFormError, handleSearch} =
    useAirportCarSearchForm({reset: false});
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<ILocation>();
  const [activeLocation, setActiveLocation] = useState<ILocation>();
  const dispatch = useAppDispatch();
  const {formDaily, formAirportTransfer, sub_service_type} =
    useAppSelector(appDataState);
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [inputLocation, setInputLocation] = useState('');

  useEffect(() => {
    getCurrentLocation();
    if (route?.params?.prev_screen === 'pickup') {
      fetchLocations(
        `${formAirportTransfer?.pickup_location?.name} ${formAirportTransfer?.pickup_location?.location?.name}`,
      );
    } else {
      fetchLocations(
        `${formAirportTransfer?.dropoff_location?.name},${formAirportTransfer?.dropoff_location?.location?.name}`,
      );
    }

    return () => {};
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.prev_screen === 'pickup') {
      setActiveLocation(formAirportTransfer?.pickup_location);
    }
    if (route?.params?.prev_screen === 'dropoff') {
      setActiveLocation(formAirportTransfer?.dropoff_location);
    }

    return () => {};
  }, [navigation, formAirportTransfer, route]);

  const getCurrentLocation = async () => {
    let loc: any;
    try {
      loc = await getLocationAsync({need_permission: true});

      // console.log('loc = ', loc);
    } catch (error) {
      // navigation.goBack();
      console.log('err 2 = ', error);
      return;
    }

    const resdetail = await getDetailsFromCoordinates(
      loc.latitude,
      loc.longitude,
    );
    // console.log('resdetail = ', resdetail);
    setCurrentLoc({
      lat: loc.latitude,
      lon: loc.longitude,
      name: resdetail?.name || resdetail?.address?.city,
      display_name: resdetail?.display_name,
    });
  };

  const getDistrictName = () => {
    if (route?.params?.prev_screen === 'pickup') {
      return formAirportTransfer?.pickup_location?.location?.name;
    }
    if (route?.params?.prev_screen === 'dropoff') {
      return formAirportTransfer?.dropoff_location?.location?.name;
    }
  };
  const isOutsideSelectedLocation = (resdetail: any) => {
    if (
      resdetail?.address?.state?.toLowerCase() !==
        getDistrictName()?.toLowerCase() &&
      resdetail?.address?.country?.toLowerCase() !==
        getDistrictName()?.toLowerCase() &&
      !resdetail?.address?.city
        ?.toLowerCase()
        ?.includes(getDistrictName()?.toLowerCase())
    ) {
      showToast({
        message: t('detail_order.validasi_outside_loc'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      return true;
    }
    return false;
  };

  const handleMapTap = async (message: {
    event: string;
    payload: {touchLatLng: {lat: any; lng: any}};
  }) => {
    if (message?.event === 'onMapClicked') {
      const {lat, lng} = message.payload.touchLatLng;
      // console.log('message.payload = ', message);
      setIsLoading(true);
      const resdetail = await getDetailsFromCoordinates(lat, lng);
      setIsLoading(false);
      if (isOutsideSelectedLocation(resdetail)) {
        return;
      }

      setActiveLocation({
        lat: lat,
        lon: lng,
        name: resdetail?.name || resdetail?.address?.city,
        display_name: resdetail?.display_name,
      });
      setInputLocation(resdetail?.display_name);
    }
  };

  const fetchLocations = async (input: string) => {
    console.log('input ', input);
    if (input.length < 3) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          input,
        )}&format=json&addressdetails=1&limit=5&countrycodes=id,sg`,
      );
      const data = await response.json();
      console.log('data?.[0] = ', data?.[0]);
      setSelectedLocation(data?.[0] || {});
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const getPlaceholder = () => {
    if (route?.params?.prev_screen === 'pickup') {
      const _data =
        formAirportTransfer?.pickup_location?.airport_location_type?.name ===
        'airport';
      return _data;
    } else {
      const _data =
        formAirportTransfer?.dropoff_location?.airport_location_type?.name ===
        'airport';
      return _data;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.white}}>
      <View
        style={{
          height: WINDOW_HEIGHT / 2,
        }}>
        <LeafletView
          onError={err => console.log('err ', err)}
          mapLayers={[
            {
              baseLayer: true,
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
          ]}
          mapMarkers={
            activeLocation?.lat && activeLocation?.lon
              ? [
                  {
                    id: 'marker-a',
                    icon: 'https://getandride.s3.ap-southeast-3.amazonaws.com/vehicle/picker/pin-navy.png',
                    position: {
                      lat: activeLocation?.lat,
                      lng: activeLocation?.lon,
                    },
                  },
                ]
              : []
          }
          mapCenterPosition={{
            lat: activeLocation?.lat || selectedLocation?.lat,
            lng: activeLocation?.lon || selectedLocation?.lon,
          }}
          onMessageReceived={(event: any) => handleMapTap(event)}
          zoom={12}
        />
      </View>
      <BottomSheet
        ref={bottomSheetFormRef as any}
        index={0}
        snapPoints={['50%', '90%']}>
        <>
          <ListLocation
            selectedLocation={
              route?.params?.prev_screen === 'pickup'
                ? form?.pickup_location?.name
                : form?.dropoff_location?.name
            }
            isAirport={getPlaceholder()}
            currentLoc={currentLoc!}
            activeLocation={activeLocation!}
            setActiveLocation={setActiveLocation as any}
            prev_screen={route?.params?.prev_screen}
            inputLocation={activeLocation?.display_name!}
            setInputLocation={(v: string) => {
              setActiveLocation(prev => ({
                ...prev,
                display_name: v,
              }));
            }}
          />
        </>
      </BottomSheet>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          width: WINDOW_WIDTH,
          alignItems: 'center',
          backgroundColor: theme.colors.white,
        }}>
        <Button
          _theme="navy"
          isLoading={isLoading}
          onPress={() => {
            if (route?.params.prev_screen === 'pickup') {
              console.log(
                'formAirportTransfer?.pickup_location ',
                formAirportTransfer?.pickup_location,
              );
              console.log('activeLocation ', activeLocation);
              dispatch(
                saveFormAirportTransfer({
                  ...formAirportTransfer,
                  pickup_location: {
                    ...formAirportTransfer?.pickup_location,
                    lat: activeLocation?.lat,
                    lon: activeLocation?.lon,
                    display_name: activeLocation?.display_name,
                    // ...activeLocation,
                  },
                }),
              );
            }
            console.log(
              'route?.params.prev_screen ',
              route?.params.prev_screen,
            );

            if (route?.params.prev_screen === 'dropoff') {
              dispatch(
                saveFormAirportTransfer({
                  ...formAirportTransfer,
                  dropoff_location: {
                    ...formAirportTransfer?.dropoff_location,
                    lat: activeLocation?.lat,
                    lon: activeLocation?.lon,
                    display_name: activeLocation?.display_name,
                  },
                }),
              );
            }
            navigation.goBack();
          }}
          title="Confirm"
          styleWrapper={{width: '90%'}}
        />
      </View>
    </View>
  );
};

export default SelectMapLocationScreen;

const styles = StyleSheet.create({});
