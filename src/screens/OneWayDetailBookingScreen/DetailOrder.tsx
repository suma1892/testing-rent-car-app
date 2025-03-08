import CancelTask from './CancelTask';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import RefundOrderNotification from 'components/RefundOrderNotification/RefundOrderNotification';
import {currencyFormat} from 'utils/currencyFormat';
import {getDistanceMaps} from 'redux/effects';
import {
  ic_chat,
  ic_chat_active,
  ic_pinpoin,
  ic_user_placeholder,
} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {theme} from 'utils';
import {API_MESSENGER, URL_IMAGE} from '@env';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {
  FONT_SIZE_12,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
  FONT_SIZE_16,
  FONT_SIZE_14,
  FONT_SIZE_10,
} from 'utils/typography';
import Button from 'components/Button';
import {showToast} from 'utils/Toast';
import {Room} from 'types/websocket.types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {DriverData} from 'types/my-booking.types';
import Config from 'react-native-config';

const DetailOrder = ({
  ScrollView,
  driverData,
  item,
}: {
  ScrollView: any;
  driverData: DriverData;
  item: any;
}) => {
  const {t} = useTranslation();
  const bookingDetail = useAppSelector(state => state.myBooking);
  const {selected, isSelectedLoading: bookingDetailLoading} = bookingDetail;
  const [distance, setDistance] = useState('');

  const order_driver_tasks = selected?.order_driver_tasks?.[0];
  const isCancelled = selected?.order_status === 'CANCELLED';
  const socketRef = useRef<any>(null);
  const authToken = useAppSelector(state => state.auth.auth.access_token);
  const [activeRoom, setActiveRoom] = useState<Room>();
  const navigation = useNavigation();

  const formatDistance = (_distance: number) => {
    if (_distance >= 1000) {
      return `${(_distance / 1000).toFixed(2)} km`; // Ubah ke km jika lebih dari atau sama dengan 1km
    }
    return `${Math.round(_distance)} m`; // Tetap dalam m jika kurang dari 1km
  };

  useEffect(() => {
    getDetailDistance();

    return () => {};
  }, [selected]);

  useFocusEffect(
    useCallback(() => {
      connectWebSocket();
      console.log('test first render');
      return () => {
        socketRef.current.close();
        socketRef.current = {};
        setActiveRoom(undefined);
      };
    }, []),
  );

  // console.log('driverData = ', driverData);

  const getRooms = () => {
    const payload = {
      key: 'GET_INBOX_WITH_TO',
      req_send_message: {
        to: driverData?.id,
      },
      room_type: 'customer-driver',
    };
    console.log('get rooms detail order ', payload);

    socketRef.current.send(JSON.stringify(payload));
    console.log('yaload ', {
      key: 'GET_INBOX_WITH_TO',
      req_send_message: {
        to: driverData?.id,
      },
      room_type: 'customer-driver',
    });
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

  const getDetailDistance = async () => {
    const res = await getDistanceMaps({
      origin_latitude: selected?.order_detail?.origin?.lat!,
      origin_longitude: selected?.order_detail?.origin?.long!,
      dest_latitude: selected?.order_detail?.destination?.lat!,
      dest_longitude: selected?.order_detail?.destination?.long!,
    });
    setDistance(formatDistance(res?.routes?.[0]?.distance));
  };

  function getDriverStatus(status: string) {
    switch (status) {
      case 'SEARCHING_FOR_DRIVER':
        return {
          title: t('one_way.SEARCHING_FOR_DRIVER.title'),
          desc: t('one_way.SEARCHING_FOR_DRIVER.desc'),
        };
      case 'ON_PICK_UP_LOCATION':
        return {
          title: t('one_way.TRANSPORTING_PASSENGER.title'),
          desc: t('one_way.TRANSPORTING_PASSENGER.desc'),
        };
      case 'BOOKED': // sudah assign ke driver
        return {
          title: t('one_way.BOOKED.title'),
          desc: t('one_way.BOOKED.desc'),
        };
      case 'CANCELLED':
        return {
          title: t('one_way.CANCELLED.title'),
          desc: t('one_way.CANCELLED.desc'),
        };
      case 'CANCEL':
        return {
          title: t('one_way.PAID.title'),
          desc: t('one_way.PAID.desc'),
        };
      case 'TRANSPORTING_PASSENGER':
        return {
          title: t('one_way.TRANSPORTING_PASSENGER.title'),
          desc: t('one_way.TRANSPORTING_PASSENGER.desc'),
        };
      case 'OPEN':
        return {
          title: t('one_way.PAID.title'),
          desc: t('one_way.PAID.title'),
        };
      case 'CHECKOUT':
        return {
          title: t('one_way.CHECKOUT.title'),
          desc: t('one_way.CHECKOUT.desc'),
        };
      case 'RUNNING':
        return {
          title: t('one_way.TRANSPORTING_PASSENGER.title'),
          desc: t('one_way.TRANSPORTING_PASSENGER.desc'),
        };
      case 'COMPLETED':
        return {
          title: t('one_way.RUNNING.title'),
          desc: t('one_way.RUNNING.desc'),
        };
      case 'FINISH':
        return {
          title: t('one_way.FINISH.title'),
          desc: t('one_way.FINISH.desc'),
        };
      case 'FAILED':
        return {
          title: t('one_way.FAILED.title'),
          desc: t('one_way.FAILED.desc'),
        };

      case 'PENDING':
        return {
          title: t('one_way.PENDING.title'),
          desc: t('one_way.PENDING.desc'),
        };
      case 'PAID':
        return {
          title: t('one_way.PAID.title'),
          desc: t('one_way.PAID.desc'),
        };
    }
    return {
      title: status,
      desc: status,
    };
  }

  const redirectToWhatsApp = () => {
    const url = 'whatsapp://send?phone=6282211511511';
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
  };

  return (
    <ScrollView>
      <View style={styles.driverSearchContainer}>
        <Text style={styles.driverSearchTitle}>
          {
            getDriverStatus(
              selected?.order_status === 'CANCELLED'
                ? selected?.order_status || ''
                : order_driver_tasks?.status || selected?.order_status || '',
            )?.title
          }
        </Text>
        <Text style={styles.driverSearchDescription}>
          {
            getDriverStatus(
              selected?.order_status === 'CANCELLED'
                ? selected?.order_status || ''
                : order_driver_tasks?.status || selected?.order_status || '',
            )?.desc
          }
        </Text>

        {order_driver_tasks?.status === 'ON_PICK_UP_LOCATION' && (
          <Text style={styles.driverSearchDescription}>
            {selected?.order_detail?.vehicle?.name} ·{' '}
            <Text style={{fontWeight: FONT_WEIGHT_BOLD}}>
              {selected?.order_detail?.vehicle?.license_number}
            </Text>
          </Text>
        )}
        <View style={styles.separator} />
      </View>

      {driverData?.name && !isCancelled ? (
        <View style={styles.driverDetailContainer}>
          <View style={styles.driverInfoContainer}>
            <Image
              source={{
                uri: URL_IMAGE + driverData?.PersonalInfos?.selfie,
              }}
              style={styles.driverImage}
            />
            <View>
              <Text
                style={{
                  fontSize: FONT_SIZE_14,
                  fontWeight: FONT_WEIGHT_BOLD,
                }}>
                {driverData?.name}
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZE_12,
                  fontWeight: FONT_WEIGHT_REGULAR,
                  marginTop: 5,
                }}>
                {driverData?.wa_code}
                {driverData?.phone}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              // console.log('item ', driverData);
              // return;
              if (activeRoom?.name || driverData?.id) {
                console.log('activeRoom = ', activeRoom);
                navigation.navigate('ChatRoom', {
                  room: {
                    ...activeRoom,
                    name: activeRoom?.name || '',
                    room_type: 'customer-driver',
                    to: driverData?.id,
                    driver_name: driverData?.name,
                  },
                  type: 'customer-driver',
                });
                return;
              }
              showToast({
                message: 'Room tidak ditemukan',
                title: 'Peringatan',
                type: 'warning',
              });
            }}>
            <Image source={ic_chat_active} style={styles.chatIcon} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.driverDetailContainer}>
          <View style={styles.driverInfoContainer}>
            <Image source={ic_user_placeholder} style={styles.driverImage} />
            <View>
              <View style={styles.placeholderLine} />
              <View
                style={[styles.placeholderLine, styles.placeholderMargin]}
              />
            </View>
          </View>
          <Image source={ic_chat} style={styles.chatIcon} />
        </View>
      )}
      <View style={styles.separator} />

      <View style={{paddingHorizontal: 20}}>
        {isCancelled && <RefundOrderNotification />}
      </View>

      <View style={styles.separator} />

      <View style={styles.detailContainer}>
        <Text style={styles.sectionTitle}>
          {t('detail_order.tripDetail.title')}
        </Text>

        <View style={styles.locationContainer}>
          <Image
            source={ic_pinpoin}
            style={[styles.locationIcon, styles.pickupIcon]}
          />
          <View>
            <Text style={styles.locationSubtitle}>
              {t('one_way.pickup_location')}
            </Text>
            <Text style={styles.locationTitle}>
              {
                selected?.order_detail?.rental_delivery_location?.split(
                  ',',
                )?.[0]
              }
            </Text>
            <Text style={styles.detailSectionContent}>
              {selected?.order_detail?.rental_delivery_location
                ?.split(',')
                ?.slice(1)
                ?.join(',')
                ?.trim() || '-'}
            </Text>
            <Text style={styles.detailSectionTitle}>
              {t('one_way.pickup_placeholder')}
            </Text>
            <Text style={styles.detailSectionContent}>
              {selected?.order_detail?.rental_delivery_notes ||
                selected?.order_detail?.rental_delivery_location_detail ||
                '-'}
            </Text>
          </View>
        </View>

        <View style={[styles.locationContainer, styles.destinationContainer]}>
          <Image
            source={ic_pinpoin}
            style={[styles.locationIcon, styles.dropoffIcon]}
          />
          <View>
            <Text style={styles.locationSubtitle}>
              {t('one_way.dropoff_location')} - {distance}
            </Text>
            <Text style={styles.locationTitle}>
              {selected?.order_detail?.rental_return_location?.split(',')?.[0]}
            </Text>
            <Text style={styles.detailSectionContent}>
              {selected?.order_detail?.rental_return_location
                ?.split(',')
                ?.slice(1)
                ?.join(',')
                ?.trim() || '-'}
            </Text>

            <Text style={styles.detailSectionTitle}>
              {t('one_way.dropoff_placeholder_description')}
            </Text>
            <Text style={styles.detailSectionContent}>
              {selected?.order_detail?.rental_return_notes ||
                selected?.order_detail?.rental_return_location_detail ||
                '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.sectionTitle}>{t('one_way.cost_detail')}</Text>

        <View style={styles.costDetailContainer}>
          <Text style={styles.costDetailText}>{t('one_way.cost_travel')}</Text>
          <Text style={styles.costDetailText}>
            {currencyFormat(selected?.booking_price || 0, selected?.currency)}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.totalCostContainer}>
        <Text style={styles.totalCostText}>{t('one_way.total_payment')}</Text>
        <Text style={styles.totalCostText}>
          {currencyFormat(
            selected?.total_amount_order || 0,
            selected?.currency,
          )}
        </Text>
      </View>

      <View
        style={{
          margin: 10,
        }}>
        {(selected?.order_status === 'CHECKOUT' ||
          selected?.order_status === 'PAID' ||
          selected?.order_status === 'SEARCHING_FOR_DRIVER' ||
          order_driver_tasks?.status === 'BOOKED') && (
          <CancelTask data={selected!} />
        )}
      </View>

      <View
        style={{
          margin: 10,
        }}>
        {(order_driver_tasks?.status === 'ON_PICK_UP_LOCATION' ||
          order_driver_tasks?.status === 'TRANSPORTING_PASSENGER') && (
          <Button
            _theme="white"
            title="Bantuan"
            onPress={redirectToWhatsApp}
            styleWrapper={{
              borderWidth: 1,
              borderColor: theme.colors.navy,
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default DetailOrder;

const styles = StyleSheet.create({
  driverSearchContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  driverSearchTitle: {
    fontSize: FONT_SIZE_16,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  driverSearchDescription: {
    fontSize: FONT_SIZE_14,
    fontWeight: FONT_WEIGHT_REGULAR,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    width: '90%',
    marginVertical: 16,
    alignSelf: 'center',
  },
  driverDetailContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  driverInfoContainer: {
    ...rowCenter,
    alignItems: 'flex-start',
  },
  driverImage: {
    width: 56,
    height: 56,
    marginRight: 5,
    borderRadius: 10,
  },
  placeholderLine: {
    width: 121,
    height: 15,
    borderRadius: 20,
    backgroundColor: theme.colors.grey7,
  },
  placeholderMargin: {
    marginTop: 5,
  },
  chatIcon: iconCustomSize(28),
  detailContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: WINDOW_WIDTH,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  destinationContainer: {
    marginTop: 16,
  },
  locationIcon: iconCustomSize(18),
  pickupIcon: {
    tintColor: theme.colors.navy,
    marginRight: 5,
  },
  dropoffIcon: {
    tintColor: theme.colors.orange,
    marginRight: 5,
  },
  locationSubtitle: {
    fontSize: FONT_SIZE_10,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  locationTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  locationDetail: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  detailSectionTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
    marginTop: 12,
  },
  detailSectionContent: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  costDetailContainer: {
    ...rowCenter,
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '100%',
  },
  costDetailText: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  totalCostContainer: {
    ...rowCenter,
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  totalCostText: {
    fontSize: FONT_SIZE_14,
    fontWeight: FONT_WEIGHT_BOLD,
  },
});
