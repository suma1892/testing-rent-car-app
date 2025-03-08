import AdditionalItem from './AdditionalItem';
import appBar from 'components/AppBar/AppBar';
import CancellationDetail from './CancellationDetail';
import CarImagePreview from './CarImagePreview';
import DownloadETicketButton from './DownloadETicketButton';
import hoc from 'components/hoc';
import i18n from 'assets/lang/i18n';
import Loading from 'components/Loading/Loading';
import React, {useEffect, useState} from 'react';
import ReconfirmationOrderNotification from './ReconfirmationOrderNotification';
import RefundOrderNotification from '../../components/RefundOrderNotification/RefundOrderNotification';
import RentalDate from './RentalDate';
import YourLocation from './YourLocation';
import YourLocationWithDriver from './YourLocationWithDriver';
import YourOrderDetail from './YourOrderDetail';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getOrderDeposit} from 'redux/features/order/orderAPI';
import {getTransmission} from 'utils/functions';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {isFuture} from 'date-fns';
import {orderState as orderSelector} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  getOrderById,
  getVehicleOrder,
} from 'redux/features/myBooking/myBookingAPI';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {getVehicleById} from 'redux/effects';
import {IVehicles} from 'types/vehicles';

export type DailyBookingOrderDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'DailyBookingOrderDetailScreen'
>;

const DailyBookingOrderDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DailyBookingOrderDetailScreenRouteProp>();

  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector(state => state.myBooking);

  const userLoading = useAppSelector(appDataState).isLoading;
  const orderData = useAppSelector(orderSelector);
  const {t} = useTranslation();

  const [orderState, setOrderState] = useState<string>('');

  const {selected, isSelectedLoading: bookingDetailLoading} = bookingDetail;
  const {isReturnDepositSuccess, isLoading: orderDepositLoading} = orderData;

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
  }, []);

  if (bookingDetailLoading || userLoading || orderDepositLoading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CarImagePreview />
      <Text style={[styles.carTitle, {marginTop: 20}]}>
        {selected?.order_detail?.vehicle?.brand_name}
        {selected?.order_detail?.vehicle?.name
          ? ` ${selected?.order_detail?.vehicle?.name}`
          : ''}
      </Text>
      <Text style={styles.carSpecification}>
        {selected?.order_detail?.vehicle?.max_passanger}{' '}
        {t('detail_order.seats')} -{' '}
        {selected?.order_detail?.vehicle?.max_suitcase}{' '}
        {t('detail_order.suitcase')} -{' '}
        {/* {selected?.order_detail?.vehicle?.transmission} */}
        {getTransmission({
          lang: i18n.language as any,
          transmission: selected?.order_detail?.vehicle?.transmission as any,
        })}
      </Text>
      <Text style={[styles.carSpecification, {marginBottom: 24}]}>
        {selected?.order_detail?.without_driver
          ? `${t('Home.daily.title')} - ${t('Home.daily.without_driver')}`
          : `${t('Home.daily.title')} - ${t('Home.daily.with_driver')}`}
      </Text>

      {/* {orderState === 'CANCELLED' && <RefundOrderNotification />}
      {orderState === 'RECONFIRMATION' && <ReconfirmationOrderNotification />} */}

      <YourOrderDetail
        vehicleName={`${selected?.order_detail?.vehicle?.brand_name} ${
          selected?.order_detail?.vehicle?.name
            ? ` ${selected?.order_detail?.vehicle?.name}`
            : ''
        }`}
      />
      <AdditionalItem transactionKey={route.params.transaction_key} />

      {/* <CancellationDetail /> */}

      {selected?.order_detail?.without_driver ? (
        <YourLocation />
      ) : (
        <YourLocationWithDriver transactionKey={route.params.transaction_key} />
      )}

      <RentalDate />
    </ScrollView>
  );
};

export default hoc(
  DailyBookingOrderDetailScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
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
