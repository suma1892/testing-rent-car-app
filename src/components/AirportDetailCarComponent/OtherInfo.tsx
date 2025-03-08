import React, { memo } from 'react';
import {h1, h4} from 'utils/styles';
import {ic_info3, ic_insurance} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const OtherInfo = () => {
  const {t} = useTranslation();

  const DATA = [
    {
      desc: t('carDetail.sure_and_timely_pickup'),
      icon: ic_info3,
    },
    {
      desc: t('carDetail.car_insurance'),
      icon: ic_insurance,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('carDetail.otherInfo')}</Text>
      {DATA.map((x, i) => (
        <View style={styles.descriptionContainer} key={`other_info_${i}`}>
          <Image source={x.icon} style={iconSize} />
          <Text style={styles.descriptionLabel}>{x.desc}</Text>
        </View>
      ))}
      <View style={styles.lineHorizontal} />
    </View>
  );
};

export default memo(OtherInfo);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  title: {
    ...h1,
    marginBottom: 10,
  },
  descriptionContainer: {
    ...rowCenter,
    marginBottom: 17,
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
