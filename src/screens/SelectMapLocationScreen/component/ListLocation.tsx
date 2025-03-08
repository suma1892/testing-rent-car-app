import debounce from 'lodash.debounce';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {iconSize} from 'utils/mixins';
import {IFormLocation, ILocation} from 'types/location.types';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {
  ic_pinpoin,
  ic_add_notes,
  ic_pinpoin3,
  ic_arrow_left,
  ic_center_map,
} from 'assets/icons';
import {
  FONT_SIZE_14,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {useNavigation} from '@react-navigation/native';
import {getDetailsFromCoordinates} from 'redux/effects';
import {showToast} from 'utils/Toast';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {useAppSelector} from 'redux/hooks';

interface IProps {
  selectedLocation: string;
  currentLoc: ILocation;
  activeLocation: ILocation;
  setActiveLocation: Dispatch<SetStateAction<ILocation>>;
  prev_screen: 'pickup' | 'dropoff';
  inputLocation: string;
  setInputLocation: any;
  isAirport: boolean;
}

const ListLocation = ({
  selectedLocation,
  currentLoc,
  isAirport,
  activeLocation,
  prev_screen,
  setActiveLocation,
  inputLocation,
  setInputLocation,
}: IProps) => {
  const [locations, setLocations] = useState<any[]>([]);
  const {t} = useTranslation();
  const navigation = useNavigation();
  // const [inputLocation, setInputLocation] = useState('');
  const {formDaily, formAirportTransfer, sub_service_type} =
    useAppSelector(appDataState);

  const fetchLocations = async (input: string) => {
    if (input.length < 3) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          input,
        )}&format=json&addressdetails=1&limit=5&countrycodes=id,sg`,
      );
      const data = await response.json();
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations(selectedLocation || '');

    return () => {
      setLocations([]);
    };
  }, [navigation, selectedLocation]);

  const debouncedFetchLocations = useCallback(
    debounce((input: string) => {
      fetchLocations(input);
    }, 500),
    [],
  );

  const handleInputChange = (text: string) => {
    setInputLocation(text);
    debouncedFetchLocations(text);
  };

  // const handleSelectLocation = (item: any) => {
  //   setInputLocation(item?.display_name);
  // };

  const getDistrictName = () => {
    if (prev_screen === 'pickup') {
      return formAirportTransfer?.pickup_location?.location?.name;
    }
    if (prev_screen === 'dropoff') {
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

  const handleSelectLocation = async (location: any) => {
    const resdetail = await getDetailsFromCoordinates(
      location?.lat,
      location?.lon,
    );

    if (isOutsideSelectedLocation(resdetail)) {
      return;
    }
    // console.log(location);
    try {
      setActiveLocation({
        lat: JSON.parse(location?.lat),
        lon: JSON.parse(location?.lon),
        display_name: location?.display_name,
        name: location?.name,
      });
      setInputLocation(location?.display_name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Clean up debounce on unmount
    return () => {
      debouncedFetchLocations.cancel();
    };
  }, [debouncedFetchLocations]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_arrow_left} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('detail_order.formDetail.location_details')}</Text>
        <View />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Image source={ic_pinpoin} style={styles.icon} />

          <TextInput
            placeholder={
              isAirport
                ? t('detail_order.pickup_location_map_placeholder')
                : t('detail_order.dropoff_location_map_placeholder')
            }
            value={inputLocation}
            style={[
              styles.textInput,
              Platform.OS === 'ios' && {paddingVertical: 14},
            ]}
            onChangeText={handleInputChange}
            placeholderTextColor={theme.colors.grey4}
          />
        </View>
      </View>

      <BottomSheetFlatList
        data={locations}
        keyExtractor={item => item.place_id.toString()}
        ListHeaderComponent={() => (
          <TouchableOpacity
            style={styles.currentLocationWrapper}
            onPress={() => handleSelectLocation(currentLoc)}>
            <Image source={ic_center_map} style={styles.currentLocationIcon} />
            <View>
              <Text style={styles.currentLocationTitle}>
                {t('one_way.current_location')}
              </Text>
              <View style={{width: '90%'}}>
                <Text style={styles.currentLocationText}>
                  {currentLoc?.display_name || t('one_way.unknwon_location')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.locationItem}
            onPress={() => handleSelectLocation(item)}>
            <Image
              source={ic_pinpoin3}
              style={[styles.icon, styles.locationIcon]}
            />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationName}>{item.name}</Text>
              <Text style={styles.locationDescription}>
                {item.display_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ListLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: theme.colors.white,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    ...iconSize,
    tintColor: theme.colors.navy,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey4,
    // marginVertical: 5,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    // paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
  },
  locationIcon: {
    tintColor: theme.colors.grey4,
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.black,
  },
  locationDescription: {
    fontSize: 12,
    color: theme.colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    fontSize: FONT_SIZE_14,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  currentLocationWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 0,
    // width: '85%',
    borderBottomColor: theme.colors.grey6,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  currentLocationIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: 'stretch',
  },
  currentLocationTitle: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
});
