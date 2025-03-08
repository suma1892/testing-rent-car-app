import React from 'react';
import RentalZoneList from './RentalZoneList';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h4} from 'utils/styles';
import {ic_rounded_plus} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const RentalZoneInput = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const formDaily = useAppSelector(appDataState).formDaily;

  return (
    <View style={styles.container}>
      <Text style={h1}>{t('detail_order.withDriver.rentalZone')}</Text>

      {formDaily?.order_booking_zone!?.length > 0 ? (
        <RentalZoneList />
      ) : (
        <TouchableOpacity
          style={[rowCenter, styles.btnRentWrapper]}
          onPress={() => navigation.navigate('RentalZone' as any)}>
          <Image source={ic_rounded_plus} style={iconCustomSize(18)} />
          <Text style={styles.addRentalZoneLabel}>
            {t('detail_order.withDriver.addRentalZone')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RentalZoneInput;

const styles = StyleSheet.create({
  container: {marginTop: 22},
  btnRentWrapper: {
    width: '100%',
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: theme.colors.grey6,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addRentalZoneLabel: {
    ...h4,
    fontSize: 12,
    marginLeft: 5,
  },
});
