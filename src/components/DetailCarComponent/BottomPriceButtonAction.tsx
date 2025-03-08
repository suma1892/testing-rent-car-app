import Button from 'components/Button';
import React, {useMemo} from 'react';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';
import {authState, logout} from 'redux/features/auth/authSlice';
import {BottomPriceButtonActionProps} from './detailCarComponent.interface';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h3, h4, h5} from 'utils/styles';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';

const StrikethroughPrice = () => {
  const formDaily = useAppSelector(appDataState).formDaily;
  const vehicleById = useAppSelector(vehiclesState).vehicleById;

  if (vehicleById.slash_price > 0) {
    return (
      <Text style={styles.hargaCoret}>
        {currencyFormat(
          formDaily.with_driver
            ? vehicleById?.price_with_driver
            : vehicleById.price,
          formDaily?.selected_location?.currency,
        )}
      </Text>
    );
  }

  return null;
};

const CarPrice = () => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;
  const vehicleById = useAppSelector(vehiclesState).vehicleById;

  return (
    <Text style={styles.carPriceValue}>
      {currencyFormat(
        (formDaily.with_driver
          ? vehicleById?.price_with_driver
          : vehicleById.price) - (vehicleById.slash_price || 0),
        formDaily?.selected_location?.currency,
      )}{' '}
      <Text style={[h3, {fontSize: 12}]}>
        / {formDaily.with_driver ? 12 : 24} {t('carDetail.hours')}
      </Text>
    </Text>
  );
};

const BottomPriceButtonAction = ({disabled}: BottomPriceButtonActionProps) => {
  const {t} = useTranslation();
  const globalConfig = useAppSelector(appDataState).globalConfig;
  const formDaily = useAppSelector(appDataState).formDaily;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authState).auth;

  const orderWaConfigValue = useMemo(() => {
    if (globalConfig.length) {
      return (
        globalConfig.find(config => config.key === 'order_wa')?.value || 'false'
      );
    }

    return 'false';
  }, [globalConfig]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={h4}>{t('carDetail.carPrice')}</Text>
        <CarPrice />
        <StrikethroughPrice />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={t('global.button.next')}
          onPress={() => {
            if (!auth?.access_token) {
              showToast({
                message: t('global.alert.please_login_to_continue'),
                type: 'error',
                title: t('global.alert.error'),
              });
              dispatch(logout());

              navigation.navigate('Login', {previousScreen: 'DetailCar'});
              return;
            }

            if (orderWaConfigValue === 'true') {
              const url = 'whatsapp://send?phone=6281262511511';
              Linking.openURL(url).catch(err => {
                let message = err?.message;
                if (
                  message?.includes(
                    `Could not open URL '${url}': No Activity found to handle Intent`,
                  )
                ) {
                  message = t('global.alert.error_redirect_to_whatsapp');
                }

                showToast({
                  title: t('global.alert.failed'),
                  type: 'error',
                  message,
                });
              });

              return;
            }

            if (!formDaily.start_booking_date) {
              navigation.goBack();
              return;
            }

            dispatch(saveFormDaily({...formDaily, order_booking_zone: []}));
            navigation.navigate('OrderDetail');
          }}
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