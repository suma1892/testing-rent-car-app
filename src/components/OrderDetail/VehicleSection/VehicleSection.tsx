import Config from 'react-native-config';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import React, {useState, useEffect} from 'react';
import {useAppSelector} from 'redux/hooks';
import {airportVehiclesState} from 'redux/features/airportVehicles/airportVehiclesSlice';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {boxShadow, iconCustomSize, rowCenter} from 'utils/mixins';
import {h1, h4} from 'utils/styles';
import {img_car_empty} from 'assets/images';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import i18n from 'assets/lang/i18n';
import {getTransmission} from 'utils/functions';

const VehicleSection = () => {
  const {t} = useTranslation();
  const {vehicleById} = useAppSelector(vehiclesState);
  const {formDaily, sub_service_type} = useAppSelector(appDataState);
  const {airportVehicleById} = useAppSelector(airportVehiclesState);

  const isAirportTransfer = sub_service_type === 'Airport Transfer';

  const max_passanger = isAirportTransfer
    ? airportVehicleById?.max_passenger
    : vehicleById?.max_passanger;
  const max_suitcase = isAirportTransfer
    ? airportVehicleById?.max_suitecase
    : vehicleById?.max_suitcase;
  const transmission = isAirportTransfer
    ? airportVehicleById?.transmission
    : vehicleById?.transmission;
  const name = isAirportTransfer
    ? airportVehicleById?.category || ''
    : `${vehicleById?.brand_name || ''} ${vehicleById?.name || ''}`;
  const image = isAirportTransfer
    ? airportVehicleById?.images?.[0]
    : vehicleById?.photo?.[0]?.name;

  const [imageSource, setImageSource] = useState<FastImageProps['source']>({
    uri: Config.URL_IMAGE + image || '',
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  });

  useEffect(() => {
    setImageSource({
      uri: Config.URL_IMAGE + image || '',
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable,
    });
  }, [image]);

  const rentalState = {
    Daily: t('Home.daily.title'),
    'Airport Transfer': t('Home.airportTransfer.title'),
    Tour: t('Home.tour.title'),
  };

  return (
    <View style={styles.container}>
      <FastImage
        source={imageSource}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => {
          setImageSource(img_car_empty);
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.vehicleName}>{name}</Text>
        <Text style={styles.passenger}>
          {max_passanger} {t('detail_order.seats')} - {max_suitcase}{' '}
          {t('detail_order.suitcase')} -{' '}
          {getTransmission({
            lang: i18n.language as any,
            transmission: transmission,
          })}
        </Text>
        <Text style={styles.driverStatus}>
          {rentalState[sub_service_type]}{' '}
          {sub_service_type !== 'Airport Transfer' && (
            <Text>
              -{' '}
              {formDaily.with_driver
                ? t('Home.daily.with_driver')
                : t('Home.daily.without_driver')}
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

export default VehicleSection;

const styles = StyleSheet.create({
  container: {
    ...rowCenter,
    ...boxShadow('#000', {height: 1, width: 1}, 3.27, 0.24),
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 22,
    borderRadius: 5,
  },
  image: {
    ...iconCustomSize(76),
    borderRadius: 5,
  },
  infoContainer: {
    marginLeft: 12,
  },
  vehicleName: {
    ...h1,
    color: theme.colors.navy,
  },
  passenger: {
    ...h4,
    fontSize: 12,
    marginVertical: 12,
  },
  driverStatus: {
    ...h4,
    fontSize: 12,
  },
});
