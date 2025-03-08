import DailyForm from '../DailyForm/DailyForm';
import React, {useCallback, useMemo, useRef} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {h1, h5} from 'utils/styles';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';
import {getStartRentalDate} from 'utils/functions';
import i18next from 'i18next';

const InputPreview = ({}) => {
  const {t} = useTranslation();
  const {services} = useAppSelector(rentalLocationState);
  const formDaily = useAppSelector(appDataState).formDaily;
  const sheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['70%', '70%'], []);

  // callbacks
  const handleSheetChanges = useCallback(() => {}, []);

  useFocusEffect(
    useCallback(() => {
      sheetRef.current?.close();
      sheetRef.current?.dismiss();
    }, [
      formDaily.start_booking_date,
      formDaily.end_booking_date,
      formDaily.start_booking_time,
      formDaily.end_booking_time,
      formDaily.location,
      formDaily?.refresh_data,
    ]),
  );

  const rentalState = {
    Daily: t('Home.daily.title'),
    'Airport Transfer': t('Home.airportTransfer.title'),
    Tour: t('Home.tour.title'),
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, {color: theme.colors.navy}]}>
        {rentalState['Daily']} -{' '}
        {formDaily.with_driver
          ? t('Home.daily.with_driver')
          : t('Home.daily.without_driver')}
      </Text>

      <View style={styles.row}>
        <View style={{width: WINDOW_WIDTH / 1.5}}>
          <Text style={[h5]}>
            {formDaily.location} |{' '}
            {getStartRentalDate({
              withDay: false,
              startBookingDate: formDaily.start_booking_date,
              dateFormat: 'd MMM yyyy',
            })}{' '}
            -{' '}
            {getStartRentalDate({
              withDay: false,
              startBookingDate: formDaily.end_booking_date,
              dateFormat: 'd MMM yyyy',
            })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => sheetRef.current?.present()}>
          <Text style={[h1, {color: theme.colors.navy}]}>
            {t('global.button.change')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={h5}>
        {formDaily.start_booking_time}{' '}
        {getIndonesianTimeZoneName({
          timezone: formDaily?.selected_location?.time_zone,
          lang: i18next.language,
        } as any)}
      </Text>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor: '#fff'}}
        handleStyle={{marginBottom: 8, marginTop: 4}}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.75,
          shadowRadius: 24,

          elevation: 24,
          // backgroundColor: 'red'
        }}>
        <BottomSheetScrollView style={{flex: 1}}>
          <DailyForm
            facilities={services?.[0]?.sub_services?.[0]?.facilities}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default InputPreview;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingVertical: 15,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#D8DFFD',
    borderRadius: 5,
  },
});
