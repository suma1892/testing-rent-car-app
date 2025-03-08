import Button from 'components/Button';
import React, {useEffect, useState} from 'react';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {ic_order_notification} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

const ReconfirmationOrderNotification = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const bookingDetail = useAppSelector(bookingState);
  const {selected} = bookingDetail;

  const [latestMessage, setLatestMessage] = useState('');

  useEffect(() => {
    if (
      !Object.prototype.hasOwnProperty.call(
        selected,
        'disbursement_reconfirmation_message',
      )
    )
      return;
    const reconfirmationMessages = [
      ...(selected?.disbursement_reconfirmation_message || []),
    ];
    setLatestMessage(reconfirmationMessages?.pop()?.message || '');
  }, [selected]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={ic_order_notification}
          style={styles.orderNotificationIcon}
          resizeMode="contain"
        />
        <Text style={styles.notificationTitle}>
          {t('myBooking.order_notification')}
        </Text>
      </View>

      <Text style={styles.notificationContent}>{latestMessage}</Text>

      <Button
        _theme="orange"
        title="Reupload"
        onPress={() => {
          navigation.navigate('BankTransfer', {
            selectedPayment: selected?.disbursement?.payment as any,
            transaction_key: selected?.transaction_key,
            reconfirmation: true,
          });
        }}
      />
    </View>
  );
};

export default ReconfirmationOrderNotification;

const styles = StyleSheet.create({
  container: {backgroundColor: '#FFF1DE', padding: 20, borderRadius: 6, marginTop: 10},
  titleContainer: {flexDirection: 'row', marginBottom: 12},
  orderNotificationIcon: {width: 21, height: 21, marginRight: 10},
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '700',
    color: theme.colors.black,
  },
  notificationContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.black,
    lineHeight: 22,
    marginBottom: 20,
  },
});
