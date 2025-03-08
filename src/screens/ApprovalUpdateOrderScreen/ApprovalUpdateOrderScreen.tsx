import appBar from 'components/AppBar/AppBar';
import Config from 'react-native-config';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {authState} from 'redux/features/auth/authSlice';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type ApprovalUpdateOrderScreenRouteProp = RouteProp<
  RootStackParamList,
  'ApprovalUpdateOrder'
>;

const ApprovalUpdateOrderScreen = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<ApprovalUpdateOrderScreenRouteProp>();
  const authData = useAppSelector(authState).auth;

  const webViewRef = useRef<WebView>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const modifyDOM = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
          if (button.textContent.trim() === 'Kembali ke Beranda') {
            button.onclick = function(event) {
              event.preventDefault();
              event.stopImmediatePropagation();
              window.ReactNativeWebView.postMessage('backToHomeClicked');
            };
          }
        });
        true;
      `);
    }
  };

  const injectedJS = `
    setTimeout(() => {
      const mobileMenu = document.querySelector('.fixed');
      if (mobileMenu) {
        mobileMenu.classList.replace('fixed', 'hidden');
      }
    }, 100);
    true;
  `;

  const handleOnMessage = (event: any) => {
    if (event.nativeEvent.data === 'backToHomeClicked') {
      navigation.replace('MainTab', {screen: 'Booking'});
    }
  };

  const approvalUpdateOrderUrl = `${Config.APP_URL}/${
    i18n.language === 'en' ? 'en' : 'id'
  }/approval-update-order?key=${route.params?.transactionKey}&token=${
    authData?.access_token
  }&refresh_token=${authData?.refresh_token}`;

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
              {t('global.button.confirm_order')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  useEffect(() => {
    if (url === `${Config.APP_URL}/update-order-approved`) {
      modifyDOM();
    }
  }, [url]);

  const getUrl = () => {
    if (i18n.language === 'cn') {
      return approvalUpdateOrderUrl?.replace(
        'getandride.com/id/',
        'getandride.com/zh/',
      );
    }
    return approvalUpdateOrderUrl;
  };

  console.log('getUrl = ', getUrl());
  return (
    <View style={{flex: 1, width: WINDOW_WIDTH}}>
      {url === approvalUpdateOrderUrl && loading && <Loading />}

      <WebView
        ref={webViewRef}
        source={{
          uri: getUrl(),
        }}
        style={{flex: 1}}
        javaScriptEnabled={true}
        injectedJavaScript={injectedJS}
        onNavigationStateChange={e => setUrl(e.url)}
        onMessage={handleOnMessage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          setLoading(false);
          // Inject the JavaScript after the page has fully loaded
          webViewRef?.current?.injectJavaScript(injectedJS);
        }}
      />
    </View>
  );
};

export default hoc(
  ApprovalUpdateOrderScreen,
  theme.colors.navy,
  false,
  'light-content',
);
