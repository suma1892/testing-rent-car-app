import Button from 'components/Button';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import React, {memo, useState} from 'react';
import RefundRejectedReasonModalContent from './RefundRejectedReasonModalContent';
import {IRefundOrderHistory} from 'types/my-booking.types';
import {refundOrder} from 'redux/features/order/orderAPI';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useAppDispatch} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

type RefundAlertProps = {
  selectedRefundOrder: IRefundOrderHistory;
  transactionKey: string;
};

const RefundAlert = ({
  selectedRefundOrder,
  transactionKey,
}: RefundAlertProps) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCreated = selectedRefundOrder?.status === 'CREATED';
  const isProcessed = selectedRefundOrder?.status === 'PROCESSED';
  const isTransferred = selectedRefundOrder?.status === 'TRANSFERED';
  const isRejected = selectedRefundOrder?.status === 'REJECTED';

  const handleOpenReasonModal = () => {
    showBSheet({
      snapPoint: ['50%', '100%'],
      content: (
        <RefundRejectedReasonModalContent
          reason={selectedRefundOrder?.rejected_reason}
        />
      ),
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    const res = await dispatch(
      refundOrder({
        transaction_key: transactionKey,
        name: selectedRefundOrder?.customer_name,
        bank: selectedRefundOrder?.customer_bank_name,
        bank_account_number: selectedRefundOrder?.customer_bank_number,
      }),
    );

    setIsLoading(false);
    if (res) {
      setOpenConfirmationModal(false);
      showToast({
        message: t('global.alert.success'),
        title: t('detail_order.successfuly_reaply_for_refund'),
        type: 'warning',
      });
      navigation.goBack();
      return;
    }

    showToast({
      message: t('global.alert.cancellation_failed'),
      title: t('global.alert.error_occurred'),
      type: 'warning',
    });
  };

  return (
    <>
      {(isCreated || isProcessed) && (
        <View style={styles.infoBox}>
          <Text style={styles.title}>
            {t('detail_order.refund_is_in_process')}
          </Text>
          <Text style={styles.infoText}>
            {t('detail_order.refund_process_alert_description', {
              orderNo: selectedRefundOrder?.order_key,
            })}
          </Text>
        </View>
      )}

      {isTransferred && (
        <View style={styles.infoBox}>
          <Text style={styles.title}>{t('detail_order.refund_success')}</Text>
          <Text style={styles.infoText}>
            {t('detail_order.refund_success_description')}
          </Text>
        </View>
      )}

      {isRejected && (
        <View style={styles.infoBox}>
          <Text style={styles.title}>{t('detail_order.refund_rejected')}</Text>
          <Text style={styles.infoText}>
            {t('detail_order.refund_rejected_description', {
              customerName: selectedRefundOrder?.customer_name,
              orderNo: selectedRefundOrder?.order_key,
            })}
          </Text>
          <TouchableOpacity onPress={handleOpenReasonModal}>
            <Text style={[styles.infoText, {color: theme.colors.blue}]}>
              Lihat Selengkapnya
            </Text>
          </TouchableOpacity>

          <Button
            _theme="navy"
            onPress={() => setOpenConfirmationModal(true)}
            styleWrapper={{marginTop: 20}}
            title={t('detail_order.reapply_for_refund')}
            // isLoading={isConfirmationLoading}
          />
        </View>
      )}

      <ConfirmationModal
        isVisible={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleConfirm}
        headerTitle={t('detail_order.reapply_for_refund') as any}
        description={t('detail_order.reapply_for_refund_description') as any}
        isConfirmationLoading={isLoading}
      />
    </>
  );
};

export default memo(RefundAlert);

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#e9f5ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.black,
    fontFamily: 'Inter-Bold',
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.black,
    fontFamily: 'Inter-Regular',
  },
});
