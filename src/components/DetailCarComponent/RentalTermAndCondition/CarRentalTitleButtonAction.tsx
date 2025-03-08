import CarRentalTermAndConditionModalContent from './CarRentalTermAndConditionModalContent';
import React from 'react';
import {h1, h4} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {showBSheet} from 'utils/BSheet';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const CarRentalTitleButtonAction = ({snk}: {snk: any}) => {
  const {t} = useTranslation();

  const showRules = () => {
    showBSheet({
      content: <CarRentalTermAndConditionModalContent snk={snk} />,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={h1}>{t('carDetail.TitleTc')}</Text>
      <Text style={styles.seeDetailsLabel} onPress={showRules}>
        {t('carDetail.learnMore')}
      </Text>
    </View>
  );
};

export default CarRentalTitleButtonAction;

const styles = StyleSheet.create({
  container: {
    ...rowCenter,
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  seeDetailsLabel: {
    ...h4,
    color: theme.colors.blue,
    alignSelf: 'flex-end',
  },
});
