import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import i18n from 'assets/lang/i18n';
import React, {Fragment, memo, useState} from 'react';
import StatusOrderBadge from 'components/StatusOrderBadge/StatusOrderBadge';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {currencyFormat} from 'utils/currencyFormat';
import {
  FONT_SIZE_12,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
} from 'utils/typography';
import {getTransmission} from 'utils/functions';
import {h1, h3, h5} from 'utils/styles';
import {iconSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {img_car_empty} from 'assets/images';
import {IVehicles} from 'types/vehicles';
import {t} from 'i18next';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  ic_card_minimal_order,
  ic_koper,
  ic_seat,
  ic_transisi,
} from 'assets/icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface ICardCar {
  item: IVehicles;
  onPress: () => void;
  containerWidth?: number | string;
}
const CarCard = ({
  item,
  onPress,
  containerWidth = WINDOW_WIDTH * (90 / 100),
}: ICardCar) => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;
  const [imageSource, setImageSource] = useState<any>({
    uri: Config.URL_IMAGE + item?.photo?.[0]?.name,
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  });

  const carName = `${item?.brand_name} ${item?.name}`;

  const content = () => {
    return (
      <Fragment>
        <View
          style={{
            height: 157,
            flexBasis: '40%',
          }}>
          <FastImage
            style={styles.imgCar}
            source={imageSource}
            resizeMode={FastImage.resizeMode.cover}
            onError={() => {
              setImageSource(img_car_empty);
            }}
          />

          {!item?.is_valid_for_order && (
            <MinDayBadge day={item?.minimal_rental_day} />
          )}
        </View>

        <View style={styles.descriptions}>
          <Text style={[styles.textCarName]}>
            {carName?.length > 25 ? carName?.slice(0, 25) + '...' : carName}
          </Text>

          <View style={[rowCenter, {}]}>
            <View style={[rowCenter, {marginRight: 15}]}>
              <Image source={ic_seat} style={iconSize} />
              <Text style={[styles.textSeat]}>{item?.max_passanger}</Text>
            </View>

            <View style={[rowCenter, {marginRight: 15}]}>
              <Image source={ic_koper} style={iconSize} />
              <Text style={[styles.textSeat]}>{item?.max_suitcase}</Text>
            </View>

            <View style={[rowCenter, {width: '40%'}]}>
              <Image source={ic_transisi} style={iconSize} />
              <Text style={[styles.textSeat, {textTransform: 'capitalize'}]}>
                {getTransmission({
                  lang: i18n.language as any,
                  transmission: item?.transmission,
                })}
              </Text>
            </View>
          </View>

          <View style={{marginTop: 0}}>
            <View
              style={[
                rowCenter,
                {justifyContent: 'space-between', marginTop: 10},
              ]}>
              <Text style={[h3, {fontSize: 12, marginBottom: 4}]}>
                {t('list_car.rent_price')}
              </Text>
              {item?.status_order && (
                <StatusOrderBadge
                  status={
                    item?.status === 'booked' ? 'booked' : item?.status_order
                  }
                />
              )}
            </View>

            <Text style={[h1, {color: theme.colors.navy, fontSize: 12}]}>
              {currencyFormat(
                (formDaily.with_driver ? item?.price_with_driver : item.price) -
                  (item?.slash_price || 0),
                formDaily?.selected_location?.currency,
              )}{' '}
              <Text style={[h1, {fontSize: 12}]}>
                / {item?.rental_duration} {t('carDetail.hours')}
              </Text>
            </Text>
            {item?.slash_price > 0 && (
              <Text style={[h5, styles.hargaCoret]}>
                {currencyFormat(
                  formDaily.with_driver ? item?.price_with_driver : item.price,
                )}
              </Text>
            )}
          </View>
        </View>
      </Fragment>
    );
  };
  // console.log('item = ', JSON.stringify(item));

  if (item.status === 'booked' || item.status_order === 'booked') {
    return (
      <TouchableWithoutFeedback>
        <View style={[rowCenter, styles.cardWrapper, {width: containerWidth}]}>
          {content()}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableOpacity
      style={[rowCenter, styles.cardWrapper, {width: containerWidth}]}
      onPress={onPress}>
      {content()}
    </TouchableOpacity>
  );
};

export default memo(CarCard);

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: theme.colors.white,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  machineWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.grey6,
    borderRadius: 10,
  },
  descriptions: {flexBasis: '65%', marginLeft: 10},
  wrapperLineVertical: {
    marginLeft: 5,
    paddingRight: 10,
  },
  hargaCoret: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'orange',
    color: theme.colors.grey4,
    fontSize: 13,
  },
  imgCar: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  textSeat: {
    marginLeft: 5,
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  textCarName: {
    marginBottom: 14,
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
  },
});

const MinDayBadge = ({day}: {day: number}) => (
  <View
    style={{
      position: 'absolute',
      top: 10,
      left: -5,
    }}>
    <Image
      source={ic_card_minimal_order}
      style={{
        height: 22,
        width: 70,
      }}
    />
    <Text
      style={{
        fontSize: 8,
        color: '#fff',
        position: 'absolute',
        alignSelf: 'center',
        top: 2,
        fontWeight: '700',
      }}>
      Min {day} {t('list_car.day')}
    </Text>
  </View>
);
