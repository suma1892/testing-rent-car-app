import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {ic_alphard, ic_baggage, ic_car1, ic_koper, ic_seat} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {h1, h4} from 'utils/styles';
import {FONT_SIZE_16} from 'utils/typography';
import {useTranslation} from 'react-i18next';

const SelectedCarCard = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.wrapper}>
      <Image source={ic_alphard} style={[iconCustomSize(75)]} />

      <View style={{marginLeft: 10}}>
        <Text style={[h1, styles.car]}>Toyota Alphard</Text>

        <View style={[rowCenter]}>
          <View style={[rowCenter]}>
            <Image source={ic_seat} style={iconCustomSize(15)} />
            <Text style={[h4]}>
              {' '}
              {t('detail_order.car_detail.seat', {seats: 6})}
            </Text>
          </View>
          <Text> | </Text>
          <View style={[rowCenter]}>
            <Image source={ic_koper} style={iconCustomSize(15)} />
            <Text style={[h4]}>
              {' '}
              2 {t('detail_order.car_detail.suitcases')} {'(L)'}
            </Text>
          </View>
        </View>
        {/* <Text style={[h4]}>
          {t('detail_order.car_detail.seat', {seats: 6})} | 2{' '}
          {t('detail_order.car_detail.suitcases')}
        </Text> */}
        {/* <Text style={[h4]}></Text> */}
      </View>
    </View>
  );
};

export default SelectedCarCard;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    borderRadius: 8,
    marginBottom: 24,
  },
  car: {
    fontSize: FONT_SIZE_16,
    color: theme.colors.navy,
    marginBottom: 10,
  },
});
