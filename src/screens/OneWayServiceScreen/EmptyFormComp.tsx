import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  ic_add_notes,
  ic_arrow_left,
  ic_center_map,
  ic_close,
  ic_no_trip,
  ic_pinpoin,
} from 'assets/icons';
import {
  FONT_SIZE_12,
  FONT_SIZE_18,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {theme} from 'utils';
import {showBSheet} from 'utils/BSheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {IFormLocation} from 'types/location.types';
import {iconCustomSize, iconSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {useAppSelector} from 'redux/hooks';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {IRentalLocationResult} from 'types/rental-location.types';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

interface IProps {
  setSnapPoints: (snapPoints: `${string}%`[]) => void;
  setActiveForm: (form: 'empty' | 'pickup' | 'dropoff') => void;
  pickupForm: IFormLocation;
  dropoffForm: IFormLocation;
  district: IRentalLocationResult;
  setDistrict: any;
  resetForm: () => void;
  currentLoc: any;
}

const EmptyFormComp = ({
  setSnapPoints,
  setActiveForm,
  dropoffForm,
  pickupForm,
  district,
  setDistrict,
  resetForm,
  currentLoc,
}: IProps) => {
  const {data: rentalLocationData} = useAppSelector(rentalLocationState);

  const {t} = useTranslation();
  const navigation = useNavigation();
  const showDistrict = () => {
    showBSheet({
      snapPoint: ['50%', '50%'],
      content: (
        <View style={styles.bottomSheetContent}>
          <View
            style={[
              rowCenter,
              {justifyContent: 'space-between', width: '100%'},
            ]}>
            <Text style={styles.bottomSheetTitle}>
              {t('one_way.select_region')}
            </Text>
            <TouchableOpacity onPress={showDistrict}>
              <Image source={ic_close} style={iconCustomSize(12)} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bottomSheetDesc}>
            {t('one_way.available_region')}
          </Text>
          <BottomSheetFlatList
            contentContainerStyle={styles.bottomSheetList}
            data={rentalLocationData || []}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setDistrict(item);
                  resetForm();
                  showDistrict();
                }}>
                <Image
                  source={ic_pinpoin}
                  style={[
                    iconCustomSize(18),
                    {tintColor: theme.colors.dark_orange, marginRight: 8},
                  ]}
                />
                <Text style={styles.bottomSheetItemText}>{item?.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ),
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_arrow_left} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {t('one_way.select_travel_destination')}
        </Text>
        <View />
      </View>

      <TouchableOpacity style={styles.locWrapper} onPress={showDistrict}>
        <Image source={ic_pinpoin} style={styles.locIcon} />
        <Text style={styles.locText}>
          {district?.name || t('one_way.choose_your_route')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => {
          setSnapPoints(['50%', '90%']);
          setActiveForm('pickup');
        }}>
        <View style={styles.inputRow}>
          <Image
            source={ic_pinpoin}
            style={[styles.locIcon, {tintColor: theme.colors.navy}]}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.locText,
              {
                color: pickupForm?.location?.display_name
                  ? theme.colors.black
                  : theme.colors.grey5,
              },
            ]}>
            {pickupForm?.location?.display_name || t('one_way.detail_pickup')}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.inputRow}>
          <Image source={ic_add_notes} style={styles.inputIcon} />
          <Text
            numberOfLines={1}
            style={[
              styles.locText,
              {
                color: pickupForm?.detail
                  ? theme.colors.black
                  : theme.colors.grey5,
              },
            ]}>
            {pickupForm?.detail || t('one_way.detail_pickup')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => {
          setSnapPoints(['50%', '90%']);
          setActiveForm('dropoff');
        }}>
        <View style={styles.inputRow}>
          <Image source={ic_pinpoin} style={styles.locIcon} />
          <Text
            numberOfLines={1}
            style={[
              styles.locText,
              {
                color: dropoffForm?.location?.display_name
                  ? theme.colors.black
                  : theme.colors.grey5,
              },
            ]}>
            {dropoffForm?.location?.display_name ||
              t('one_way.dropoff_placeholder')}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.inputRow}>
          <Image source={ic_add_notes} style={styles.inputIcon} />
          <Text
            numberOfLines={1}
            style={[
              styles.locText,
              {
                color: dropoffForm?.detail
                  ? theme.colors.black
                  : theme.colors.grey5,
              },
            ]}>
            {dropoffForm?.detail ||
              t('one_way.dropoff_placeholder_description')}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.currentLocationWrapper}>
        <Image source={ic_center_map} style={styles.currentLocationIcon} />
        <View>
          <Text style={styles.currentLocationTitle}>
            {t('one_way.current_location')}
          </Text>
          <Text style={styles.currentLocationText}>
            {currentLoc?.display_name || t('one_way.unknwon_location')}
          </Text>
        </View>
      </View>

      <View style={styles.dividerFull} />

      <View style={styles.noTripWrapper}>
        <Image source={ic_no_trip} style={styles.noTripIcon} />
        <View>
          <Text style={styles.noTripTitle}>{t('one_way.no_trip')}</Text>
          <Text style={styles.noTripText}>
            {t('one_way.no_trip_description')}{' '}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EmptyFormComp;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  locWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    borderRadius: 7,
    marginBottom: 16,
  },
  locIcon: {
    width: 18,
    height: 18,
    tintColor: theme.colors.dark_orange,
    marginRight: 8,
  },
  locText: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.black,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 7,
    padding: 10,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.grey4,
    marginVertical: 10,
  },
  currentLocationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '85%',
  },
  currentLocationIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  currentLocationTitle: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  dividerFull: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    marginVertical: 20,
  },
  noTripWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    width: '85%',
  },
  noTripIcon: {
    width: 46,
    height: 51,
    marginRight: 10,
  },
  noTripTitle: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  noTripText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  bottomSheetContent: {
    padding: 20,
    flex: 1,
    alignItems: 'flex-start',
    width: WINDOW_WIDTH,
  },
  bottomSheetTitle: {
    fontSize: FONT_SIZE_18,
    fontWeight: FONT_WEIGHT_BOLD,
    marginBottom: 10,
  },
  bottomSheetList: {
    alignItems: 'flex-start',
    width: WINDOW_WIDTH,
  },
  listItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey4,
    width: WINDOW_WIDTH,
    flexDirection: 'row',
  },
  bottomSheetItemText: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.black,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  bottomSheetDesc: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
});
