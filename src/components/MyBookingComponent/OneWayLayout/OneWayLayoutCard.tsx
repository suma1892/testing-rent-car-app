import Button from 'components/Button';
import CancelOrderButtonAction from 'components/MyBookingOrderDetailComponents/CancelOrderButtonAction/CancelOrderButtonAction';
import i18n from 'i18next';
import moment from 'moment';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {authState} from 'redux/features/auth/authSlice';
import {currencyFormat} from 'utils/currencyFormat';
import {getIndonesianTimeZone, getIndonesianTimeZoneName, theme} from 'utils';
import {getOrderStatus, getStartRentalDate} from 'utils/functions';
import {getPackageDetail} from 'redux/effects';
import {h1} from 'utils/styles';
import {ic_arrow_right_3, ic_order_notification} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {isFuture, setHours, setMinutes, setSeconds, subDays} from 'date-fns';
import {PAYMENT_STATUSES, paymentStatusStyle} from '../utils';
import {useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import RefundProcess from '../AirportLayout/RefundProcess';
import SelectionCancelTask from '../AirportLayout/SelectionCancelTask';

interface IProps {
  item: any;
}

const OneWayLayoutCard: React.FC<IProps> = memo(({item}) => {
  const {
    order_key,
    order_status,
    order_detail,
    disbursement,
    transaction_key,
    total_payment,
    over_time,
    order_approval_status,
    review_identity,
  } = item;

  const authData = useAppSelector(authState).auth;
  const accountBank = useAppSelector(accountBankState);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [packageId, setPackageId] = useState<any>();

  useEffect(() => {
    handleGetPackageDetail();
    return () => {};
  }, [item]);

  const handleGetPackageDetail = async () => {
    if (item?.order_detail?.origin?.lat) {
      const res = await getPackageDetail({
        origin_latitude: item?.order_detail?.origin?.lat,
        origin_longitude: item?.order_detail?.origin?.long,
        dest_latitude: item?.order_detail?.destination?.lat,
        dest_longitude: item?.order_detail?.destination?.long,
        location_id: item?.order_detail?.location_id,
      });
      const _data = res?.data?.find(
        (x: any) => x?.id === item?.order_detail?.package_id,
      );
      setPackageId(_data);
    }
  };

  const {userProfile} = useAppSelector(appDataState);

  const isShowConfirmationButton = useMemo(
    () =>
      PAYMENT_STATUSES.showConfirmationButton.includes(order_status) &&
      order_approval_status === 'WAITING_APPROVAL_UPDATE_ORDER_CUSTOMER',
    [order_status, order_approval_status],
  );

  // const isShowCancelButton = useMemo(
  //   () =>
  //     isFuture(new Date(order_detail?.start_booking_date)) &&
  //     order_status === 'PAID' &&
  //     !isShowConfirmationButton,
  //   [order_status, isShowConfirmationButton, order_detail?.start_booking_date],
  // );
  const isShowCancelButton = useMemo(() => {
    const start_booking_date = order_detail?.start_booking_date;
    if (!start_booking_date) return false;

    const today = new Date();
    const startDate = new Date(`${start_booking_date}T00:00:00`);
    const cancelDeadline = setSeconds(
      setMinutes(setHours(subDays(startDate, 2), 17), 0),
      0,
    );

    if (today >= cancelDeadline) return false;

    const canCancel =
      (order_status === 'PAID' ||
        order_status === 'COMPLETED' ||
        order_status === 'CHECKOUT') &&
      !isShowConfirmationButton;

    return canCancel;
  }, [
    order_status,
    isShowConfirmationButton,
    order_detail?.start_booking_date,
  ]);

  const isShowOrderNotification = useMemo(
    () =>
      PAYMENT_STATUSES.showNotification.includes(order_status) ||
      isShowConfirmationButton,
    [order_status, isShowConfirmationButton],
  );

  const isShowVerifyIdentityButton = useMemo(() => {
    return (
      review_identity?.messages?.length > 0 &&
      !PAYMENT_STATUSES.hideVerifyIdentityButton.includes(order_status) &&
      (userProfile.personal_info?.need_review_ktp ||
        userProfile.personal_info?.need_review_sim)
    );
  }, [review_identity?.messages, order_status, userProfile.personal_info]);

  const navigateToPaymentScreen = useCallback(
    (paymentMethod: string) => {
      const navigateTo: any = {
        'Virtual Account': 'VirtualAccount',
        'E-money': 'InstantPayment',
        QRIS: 'InstantPayment',
        'Credit Card': 'PaymentWebView',
        'Manual Transfer': 'BankTransfer',
      }[paymentMethod];

      if (navigateTo) {
        navigation.navigate(navigateTo, {
          selectedPayment: disbursement?.payment,
          transaction_key,
          redirect_url: disbursement?.redirect_url,
          reconfirmation: paymentMethod === 'Manual Transfer',
        });
      }
    },
    [navigation, disbursement, transaction_key],
  );

  const handlePay = useCallback(() => {
    if (!disbursement) {
      navigation.navigate('PaymentMethod', {transaction_key});
    } else if (accountBank?.data === null) {
      navigation.navigate('UserInformationPayment', {
        func: () => navigateToPaymentScreen(disbursement?.payment.method),
      });
    } else {
      navigateToPaymentScreen(disbursement?.payment.method);
    }
  }, [disbursement, navigation, transaction_key, accountBank?.data]);

  const handleConfirmApproval = useCallback(() => {
    navigation.navigate('ApprovalUpdateOrder', {
      transactionKey: transaction_key,
    });
  }, [authData?.access_token, t, transaction_key]);

  return (
    <Fragment>
      <View style={[styles.circle, {left: -11}]} />
      <View style={[styles.circle, {right: -11}]} />

      <View
        style={[styles.card, {paddingTop: isShowOrderNotification ? 0 : 20}]}>
        {isShowOrderNotification && (
          <View style={styles.notificationContainer}>
            <Image
              source={ic_order_notification}
              style={styles.orderNotificationIcon}
              resizeMode="contain"
            />
            <Text style={styles.notificationTitle}>
              {t('myBooking.order_notification')}
            </Text>
          </View>
        )}

        <View style={{paddingHorizontal: '5%'}}>
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={styles.yourOrderContainer}>
              <Text style={styles.yourOrderText}>
                {t('myBooking.your_order')}
              </Text>
            </View>

            {isShowVerifyIdentityButton && (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.verifyIdentityContainer}
                  onPress={() => navigation.navigate('Profile')}>
                  <Text style={styles.verifyIdentityText}>
                    {t('profile.identity_verification')}
                  </Text>
                  <Image
                    source={ic_arrow_right_3}
                    style={[iconSize, {tintColor: theme.colors.orange}]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.row, {marginBottom: 14}]}>
            <Text style={styles.highlightedText}>
              {t('myBooking.your_order_data')}
            </Text>
            <Text style={styles.highlightedText}>
              {/* {t('myBooking.rental_date')} */}
            </Text>
          </View>

          <View style={[styles.row, {marginBottom: 8}]}>
            <Text style={styles.unhighlightedText}>
              {t('detail_order.order_no')}
            </Text>
            <Text style={styles.unhighlightedText}>
              {t('myBooking.package')}
            </Text>
          </View>

          <View style={[styles.row, {marginBottom: 18}]}>
            <Text style={styles.highlightedText}>{order_key || '-'}</Text>
            <Text style={styles.highlightedText}>{packageId?.name}</Text>
          </View>

          <View style={[styles.row, {marginBottom: 8}]}>
            <Text style={styles.unhighlightedText}>
              {t('myBooking.order_date')}
            </Text>
            <Text style={styles.unhighlightedText}>
              {t('myBooking.order_hour')}
            </Text>
          </View>

          <View style={[styles.row, {marginBottom: 18}]}>
            <Text style={styles.highlightedText}>
              {getStartRentalDate({
                withDay: true,
                startBookingDate: item?.created_at,
              })}
            </Text>
            <Text style={styles.highlightedText}>
              {order_detail?.start_booking_time
                ? moment(order_detail?.start_booking_time, 'HH:mm').format(
                    // 'hh:mm A',
                    i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A',
                  )
                : '-'}
            </Text>
          </View>

          <View style={[styles.row, {marginBottom: 8}]}>
            <Text style={styles.unhighlightedText}>
              {t('myBooking.totalPrice')}
            </Text>
            {order_detail?.without_driver ? (
              <Text style={styles.unhighlightedText}>
                {t('myBooking.endTime')}
              </Text>
            ) : (
              <Text style={styles.unhighlightedText}>
                {t('detail_order.summary.timezone')}
              </Text>
            )}
          </View>

          <View style={[styles.row, {marginBottom: 18}]}>
            <Text style={styles.highlightedText}>
              {currencyFormat(total_payment, item?.currency)}
            </Text>
            {order_detail?.without_driver ? (
              <Text style={styles.highlightedText}>
                {order_detail?.end_booking_time
                  ? moment(order_detail?.end_booking_time, 'HH:mm').format(
                      // 'hh:mm A',
                      i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A',
                    )
                  : '-'}
              </Text>
            ) : (
              <Text style={styles.highlightedText}>
                {getIndonesianTimeZoneName({
                  lang: i18n.language as any,
                  timezone: getIndonesianTimeZone(
                    order_detail?.loc_time_id,
                  ) as any,
                })}
              </Text>
            )}
          </View>

          <View style={[styles.row, {marginBottom: 8}]}>
            <View style={[styles.row, {marginBottom: 8}]}>
              <Text style={styles.unhighlightedText}>
                {t('myBooking.paymentStatus')}
              </Text>
            </View>

            <View style={[styles.row, {marginBottom: 8}]}>
              <Text style={styles.unhighlightedText}>
                {t('myBooking.paymentMethod')}
              </Text>
            </View>
          </View>
          <View style={[styles.row, {marginBottom: 18}]}>
            <Text
              style={[
                styles.highlightedText,
                paymentStatusStyle(
                  isShowConfirmationButton
                    ? order_approval_status
                    : order_status,
                ),
              ]}>
              {isShowConfirmationButton
                ? t('myBooking.recalculation_process')
                : getOrderStatus({
                    _order_status: order_status,
                    lang: i18n.language,
                  })}
            </Text>

            <Text style={[styles.highlightedText]}>
              {item?.disbursement?.payment?.method || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* {isShowCancelButton && (
            <CancelOrderButtonAction transactionKey={transaction_key} />
          )} */}
          {order_status === 'CANCELLED' && <RefundProcess item={item} />}
          {isShowCancelButton && (
            <SelectionCancelTask transactionKey={transaction_key} />
          )}

          {isShowConfirmationButton && (
            <Button
              _theme="orange"
              title={t('global.button.confirm_order')}
              onPress={handleConfirmApproval}
              styleWrapper={{
                marginBottom: 10,
              }}
              styleText={{fontSize: 14}}
            />
          )}

          {!PAYMENT_STATUSES.hiddenPaymentButton.includes(order_status) && (
            <Button
              _theme="navy"
              title={
                disbursement
                  ? order_status === 'RECONFIRMATION'
                    ? 'Reupload'
                    : t('global.button.payNow')
                  : t('global.button.choosePayment')
              }
              onPress={handlePay}
              styleWrapper={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: 'navy',
                paddingVertical: 15,
                marginBottom: 10,
              }}
              styleText={{color: 'navy', fontSize: 14}}
            />
          )}

          {order_status === 'CHECKOUT' &&
            disbursement?.payment?.method === 'Credit Card' && (
              <Button
                _theme="navy"
                title={t('myBooking.check_order')}
                onPress={handlePay}
                styleWrapper={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: theme.colors.navy,
                  paddingVertical: 15,
                  marginBottom: 10,
                }}
                styleText={{color: theme.colors.navy, fontSize: 14}}
              />
            )}

          {order_status !== 'EXPIRED' && (
            <Button
              _theme="navy"
              title={t('global.button.orderDetail')}
              onPress={() =>
                navigation.navigate('OneWayDetailBooking', {
                  item: item,
                  package: packageId,
                })
              }
              styleWrapper={{
                marginRight: 5,
                paddingVertical: 15,
              }}
              styleText={{
                fontSize: 14,
              }}
            />
          )}
        </View>
      </View>
    </Fragment>
  );
});

export default OneWayLayoutCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: theme.colors.grey6,
    elevation: 4,
    marginBottom: 10,
    paddingBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
  },
  yourOrderContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#DDE7FF',
    borderRadius: 2,
    alignSelf: 'baseline',
    marginBottom: 17,
  },
  yourOrderText: {
    color: '#1C3D5D',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  verifyIdentityContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 17,
    flexDirection: 'row',
  },
  verifyIdentityText: {
    ...h1,
    color: theme.colors.orange,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
  },
  highlightedText: {
    flexBasis: '50%',
    color: theme.colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '700',
  },
  unhighlightedText: {
    flexBasis: '50%',
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  circle: {
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    width: 23,
    height: 23,
    position: 'absolute',
    top: '37%',
    zIndex: 3,
  },
  notificationContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#FFF1DE',
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  orderNotificationIcon: {width: 17, height: 17, marginRight: 7},
  notificationTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '700',
    color: theme.colors.black,
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
