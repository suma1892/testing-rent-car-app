import Config from 'react-native-config';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import useWebSocket from 'react-native-use-websocket';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {RootStackParamList} from 'types/navigator';
import useInternetStatus from './useInternetStatus';
import {delay} from './functions';
import {useTranslation} from 'react-i18next';

type UseConnectWebSocketProps = {
  url?: string;
  roomPayload?: any[];
  onSettled?: (response: any) => void;
  deps?: any[];
  active_screen?: RootStackParamList;
  isPing?: boolean;
  onError: (err: any) => void;
  authToken: string;
  onOpen?: () => void;
};
const INVALID_LINK = 'wss://invalid-link';
const WEBSOCKET_LINK = Config.API_MESSENGER;
const useConnectWebSocket = ({
  url,
  roomPayload,
  onSettled,
  onError,
  deps = [],
  onOpen,
  authToken,
}: UseConnectWebSocketProps) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isInternetReachable = useInternetStatus();
  const didUnmount = useRef(false);
  const isDisconnected = useRef(false);
  const isRefreshingToken = useRef(false);
  const [activeToken, setActiveToken] = useState(authToken);
  const [websocketUrl, setWebsocketUrl] = useState(WEBSOCKET_LINK);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {sendJsonMessage, lastJsonMessage, readyState, getWebSocket} =
    useWebSocket(
      websocketUrl as any,
      {
        queryParams: {
          token: authToken!,
        },
        onOpen: () => {
          console.log('✅ WebSocket connected ', authToken);
          isDisconnected.current = false;
          roomPayload?.forEach(x => sendJsonMessage(x));
          onOpen?.();

          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

          // if (isInternetReachable && !isDisconnected.current) {
          console.log('navigation.isFocused() onopen ', navigation.isFocused());
          if (!navigation.isFocused()) return;

          console.log('📡 Internet aktif, memulai PING');
          pingIntervalRef.current = setInterval(() => {
            if (!isDisconnected.current && !isRefreshingToken.current) {
              console.log('📡 Sending PING');
              sendJsonMessage({key: 'PING'});
            }
          }, 2000);
          // } else {
          //   console.log('🛑 Internet terputus, menghentikan PING');
          // }
        },
        onMessage: event => {
          try {
            const response = event.data.startsWith('{"')
              ? JSON.parse(event.data)
              : '';
            if (response?.key === 'PONG') {
              console.log('🟢 Received PONG');
              return;
            }
            onSettled?.(response);
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
          }
        },
        onError: async error => {
          if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
          }
          didUnmount.current = true;
          console.log('navigation.isFocused() ', navigation.isFocused());
          if (!navigation.isFocused()) return;

          console.error('❌ WebSocket error: ', error);
          if (
            error?.message?.includes('Network is down') ||
            error?.message?.includes('kCFErrorDomainCFNetwork') ||
            error?.message?.includes('No address associated with hostname')
          ) {
            onError(t('myInbox.alert_no_connection'));
            disconnectWebSocket();

            return;
          }
        },
        onClose: err => {
          if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
          }
          didUnmount.current = true;
          console.log('isfocused ', isFocused);
          if (!navigation.isFocused()) return;

          console.log('⚠️ WebSocket closed', err);
          if (
            err?.message?.includes('No address associated with hostname') ||
            !err?.message ||
            err?.message?.includes('Socket closed')
          ) {
            console.log('reset url');
            setWebsocketUrl(WEBSOCKET_LINK);
            return;
          }
          if (err?.message?.includes('401')) {
            setActiveToken(authToken);
            onError(t('myInbox.alert_no_connection'));
            setWebsocketUrl(WEBSOCKET_LINK);
            if (pingIntervalRef.current) {
              clearInterval(pingIntervalRef.current);
              pingIntervalRef.current = null;
            }
            return;
          }
        },
        retryOnError: true,
        shouldReconnect: () => true, // !didUnmount.current,// && !isDisconnected.current,
        reconnectAttempts: 10,
        reconnectInterval: 1000,
      },
      Boolean(authToken),
    );

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  useEffect(() => {
    console.log('aktif token ', authToken);
    setActiveToken(authToken);
    // disconnectWebSocket();
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      console.log('masuk pertama disini');
      const _func = async () => {
        roomPayload?.forEach(x => sendJsonMessage(x));
      };
      _func();
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }

      return () => {
        didUnmount.current = false;
        console.log('isFocuesd = ', isFocused);
      };
    }, [sendJsonMessage, navigation]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!isInternetReachable) {
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      } else {
        const socket = getWebSocket();
        socket?.close();
        console.log('check triggerred ', socket?.readyState);
        setWebsocketUrl(INVALID_LINK);
      }
    }, [isInternetReachable]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!isInternetReachable) {
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
          isDisconnected.current = false;
        }
      }

      return () => {};
    }, [isInternetReachable]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('🛑 Stopping PING');
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      };
    }, [sendJsonMessage, isInternetReachable]),
  );

  const reconnectWebSocket = async () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    setWebsocketUrl(INVALID_LINK);
    await delay(1000);
    setWebsocketUrl(WEBSOCKET_LINK);
  };

  const disconnectWebSocket = () => {
    const currentWebSocket = getWebSocket();
    console.log(currentWebSocket?.readyState);
    currentWebSocket?.close();

    console.log(currentWebSocket?.readyState);
  };

  return {
    sendJsonMessage,
    disconnectWebSocket,
    reconnectWebSocket,
    readyState,
  };
};

export default useConnectWebSocket;
