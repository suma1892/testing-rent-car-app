import debounce from 'lodash.debounce';
import React, {useCallback, useEffect, useState} from 'react';
import {iconSize} from 'utils/mixins';
import {IFormLocation, ILocation} from 'types/location.types';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  Image,
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

interface IProps {
  handleSelectLocation: (item: any) => void;
  onFocus: () => void;
  form: IFormLocation;
  setForm: any;
  handleResetCenter: () => void;
  currentLoc: ILocation;
  title: string;
  goBack: () => void;
  placeholder: string;
}

const TripFormComp = ({
  handleSelectLocation,
  onFocus,
  form,
  setForm,
  handleResetCenter,
  currentLoc,
  title,
  placeholder,
  goBack,
}: IProps) => {
  const [locations, setLocations] = useState<any[]>([]);
  const {t} = useTranslation();

  const fetchLocations = async (input: string) => {
    if (input.length < 3) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          input,
        )}&format=json&addressdetails=1&limit=5&countrycodes=id`,
      );
      const data = await response.json();
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations(form?.location?.name || '');

    return () => {
      setLocations([]);
    };
  }, []);

  const debouncedFetchLocations = useCallback(
    debounce((input: string) => {
      fetchLocations(input);
    }, 500),
    [],
  );

  const handleInputChange = (text: string) => {
    setForm((prev: IFormLocation) => ({
      ...prev,
      location: {
        ...prev?.location,
        display_name: text,
      },
    }));
    debouncedFetchLocations(text);
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
        <TouchableOpacity onPress={() => goBack()}>
          <Image source={ic_arrow_left} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
        <View />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Image source={ic_pinpoin} style={styles.icon} />
          <TextInput
            placeholder={title}
            value={form?.location?.display_name}
            style={styles.textInput}
            onChangeText={handleInputChange}
            placeholderTextColor={theme.colors.grey4}
            onFocus={onFocus}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.inputRow}>
          <Image source={ic_add_notes} style={[styles.icon, {tintColor: ''}]} />
          <TextInput
            placeholder={placeholder}
            style={styles.textInput}
            onFocus={onFocus}
            value={form?.detail}
            placeholderTextColor={theme.colors.grey4}
            onChangeText={(text: string) =>
              setForm((prev: IFormLocation) => ({
                ...prev,
                detail: text,
              }))
            }
          />
        </View>
      </View>

      <BottomSheetFlatList
        data={locations}
        keyExtractor={item => item.place_id.toString()}
        ListHeaderComponent={() => (
          <TouchableOpacity
            style={styles.currentLocationWrapper}
            onPress={handleResetCenter}>
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

export default TripFormComp;

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
    padding: 10,
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
    borderBottomColor: theme.colors.grey4,
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
    borderBottomColor: theme.colors.grey5,
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
