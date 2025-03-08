import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import ConfirmationModalContent from 'components/PaymentMethodComponent/ConfirmationModalContent/ConfirmationModalContent';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import PaymentMethodItem from 'components/PaymentMethodComponent/PaymentMethodItem/PaymentMethodItem';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {colors, h1} from 'utils/styles';
import {createDisbursements} from 'redux/features/order/orderAPI';
import {currencyFormat} from 'utils/currencyFormat';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {IPayments, METHOD_PAYMENT} from 'types/global.types';
import {orderState} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {timeZone} from 'utils/getTimezone';
import {toggleBSheet, toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ic_arrow_left_white} from 'assets/icons';

type PaymentMethodData = {
  title: string;
  method: METHOD_PAYMENT;
};

export type PaymentMethodScreenRouteProp = RouteProp<
  RootStackParamList,
  'PaymentMethod'
>;

const PaymentMethodScreen: FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<PaymentMethodScreenRouteProp>();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const isLoading = useAppSelector(appDataState).isLoading;
  const selected = useAppSelector(bookingState).selected;
  const order = useAppSelector(orderState).order;
  const accountBank = useAppSelector(accountBankState);
  const [selectedPayment, setSelectedPayment] = useState<IPayments>();

  const PAYMENT_METHOD_DATA: PaymentMethodData[] = [
    {title: t('payment_method.virtual_account'), method: 'Virtual Account'},
    {title: t('payment_method.transfer_manual'), method: 'Manual Transfer'},
    {title: t('payment_method.qris_payment'), method: 'QRIS'},
    {title: t('payment_method.ewallet_payment'), method: 'E-money'},
    {
      title: t('payment_method.card_payment'),
      method: 'Credit Card',
    },
  ];

  const totalPayment = useMemo(() => {
    const vat = selectedPayment?.vat || 0;
    const downPayment = selected?.down_payment || 0;
    const totalPayment = selected?.total_payment || 0;

    if (selected?.type === 'HALF') {
      return vat
        ? `${currencyFormat(vat, 'IDR')} + ${currencyFormat(
            downPayment,
            'IDR',
          )} = ${currencyFormat(vat + downPayment, 'IDR')}`
        : currencyFormat(downPayment, 'IDR');
    }

    return vat
      ? `${currencyFormat(vat, selected?.currency || 'IDR')} + ${currencyFormat(
          totalPayment,
          selected?.currency || 'IDR',
        )} = ${currencyFormat(vat + totalPayment, selected?.currency || 'IDR')}`
      : currencyFormat(totalPayment, selected?.currency || 'IDR');
  }, [selected, selectedPayment]);

  useEffect(() => {
    dispatch(getMyAccountBank());
  }, []);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() =>
              navigation.navigate('MainTab', {screen: 'Booking'} as any)
            }>
            <Image source={ic_arrow_left_white} style={styles.backIcon} />
            <Text style={[h1, styles.headerText]}>
              {t('payment_method.header')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTab', {screen: 'Booking'} as any);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    dispatch(getOrderById(route?.params?.transaction_key || ''));

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (selected?.total_payment) {
      dispatch(
        getPayments({
          total_payment:
            selected?.type === 'HALF'
              ? Number(selected?.down_payment)
              : Number(selected.total_payment),
          location_id: selected?.order_detail?.location_id,
          currency: selected?.currency,
        }),
      );
    }
  }, [selected]);

  const renderItem = useCallback(
    ({item}: {item: {title: string; method: METHOD_PAYMENT}}) => (
      <PaymentMethodItem
        data={item}
        value={selectedPayment}
        onChange={setSelectedPayment}
      />
    ),
    [selectedPayment],
  );

  const handlePayment = async (
    data: IPayments,
    screen: 'VirtualAccount' | 'InstantPayment' | 'PaymentWebView',
  ) => {
    try {
      dispatch(toggleLoader(true));
      const response = await dispatch(
        createDisbursements({
          payment_type_id: data.id,
          transaction_key:
            route.params?.transaction_key || order.transaction_key,
          vat: data?.vat,
          time_zone: timeZone,
        }),
      );
      dispatch(toggleLoader(false));

      if (response.type.includes('fulfilled')) {
        navigation.navigate(screen, {
          selectedPayment: data,
          transaction_key:
            route.params?.transaction_key || order.transaction_key,
          redirect_url: response?.payload?.data?.disbursement?.redirect_url,
        });
      }
    } catch {
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
            if (!accountBank?.data) {
              navigation.navigate('UserInformationPayment', {
                func: handleNextPayment,
              });
              dispatch(toggleBSheet(false));
              return;
            }
            handleNextPayment();
          }}
          onCancel={handleConfirmation}
        />
      ),
      snapPoint: ['50%', '55%'],
    });
  };

  const handleNextPayment = useCallback(() => {
    const {method, description, provider} = selectedPayment || {};
    const transactionKey =
      route.params?.transaction_key || order.transaction_key;

    if (!!selectedPayment) {
      if (provider === 'cashlez') {
        handlePayment(selectedPayment, 'PaymentWebView');
        handleConfirmation();
      } else if (method === 'Credit Card' && description === 'Credit Card') {
        navigation.navigate('CardPayment', {
          selectedPayment,
          transaction_key: transactionKey,
        });
        handleConfirmation();
      } else if (method === 'Manual Transfer') {
        navigation.navigate('BankTransfer', {
          selectedPayment,
          transaction_key: transactionKey,
        });
      } else if (method === 'E-money' || method === 'QRIS') {
        handlePayment(selectedPayment, 'InstantPayment');
      } else if (method === 'Virtual Account') {
        handlePayment(selectedPayment, 'VirtualAccount');
      }

      handleConfirmation();
    }
  }, [selectedPayment, order, route]);

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('payment_method.header')}</Text>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={PAYMENT_METHOD_DATA}
        renderItem={renderItem}
        keyExtractor={(_, i) => `payment-${i}`}
      />
      <View style={styles.footerContainer}>
        <Text style={[h1, styles.totalPaymentText]}>{totalPayment}</Text>
        <Button
          _theme="navy"
          disabled={!selectedPayment}
          onPress={handleConfirmation}
          title={t('global.button.nextPayment')}
        />
      </View>
    </View>
  );
};

export default hoc(
  PaymentMethodScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: '5%',
    marginTop: 24,
  },
  backIcon: {height: 20, width: 20, marginLeft: 16},
  headerText: {color: 'white', marginLeft: 10},
  listContainer: {paddingHorizontal: '5%'},
  footerContainer: {
    paddingTop: 10,
    paddingBottom: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: theme.colors.white,
    elevation: 5,
  },
  totalPaymentText: {fontSize: 14, marginBottom: 10},
});
