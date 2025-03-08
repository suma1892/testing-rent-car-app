import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import React, {memo, useCallback, useMemo, useState} from 'react';
import StatusOrderBadge from 'components/StatusOrderBadge/StatusOrderBadge';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h2, h4, h5} from 'utils/styles';
import {ic_koper, ic_seat, ic_transisi} from 'assets/icons';
import {iconSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {img_car_empty} from 'assets/images';
import {IVehicles} from 'types/vehicles';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import i18n from 'assets/lang/i18n';
import {getTransmission} from 'utils/functions';

type FavoriteCarCardProps = {
  item: IVehicles;
  onPress: () => void;
  containerWidth?: number | string;
  withDriver: boolean;
};

const FavoriteCarCard = ({
  item,
  onPress,
  containerWidth = WINDOW_WIDTH * (90 / 100),
  withDriver,
}: FavoriteCarCardProps) => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;
  const [imageSource, setImageSource] = useState<any>({
    uri: Config.URL_IMAGE + item?.photo?.[0]?.name,
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  });

  const rentPrice = useMemo(
    () =>
      (withDriver ? item?.price_with_driver : item.price) -
      (item?.slash_price || 0),
    [withDriver, item?.price_with_driver, item?.price, item?.slash_price],
  );

  const originalPrice = useMemo(
    () => (withDriver ? item?.price_with_driver : item.price),
    [withDriver, item?.price_with_driver, item?.price],
  );
  const handleErrorImage = useCallback(() => {
    setImageSource(img_car_empty);
  }, []);

  return (
    <TouchableOpacity
      style={[rowCenter, styles.cardWrapper, {width: containerWidth}]}
      onPress={onPress}>
      <View style={styles.carThumbnailContainer}>
        <FastImage
          source={imageSource}
          style={styles.carThumbnail}
          resizeMode={FastImage.resizeMode.cover}
          onError={handleErrorImage}
        />
      </View>

      <View style={{flexBasis: '65%', marginLeft: 10}}>
        <Text style={[h1, {marginBottom: 10}]}>
          {item?.brand_name} {item?.name}
        </Text>

        <View style={[rowCenter, styles.carDetails]}>
          <View style={rowCenter}>
            <Image source={ic_seat} style={iconSize} />
            <Text style={[h2, {marginLeft: 5}]}>{item?.max_passanger}</Text>
          </View>

          <View style={[rowCenter, styles.wrapperLineVertical]}>
            <Image source={ic_koper} style={iconSize} />
            <Text style={[h2, {marginLeft: 5}]}>{item?.max_suitcase}</Text>
          </View>

          <View style={[rowCenter, {width: '40%'}]}>
            <Image source={ic_transisi} style={iconSize} />
            <Text
              style={[
                h2,
                {marginLeft: 5, fontSize: 12, textTransform: 'capitalize'},
              ]}>
              {getTransmission({
                lang: i18n.language,
                transmission: item?.transmission,
              } as any)}
            </Text>
          </View>
        </View>

        <View style={{marginTop: 5}}>
          <View
            style={[
              rowCenter,
              {justifyContent: 'space-between', marginTop: 10},
            ]}>
            <Text style={[h4, {fontSize: 12}]}>{t('list_car.rent_price')}</Text>
            {item?.status_order && (
              <StatusOrderBadge status={item?.status_order} />
            )}
          </View>

          <Text style={[h1, {color: theme.colors.navy}]}>
            {currencyFormat(rentPrice)}{' '}
            <Text style={[h1, {fontSize: 12}]}>
              / {item?.rental_duration} {t('carDetail.hours')}
            </Text>
          </Text>
          {item?.slash_price > 0 && (
            <Text style={[h5, styles.hargaCoret]}>
              {currencyFormat(originalPrice)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(FavoriteCarCard);

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: theme.colors.white,
    marginBottom: 10,
    marginRight: 5,
    borderRadius: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.grey6,
  },
  wrapperLineVertical: {
    marginLeft: 5,
  },
  hargaCoret: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'orange',
    color: theme.colors.grey4,
    marginTop: 6,
  },
  carThumbnailContainer: {
    // flexBasis: '40%',
    overflow: 'hidden',
    height: 157,
    flexBasis: '40%',
  },
  carThumbnail: {
    height: 136,
    width: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  carDetails: {justifyContent: 'space-between', width: '85%', marginBottom: 5},
});
