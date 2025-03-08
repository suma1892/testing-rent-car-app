import AirportTransferSection from 'components/OrderDetail/AirportTransferSection/AirportTransferSection';
import appBar from 'components/AppBar/AppBar';
import BaggageInput from 'components/OrderDetail/BaggageInput/BaggageInput';
import ButtonNextPayment from 'components/OrderDetail/ButtonNextPayment/ButtonNextPayment';
import DailySection from 'components/OrderDetail/DailySection/DailySection';
import HandleCheckDeposito from 'components/OrderDetail/HandleCheckDeposito/HandleCheckDeposito';
import HandlePaymentDetail from 'components/OrderDetail/HandlePaymentDetail/HandlePaymentDetail';
import hoc from 'components/hoc';
import InputPhoneNumber from 'components/OrderDetail/InputPhoneNumber/InputPhoneNumber';
import PointUsage from 'components/OrderDetail/PointUsage/PointUsage';
import React, {FC, useEffect, useState} from 'react';
import Shimmer from 'components/Shimmer/Shimmer';
import useOrderDetail from './hooks/useOrderDetail';
import VehicleSection from 'components/OrderDetail/VehicleSection/VehicleSection';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';
import {boxShadow, rowCenter, WINDOW_HEIGHT} from 'utils/mixins';
import {h1, h3} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {resetUser, userState} from 'redux/features/user/userSlice';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Voucher} from 'redux/features/voucher/voucherSlice';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  BackHandler,
} from 'react-native';

const OrderDetailScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {form, setForm} = useOrderDetail();
  const {userProfile, isLoading, sub_service_type} =
    useAppSelector(appDataState);
  const user = useAppSelector(userState);

  const isDaily = sub_service_type === 'Daily';
  const isAirportTransfer = sub_service_type === 'Airport Transfer';
  const {formDaily} = useAppSelector(appDataState);

  const [isAirportLocation, setIsAirportLocation] = useState(false);
  const [checkDeposito, setCheckDeposito] = useState(isAirportTransfer);
  const [voucher, setVoucher] = useState<Voucher>();
  const [withoutDriverSameValue, setWithoutDriverSameValue] = useState(false);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => {
              dispatch(
                saveFormDaily({
                  ...formDaily,
                  additional_item: [],
                }),
              );
              navigation.goBack();
            }}>
            <Image source={ic_arrow_left_white} style={styles.icon} />
            <Text style={styles.headerText}>{t('detail_order.title')}</Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  useEffect(() => {
    const backAction = () => {
      dispatch(
        saveFormDaily({
          ...formDaily,
          additional_item: [],
        }),
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user.isUpdateSuccess) {
      dispatch(resetUser());
    }
  }, [user.isUpdateSuccess]);

  const renderItem = () => (
    <>
      <VehicleSection />
      <View style={styles.section}>
        <Text style={[h1, {marginBottom: 20}]}>
          {t('detail_order.formDetail.title')}
        </Text>
        {isLoading ? (
          <Shimmer height={100} borderRadius={8} />
        ) : (
          <View style={styles.infoUserWrapper}>
            <Text style={[h1, styles.infoText]}>{userProfile.name}</Text>
            <Text style={[h3, styles.infoText]}>{userProfile.email}</Text>
          </View>
        )}
        <InputPhoneNumber form={form} setForm={setForm} />
        <View style={styles.lineHorizontal} />
      </View>

      <Text style={styles.tripDetailWrapper}>
        {t('detail_order.tripDetail.title')}
      </Text>
      <View style={{marginTop: 10}} />
      <BaggageInput
        value={form?.baggage}
        onChange={x => setForm({...form, baggage: x})}
      />

      {isAirportTransfer && (
        <AirportTransferSection
          form={form}
          setForm={setForm}
          onChangeVoucher={val => setVoucher(val)}
        />
      )}

      {isDaily && (
        <DailySection
          form={form}
          setForm={setForm}
          isAirportLocation={isAirportLocation}
          setIsAirportLocation={setIsAirportLocation}
          withoutDriverSameValue={withoutDriverSameValue}
          setWithoutDriverSameValue={setWithoutDriverSameValue}
          onChangeVoucher={val => setVoucher(val)}
        />
      )}

      <PointUsage setPoint={value => setForm({...form, point: `${value}`})} />
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.scrollViewContainer}
        keyboardDismissMode="interactive"
        data={[1]}
        renderItem={renderItem}
        keyExtractor={(_, index) => `order-detail-component-${index}`}
      />

      <View
        style={[
          boxShadow('#000', {height: 1, width: 1}, 3.27, 0.24),
          styles.bottomView,
        ]}>
        <HandlePaymentDetail form={form} />
        {!isAirportTransfer && (
          <HandleCheckDeposito
            checked={checkDeposito}
            onPress={() => setCheckDeposito(!checkDeposito)}
          />
        )}
        <ButtonNextPayment
          disabled={!checkDeposito}
          isAirportLocation={isAirportLocation}
          form={form}
        />
      </View>
    </View>
  );
};

export default hoc(
  OrderDetailScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingBottom: WINDOW_HEIGHT / 4,
  },
  icon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  headerText: {
    color: 'white',
    marginLeft: 10,
  },
  section: {
    marginTop: 20,
  },
  infoUserWrapper: {
    backgroundColor: theme.colors.grey7,
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    marginVertical: 5,
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 20,
  },
  bottomView: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: -10,
    width: '100%',
    left: -16,
    padding: 16,
    marginHorizontal: '5%',
  },
  tripDetailWrapper: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 20,
  },
});
