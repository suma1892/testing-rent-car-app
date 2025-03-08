import React from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h4} from 'utils/styles';
import {ic_round_discount} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

const AllInCard = () => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;

  if (formDaily.with_driver) {
    return (
      <View style={styles.container}>
        <View style={rowCenter}>
          <Image source={ic_round_discount} style={iconCustomSize(19)} />
          <Text style={[h1, {color: theme.colors.navy}]}>
            {t('carDetail.all_in')}
          </Text>
        </View>

        <Text style={[h4, {fontSize: 12, lineHeight: 20}]}>
          {t('carDetail.all_in_desc')}
        </Text>
      </View>
    );
  }

  return null;
};

export default AllInCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: 'rgba(231, 243, 255, 1)',
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: theme.colors.navy,
  },
});
