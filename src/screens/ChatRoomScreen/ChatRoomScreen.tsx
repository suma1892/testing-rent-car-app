/* eslint-disable react-hooks/exhaustive-deps */
import {API_MESSENGER} from '@env';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import appBar from 'components/AppBar/AppBar';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Keyboard,
  Platform,
} from 'react-native';
// import {useAuthStore} from 'store/actions/authStore';

import {useTranslation} from 'react-i18next';
import LeadingHeader from './component/LeadingHeader';
import TrailingHeader from './component/TrailingHeader';
import {theme} from 'utils';
import {
  ic_arrow_right,
  ic_clip,
  ic_close,
  ic_messages,
  ic_pinpoin3,
  ic_send,
} from 'assets/icons';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  FONT_SIZE_10,
  FONT_SIZE_12,
  FONT_SIZE_14,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {ImagePickerResponse, launchCamera} from 'react-native-image-picker';
import {showToast} from 'utils/Toast';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {RootStackParamList} from 'types/navigator';
import {
  delay,
  getImagesFromDCIM,
  getImagesFromDCIMAndDownload,
} from 'utils/functions';
import RenderItemChat from './component/RenderItemChat';
import RenderItemImage from './component/RenderItemImage';
import RenderItemImageList from './component/RenderItemImageList';
import ModalImagePreview from './component/ModalImagePreview';
import {getOrderByTrxId, uploadDriverTaskImages} from 'redux/effects';
import {ItemChat, Room} from 'types/websocket.types';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getUser} from 'redux/features/appData/appDataAPI';
import LeadingHeaderDriver from './component/LeadingHeaderDriver';
import {showBSheet} from 'utils/BSheet';
import Button from 'components/Button';
import {BigBoolean} from 'types/global.types';
import Config from 'react-native-config';
import {IOrder} from 'types/my-booking.types';
import {h1, h4} from 'utils/styles';
import i18next from 'i18next';
import useConnectWebSocket from 'utils/useConnectWebSocket';
import {ReadyState} from 'react-native-use-websocket';
import moment from 'moment';

type ScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

