import { ic_info, ic_info2, ic_info3 } from 'assets/icons';
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from 'utils';
import { iconSize, rowCenter } from 'utils/mixins';
import { h1, h2, h4 } from 'utils/styles';

const PickupInfo = () => {
  const {t} = useTranslation();

  const pickupInfo = [
    'carDetail.pickup_info_details.list_1',
    'carDetail.pickup_info_details.list_2',
    'carDetail.pickup_info_details.list_3',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('carDetail.pickup_info')}</Text>

      <View style={styles.pickupMethodContainer}>
        <Image source={ic_info3} style={iconSize} />
        <Text style={styles.subtitle}>{t('carDetail.pickup_method')}</Text>
      </View>
      
      <View style={styles.listContainer}>
        {pickupInfo.map((data, i) => (
          <Text key={`text_${i}`} style={styles.descriptionLabel}>
            &#x2022; {t(data)}
          </Text>
        ))}
      </View>
      <View style={styles.lineHorizontal} />
    </View>
  );
};

export default memo(PickupInfo);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  title: {
    ...h1,
    marginTop: 10,
  },
  subtitle: {
    ...h2,
    marginLeft: 5
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
  listContainer: {
    marginLeft: 20,
    marginTop: 10,
  },
  descriptionLabel: {
    ...h4,
    lineHeight: 24,
  },
  pickupMethodContainer: {
    ...rowCenter,
    alignItems: 'center',
    marginTop: 10
  },
});
