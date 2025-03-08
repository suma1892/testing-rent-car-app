import AirportPaymentDetailModalContent from './AirportPaymentDetailModalContent';
import DailyPaymentDetailModalContent from './DailyPaymentDetailModalContent';
import React from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {currencyFormat} from 'utils/currencyFormat';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {h1, h5} from 'utils/styles';
import {ic_arrow_down} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {orderState} from 'redux/features/order/orderSlice';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HandlePaymentDetail = ({form}: {form: Form}) => {
  const {t} = useTranslation();
  const {sub_service_type} = useAppSelector(appDataState);
  const {summaryOrder, isLoading} = useAppSelector(orderState);
  const {formDaily, formAirportTransfer} = useAppSelector(appDataState);

  const openDetails = () => {
    showBSheet({
      content:
        sub_service_type === 'Daily' ? (
          <DailyPaymentDetailModalContent form={form} />
        ) : (
          <AirportPaymentDetailModalContent form={form} />
        ),
    });
  };

  const currency =
    sub_service_type === 'Daily'
      ? formDaily?.selected_location?.currency
      : formAirportTransfer?.pickup_location?.location?.currency;

  return (
    <TouchableOpacity onPress={openDetails}>
      <Text style={h1}>{t('detail_order.summary.totalPayment')}</Text>
      {isLoading ? (
        <View style={{alignItems: 'flex-start'}}>
          <ActivityIndicator size="small" color={theme.colors.navy} />
        </View>
      ) : (
        <>
          <View style={rowCenter}>
            <Text style={[h1, styles.price]}>
              {form?.type === 'HALF'
                ? currencyFormat(summaryOrder?.total_dp, currency)
                : currencyFormat(summaryOrder?.total_payment, currency)}
            </Text>
            <Image
              source={ic_arrow_down}
              style={[iconCustomSize(10), {marginBottom: 12}]}
              resizeMode="contain"
            />
          </View>
          {summaryOrder?.slash_price > 0 && (
            <Text style={[h5, styles.strikethroughPrice]}>
              {currencyFormat(summaryOrder.total_payment, currency)}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default HandlePaymentDetail;

const styles = StyleSheet.create({
  price: {color: theme.colors.navy, marginRight: 10, marginBottom: 12},
  strikethroughPrice: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'orange',
    color: theme.colors.grey4,
    marginTop: 6,
  },
});
