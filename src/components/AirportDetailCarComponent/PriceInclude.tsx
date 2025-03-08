import React, { memo } from 'react';
import {h1, h4} from 'utils/styles';
import {ic_fuel, ic_parking, ic_toll} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const PriceInclude = () => {
  const {t} = useTranslation();

  const DATA_INCLUDE_PRICES = [
    {
      desc: t('priceInclude.fuel'),
      icon: ic_fuel,
    },
    {
      desc: t('priceInclude.toll'),
      icon: ic_toll,
    },
    {
      desc: t('priceInclude.parking'),
      icon: ic_parking,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={h1}>{t('carDetail.priceInclude')}</Text>
      <View style={styles.descriptionListContainer}>
        {DATA_INCLUDE_PRICES.map((x, i) => (
          <View style={styles.descriptionContainer} key={`price_include_${i}`}>
            <Image source={x.icon} style={iconSize} />
            <Text style={styles.descriptionLabel}>{x.desc}</Text>
          </View>
        ))}
      </View>
      <View style={styles.lineHorizontal} />
    </View>
  );
};

export default memo(PriceInclude);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  descriptionListContainer: {
    ...rowCenter,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  descriptionContainer: {
    ...rowCenter,
    marginBottom: 17,
    width: '50%',
  },
  descriptionLabel: {
    ...h4,
    marginLeft: 10,
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
});
