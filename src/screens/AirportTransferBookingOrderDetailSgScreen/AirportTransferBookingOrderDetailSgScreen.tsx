import appBar from 'components/AppBar/AppBar';

import DownloadETicketButton from 'screens/DailyBookingOrderDetailScreen/DownloadETicketButton';
import hoc from 'components/hoc';

import OrderNotification from 'screens/DailyBookingOrderDetailScreen/ReconfirmationOrderNotification';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import YourOrderDetail from 'screens/DailyBookingOrderDetailScreen/YourOrderDetail';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {getOrderDeposit} from 'redux/features/order/orderAPI';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1, h4} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {isFuture} from 'date-fns';
import {orderState as orderSelector} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import DriverInfo from './DriverInfo';
import BookingDeparture from 'screens/DailyBookingOrderDetailScreen/BookingDeparture';
import Button from 'components/Button';
import {getDriverById} from 'redux/effects';
import {Room} from 'types/websocket.types';
import {API_MESSENGER} from '@env';
import {showToast} from 'utils/Toast';
import {appDataState} from 'redux/features/appData/appDataSlice';
import Config from 'react-native-config';
import RejectedNotificationCard from './RejectedNotificationCard';
import YourOrderDetailSg from 'screens/DailyBookingOrderDetailScreen/YourOrderDetailSg';

export type AirportTransferBookingOrderDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'AirportTransferBookingOrderDetailSgScreen'
>;

const AirportTransferBookingOrderDetailSgScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AirportTransferBookingOrderDetailScreenRouteProp>();
  const packageActive = route?.params?.packageActive || {};
  const [activeRoomCS, setActiveRoomCS] = useState<any>();

  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector(bookingState);
  const orderData = useAppSelector(orderSelector);
  const {t} = useTranslation();

  const [orderState, setOrderState] = useState<string>('');

  const {selected} = bookingDetail;
  const {isReturnDepositSuccess} = orderData;
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);
  const [driverData, setDriverData] = useState<any>();
  const item = route?.params?.item || {};
  const socketRef = useRef<any>(null);
  const [activeRoom, setActiveRoom] = useState<Room>();
  const authToken = useAppSelector(state => state.auth.auth.access_token);
  const userProfile = useAppSelector(appDataState).userProfile;

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
    return () => {
      setDriverData(undefined);
    };
  }, [navigation, selected?.order_status]);

  // useEffect(() => {}, [route.params.transaction_key, isReturnDepositSuccess]);

  useFocusEffect(
    useCallback(() => {
      if (route.params.transaction_key || isReturnDepositSuccess) {
        dispatch(getOrderById(route.params.transaction_key));
        dispatch(getOrderDeposit(route.params.transaction_key));
      }

      console.log('test first render');
      return () => {
        setDriverData(undefined);
      };
    }, [route.params.transaction_key, isReturnDepositSuccess]),
  );

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

  const getDriverDetail = async () => {
    if (
      !selected?.order_driver_tasks?.[0]?.driver_id ||
      selected?.order_driver_tasks?.[0]?.status === 'CANCEL'
      // ||
      // selected?.order_status === 'COMPLETED' ||
      // selected?.order_status === 'FAILED' ||
      // selected?.order_status === 'CANCELLED'
    )
      return;
    console.log(
      'selected?.order_driver_tasks?.[0]?.driver_id ',
      selected?.order_driver_tasks?.[0],
    );
    setIsLoadingDriver(true);
    setDriverData(undefined);
    const res = await getDriverById(
      selected?.order_driver_tasks?.[0]?.driver_id,
    );
    console.log('res driver ', res);
    setIsLoadingDriver(false);
    setDriverData(res);
  };

  // const getDetailOrder = async () => {
  //   await dispatch(getOrderById(item?.transaction_key));
  // };

  useFocusEffect(
    useCallback(() => {
      dispatch(getUser());
      connectWebSocket();
      getDriverDetail();

      console.log('test first render');
      return () => {
        socketRef.current.close();
        socketRef.current = {};
        setActiveRoom(undefined);
        setDriverData(undefined);
      };
    }, [selected]),
  );

  useFocusEffect(
    useCallback(() => {
      getDriverDetail();

      console.log('test first render');
      return () => {
        setDriverData(undefined);
      };
    }, [selected]),
  );

  const getRooms = () => {
    const payload = {
      key: 'GET_INBOX',
      // req_send_message: {
      //   to: driverData?.id,
      // },
      room_type: 'customer-driver',
    };
    console.log('get rooms detail order ', payload);

    socketRef.current.send(JSON.stringify(payload));
    // getRoomCS();
  };

  const getRoomCS = () => {
    console.log('get rooms cs');
    socketRef.current.send(
      JSON.stringify({
        key: 'GET_INBOX_WITH_ADMIN',
        room_type: 'cs-customer',
      }),
    );
  };

  // console.log('authToken = ', authToken);
  const connectWebSocket = () => {
    socketRef.current = new WebSocket(Config.API_MESSENGER, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      getRooms();
    };

    socketRef.current.onmessage = (event: {data: string}) => {
      const response = JSON.parse(event.data);

      console.log('response = ', JSON.stringify(response));
      console.log(
        'route.params.item?.order_key ',
        route.params.item?.order_key,
      );
      if (response?.key === 'GET_INBOX') {
        const findDataCs = response?.data?.find(
          x =>
            x?.room?.name === route.params.item?.order_key &&
            x?.room?.room_type === 'cs-order',
        );
        console.log('findDataCs ', findDataCs);
        setActiveRoomCS(findDataCs);

        const findDataCust = response?.data?.find(
          x =>
            x?.room?.name === route.params.item?.order_key &&
            x?.room?.room_type === 'customer-driver',
        );
        setActiveRoom(findDataCust);
      }
      // if (response?.room_type === 'cs-customer') {
      //   setActiveRoomCS(response);
      // }

      if (response?.room_type === 'customer-driver') {
        setActiveRoom(response);
      }
    };

    socketRef.current.onerror = async (error: {message: string | string[]}) => {
      console.error('WebSocket error: ', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DriverInfo
        driverData={driverData}
        activeRoom={activeRoom!}
        isLoading={isLoadingDriver}
        navigateToChat={() => {
          if (activeRoom?.name || driverData?.id) {
            const _room = {
              ...activeRoom,
              name: activeRoom?.room?.name || '',
              room_type: 'customer-driver',
              to: driverData?.id,
              driver_name: driverData?.name,
              is_active: true,
              id: activeRoom?.room?.id,
              user_name: activeRoom?.user?.user_name,
              participants: activeRoom?.room?.participants,
              transaction_key: route.params.transaction_key,
            };
            console.log('_room = ', _room);
            console.log('activeRoom = ', activeRoom);
            // return;
            navigation.navigate('ChatRoom', {
              room: _room,
              type: 'customer-driver',
            });
            return;
          }
          showToast({
            message: 'Room tidak ditemukan',
            title: 'Peringatan',
            type: 'warning',
          });
        }}
      />
      {orderState === 'RECONFIRMATION' && <OrderNotification />}
      {orderState === 'REJECTED' && <RejectedNotificationCard />}

      <YourOrderDetailSg
        vehicleName={packageActive?.title}
        isAirportTransfer={true}
      />
      <BookingDeparture
        vehicleName={packageActive?.title}
        isAirportTransfer={true}
      />

      {selected?.order_status !== 'FAILED' && (
        <Button
          _theme="white"
          onPress={() => {
            console.log('activeRoomCS ', activeRoomCS);
            const dataNavigate = {
              room: {
                name:
                  activeRoomCS?.room?.name ||
                  `${route?.params?.item?.order_key}`,
                room_type: activeRoomCS?.room?.room_type || 'cs-order',
                id: activeRoomCS?.room?.id,
                is_active: true,
                transaction_key: route.params.transaction_key,
              },
              type: activeRoomCS?.room?.room_type || 'cs-order',
              funcHelpCenter: () => {
                navigation.replace('ChatRoom', {
                  room: {
                    participants:
                      activeRoomCS?.participants || item?.room?.participants,
                    name: activeRoomCS?.name || `${userProfile?.name}`,
                    room_type: activeRoomCS?.room_type || 'cs-customer',
                    id: activeRoomCS?.id,
                    is_active: true,
                    transaction_key: item?.room?.data?.order_id,
                  },
                  type: activeRoomCS?.room_type || 'cs-customer',
                });
              },
            };
            console.log('dataNavigate = ', dataNavigate);
            navigation.navigate('ChatRoom', dataNavigate);
          }}
          title={t('myBooking.need_help') as string}
          styleWrapper={{
            borderWidth: 1,
            borderColor: theme.colors.navy,
            marginTop: 36,
          }}
        />
      )}
    </ScrollView>
  );
};

export default hoc(
  AirportTransferBookingOrderDetailSgScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
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
