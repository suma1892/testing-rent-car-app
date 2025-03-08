import { img_promo } from 'assets/images';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IVehicles } from 'types/vehicles';
import { theme } from 'utils';
import { currencyFormat } from 'utils/currencyFormat';
import { WINDOW_WIDTH, rowCenter } from 'utils/mixins';
import { h1, h4, h5 } from 'utils/styles';

type PromoBundleCardProps = {
  item: IVehicles;
  onPress: () => void;
  containerWidth?: number | string;
};

const PromoBundleCard = ({
  item,
  onPress,
  containerWidth = WINDOW_WIDTH * (90 / 100),
}: PromoBundleCardProps) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      style={[rowCenter, styles.cardWrapper, {width: containerWidth}]}
      onPress={onPress}>
      <View style={styles.promoThumbnailContainer}>
        <Image
          // source={{uri: URL_IMAGE + item?.photo?.[0]?.name}}
          source={img_promo}
          style={styles.promoThumbnail}
        />
      </View>

      <View style={{flexBasis: '57%'}}>
        <Text style={[h1, {marginBottom: 10}]}>Hotel Seminyak</Text>

        <View style={{marginTop: 5}}>
          <Text style={[h4, {fontSize: 12}]}>{t('list_car.rent_price')}</Text>
          <Text style={[h1, {color: theme.colors.navy}]}>
            {currencyFormat(item.price - (item?.slash_price || 0))}{' '}
            <Text style={[h1, {fontSize: 12}]}>/ 1 {t('list_car.day')}</Text>
          </Text>
          {item.slash_price > 0 && (
            <Text style={[h5, styles.hargaCoret]}>
              {currencyFormat(item.slash_price)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PromoBundleCard;

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: theme.colors.white,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  hargaCoret: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'orange',
    color: theme.colors.grey4,
    marginTop: 6,
  },
  promoThumbnailContainer: {flexBasis: '40%', overflow: 'hidden'},
  promoThumbnail: {
    height: 136,
    width: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
