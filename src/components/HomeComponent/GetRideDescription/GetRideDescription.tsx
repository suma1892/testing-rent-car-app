import GetRideCarousel from './GetRideCarousel';
import GetRideServices from './GetRideServices';
import React, {memo} from 'react';
import {colors} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {theme} from 'utils';

const GetRideDescription = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <GetRideCarousel />

      <View style={styles.descContainer}>
        <Text style={[styles.h1, styles.textTitle]}>
          {t('Home.getrideDescription.title')}
        </Text>
        <Text style={[styles.h5, styles.textDesc]}>
          {t('Home.getrideDescription.description')}
        </Text>

        <GetRideServices />
      </View>
    </View>
  );
};

export default memo(GetRideDescription);

const styles = StyleSheet.create({
  background: {
    flex: 1, // Supaya background menutupi seluruh layar
  },
  container: {
    backgroundColor: theme.colors.navy,
    paddingTop: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  descContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 34,
  },
  textTitle: {
    color: '#F1A33A',
    fontSize: 18,
    marginVertical: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  textDesc: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
