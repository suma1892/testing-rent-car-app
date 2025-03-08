import AirportDetailCarScreen from 'screens/AirportDetailCarScreen/AirportDetailCarScreen';
import AirportListCarScreen from 'screens/AirportListCarScreen/AirportListCarScreen';
import NetInfo from '@react-native-community/netinfo';

import ChangePasswordScreen from 'screens/ChangePasswordScreen/ChangePasswordScreen';
import CodepushUpdateManager from 'screens/CodepushUpdateManager/CodepushUpdateManager';
import CompanyProfileScreen from 'screens/CompanyProfileScreen/CompanyProfileScreen';
import DailyBookingOrderDetailScreen from 'screens/DailyBookingOrderDetailScreen/DailyBookingOrderDetailScreen';
import DeleteAccountConfirmationScreen from 'screens/DeleteAccountConfirmationScreen/DeleteAccountConfirmationScreen';
import DetailVoucherScreen from 'screens/DetailVoucherScreen/DetailVoucherScreen';
import ForgotPasswordOtpInputScreen from 'screens/ForgotPasswordOtpInputScreen/ForgotPasswordOtpInputScreen';
import HistoryPointScreen from 'screens/HistoryPointScreen/HistoryPointScreen';
import LoyaltyScreen from 'screens/LoyaltyScreen/LoyaltyScreen';
import MainTabNavigator from './MainTabNavigator';
import NotificationScreen from 'screens/NotificationScreen/NotificationScreen';
import OnBoardingScreen from 'screens/OnBoardingScreen/OnBoardingScreen';
import ProfileScreen from 'screens/ProfileScreen/ProfileScreen';
import React, {useEffect, useRef, useState} from 'react';
import ReferralCodeDeeplinkScreen from 'screens/ReferralCodeDeeplinkScreen/ReferralCodeDeeplinkScreen';
import ReferralCodeScreen from 'screens/ReferralCodeScreen/ReferralCodeScreen';
import RentalZoneScreen from 'screens/RentalZoneScreen/RentalZoneScreen';
import UploadBankTransferScreen from 'screens/UploadBankTransferScreen/UploadBankTransferScreen';
import UserInformationScreen from 'screens/UserInformationScreen/UserInformationScreen';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigator';
import {theme} from 'utils';
import {
  AuthScreen,
  ForgotPasswordScreen,
  DetailCarScreen,
  DailyListCarScreen,
  LoginScreen,
  OrderDetailScreen,
  RegisterPasswordScreen,
  RegisterScreen,
  RegisterVerificationScreen,
  ResetPasswordScreen,
  PaymentMethodScreen,
  CardPaymentScreen,
  VirtualAccountScreen,
  BankTransferScreen,
  InstantPaymentScreen,
  InboxDetailScreen,
  HelpCenterScreen,
} from '../screens';
import DeleteAccountOtpScreen from 'screens/DeleteAccountOtpScreen/DeleteAccountOtpScreen';
import SuccessDeleteAccountScreen from 'screens/SuccessDeleteAccountScreen/SuccessDeleteAccountScreen';
import UserInformationPaymentScreen from 'screens/UserInformationPaymentScreen/UserInformationPaymentScreen';
import PaymentWebViewScreen from 'screens/PaymentWebViewScreen/PaymentWebViewScreen';
import InfoPaymentSuccessScreen from 'screens/InfoPaymentSuccessScreen/InfoPaymentSuccessScreen';

import ProofTransferScreen from 'screens/ProofTransferScreen/ProofTransferScreen';
import ApprovalUpdateOrderScreen from 'screens/ApprovalUpdateOrderScreen/ApprovalUpdateOrderScreen';
import AdditionalItemScreen from 'screens/AdditionalItemScreen/AdditionalItemScreen';
import OneWayServiceScreen from 'screens/OneWayServiceScreen/OneWayServiceScreen';
import OrderScheduleScreen from 'screens/OrderScheduleScreen/OrderScheduleScreen';
import OneWayDetailBookingScreen from 'screens/OneWayDetailBookingScreen/OneWayDetailBookingScreen';
import RefundStatusScreen from 'screens/RefundStatusScreen/RefundStatusScreen';
import NotificationListScreen from 'screens/NotificationListScreen/NotificationListScreen';
import ChatRoomScreen from 'screens/ChatRoomScreen/ChatRoomScreen';
import OrderDetailAirportTransferScreen from 'screens/OrderDetailAirportTransferScreen/OrderDetailAirportTransferScreen';
import SelectMapLocationScreen from 'screens/SelectMapLocationScreen/SelectMapLocationScreen';
import AirportTransferBookingOrderDetailSgScreen from 'screens/AirportTransferBookingOrderDetailSgScreen/AirportTransferBookingOrderDetailSgScreen';
import AirportTransferBookingOrderDetailScreen from 'screens/AirportTransferBookingOrderDetailScreen/AirportTransferBookingOrderDetailScreen';
import RefundProcessScreen from 'screens/RefundProcessScreen/RefundProcessScreen';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {refreshToken} from 'redux/features/auth/authAPI';
import {logout} from 'redux/features/auth/authSlice';
import store from 'redux/store';
import {useNavigation} from '@react-navigation/native';
import useEffectSkipInitialRender from 'utils/useEffectSkipInitialRender';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

const RootStack = createStackNavigator<RootStackParamList>();

