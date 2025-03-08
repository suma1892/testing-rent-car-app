import appBar from 'components/AppBar/AppBar';
import CancellationDetail from './CancellationDetail';
import CarImagePreview from './CarImagePreview';
import DeliveryDate from 'components/AirportTransferBookingOrderDetailComponent/DeliveryDate';
import Deposit from 'components/AirportTransferBookingOrderDetailComponent/Deposit';
import DownloadETicketButton from 'screens/DailyBookingOrderDetailScreen/DownloadETicketButton';
import hoc from 'components/hoc';
import i18n from 'assets/lang/i18n';
import LocationData from 'components/AirportTransferBookingOrderDetailComponent/LocationData';
import OrderNotification from 'screens/DailyBookingOrderDetailScreen/ReconfirmationOrderNotification';
import React, {useEffect, useState} from 'react';
import YourOrderDetail from 'screens/DailyBookingOrderDetailScreen/YourOrderDetail';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {getOrderDeposit} from 'redux/features/order/orderAPI';
import {getTransmission} from 'utils/functions';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, ScrollView, StyleSheet, Text} from 'react-native';
import {isFuture} from 'date-fns';
import {orderState as orderSelector} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  getOrderById,
  getVehicleOrder,
} from 'redux/features/myBooking/myBookingAPI';

export type AirportTransferBookingOrderDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'AirportTransferBookingOrderDetailScreen'
>;

const AirportTransferBookingOrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AirportTransferBookingOrderDetailScreenRouteProp>();
  const packageActive = route?.params?.packageActive || {};

  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector(bookingState);
  const orderData = useAppSelector(orderSelector);
  const {t} = useTranslation();

  const [orderState, setOrderState] = useState<string>('');

  const {selected} = bookingDetail;
  const {isReturnDepositSuccess} = orderData;

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('global.button.orderDetail')}
            </Text>
          </TouchableOpacity>
        ),
        trailing: (
          <DownloadETicketButton
            route={route}
            show={
              selected?.order_status === 'PAID' ||
              selected?.order_status === 'FINISHED' ||
              selected?.order_status === 'COMPLETED'
            }
          />
        ),
      }),
    );
  }, [navigation, selected?.order_status]);

  useEffect(() => {
    if (route.params.transaction_key || isReturnDepositSuccess) {
      dispatch(getOrderById(route.params.transaction_key));
      dispatch(getOrderDeposit(route.params.transaction_key));
    }
  }, [route.params.transaction_key, isReturnDepositSuccess]);

  useEffect(() => {
    setOrderState(selected?.order_status as any);

    if (
      (selected?.order_status?.toLowerCase() == 'pending' &&
        !isFuture(new Date(selected?.expired_time))) ||
      (selected?.order_status?.toLowerCase() == 'reconfirmation' &&
        !isFuture(new Date(selected?.expired_time)))
    ) {
      setOrderState('FAILED');
    }
  }, [selected?.order_status, selected?.expired_time]);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getVehicleOrder({id: Number(selected?.order_detail?.vehicle_id)}));
  }, [selected?.order_detail?.vehicle_id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CarImagePreview />
      <Text style={[styles.carTitle, {marginTop: 20}]}>
        {selected?.order_detail?.vehicle?.brand_name}
        {selected?.order_detail?.vehicle?.name ? ` ${selected?.order_detail?.vehicle?.name}` : ''}
      </Text>
      <Text style={styles.carSpecification}>
        {selected?.order_detail?.vehicle?.max_passanger} {t('detail_order.seats')} -{' '}
        {selected?.order_detail?.vehicle?.max_suitcase} {t('detail_order.suitcase')} -{' '}
        {getTransmission({
          lang: i18n.language as any,
          transmission: selected?.order_detail?.vehicle?.transmission as any,
        })}
      </Text>
      <Text style={[styles.carSpecification, {marginBottom: 24}]}>
        {t('myBooking.deliver_to_airport')}
      </Text>

      {/* {orderState === 'RECONFIRMATION' && <OrderNotification />} */}

      <YourOrderDetail
        vehicleName={packageActive?.title}
        isAirportTransfer={true}
      />
      {/* <CancellationDetail /> */}
      <LocationData transactionKey={route.params.transaction_key} />
      <DeliveryDate />
      <Deposit />
    </ScrollView>
  );
};

export default hoc(
  AirportTransferBookingOrderDetailScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: '5%',
    paddingBottom: 30,
  },
  carouselTitleContainer: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 20,
    top: 20,
  },
  vehicleName: {
    fontWeight: 'bold',
    color: theme.colors.navy,
    fontFamily: 'Inter-Medium',
  },
  carTitle: {
    fontWeight: 'bold',
    color: theme.colors.navy,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  carSpecification: {
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
});
