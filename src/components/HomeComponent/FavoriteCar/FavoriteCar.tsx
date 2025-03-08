import React from 'react';
import FavoriteCarCarousel from './FavoriteCarCarousel';
import FavoriteCarDriverSelection from './FavoriteCarDriverSelection';
import {getTypeOfVehicles} from 'redux/features/vehicles/vehiclesAPI';
import {h1} from 'utils/styles';
import {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

const FavoriteCar: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [withDriverState, setWithDriverState] = useState<boolean>(false);

  useEffect(() => {
    const params =
      '?' +
      new URLSearchParams({
        support_driver: withDriverState.toString(),
      }).toString();
    dispatch(getTypeOfVehicles(params));
  }, [withDriverState]);

  return (
    <View style={styles.container}>
      <Text style={[h1, styles.title]}>{t('Home.carFavTitle')}</Text>

      <View style={{marginRight: '5%'}}>
        <FavoriteCarDriverSelection
          onChange={({withDriver}) => {
            setWithDriverState(withDriver);
          }}
        />
      </View>

      <FavoriteCarCarousel withDriverState={withDriverState} />
    </View>
  );
};

export default memo(FavoriteCar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingLeft: '5%',
    paddingVertical: 20,
  },
  title: {marginBottom: 10, fontSize: 18},
  boxWrapper: {
    marginRight: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
});
