import PaymentItem from '../PaymentItem/PaymentItem';
import PaymentItemCreditCard from '../PaymentItem/PaymentItemCreditCard';
import React, {useMemo} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {h1, h4} from 'utils/styles';
import {IPayments, METHOD_PAYMENT} from 'types/global.types';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {useTranslation} from 'react-i18next';

type PaymentMethodItemProps = {
  data: {
    title: string;
    method: METHOD_PAYMENT;
  };
  value?: IPayments;
  onChange: (x: IPayments) => void;
};

const enabledPayment = [{method: 'Manual Transfer', code: 'BCA'}];

const PaymentMethodItem = ({data, value, onChange}: PaymentMethodItemProps) => {
  const paymentMethods = useAppSelector(appDataState).payments;
  const selected = useAppSelector(bookingState).selected;
  const {t} = useTranslation();
  const finalData = () => {
    if (paymentMethods.length) {
      return (
        paymentMethods
          .filter(
            obj => obj.method === data.method,
            // &&
            //   (data.method !== 'Manual Transfer' || obj.code !== 'Mandiri'),
          )
          .map(item => ({
            ...item,
            enabled: !!enabledPayment.find(
              payment =>
                payment.code === item.code && payment.method === item.method,
            ),
          })) || []
      );
    }

    return [];
  };

  const renderItem = ({item}: {item: IPayments}) => {
    if ((item.code || item.description) === 'Credit Card') {
      return (
        <PaymentItemCreditCard
          data={item}
          value={value}
          onChange={onChange}
          isDisabled={
            selected?.type === 'HALF' &&
            data.title === t('payment_method.card_payment')
          }
        />
      );
    }

    return (
      <PaymentItem
        data={item}
        value={value}
        onChange={onChange}
        isDisabled={
          selected?.type === 'HALF' &&
          data.title === t('payment_method.card_payment')
        }
      />
    );
  };

  return (
    <>
      {selected?.type === 'HALF' &&
        data.title === t('payment_method.card_payment') && (
          <View
            style={{
              padding: 10,
              backgroundColor: theme.colors.low_red,
              borderRadius: 4,
            }}>
            <Text style={[h4, {color: theme.colors.red}]}>
              {t('payment_method.disable_dp_info')}
            </Text>
          </View>
        )}
      <View style={styles.container}>
        <View style={{margin: 16}}>
          <Text style={styles.title}>{data.title}</Text>
        </View>
        <FlatList
          data={finalData()}
          renderItem={renderItem}
          keyExtractor={(_, i) => `payment-method-item-${i}`}
        />
      </View>
    </>
  );
};

export default PaymentMethodItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    marginVertical: 14,
    borderRadius: 3,
  },
  title: {
    ...h1,
    fontSize: 14,
  },
});
