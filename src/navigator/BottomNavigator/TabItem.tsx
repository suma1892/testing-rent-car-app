import React, {useCallback, useMemo} from 'react';
import theme from 'utils/theme';
import {authState, logout} from 'redux/features/auth/authSlice';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {inboxState} from 'redux/features/inbox/myInboxSlice';
import {resetAccountBank} from 'redux/features/accountBank/accountBankSlice';
import {resetDisbursementStatus} from 'redux/features/order/orderSlice';
import {resetNotification} from 'redux/features/notifications/notificationSlice';
import {resetSelected} from 'redux/features/myBooking/myBookingSlice';
import {resetUser} from 'redux/features/user/userSlice';
import {showToast} from 'utils/Toast';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  ic_active_voucher,
  ic_document_active,
  ic_document_inactive,
  ic_home_active,
  ic_home_inactive,
  ic_inactive_voucher,
  ic_message_active,
  ic_message_inactive,
  ic_profile_active,
  ic_profile_inactive,
} from 'assets/icons';

type TabItemProps = {
  title: string;
  active: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

const TabItem = ({title, active, onPress, onLongPress}: TabItemProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authState).auth;
  const inboxData = useAppSelector(inboxState);

  const isNotReadInbox = useMemo(() => {
    return inboxData?.data?.inboxes?.some((inbox: any) => !inbox?.is_read);
  }, [inboxData?.data?.inboxes]);

  const Icon = useMemo(() => {
    switch (title) {
      case t('Home.tabBarLabel'):
        return (
          <Image
            source={active ? ic_home_active : ic_home_inactive}
            style={iconCustomSize(25)}
            resizeMode="contain"
          />
        );
      case t('myBooking.tabBarLabel'):
        return (
          <Image
            source={active ? ic_document_active : ic_document_inactive}
            style={iconCustomSize(25)}
            resizeMode="contain"
          />
        );
      case t('myInbox.tabBarLabel'):
        return (
          <View style={{position: 'relative'}}>
            <Image
              source={active ? ic_message_active : ic_message_inactive}
              style={iconCustomSize(25)}
              resizeMode="contain"
            />
            {isNotReadInbox ? <View style={styles.dotNewData} /> : null}
          </View>
        );
      case t('settings.myVoucher'):
        return (
          <Image
            source={active ? ic_active_voucher : ic_inactive_voucher}
            style={iconCustomSize(25)}
            resizeMode="contain"
          />
        );
      case t('settings.tabBarLabel'):
        return (
          <Image
            source={active ? ic_profile_active : ic_profile_inactive}
            style={iconCustomSize(25)}
            resizeMode="contain"
          />
        );
      default:
        return <Image source={ic_home_active} style={iconCustomSize(25)} />;
    }
  }, [title, active, isNotReadInbox, t]);

  const handleLogoutAndReset = useCallback(() => {
    showToast({
      message: t('global.alert.please_login_to_continue'),
      type: 'error',
      title: t('global.alert.error'),
    });
    navigation.navigate('Login');
    dispatch(logout());
    dispatch(resetAccountBank());
    dispatch(resetDisbursementStatus());
    dispatch(resetUser());
    dispatch(resetNotification());
    dispatch(resetSelected());
  }, [dispatch, navigation, t]);

  const handlePress = useCallback(() => {
    if (!auth?.access_token) {
      handleLogoutAndReset();
      return;
    }
    onPress();
  }, [auth?.access_token, handleLogoutAndReset, onPress]);

  const handleLongPress = useCallback(() => {
    onLongPress();
  }, [onLongPress]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleLongPress}>
      {Icon}
      <Text
        style={[
          styles.text,
          {color: active ? theme.colors.navy : theme.colors.text.secondary},
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 35,
    flex: 1,
  },
  text: {
    fontSize: 10,
    marginTop: 4,
  },
  dotNewData: {
    borderRadius: 50,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.orange,
    position: 'absolute',
    right: -2,
  },
});
