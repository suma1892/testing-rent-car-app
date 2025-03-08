import React from 'react';
import {h1, h4} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const CarRentalRequirement = () => {
  const {t} = useTranslation();

  const policies = [
    'carDetail.policies.list_1',
    'carDetail.policies.list_2',
    'carDetail.policies.list_3',
  ];

  const requirements = [
    'carDetail.requirements.list_1',
    'carDetail.requirements.list_2',
    'carDetail.requirements.list_3',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('carDetail.policy')}</Text>
      <View style={styles.listContainer}>
        {policies.map((data, i) => (
          <Text key={`text_${i}`} style={styles.descriptionLabel}>
            &#x2022; {t(data)}
          </Text>
        ))}
      </View>
      <View style={styles.lineHorizontal} />

      <Text style={styles.title}>{t('carDetail.rentalRequirement')}</Text>
      <View style={styles.listContainer}>
        {requirements.map((data, i) => (
          <Text key={`text_${i}`} style={styles.descriptionLabel}>
            &#x2022; {t(data)}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default CarRentalRequirement;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  title: {
    ...h1,
    marginTop: 10,
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
});
