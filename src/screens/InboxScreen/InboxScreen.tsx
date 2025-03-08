import appBar from 'components/AppBar/AppBar';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import MyInboxCard from 'components/MyInboxComponent/MyInboxCard/MyInboxCard';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getInboxes} from 'redux/features/inbox/myInboxAPI';
import {h1, h4} from 'utils/styles';
import {
  ic_arrow_left_white,
  ic_ask_cs,
  ic_empty_image,
  ic_inbox_not_found,
  ic_messages,
  ic_notif,
  ic_notification_bell,
} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {inboxState, setPage} from 'redux/features/inbox/myInboxSlice';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  FONT_SIZE_12,
  FONT_SIZE_14,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
  FONT_WEIGHT_SEMI_BOLD,
} from 'utils/typography';
import Button from 'components/Button';

import {Room} from 'types/websocket.types';
import UserInitial from 'components/UserInitial';
import moment from 'moment';
import {appDataState} from 'redux/features/appData/appDataSlice';
import useConnectWebSocket from 'utils/useConnectWebSocket';

const MyBooking: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const inboxData = useAppSelector(inboxState);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<Room[]>();
  const userProfile = useAppSelector(appDataState).userProfile;
  const [messageErr, setMessageErr] = useState(t('myInbox.no_message'));
  const authToken = useAppSelector(state => state?.auth?.auth?.access_token);

  const [messageCs, setMessageCs] = useState<any>();

  const [activeTabChat, setActiveTabChat] = useState<'inbox' | 'history'>(
    'inbox',
  );

  const [listHistory, setListHistory] = useState<any[]>([]);

  const [activeRoomCS, setActiveRoomCS] = useState<any>();
  useFocusEffect(
    useCallback(() => {
      setActiveRoom([]);
      return () => {
        setActiveRoom([]);
        console.log('isFocused inbox ', isFocused);
      };
    }, []),
  );

  const {sendJsonMessage, reconnectWebSocket} = useConnectWebSocket({
    roomPayload: [
      {
        key: 'GET_INBOX',
      },
      {
        key: 'GET_INBOX_WITH_ADMIN',
        room_type: 'cs-customer',
      },
      {
        key: 'GET_HISTORY',
        room_types: ['cs-order', 'customer-driver'],
      },
    ],
    authToken: authToken!,
    onSettled: (response: any) => {
      setMessageErr(t('myInbox.no_message'));
      // console.log('response 123 ', response);
      if (response?.key === 'NEW_MESSAGE') {
        sendJsonMessage({
          key: 'GET_INBOX',
        });
        return;
      }

      if (response?.room_type === 'cs-customer') {
        setActiveRoomCS(response);
      }

      if (response?.key === 'GET_INBOX' && Array.isArray(response?.data)) {
        setActiveRoom(
          response?.data.filter(
            x =>
              x?.room?.room_type === 'customer-driver' ||
              x?.room?.room_type === 'cs-order',
          ),
        );
        const dataCs = response?.data.find(
          x => x?.room?.room_type === 'cs-customer',
        );
        // console.log('dataCs ', dataCs);
        setMessageCs(dataCs);
      } else if (response.key === 'GET_HISTORY' && response?.data) {
        console.log('masuk history');
        setListHistory([...response?.data]);
      }
    },
    onError: (err: any) => {
      setMessageErr(err);
    },
    // deps: [taskDetails?.order?.order_key],
  });

  const renderItem = useCallback(
    ({item}: any) => {
      const cust_name =
        item?.room?.participants?.filter(
          x => x?.user_name !== userProfile?.name,
        )?.[0]?.user_name || item?.room?.participants?.[1]?.user_name;

      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatRoom', {
              room: {
                ...item?.room,
                name: item?.room?.name,
                room_type: item?.room?.room_type,
                id: item?.room?.id,
                is_active: true, //item?.room?.is_active,
                transaction_key: item?.room?.data?.order_id,
                user_name: item?.user?.user_name,
              },
              type: item?.room?.room_type,
              funcHelpCenter: () => {
                navigation.replace('ChatRoom', {
                  room: {
                    ...item?.room,
                    name:
                      activeRoomCS?.name || `${userProfile?.name}`,
                    room_type: activeRoomCS?.room_type || 'cs-customer',
                    id: activeRoomCS?.id,
                    is_active: true,
                    transaction_key: item?.room?.data?.order_id,
                  },
                  type: activeRoomCS?.room_type || 'cs-customer',
                });
              },
            });
          }}
          style={[
            rowCenter,
            {justifyContent: 'space-between', marginBottom: 10},
          ]}>
          <View style={[rowCenter]}>
            {item?.room?.room_type === 'cs-order' ? (
              <Image
                source={ic_ask_cs}
                style={[iconCustomSize(40), {marginRight: 10}]}
              />
            ) : (
              <UserInitial
                name={
                  item?.room?.room_type === 'cs-order'
                    ? item?.room?.data?.order_key || item?.room?.name
                    : cust_name
                }
                size={40}
              />
            )}
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontSize: FONT_SIZE_12,
                  fontWeight: FONT_WEIGHT_SEMI_BOLD,
                }}>
                {item?.room?.room_type === 'cs-order'
                  ? item?.room?.data?.order_key || item?.room?.name
                  : cust_name}
              </Text>
              {item?.message.file ? (
                <>
                  <View style={[rowCenter]}>
                    <Image source={ic_empty_image} style={iconCustomSize(15)} />
                    <Text
                      style={{
                        fontSize: FONT_SIZE_12,
                        fontWeight: FONT_WEIGHT_REGULAR,
                        color: theme.colors.grey4,
                        marginLeft: 5,
                      }}>
                      Photo
                    </Text>
                  </View>
                </>
              ) : (
                <Text
                  style={{
                    fontSize: FONT_SIZE_12,
                    fontWeight: FONT_WEIGHT_REGULAR,
                    color: theme.colors.grey4,
                  }}>
                  {item?.message.message}
                </Text>
              )}
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: FONT_SIZE_12,
                fontWeight: FONT_WEIGHT_REGULAR,
                color: theme.colors.grey4,
              }}>
              {moment(item?.created_at).format('HH:mm')}
            </Text>
            {!item?.message?.is_read && (
              <View style={styles.messageCount}>
                <Text style={styles.messageCountText}>1</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, activeRoom],
  );

  const refreshSocket = () => {
    // refetch();
    // disconnectWebSocket();
    // reconnectWebSocket();
    navigation.replace('MainTab', {screen: 'Inbox'});
    // disconnectWebSocket();
  };

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
              {t('myInbox.tabBarLabel')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    console.log('isFocused navigation ', isFocused);
  }, [navigation]);

  // useEffect(() => {
  //   console.log('isFocused222 ', isFocused);
  //   console.log('navigation.isFocused() ', navigation.isFocused());
  //   return () => {
  //     console.log('isFocused return ', isFocused);
  //     console.log('navigation.isFocused() return ', navigation.isFocused());
  //   };
  // }, [isFocused]);

  // if (inboxData.isLoading) {
  //   return <Loading />;
  // }

  // console.log('activeRoomCS ', activeRoomCS);
  const unreadInboxCount = useMemo(() => {
    const count =
      inboxData?.data?.inboxes?.filter((inbox: any) => !inbox?.is_read)
        .length || 0;
    return count > 99 ? '99+' : count;
  }, [inboxData?.data?.inboxes]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: theme.colors.white,
          elevation: 4,
          padding: 20,
        }}>
        <TouchableOpacity
          style={[rowCenter, {marginBottom: 21}]}
          onPress={() => navigation.navigate('NotificationList')}>
          <Image source={ic_notification_bell} style={iconCustomSize(17)} />
          <Text style={styles.textTitle}>{t('myInbox.notification')}</Text>
          {(unreadInboxCount > 0 || Boolean(unreadInboxCount)) && (
            <View style={[styles.messageCount, {marginLeft: 10}]}>
              <Text style={styles.messageCountText}>{unreadInboxCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[rowCenter]}
          onPress={() => {
            console.log('activeRoomCS ', activeRoomCS);
            navigation.navigate('ChatRoom', {
              room: {
                name: activeRoomCS?.name || `${userProfile?.name}`,
                room_type: activeRoomCS?.room_type || 'cs-customer',
                id: activeRoomCS?.id,
                is_active: true,
              },
              type: activeRoomCS?.room_type || 'cs-customer',
            });
          }}>
          <Image source={ic_notif} style={iconCustomSize(17)} />
          <Text style={styles.textTitle}>{t('myInbox.call_center')}</Text>
          {messageCs?.message && !messageCs?.message?.is_read && (
            <View style={[styles.messageCount, {marginLeft: 10}]}>
              <Text style={styles.messageCountText}>1</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={{padding: 20}}>
        <View style={[rowCenter, {marginBottom: 21}]}>
          <Image source={ic_notif} style={iconCustomSize(17)} />
          <Text style={styles.textTitle}>{t('myInbox.your_chat')}</Text>
        </View>

        <View style={[rowCenter, {justifyContent: 'space-between'}]}>
          <Button
            _theme="white"
            onPress={() => {
              setActiveTabChat('inbox');
              // getRooms();
            }}
            title="Inbox"
            styleWrapper={{
              flex: 1 / 2.2,
              backgroundColor:
                activeTabChat === 'inbox'
                  ? theme.colors.navy
                  : theme.colors.grey6,
            }}
            styleText={{
              color:
                activeTabChat === 'inbox'
                  ? theme.colors.white
                  : theme.colors.grey3,
            }}
          />

          <Button
            _theme="white"
            onPress={() => {
              setActiveTabChat('history');
              // getHistory();
            }}
            title="History"
            styleWrapper={{
              flex: 1 / 2.2,
              backgroundColor:
                activeTabChat === 'history'
                  ? theme.colors.navy
                  : theme.colors.grey6,
            }}
            styleText={{
              color:
                activeTabChat === 'history'
                  ? theme.colors.white
                  : theme.colors.grey3,
            }}
          />
        </View>

        {activeTabChat === 'history' && (
          <FlatList
            data={listHistory}
            refreshing={refresh}
            onRefresh={() => {
              return refreshSocket();
            }}
            style={{marginTop: 20}}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '30%',
                }}>
                <Image
                  source={ic_messages}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                />
                <Text
                  style={[
                    h1,
                    {
                      fontSize: FONT_SIZE_14,
                      textAlign: 'center',
                      lineHeight: 24,
                    },
                  ]}>
                  {messageErr}
                </Text>
              </View>
            )}
          />
        )}
        {activeTabChat === 'inbox' && (
          <FlatList
            data={activeRoom}
            refreshing={refresh}
            onRefresh={() => {
              return refreshSocket();
            }}
            style={{marginTop: 20}}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '30%',
                }}>
                <Image
                  source={ic_messages}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                />
                <Text
                  style={[
                    h1,
                    {
                      fontSize: FONT_SIZE_14,
                      textAlign: 'center',
                      lineHeight: 24,
                    },
                  ]}>
                  {messageErr}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default hoc(MyBooking, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    // padding: 10,
    // justifyContent: 'space-between',
  },
  textTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHT_REGULAR,
    marginLeft: 5,
  },
  messageCount: {
    backgroundColor: theme.colors.orange,
    // padding: 5,
    marginTop: 2,
    borderRadius: 100,
    // paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
  },
  messageCountText: {
    ...h4,
    color: theme.colors.white,
    fontSize: 10,
  },
});
