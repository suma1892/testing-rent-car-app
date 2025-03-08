import appBar from 'components/AppBar/AppBar';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {useEffect} from 'react';
import RefundAlert from './components/RefundAlert';
import RefundHistories from './components/RefundHistories';
import RefundProofTransfer from './components/RefundProofTransfer';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {currencyFormat} from 'utils/currencyFormat';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image} from 'react-native';
import {IRefundOrderHistory} from 'types/my-booking.types';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  getOrderById,
  getRefundOrderHistories,
} from 'redux/features/myBooking/myBookingAPI';

export type RefundStatusScreenRouteProp = RouteProp<
  RootStackParamList,
  'RefundStatus'
>;

const RefundStatusScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute<RefundStatusScreenRouteProp>();

  const bookingDetail = useAppSelector(bookingState);
  const {
    selected,
    refundOrderHistories,
    isSelectedLoading: isBookingDetailLoading,
  } = bookingDetail;

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('myBooking.refund_status')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  useEffect(() => {
    if (route.params.transaction_key) {
      dispatch(getOrderById(route.params.transaction_key));
      dispatch(getRefundOrderHistories(route.params.transaction_key));
    }
  }, [route.params.transaction_key]);

  const selectedRefundOrder: IRefundOrderHistory = refundOrderHistories?.[0];
  const isCreated = selectedRefundOrder?.status === 'CREATED';
  const isProcessed = selectedRefundOrder?.status === 'PROCESSED';
  const isTransferred = selectedRefundOrder?.status === 'TRANSFERED';

  if (isBookingDetailLoading) {
    return <Loading />;
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.white}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, padding: 20}}>
        {/* Informasi Pengembalian Dana */}
        <RefundAlert
          selectedRefundOrder={selectedRefundOrder}
          transactionKey={route.params?.transaction_key}
        />

        <View style={styles.detailBox}>
          <Text style={styles.subTitle}>
            {t('detail_order.refund_request')}
          </Text>
          <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>{t('detail_order.order_no')}</Text>
              <Text style={styles.value}>{selectedRefundOrder?.order_key}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>{t('detail_order.name')}</Text>
              <Text style={styles.value}>
                {selectedRefundOrder?.customer_name}
              </Text>
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.label}>
                {t('detail_order.account_number')}
              </Text>
              <Text style={styles.value}>
                {selectedRefundOrder?.customer_bank_number}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>{t('global.bank_name')}</Text>
              <Text style={styles.value}>
                {selectedRefundOrder?.customer_bank_name}
              </Text>
            </View>

            <View style={{width: '50%'}}>
              <Text style={styles.label}>{t('detail_order.nominal')}</Text>
              <Text style={styles.value}>
                {currencyFormat(
                  Number(selectedRefundOrder?.refund_amount),
                  selected?.currency,
                )}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.label}>{t('virtual_account.status')}</Text>
              <Text
                style={[
                  styles.value,
                  styles.status,
                  {
                    color:
                      isCreated || isProcessed
                        ? theme.colors.orange
                        : isTransferred
                        ? theme.colors.green
                        : theme.colors.red,
                  },
                ]}>
                {t(
                  `detail_order.${selectedRefundOrder?.status?.toLowerCase()}` as any,
                )}
              </Text>
            </View>
          </View>
        </View>

        {isTransferred && (
          <RefundProofTransfer
            imageUri={selectedRefundOrder?.proof_of_transfer_refund}
          />
        )}

        <View style={styles.separator} />

        {/* Status Refund Dana */}
        <RefundHistories selectedRefundOrder={selectedRefundOrder} />
      </ScrollView>
    </View>
  );
};

export default hoc(
  RefundStatusScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  detailBox: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.black,
    fontFamily: 'Inter-Bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: theme.colors.black,
    fontFamily: 'Inter-Regular',
  },
  value: {
    fontSize: 14,
    color: theme.colors.black,
    fontFamily: 'Inter-Bold',
  },
  status: {
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    width: '100%',
    alignSelf: 'center',
  },
});
