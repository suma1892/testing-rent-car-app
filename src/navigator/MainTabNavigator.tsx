import BottomNavigator from './BottomNavigator';
import React, {useEffect} from 'react';
import VoucherSCreen from 'screens/VoucherSCreen/VoucherSCreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getInboxes} from 'redux/features/inbox/myInboxAPI';
import {RootTabParamList} from '../types/navigator';
import {theme} from 'utils';
import {useAppDispatch} from 'redux/hooks';
import {useNavigationState} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  HomeScreen,
  BookingScreen,
  InboxScreen,
  AccountScreen,
} from '../screens';

const RootTab = createBottomTabNavigator<RootTabParamList>();

const MainTab: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const stackNavigationState = useNavigationState(state => state);
  const tabNavigationState: any = stackNavigationState.routes.find(
    route => route.state,
  )?.state;
  const currentTabName = tabNavigationState
    ? tabNavigationState.routes[tabNavigationState.index].name
    : 'Unknown';

  useEffect(() => {
    dispatch(getInboxes());
  }, [currentTabName]);

  return (
    <RootTab.Navigator
      screenOptions={{
        headerShown: false,
        unmountOnBlur: false,
      }}
      initialRouteName={'Home'}
      tabBar={(props: any) => <BottomNavigator {...props} />}>
      <RootTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          // unmountOnBlur: true,
          tabBarLabel: t('Home.tabBarLabel') as any,
          tabBarShowLabel: true,
        }}
      />
      <RootTab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: t('myBooking.tabBarLabel') as any,
          tabBarShowLabel: true,
          headerStyle: {
            backgroundColor: theme.colors.navy,
          },
        }}
      />
      <RootTab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: t('myInbox.tabBarLabel') as any,
          tabBarShowLabel: true,
          headerStyle: {
            backgroundColor: theme.colors.navy,
          },
        }}
      />
      <RootTab.Screen
        name="Voucher"
        component={VoucherSCreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: t('settings.myVoucher') as any,
          tabBarShowLabel: true,
          headerStyle: {
            backgroundColor: theme.colors.navy,
          },
        }}
      />
      <RootTab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: t('settings.tabBarLabel') as any,
          tabBarShowLabel: true,
          headerStyle: {
            backgroundColor: theme.colors.navy,
          },
        }}
      />
    </RootTab.Navigator>
  );
};

export default MainTab;
