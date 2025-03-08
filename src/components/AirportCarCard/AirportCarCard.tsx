import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import React, {Fragment, memo, useState} from 'react';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h2, h4, h5} from 'utils/styles';
import {IAirportVehicles} from 'types/airport-vehicles';
import {iconSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {img_car_empty} from 'assets/images';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  ic_koper,
  ic_koper_2,
  ic_koper_3,
  ic_mini_bus_badge,
  ic_premium_badge,
  ic_seat,
  ic_seat_2,
  ic_seat_3,
  ic_standart_badge,
} from 'assets/icons';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {useAppSelector} from 'redux/hooks';

interface IAirportCarCard {
  item: IAirportVehicles;
  onPress: () => void;
  containerWidth?: number | string;
}
const AirportCarCard = ({
  item,
  onPress,
  containerWidth = WINDOW_WIDTH * (90 / 100),
}: IAirportCarCard) => {
  const {t} = useTranslation();
  const [imageSource, setImageSource] = useState<any>({
    uri: Config.URL_IMAGE + item?.images?.[0],
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  });
  const {formAirportTransfer} = useAppSelector(appDataState);

  const getIconCategory = (
    type: 'seat' | 'suitcase' | 'category',
    category: string,
  ) => {
    if (type === 'seat') {
      if (category === 'Mobil Standart') {
        return ic_seat;
      }

      if (category === 'Premium') {
        return ic_seat_2;
      }

      if (category === 'Mini Bus') {
        return ic_seat_3;
      } else {
        return ic_seat;
      }
    }

    if (type === 'suitcase') {
      if (category === 'Mobil Standart') {
        return ic_koper;
      }

      if (category === 'Premium') {
        return ic_koper_2;
      }

      if (category === 'Mini Bus') {
        return ic_koper_3;
      } else {
        return ic_koper;
      }
    }

    if (type === 'category') {
      if (category === 'Mobil Standart') {
        return ic_standart_badge;
      }

      if (category === 'Premium') {
        return ic_premium_badge;
      }

      if (category === 'Mini Bus') {
        return ic_mini_bus_badge;
      } else {
        return ic_standart_badge;
      }
    }
  };

  const content = () => {
    return (
      <Fragment>
        <View style={{flexBasis: '35%'}}>
          <FastImage
            style={{
              height: 135,
              width: '100%',
              borderTopLeftRadius: 7,
              borderBottomLeftRadius: 7,
            }}
            source={imageSource}
            resizeMode={FastImage.resizeMode.cover}
            onError={() => {
              setImageSource(img_car_empty);
            }}
          />
          {/* {item?.status_order && (
            <StatusOrderBadge
              status={item?.status === 'booked' ? 'booked' : item?.status_order}
            />
          )} */}
        </View>

        <View style={styles.descriptions}>
          <Text style={h1}>
            {item?.title?.length > 25
              ? item?.title?.slice(0, 25) + '...'
              : item?.title}
          </Text>

          <Text style={styles.description}>
            {item?.description?.length > 75
              ? item?.description?.slice(0, 75) + '...'
              : item?.description}
          </Text>

          <View style={[rowCenter, {justifyContent: 'space-between'}]}>
            <View style={rowCenter}>
              <Image
                source={getIconCategory('seat', item?.category)}
                style={iconSize}
                resizeMode="contain"
              />
              {/* <Text style={[h2, {marginLeft: 5}]}>{item?.max_passenger}</Text> */}
            </View>

            <View style={[rowCenter, styles.wrapperLineVertical]}>
              <Image
                source={getIconCategory('suitcase', item?.category)}
                style={iconSize}
                resizeMode="contain"
              />
              <Text style={[h2, {marginLeft: 5}]}>{item?.max_suitecase}</Text>
            </View>

            <View
              style={[
                rowCenter,
                {
                  width: '45%',
                  alignSelf: 'flex-end',
                },
              ]}>
              {/* <Image
                source={getIconCategory('category', item?.category)}
                style={{width: 64, height: 18}}
                resizeMode="contain"
              /> */}
              <View
                style={{
                  backgroundColor: theme.colors.navy,
                  alignItems: 'center',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    fontSize: 8.5,
                    color: '#fff',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  {item?.category}
                </Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: 5}}>
            <Text style={[h4, {fontSize: 12}]}>{t('list_car.rent_price')}</Text>
            <Text style={[h1, {color: theme.colors.navy, marginTop: 5}]}>
              {currencyFormat(
                item?.slash_price > 0
                  ? item.price - item?.slash_price
                  : item.price,
                formAirportTransfer?.pickup_location?.location?.currency,
              )}{' '}
            </Text>
            {item?.slash_price > 0 && (
              <Text style={[h5, styles.hargaCoret]}>
                {currencyFormat(
                  item.price,
                  formAirportTransfer?.pickup_location?.location?.currency,
                )}
              </Text>
            )}
          </View>
        </View>
      </Fragment>
    );
  };

  // if (item.status === 'booked' || item.status_order === 'booked') {
  //   return (
  //     <TouchableWithoutFeedback>
  //       <View style={[rowCenter, styles.cardWrapper, {width: containerWidth}]}>
  //         {content()}
  //       </View>
  //     </TouchableWithoutFeedback>
  //   );
  // }

  return (
    <TouchableOpacity
      style={[rowCenter, styles.cardWrapper, {width: containerWidth}]}
      onPress={onPress}>
      {content()}
    </TouchableOpacity>
  );
};

export default memo(AirportCarCard);

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: theme.colors.white,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    marginRight: 20,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
  },
  machineWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.grey6,
    borderRadius: 10,
  },
  descriptions: {
    flexBasis: '65%',
    marginLeft: 10,
  },
  wrapperLineVertical: {
    marginLeft: 5,
    paddingRight: 10,
  },
  hargaCoret: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'orange',
    color: theme.colors.grey4,
  },
  description: {
    ...h5,
    fontSize: 10,
    marginBottom: 3,
    width: '90%',
  },
});
