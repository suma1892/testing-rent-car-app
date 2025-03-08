import AirportLayout from 'components/HomeComponent/AirportLayout';
import React, {useCallback, useMemo, useRef} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {getStartRentalDate} from 'utils/functions';
import {h1, h5} from 'utils/styles';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';
import i18next from 'i18next';

const InputPreview = ({}) => {
  const {t} = useTranslation();
  const {formAirportTransfer} = useAppSelector(appDataState);
  const sheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['70%', '70%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      // setShowWheel(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      sheetRef.current?.close();
      sheetRef.current?.dismiss();
    }, [
      formAirportTransfer.pickup_location,
      formAirportTransfer.dropoff_location,
      formAirportTransfer.pickup_date,
      formAirportTransfer.pickup_time,
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
        {rentalState['Airport Transfer']}
      </Text>

      <View style={styles.row}>
        <View style={{width: WINDOW_WIDTH / 1.5}}>
          <Text style={[h5]}>
            {formAirportTransfer.pickup_location.name} |{' '}
            {getStartRentalDate({
              withDay: false,
              startBookingDate: formAirportTransfer.pickup_date,
              dateFormat: 'd MMM yyyy',
            })}{' '}
            -{' '}
            {getStartRentalDate({
              withDay: false,
              startBookingDate: formAirportTransfer.pickup_date,
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
        {formAirportTransfer.pickup_time}{' '}
        {/* {formAirportTransfer.pickup_location?.time_zone ||
          formAirportTransfer.dropoff_location?.time_zone} */}{' '}
        {getIndonesianTimeZoneName({
          timezone:
            formAirportTransfer.pickup_location?.time_zone ||
            formAirportTransfer.dropoff_location?.time_zone,
          lang: i18next.language,
        })}
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
          <AirportLayout reset={false} isListAirportCar={true} />
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
