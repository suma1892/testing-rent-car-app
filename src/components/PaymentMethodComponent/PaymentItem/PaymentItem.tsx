import ConfirmationModalContent from '../ConfirmationModalContent/ConfirmationModalContent';
import React from 'react';
import {createDisbursements} from 'redux/features/order/orderAPI';
import {h4} from 'utils/styles';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IPayments} from 'types/global.types';
import {orderState} from 'redux/features/order/orderSlice';
import {PaymentMethodScreenRouteProp} from 'screens/PaymentMethodScreen/PaymentMethodScreen';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  ic_american_express,
  ic_bca,
  ic_bni,
  ic_bri,
  ic_cimb,
  ic_gopay,
  ic_jcb,
  ic_mandiri,
  ic_master_card,
  ic_permata,
  ic_qris,
  ic_visa,
  ic_uob,
} from 'assets/icons';
import {idrFormatter} from 'utils/functions';
import {timeZone} from 'utils/getTimezone';
import {currencyFormat} from 'utils/currencyFormat';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';

type PaymentItemProps = {
  data: IPayments;
  value?: IPayments;
  onChange: (x: IPayments) => void;
  isDisabled: boolean;
};

const PaymentItem = ({data, value, onChange, isDisabled}: PaymentItemProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<PaymentMethodScreenRouteProp>();
  const dispatch = useAppDispatch();
  const order = useAppSelector(orderState).order;
  const selected = useAppSelector(bookingState).selected;

  const handleIcon = (ic: string) => {
    switch (ic) {
      case 'BCA':
        return ic_bca;
      case 'BNI':
        return ic_bni;
      case 'BRI':
        return ic_bri;
      case 'Mandiri':
        return ic_mandiri;
      case 'Permata':
        return ic_permata;
      case 'Gopay':
        return ic_gopay;
      case 'QRIS':
        return ic_qris;
      case 'CIMB Niaga':
        return ic_cimb;
      case 'UOB':
        return ic_uob;
      default:
        break;
    }
  };

  const handlePayment = async (
    payment: IPayments,
    screen: 'VirtualAccount' | 'InstantPayment',
  ) => {
    // onChange(payment);
    // return;
    try {
      dispatch(toggleLoader(true));
      const timezone = timeZone;

      const res = await dispatch(
        createDisbursements({
          payment_type_id: payment.id,
          transaction_key:
            route.params?.transaction_key || order.transaction_key,
          vat: payment?.vat,
          time_zone: timezone,
        }),
      );
      dispatch(toggleLoader(false));

      if (res.type.includes('fulfilled')) {
        navigation.navigate(screen, {
          selectedPayment: payment,
          transaction_key:
            route.params?.transaction_key || order.transaction_key,
        });
      }
    } catch (error) {
      dispatch(toggleLoader(false));

      showToast({
        message: t('global.alert.error_occurred'),
        title: t('global.alert.warning'),
        type: 'error',
      });
    }
  };

  const handleConfirmation = () => {
    showBSheet({
      content: (
        <ConfirmationModalContent
          onSubmit={() => {
            console.log('data = ', data);
            if (data.method === 'Manual Transfer') {
              navigation.navigate('BankTransfer', {
                selectedPayment: data,
                transaction_key: route.params?.transaction_key,
              });
            } else if (data.method === 'E-money' || data?.method === 'QRIS') {
              handlePayment(data, 'InstantPayment');
            } else if (data.method === 'Virtual Account') {
              handlePayment(data, 'VirtualAccount');
            }

            handleConfirmation();
          }}
          onCancel={handleConfirmation}
        />
      ),
      snapPoint: ['60%', '90%'],
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor:
            value?.id === data?.id ? theme.colors.low_blue : theme.colors.white,
        },
      ]}
      disabled={!data.is_available || isDisabled}
      onPress={() => {
        if (data.is_available) {
          // handleConfirmation();
          console.log('data is available = ', data);
          onChange(data);
        }
      }}>
      <View style={styles.columnContainer}>
        <Text style={styles.bankCode}>
          {data?.provider === 'cashlez'
            ? `${t('myBooking.credit_card')} (CASHLEZ)`
            : data.description === 'Credit Card'
            ? t('myBooking.credit_card')
            : data.code || data.description}
        </Text>
        {data?.provider === 'cashlez' ? (
          <>
            <View style={[rowCenter, {}]}>
              <Image
                source={ic_visa}
                style={styles.images}
                resizeMode={'cover'}
              />
              <Image
                source={ic_master_card}
                style={styles.images}
                resizeMode={'cover'}
              />
              <Image
                source={ic_jcb}
                style={styles.images}
                resizeMode={'cover'}
              />
              <Image
                source={ic_american_express}
                style={styles.images}
                resizeMode={'cover'}
              />
            </View>
          </>
        ) : (
          <Image
            source={handleIcon(data.code)}
            style={styles.images}
            resizeMode={'contain'}
          />
        )}
      </View>

      <View style={[styles.columnContainer, {justifyContent: 'flex-end'}]}>
        {!data.is_available && (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineLabel}>
              {t('payment_method.offline')}
            </Text>
          </View>
        )}

        <Text style={styles.vat}>
          + {currencyFormat(data?.vat, selected?.currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PaymentItem;

const styles = StyleSheet.create({
  container: {
    ...rowCenter,
    justifyContent: 'space-between',
    paddingVertical: 21,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey6,
  },
  bankCode: {
    ...h4,
    marginBottom: 5,
    // marginHorizontal: 0,
  },
  columnContainer: {
    ...rowCenter,
    flex: 1,
    marginHorizontal: 16,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  images: {
    marginRight: 10,
    height: 23,
    width: 37,
    borderWidth: 1,
    borderColor: theme.colors.grey7,
    borderRadius: 3,
  },
  offlineContainer: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 3,
    backgroundColor: '#EEEEEE',
    marginRight: 10,
  },
  offlineLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.black,
  },
  arrowRight: {
    ...iconCustomSize(12),
    marginLeft: 48,
  },
  vat: {
    fontSize: 12,
    fontWeight: '700',
  },
});
