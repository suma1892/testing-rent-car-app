import ConfirmationModalContent from '../ConfirmationModalContent/ConfirmationModalContent';
import React from 'react';
import {h4} from 'utils/styles';
import {iconCustomSize} from 'utils/mixins';
import {idrFormatter} from 'utils/functions';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IPayments} from 'types/global.types';
import {orderState} from 'redux/features/order/orderSlice';
import {PaymentMethodScreenRouteProp} from 'screens/PaymentMethodScreen/PaymentMethodScreen';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  ic_american_express,
  ic_jcb,
  ic_master_card,
  ic_visa,
} from 'assets/icons';
import {currencyFormat} from 'utils/currencyFormat';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';

type PaymentItemCreditCardProps = {
  data: IPayments;
  value?: IPayments;
  onChange: (x: IPayments) => void;
  isDisabled: boolean;
};

const PaymentItemCreditCard = ({
  data,
  value,
  onChange,
  isDisabled,
}: PaymentItemCreditCardProps) => {
  const navigation = useNavigation();
  const selected = useAppSelector(bookingState).selected;

  const route = useRoute<PaymentMethodScreenRouteProp>();
  const order = useAppSelector(orderState).order;
  const {t} = useTranslation();
  const handleConfirmation = () => {
    showBSheet({
      content: (
        <ConfirmationModalContent
          onSubmit={() => {
            onChange(data);
            return;
            navigation.navigate('CardPayment', {
              selectedPayment: data,
              transaction_key:
                route.params?.transaction_key || order.transaction_key,
            });

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
          onChange(data);
        }
      }}>
      <View style={[styles.columnContainer, {flexWrap: 'wrap'}]}>
        <Text style={styles.bankCode}>
          {data?.provider === 'cashlez'
            ? `${t('myBooking.credit_card')} (CASHLEZ)`
            : data.description === 'Credit Card'
            ? t('myBooking.credit_card')
            : data.code || data.description}
        </Text>
        <View style={styles.row}>
          <Image source={ic_visa} style={styles.images} resizeMode={'cover'} />
          <Image
            source={ic_master_card}
            style={styles.images}
            resizeMode={'cover'}
          />
          <Image source={ic_jcb} style={styles.images} resizeMode={'cover'} />
          <Image
            source={ic_american_express}
            style={styles.images}
            resizeMode={'cover'}
          />
        </View>
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

export default PaymentItemCreditCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 21,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey6,
  },
  bankCode: {
    ...h4,
    // marginHorizontal: 16,
    marginBottom: 5,
  },
  columnContainer: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  images: {height: 23, width: 37, marginRight: 7},
  row: {
    flexDirection: 'row',
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
