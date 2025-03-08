import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {theme} from 'utils';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {showBSheet} from 'utils/BSheet';
import {
  FONT_SIZE_12,
  FONT_SIZE_14,
  FONT_SIZE_18,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {ic_close, ic_pinpoin} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {IRentalLocationResult} from 'types/rental-location.types';
import {authState, logout} from 'redux/features/auth/authSlice';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';

const OneWayLayout = () => {
  const [district, setDistrict] = useState<IRentalLocationResult>();
  const {data: rentalLocationData} = useAppSelector(rentalLocationState);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authState).auth;
  const {t} = useTranslation();

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

  useFocusEffect(
    useCallback(() => {
      setDistrict(undefined);
    }, []),
  );
  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.title}>{t('one_way.choose_your_route')}</Text>

      <TouchableOpacity style={styles.locWrapper} onPress={showDistrict}>
        <Image source={ic_pinpoin} style={styles.locIcon} />
        <Text
          style={[
            styles.locText,
            {color: district?.name ? theme.colors.black : theme.colors.grey5},
          ]}>
          {district?.name || t('one_way.choose_your_route')}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('one_way.search_route_destination')}</Text>
      <TouchableOpacity
        style={styles.locWrapper}
        onPress={() => {
          if (!auth?.access_token) {
            showToast({
              message: t('global.alert.please_login_to_continue'),
              type: 'error',
              title: t('global.alert.error'),
            });
            dispatch(logout());

            navigation.navigate('Login', {previousScreen: 'MainTab'});
            return;
          }

          if (!district?.id) {
            showToast({
              message: t('global.alert.please_select_district'),
              type: 'error',
              title: t('global.alert.error'),
            });
            return;
          }
          if (district?.id) {
            navigation.navigate('OneWayService', {district: district!});
          }
        }}>
        <Image
          source={ic_pinpoin}
          style={[styles.locIcon, {tintColor: theme.colors.orange}]}
        />
        <Text style={[styles.locText, {color: theme.colors.grey5}]}>
          {t('one_way.search_route_destination_placeholder')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OneWayLayout;

const styles = StyleSheet.create({
  bottomSheetContent: {
    padding: 20,
    flex: 1,
    alignItems: 'flex-start',
    width: WINDOW_WIDTH,
  },
  mainWrapper: {
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    borderRadius: 7,
    padding: 10,
    margin: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: FONT_SIZE_18,
    fontWeight: FONT_WEIGHT_BOLD,
    marginBottom: 10,
  },
  bottomSheetDesc: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  bottomSheetList: {
    alignItems: 'flex-start',
    width: WINDOW_WIDTH,
  },
  listItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    width: WINDOW_WIDTH,
    flexDirection: 'row',
  },
  bottomSheetItemText: {
    fontSize: FONT_SIZE_14,
    color: theme.colors.black,
    fontWeight: FONT_WEIGHT_BOLD,
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
});