const topToDownAnimation = {
  cardStyleInterpolator: ({current, layouts}: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const useInternetStatus = () => {
  const [reachable, setReachable] = useState(false);
  useEffect(() => {
    try {
      //

      const subscribe = state => setReachable(state.isInternetReachable);

      NetInfo.addEventListener(subscribe);

      // return () => NetInfo.removeEventListener(subscribe);
    } catch (e) {}
  }, []);

  return reachable;
};

const MainStack: React.FC = () => {
  const dispatch = useAppDispatch();
  const isInternetReachable = useInternetStatus();

  const time = 300000;
  const refresh_token = useAppSelector(
    state => state?.auth?.auth?.refresh_token,
  );
  const [signal, setSignal] = useState(null);
  const [color, setColor] = useState(theme.colors.red);
  const [textSignal, settextSignal] = useState('Jaringan tidak tersedia');
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('isInternetReachable ', isInternetReachable);
    if (!isInternetReachable) {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      return;
    }
    pingIntervalRef.current = setInterval(async () => {
      console.log('🔄 Refreshing token every 5 minutes...');
      try {
        if (refresh_token) {
          const res = await dispatch(refreshToken(refresh_token as any));
          console.log('✅ Token refreshed successfully');
        }
      } catch (error) {
        console.error('❌ Failed to refresh token:', error);
        // await dispatch(logout());
        // navigation.navigate('MainTab', {screen: 'Home'} as any);
      }
    }, time);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [isInternetReachable]);
  const {t} = useTranslation();
  useEffectSkipInitialRender(() => {
    if (!signal) {
      setSignal(!isInternetReachable);
      setColor(theme.colors.red);
      settextSignal(t('global.alert.no_network'));
    } else {
      setColor('#46ab61');
      settextSignal(t('global.alert.back_online'));

      setTimeout(() => {
        setSignal(!isInternetReachable);
      }, 2000);
    }
  }, [isInternetReachable]);

  return (
    <>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
        }}
        initialRouteName="Auth">
        <RootStack.Screen name="Auth" component={AuthScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen
          name="RegisterPassword"
          component={RegisterPasswordScreen}
        />
        <RootStack.Screen
          name="RegisterVerification"
          component={RegisterVerificationScreen}
        />
        <RootStack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />
        <RootStack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
        />
        <RootStack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{
            animationEnabled: false,
          }}
          // options={topToDownAnimation}
        />
        <RootStack.Screen
          name="DailyListCar"
          component={DailyListCarScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="AirportListCar"
          component={AirportListCarScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="OrderDetailAirportTransfer"
          component={OrderDetailAirportTransferScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="DetailCar"
          component={DetailCarScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="AirportDetailCar"
          component={AirportDetailCarScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="RentalZone"
          component={RentalZoneScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="PaymentMethod"
          component={PaymentMethodScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="PaymentWebView"
          component={PaymentWebViewScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="DailyBookingOrderDetailScreen"
          component={DailyBookingOrderDetailScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="AirportTransferBookingOrderDetailScreen"
          component={AirportTransferBookingOrderDetailScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="AirportTransferBookingOrderDetailSgScreen"
          component={AirportTransferBookingOrderDetailSgScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="CardPayment"
          component={CardPaymentScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="VirtualAccount"
          component={VirtualAccountScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="BankTransfer"
          component={BankTransferScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="ProofTransfer"
          component={ProofTransferScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="UploadBankTransfer"
          component={UploadBankTransferScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="InstantPayment"
          component={InstantPaymentScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
          }}
        />
        <RootStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="UserInformation"
          component={UserInformationScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="UserInformationPayment"
          component={UserInformationPaymentScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="ReferralCode"
          component={ReferralCodeScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="ReferralCodeDeeplink"
          component={ReferralCodeDeeplinkScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="InboxDetail"
          component={InboxDetailScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="HelpCenter"
          component={HelpCenterScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="OnBoarding"
          component={OnBoardingScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="CodepushUpdateManager"
          component={CodepushUpdateManager}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="CompanyProfile"
          component={CompanyProfileScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="Loyalty"
          component={LoyaltyScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="RefferalCode"
          component={ReferralCodeScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="HistoryPoint"
          component={HistoryPointScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="ForgotPasswordOtpInput"
          component={ForgotPasswordOtpInputScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="DetailVoucher"
          component={DetailVoucherScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="DeleteAccountConfirmation"
          component={DeleteAccountConfirmationScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="DeleteAccountOtp"
          component={DeleteAccountOtpScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="SuccessDeleteAccount"
          component={SuccessDeleteAccountScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="ApprovalUpdateOrder"
          component={ApprovalUpdateOrderScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="InfoPaymentSuccessScreen"
          component={InfoPaymentSuccessScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="AdditionalItem"
          component={AdditionalItemScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="OneWayService"
          component={OneWayServiceScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="OrderSchedule"
          component={OrderScheduleScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="OneWayDetailBooking"
          component={OneWayDetailBookingScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="RefundStatus"
          component={RefundStatusScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="NotificationList"
          component={NotificationListScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="ChatRoom"
          component={ChatRoomScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.white,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="SelectMapLocation"
          component={SelectMapLocationScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.white,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name="RefundProcess"
          component={RefundProcessScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.navy,
            },
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </RootStack.Navigator>
      {signal && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 30,
            backgroundColor: color,
          }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 12,
              color: '#fff',
            }}>
            {textSignal}
          </Text>
        </View>
      )}
    </>
  );
};

export default MainStack;