const ChatRoomScreen = () => {
  const {t} = useTranslation();
  const {room, type, funcHelpCenter} = useRoute<ScreenRouteProp>().params;
  const route = useRoute();
  const [loaderSend, setLoaderSend] = useState(false);
  // console.log('room key ', room?.name);

  const bottomSheetFormRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '60%', '100%'], []);
  const {userProfile, isLoading: userProfileLoading} =
    useAppSelector(appDataState);
  const dispatch = useAppDispatch();

  const [newMessage, setNewMessage] = useState('');

  const [currentMessages, setCurrentMessages] = useState([]);
  const socketRef = useRef<any>(null);
  const authToken = useAppSelector(state => state.auth?.auth?.access_token);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const retryInterval = 3000;

  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'reconnecting', 'disconnected'
  const isComponentMounted = useRef(true);
  const [images, setImages] = useState([]);

  const marginBottom = useSharedValue<'0%' | '40%'>('0%');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: marginBottom.value,
    };
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [orderById, setOrderById] = useState<IOrder>();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActiveRoom, setIsActiveRoom] = useState<BigBoolean>(true);

  const [inputMarginBottom, setInputMarginBottom] = useState<'40%' | '0%'>(
    '0%',
  );
  const [activeRoom, setActiveRoom] = useState<Room>(room);
  const [messageErr, setMessageErr] = useState(t('myInbox.no_message'));

  const navigation = useNavigation();

  useEffect(() => {
    if (room?.room_type === 'cs-customer' || room?.room_type === 'cs-order') {
      navigation.setOptions(
        appBar({
          leading: (
            <LeadingHeader
              room_type={room?.room_type}
              order_key={orderById?.order_key || room?.name}
            />
          ),
          trailing: (
            <TrailingHeader
              onPress={endChatAdmin}
              isActiveRoom={isActiveRoom}
            />
          ),
          headerStyle: {
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.navy,
          },
        }),
      );
    } else {
      navigation.setOptions(
        appBar({
          leading: <LeadingHeaderDriver room={room} />,
        }),
      );
    }
  }, [navigation, t, type, isActiveRoom, orderById?.order_key, room?.name]);

  useFocusEffect(
    useCallback(() => {
      isComponentMounted.current = true;

      getImages();
      getOrderById();

      return () => {
        isComponentMounted.current = false;
        setOrderById(undefined);

        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
          setCurrentMessages([]);
        }
      };
    }, [authToken, room, navigation]),
  );

  const getOrderById = async () => {
    // console.log('room?.name ', room);
    if (
      room?.transaction_key &&
      (room?.room_type === 'cs-order' || room?.room_type === 'customer-driver')
    ) {
      const res = await getOrderByTrxId(room?.transaction_key!);
      // console.log('getOrderByTrxId ', res);
      setOrderById(res);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        closeBottomSheet();
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('Keyboard is hidden');
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const endChatAdmin = () => {
    showBSheet({
      content: (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image
            source={ic_messages}
            style={{
              width: 168,
              height: 168,
            }}
          />
          <Text
            style={{
              fontSize: FONT_SIZE_12,
              fontWeight: FONT_WEIGHT_BOLD,
            }}>
            {t('myInbox.end_chat')}
          </Text>
          <Text
            style={{
              fontSize: FONT_SIZE_12,
              fontWeight: FONT_WEIGHT_REGULAR,
              lineHeight: 21,
              textAlign: 'center',
            }}>
            {t('myInbox.end_chat_desc')}
          </Text>

          <View
            style={{
              marginTop: 20,
              width: WINDOW_WIDTH - 50,
            }}>
            <Button
              _theme="navy"
              onPress={() => {
                endChatAdmin();
              }}
              title={t('myInbox.btn_continue_chat')}
            />
            <Button
              _theme="white"
              onPress={() => endRoomSession()}
              title={t('myInbox.btn_end_chat')}
              styleWrapper={{
                borderWidth: 1,
                borderColor: theme.colors.navy,
                marginTop: 20,
              }}
            />
          </View>
        </View>
      ),
      snapPoint: ['60%', '60%'],
    });
  };

  const endRoomSession = async () => {
    // if (readyState !== ReadyState.OPEN) return;
    if (!activeRoom?.id) return;
    const payload = {
      key: 'END_SESSION',
      req_send_message: {
        room_id: activeRoom?.id,
      },
    };
    // socketRef.current.send(JSON.stringify(payload));
    sendJsonMessage(payload);
    getMessages(activeRoom);
    endChatAdmin();
  };

  const startRoomSession = async () => {
    if (readyState !== ReadyState.OPEN) return;
    const payload = {
      key: 'SEND_MESSAGE',
      req_send_message: {
        room_name: activeRoom?.name || room?.driver_name,
        message: 'Hallo admin',
        ...(!activeRoom?.name && {to: room?.to}),
      },
      room_type: room?.room_type,
    };
    // socketRef.current.send(JSON.stringify(payload));
    sendJsonMessage(payload);
    setLoaderSend(false);
    if (!activeRoom?.id) {
      getRooms();
    }
    getMessages(activeRoom);
  };

  const getRooms = () => {
    if (!room?.to) return;
    const payload = {
      key:
        room?.room_type === 'cs-order' || room?.room_type === 'cs-customer'
          ? 'GET_INBOX_WITH_ADMIN'
          : 'GET_INBOX_WITH_TO',
      req_send_message: {
        to: room?.to,
      },
      room_type:
        room?.room_type === 'cs-order'
          ? 'cs-order'
          : room?.room_type === 'cs-customer'
          ? 'cs-customer'
          : 'customer-driver',
    };
    console.log('get rooms ', payload);
    // socketRef.current.send(JSON.stringify(payload));
    sendJsonMessage(payload);
  };

  const {sendJsonMessage, reconnectWebSocket, readyState} = useConnectWebSocket(
    {
      roomPayload: [],
      authToken: authToken!,
      onOpen: () => {
        const payload = {
          key:
            room?.room_type === 'cs-order' || room?.room_type === 'cs-customer'
              ? 'GET_INBOX_WITH_ADMIN'
              : 'GET_INBOX_WITH_TO',
          req_send_message: {
            to: room?.to,
          },
          room_type:
            room?.room_type === 'cs-order'
              ? 'cs-order'
              : room?.room_type === 'cs-customer'
              ? 'cs-customer'
              : 'customer-driver',
        };
        console.log('payload room ', payload);
        sendJsonMessage(payload);

        getMessages(activeRoom);
      },
      onSettled: (response: any) => {
        // console.log('response ', response);
        setMessageErr(t('myInbox.no_message'));
        if (
          response &&
          response.messages &&
          response?.room?.room_type === room?.room_type
        ) {
          setCurrentMessages(response.messages);
          setIsActiveRoom(response?.room?.is_active);
        }

        if (response?.key === 'END_SESSION') {
          getMessages(activeRoom?.id ? activeRoom : {id: response?.room?.id});
        }

        if (
          response &&
          response?.message &&
          response?.key === 'NEW_MESSAGE' &&
          response?.room?.room_type === room?.room_type
        ) {
          console.log('masuk end session');
          getMessages(activeRoom?.id ? activeRoom : {id: response?.room?.id});
          // setIsActiveRoom(response?.room?.is_active);
        }
        if (response?.room_type === 'customer-driver') {
          console.log('masuk room response', response);
          setActiveRoom(response);
          getMessages(response);
        }
      },
      onError: (err: any) => {
        setMessageErr(err);
      },
      // deps: [taskDetails?.order?.order_key],
    },
  );

  const getImages = async () => {
    try {
      const _: any = await getImagesFromDCIMAndDownload();
      setImages(_);
    } catch (error) {
      console.log('err ', error);
    }
  };

  const getMessages = (_activeRoom: any) => {
    console.log('readyState ', readyState);
    // if (readyState !== ReadyState.OPEN) return;
    if (
      // socketRef.current?.send &&
      _activeRoom?.id
      // &&
      // readyState === ReadyState.OPEN
      // socketRef.current &&
      // socketRef.current.readyState === WebSocket.OPEN
      // true
    ) {
      const payload = {
        key: 'GET_MESSAGES',
        req_get_messages: {
          room_id: _activeRoom?.id,
          limit: 50,
          page: 1,
        },
      };
      console.log('payload get mesg = ', payload);
      // socketRef.current?.send(JSON.stringify(payload));
      sendJsonMessage(payload);
    } else {
      // showToast({
      //   message: 'Room tidak ditemukan',
      //   title: 'Peringatan',
      //   type: 'warning',
      // });
    }
  };

  const sendMessageWithFiles = async (
    resUrlImage: any,
    message: any,
    roomName: any,
    roomType: any,
  ) => {
    try {
      for (const [index, fileObj] of resUrlImage.entries()) {
        const fileUrl = fileObj.file;
        const fileExtension = fileUrl.split('.').pop();
        const fileType = `image/${fileExtension}`;
        console.log('fileType ', fileType);
        const payload = {
          key: 'SEND_MESSAGE',
          req_send_message: {
            message: index === 0 ? message : '',
            file: fileUrl,
            file_type: fileType,
            // ...(activeRoom?.name && {room_name: roomName}),
            ...(currentMessages?.length <= 0 && {
              room_name: activeRoom?.name || `${orderById?.order_key}`,
            }),
            ...(activeRoom?.id && {room_id: activeRoom?.id}),
            ...(!activeRoom?.name && {to: room?.to}),
            order_key: orderById?.order_key,

            data: {
              order_id: orderById?.transaction_key,
              order_key: orderById?.order_key,
            },
            // ...(orderById?.order_key &&
            //   currentMessages?.length === 0 && {
            //     order_key: orderById?.order_key,
            //     data: {
            //       order_id: orderById?.order_key,
            //       order_key: orderById?.order_key,
            //     },
            //   }),
          },
          room_type: roomType,
        };

        // while (socketRef.current?.readyState !== WebSocket.OPEN) {
        //   console.log('Waiting for WebSocket to be ready...');
        //   await delay(1000);
        // }

        // socketRef.current.send(JSON.stringify(payload));
        sendJsonMessage(payload);
        console.log('Message sent img:', payload);

        setNewMessage('');
        await delay(1000);
      }
    } catch (error) {
      console.error('Error sending message with files:', error);
    }
  };

  const sendMessage = async () => {
    console.log('readyState ', readyState);
    // return;
    setLoaderSend(true);
    // if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
    if (readyState === ReadyState.OPEN) {
      if (selectedImages?.length > 0) {
        const resUrlImage = await uploadDriverTaskImages(selectedImages);

        await sendMessageWithFiles(
          resUrlImage,
          newMessage,
          activeRoom?.name || `${orderById?.order_key}`,
          room?.room_type,
        );
        setSelectedImages([]);
        setTimeout(() => {
          setLoaderSend(false);
          getMessages(activeRoom);
          if (!activeRoom?.id) {
            getRooms();
          }
        }, 500);
        return;
      }
      const payload = {
        key: 'SEND_MESSAGE',
        req_send_message: {
          ...(currentMessages?.length <= 0 && {
            room_name: activeRoom?.name || `${orderById?.order_key}`,
          }),
          message: newMessage,
          ...(!activeRoom?.name && {to: room?.to}),
          order_key: orderById?.order_key,
          ...(activeRoom?.id && {room_id: activeRoom?.id}),
          data: {
            order_id: orderById?.transaction_key,
            order_key: orderById?.order_key,
          },
        },
        room_type: room?.room_type,
      };

      console.log('payload = ', payload);
      console.log('activeRoom?.name ', activeRoom?.name);
      // return;
      // socketRef.current.send(JSON.stringify(payload));
      sendJsonMessage(payload);
      setLoaderSend(false);
      if (!activeRoom?.id) {
        getRooms();
      }
      getMessages(activeRoom);
      setNewMessage('');
    } else {
      console.error('WebSocket is not open');
    }
  };

  const onOpenCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result: ImagePickerResponse = await launchCamera({
          mediaType: 'photo',
          quality: 0.5,
          includeBase64: false,
          saveToPhotos: true,
        });

        if (Number(result.assets?.[0]?.fileSize) > 2097152) {
          throw new Error('Maaf, ukuran file tidak boleh lebih dari 2MB!');
        } else {
          console.log('result.assets?.[0] = ', result.assets?.[0]?.uri);
          if (!result.assets?.[0]?.uri) return;
          setSelectedImages(prev => [...prev, result.assets?.[0]?.uri]);
        }
      } else {
        throw new Error('Camera permission denied');
      }
    } catch (error: any) {
      showToast({
        title: t('failed'),
        type: 'error',
        message: error?.message || t('error_occured'),
      });
    }
  };

  const renderItem = useCallback(
    ({item, index}: {item: ItemChat | string; index: number}) => {
      const showDate = () => {
        if (index === currentMessages.length - 1) return true; // Show for last message (first when inverted)
        const prevMessage: any = currentMessages[index + 1]; // Since list is inverted, next item is previous message
        if (!prevMessage || prevMessage === 'cs-order') return false;

        const currentDate = moment(item?.created_at).startOf('day');
        const prevDate = moment(prevMessage?.created_at).startOf('day');
        return !currentDate.isSame(prevDate);
      };

      if (item === 'cs-order') {
        return (
          <TouchableOpacity
            style={[rowCenter, styles.cardOrder]}
            onPress={() =>
              navigation.navigate('AirportTransferBookingOrderDetailSgScreen', {
                transaction_key: orderById?.transaction_key!,
                packageActive: {},
                item: orderById!,
              })
            }>
            <View style={[rowCenter, {}]}>
              <Image
                source={ic_pinpoin3}
                style={[iconCustomSize(25), {marginRight: 12}]}
              />
              <View>
                <Text style={[h1]}>{t('Home.airportTransfer.title')}</Text>
                <Text style={[h4]}>{orderById?.order_key || room?.name}</Text>
              </View>
            </View>
            <View>
              <Image
                source={ic_arrow_right}
                style={iconCustomSize(15)}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <RenderItemChat
          item={item as any}
          isUser={item?.user_id === userProfile?.id}
          openImageInFullScreen={(x: string) => openImageInFullScreen(x)}
          showDate={showDate()}
        />
      );
    },
    [
      userProfile?.id,
      currentMessages,
      socketRef.current,
      navigation,
      room?.room_type,
      orderById?.order_key,
      orderById?.order_status,
    ],
  );

  const openModalGallery = () => {
    // bottomSheetFormRef.current?.present();
    bottomSheetFormRef.current?.snapToIndex(0);
    Keyboard.dismiss();
    setInputMarginBottom('40%');
    animateMarginBottom('40%');
  };

  const closeModalGallery = () => {
    // setTimeout(() => {
    bottomSheetFormRef.current?.close();
    setInputMarginBottom('0%');
    animateMarginBottom('0%');
    // }, 500);
  };

  const toggleImageSelection = (item: string) => {
    setSelectedImages(prevSelectedImages => {
      if (!prevSelectedImages.includes(item)) {
        // Tambahkan item jika belum ada
        return [...prevSelectedImages, item];
      } else {
        // Hapus item jika sudah ada
        return prevSelectedImages.filter(x => x !== item);
      }
    });
  };

  const openImageInFullScreen = (imageUri: string) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const closeFullScreen = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  const closeBottomSheet = useCallback(() => {
    if (bottomSheetFormRef.current) {
      setTimeout(() => {
        // bottomSheetFormRef.current?.dismiss();
      }, 50);
      console.log('BottomSheetModal dismissed');
    }
  }, []);

  const animateMarginBottom = (value: '0%' | '40%') => {
    marginBottom.value = withTiming(value, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };
  const renderItemImages = useCallback(
    ({item, index}: {item: string; index: number}) => (
      <RenderItemImage
        index={index}
        item={item}
        onOpenCamera={onOpenCamera}
        selectedImages={selectedImages}
        toggleImageSelection={toggleImageSelection}
      />
    ),
    [selectedImages, toggleImageSelection, images],
  );

  // console.log('selectedImages  ', selectedImages);

  const renderItemImageList = useCallback(
    ({item}: {item: string}) => (
      <RenderItemImageList
        item={item}
        openImageInFullScreen={openImageInFullScreen}
        toggleImageSelection={toggleImageSelection}
      />
    ),
    [],
  );

  const HelpCenterVisit = ({onPress}: {onPress: any}) => {
    if (i18next.language?.includes('en')) {
      return (
        <Text style={styles.helpCenterText}>
          This report is closed.{'\n'}Please visit the{' '}
          <Text
            onPress={onPress}
            style={{fontWeight: FONT_WEIGHT_BOLD, color: theme.colors.navy}}>
            Help Center
          </Text>{' '}
          Page
        </Text>
      );
    }
    if (i18next.language?.includes('id')) {
      return (
        <Text style={styles.helpCenterText}>
          Laporan ini sudah ditutup. Jika ada kendala, kunjungi halaman
          <Text
            onPress={onPress}
            style={{fontWeight: FONT_WEIGHT_BOLD, color: theme.colors.navy}}>
            Pusat Bantuan
          </Text>
        </Text>
      );
    }
    // return(

    // )
  };
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshSocket = () => {
    // refetch();
    // disconnectWebSocket();
    // reconnectWebSocket();
    navigation.replace('ChatRoom', {...route?.params});
    // disconnectWebSocket();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={
          messageErr === t('myInbox.alert_no_connection')
            ? []
            : room?.room_type === 'cs-order'
            ? [...currentMessages, 'cs-order']
            : currentMessages
        }
        inverted={messageErr !== t('myInbox.alert_no_connection')}
        keyExtractor={(item, index) => index.toString()}
        refreshing={refresh}
        onRefresh={() => {
          // if (messageErr !== t('myInbox.alert_no_connection')) return;
          return refreshSocket();
        }}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <>
            {messageErr === t('myInbox.alert_no_connection') && (
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
          </>
        )}
      />

      <View>
        <FlatList
          data={selectedImages}
          horizontal
          renderItem={renderItemImageList}
          keyExtractor={index => index.toString()}
        />

        {!room?.is_active ? (
          <>
            <View
              style={{
                marginTop: 20,
                borderTopColor: theme.colors.grey6,
                borderTopWidth: 1,
                paddingTop: 10,
              }}>
              <Text
                style={{
                  fontSize: FONT_SIZE_12,
                  fontWeight: FONT_WEIGHT_REGULAR,
                  lineHeight: 21,
                  textAlign: 'center',
                }}>
                {t('myInbox.archive_chat')}
              </Text>
            </View>
          </>
        ) : !isActiveRoom ? (
          <View
            style={{
              marginTop: 20,
              borderTopColor: theme.colors.grey6,
              borderTopWidth: 1,
              paddingTop: 10,
            }}>
            {room?.room_type === 'cs-customer' ? (
              <Text
                style={{
                  fontSize: FONT_SIZE_12,
                  fontWeight: FONT_WEIGHT_REGULAR,
                  lineHeight: 21,
                  textAlign: 'center',
                }}>
                {t('myInbox.chat_close')}{' '}
                <Text
                  onPress={startRoomSession}
                  style={{
                    fontWeight: FONT_WEIGHT_BOLD,
                    color: theme.colors.navy,
                  }}>
                  {t('myInbox.open_chat')}
                </Text>
              </Text>
            ) : (
              <HelpCenterVisit
                onPress={() => {
                  if (funcHelpCenter) {
                    funcHelpCenter();
                  }
                }}
              />
            )}
          </View>
        ) : (
          <Animated.View style={[styles.inputContainer, animatedStyle]}>
            <TouchableOpacity
              onPress={() =>
                inputMarginBottom === '40%'
                  ? closeModalGallery()
                  : openModalGallery()
              }>
              <Image
                source={inputMarginBottom === '40%' ? ic_close : ic_clip}
                style={iconCustomSize(inputMarginBottom === '40%' ? 15 : 24)}
              />
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholderTextColor={theme.colors.grey5}
                placeholder={t('myInbox.type_message')}
              />
              <TouchableOpacity
                // disabled={connectionStatus !== 'connected' || loaderSend}
                disabled={readyState !== ReadyState.OPEN || loaderSend}
                style={{marginRight: 10}}
                onPress={sendMessage}>
                <Image
                  source={ic_send}
                  style={[
                    iconCustomSize(20),
                    {
                      tintColor: loaderSend
                        ? theme.colors.grey4
                        : theme.colors.navy,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      <BottomSheet
        ref={bottomSheetFormRef as any}
        index={-1}
        snapPoints={snapPoints}
        animationConfigs={{
          duration: 500,
        }}
        enablePanDownToClose={false}
        // enableDismissOnClose={false}
        // onChange={handleSelectionChange}
      >
        <View
          style={{
            flex: 1,
          }}>
          <BottomSheetFlatList
            data={['0', ...images]}
            initialNumToRender={20}
            // extraData={selectedImages}
            // extraData={['0', ...images]?.length}
            maxToRenderPerBatch={10}
            windowSize={5}
            numColumns={3}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={Platform.OS === 'android'}
            style={{
              padding: 5,
            }}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            keyExtractor={item => item}
            renderItem={renderItemImages}
          />
        </View>
      </BottomSheet>
      <ModalImagePreview
        closeFullScreen={closeFullScreen}
        isModalVisible={isModalVisible}
        selectedImage={selectedImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: WINDOW_WIDTH / 1.5,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    // borderColor: '#ccc',
    // borderWidth: 1,
    color: theme.colors.black,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    marginRight: 10,
    color: theme.colors.black,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.grey6,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 20,
  },
  outbox: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.blue,
  },
  inbox: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
  },
  messageText: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
    color: theme.colors.white,
    marginRight: 10,
    lineHeight: 19,
  },
  dateText: {
    fontSize: FONT_SIZE_10,
    fontWeight: FONT_WEIGHT_REGULAR,
    color: theme.colors.white,
    marginRight: 4,
  },
  chatItemWrapper: {
    marginBottom: 10,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue,
    maxWidth: WINDOW_WIDTH / 1.5,
  },
  cardOrder: {
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    borderRadius: 10,
    margin: 10,
  },
  helpCenterText: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ChatRoomScreen;
