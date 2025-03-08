import React from 'react';
import {h1, h3, h4} from 'utils/styles';
import {ic_koper, ic_seat, ic_transisi} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {InfoProps} from './detailCarComponent.interface';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import { getTransmission } from 'utils/functions';

const Info = ({title, description, show, icon}: InfoProps) => {
  if (show) {
    return (
      <View style={styles.infoContainer}>
        <Image source={icon} style={iconSize} />
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
    );
  }

  return null;
};

const CarInfo = () => {
  const {t, i18n} = useTranslation();
  const vehicleById = useAppSelector(vehiclesState).vehicleById;

  return (
    <View style={styles.container}>
      <Info
        icon={ic_seat}
        title={t('carDetail.seatCapacity')}
        description={`${vehicleById.max_passanger} ${
          vehicleById.max_passanger > 1
            ? t('carDetail.seats')
            : t('carDetail.seat')
        }`}
        show
      />
      <Info
        icon={ic_koper}
        title={t('carDetail.bagDetail')}
        description={`${vehicleById.max_suitcase} ${t('carDetail.bag')}`}
        show
      />

      <View style={styles.infoContainer}>
        <Image source={ic_transisi} style={iconSize} />
        <Text style={styles.infoTitle}>{t('carDetail.transmision')}</Text>
        <Text style={styles.transmissionDescription}>
          {getTransmission({
            lang: i18n.language,
            transmission: vehicleById?.transmission,
          })}
        </Text>
      </View>
    </View>
  );
};

export default CarInfo;

const styles = StyleSheet.create({
  container: {
    ...rowCenter,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoTitle: {
    ...h1,
    paddingVertical: 5,
    fontSize: 12,
  },
  infoDescription: {
    ...h4,
    fontSize: 12,
  },
  transmissionDescription: {
    ...h3,
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
