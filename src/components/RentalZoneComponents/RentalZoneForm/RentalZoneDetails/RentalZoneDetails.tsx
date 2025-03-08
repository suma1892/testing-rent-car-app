import React from 'react';
import ZoneDetail from './ZoneDetail';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h4} from 'utils/styles';
import {ic_pinpoin3} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {orderState} from 'redux/features/order/orderSlice';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {theme} from 'utils';

const RentalZoneDetails = () => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;
  const {listRentalZone} = useAppSelector(orderState);
  const {vehicleById} = useAppSelector(vehiclesState);

  const sortedZones = listRentalZone
    ?.slice()
    ?.filter(
      ({category}) =>
        !!category?.find(
          ({category_name}) => category_name === vehicleById?.category?.name,
        ),
    )
    .sort((a, b) => a?.name?.localeCompare(b?.name));

  if (!formDaily.with_driver) return null;

  const renderPinpoinImage = (index: number) => {
    const stylesMap = [
      styles.pinpoinImageRentalZone0,
      styles.pinpoinImageRentalZone1,
      styles.pinpoinImageRentalZone2,
    ];

    return (
      <Image
        source={ic_pinpoin3}
        style={stylesMap[index] || styles.pinpoinImageDefault}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={h1}>{t('carDetail.zone_title')}</Text>
      {sortedZones?.length > 0 ? (
        sortedZones.map((zone, i) => (
          <ZoneDetail
            key={`zone_detail_${i}`}
            label={zone.name}
            // free={i === 0}
            free={zone?.name === 'Zona 0'}
            pinpoinImage={renderPinpoinImage(i)}
            data={zone}
          />
        ))
      ) : (
        <View style={styles.emptyWrapper}>
          <Text style={[h4, {fontSize: 12, color: theme.colors.black}]}>
            {t('detail_order.rentalZone.empty_zone')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RentalZoneDetails;

const styles = StyleSheet.create({
  container: {marginTop: 16, marginBottom: 20},
  pinpoinImageRentalZone0: {...iconCustomSize(21), marginTop: 5},
  pinpoinImageRentalZone1: {
    ...iconCustomSize(21),
    marginTop: 5,
    tintColor: 'rgba(241, 163, 58, 1)',
  },
  pinpoinImageRentalZone2: {
    ...iconCustomSize(21),
    marginTop: 5,
    tintColor: 'rgba(229, 96, 47, 1)',
  },
  pinpoinImageDefault: {...iconCustomSize(21), marginTop: 5},
  emptyWrapper: {
    height: 50,
    backgroundColor: theme.colors.grey7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
