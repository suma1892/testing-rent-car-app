import Button from 'components/Button';
import React, {useMemo} from 'react';
import {airportVehiclesState} from 'redux/features/airportVehicles/airportVehiclesSlice';
import {authState, logout} from 'redux/features/auth/authSlice';
import {BottomPriceButtonActionProps} from './airportDetailComponent.interface';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h4, h5} from 'utils/styles';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {appDataState} from 'redux/features/appData/appDataSlice';

const CarPrice = () => {
  const {airportVehicleById} = useAppSelector(airportVehiclesState);
  const {globalConfig, formAirportTransfer, userProfile} =
    useAppSelector(appDataState);
  const formattedPrice = useMemo(
    () =>
      currencyFormat(
        airportVehicleById.price - (airportVehicleById.slash_price || 0),
        formAirportTransfer?.pickup_location?.location?.currency,
      ),
    [airportVehicleById.price, airportVehicleById.slash_price],
  );

  return (
    <View>
      <Text style={styles.carPriceValue}>{formattedPrice}</Text>
      {airportVehicleById.slash_price > 0 && (
        <Text style={styles.hargaCoret}>
          {currencyFormat(
            airportVehicleById.price,
            formAirportTransfer?.pickup_location?.location?.currency,
          )}
        </Text>
      )}
    </View>
  );
};

const BottomPriceButtonAction = ({disabled}: BottomPriceButtonActionProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {globalConfig, formAirportTransfer, sub_service_type} =
    useAppSelector(appDataState);
  const {auth} = useAppSelector(authState);

  const orderWaConfigValue = useMemo(
    () =>
      globalConfig.find(config => config.key === 'order_wa')?.value || 'false',
    [globalConfig],
  );

  const handleButtonPress = () => {
    if (!auth?.access_token) {
      showToast({
        message: t('global.alert.please_login_to_continue'),
        type: 'error',
        title: t('global.alert.error'),
      });
      dispatch(logout());

      return navigation.navigate('Login', {
        previousScreen:
          sub_service_type === 'Airport Transfer'
            ? 'AirportDetailCar'
            : 'DetailCar',
      });
    }

    if (orderWaConfigValue === 'true') {
      const url = 'whatsapp://send?phone=6281262511511';
      Linking.openURL(url).catch(err => {
        const message = err?.message.includes(`No Activity found`)
          ? t('global.alert.error_redirect_to_whatsapp')
          : err.message;

        showToast({
          title: t('global.alert.failed'),
          type: 'error',
          message,
        });
      });
      return;
    }

    if (!formAirportTransfer.pickup_date) {
      return navigation.goBack();
    }

    navigation.navigate('OrderDetail');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={h4}>{t('carDetail.carPrice')}</Text>
        <CarPrice />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t('global.button.next')}
          onPress={handleButtonPress}
          _theme="navy"
          disabled={!disabled}
        />
      </View>
    </View>
  );
};

export default BottomPriceButtonAction;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    justifyContent: 'space-between',
    padding: 16,
  },
  hargaCoret: {
    ...h5,
    textDecorationLine: 'line-through',
    textDecorationColor: 'orange',
    color: theme.colors.grey4,
    marginTop: 6,
  },
  carPriceValue: {
    ...h1,
    color: theme.colors.navy,
    fontSize: 15,
  },
  buttonContainer: {
    flexBasis: '50%',
    alignSelf: 'flex-end',
  },
});
