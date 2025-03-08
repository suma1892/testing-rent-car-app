import Button from 'components/Button';
import React, {memo, useCallback, useMemo} from 'react';
import {enUS, id, zhCN} from 'date-fns/locale';
import {format} from 'date-fns';
import {ic_check2, ic_error2, ic_rounded_fill} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {IRefundOrderHistory} from 'types/my-booking.types';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

type RefundHistoriesProps = {
  selectedRefundOrder: IRefundOrderHistory;
};

const RefundHistories = ({selectedRefundOrder}: RefundHistoriesProps) => {
  const {t, i18n} = useTranslation();

  const REFUND_STATUS = useMemo(() => {
    if (selectedRefundOrder?.status === 'REJECTED') {
      return ['CREATED', 'REJECTED'];
    }

    return ['CREATED', 'PROCESSED', 'TRANSFERED'];
  }, [selectedRefundOrder?.status]);

  const formatDate = useCallback(
    (dateString: string | undefined) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return format(date, 'eeee dd MMM HH:mm:ss', {
        locale:
          i18n.language === 'id-ID'
            ? id
            : i18n.language?.includes('cn')
            ? zhCN
            : enUS,
      });
    },
    [i18n.language],
  );

  const redirectToWhatsApp = () => {
    const url = 'whatsapp://send?phone=6281262511511';
    Linking.openURL(url).catch(err => {
      const message = err?.message.includes(`No Activity found`)
        ? t('global.alert.error_redirect_to_whatsapp')
        : err.message;

      showToast({
        title: t('global.alert.failed'),
        type: 'error',
        message,
      });
    });
  };

  const renderTimelineItem = useCallback(
    (status: string, index: number) => {
      const data = selectedRefundOrder?.refund_order_histories?.[index];
      const lastData =
        selectedRefundOrder?.refund_order_histories?.[REFUND_STATUS.length - 1];
      const formattedDate = formatDate(data?.created_at);
      const isLastIndex = index === REFUND_STATUS.length - 1;
      const isCreated = selectedRefundOrder?.status === 'CREATED';
      const isRejected = data?.status === 'REJECTED';

      return (
        <View style={styles.timelineItem} key={`refund_order_${index}`}>
          <View style={styles.timelineIconWrapper}>
            <Image
              source={
                !!data && isRejected
                  ? ic_error2
                  : !!data && !isRejected
                  ? ic_check2
                  : ic_rounded_fill
              }
              style={iconCustomSize(17)}
              resizeMode="contain"
            />
            {!isLastIndex && (
              <View
                style={[
                  styles.timelineLine,
                  {
                    backgroundColor:
                      lastData?.status === 'REJECTED'
                        ? theme.colors.red
                        : !isCreated
                        ? theme.colors.green
                        : theme.colors.grey5,
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.timelineTextWrapper}>
            <Text style={styles.timelineText}>
              {t(
                `detail_order.${(
                  data?.status || status
                )?.toLowerCase()}` as any,
              )}
            </Text>
            <Text style={styles.timelineDate}>{formattedDate}</Text>
          </View>
        </View>
      );
    },
    [selectedRefundOrder, formatDate],
  );

  return (
    <View style={styles.timelineBox}>
      <Text style={styles.subTitle}>{t('myBooking.refund_status')}</Text>
      {REFUND_STATUS.map(renderTimelineItem)}
      <Button
        _theme="white"
        title={t('global.button.help')}
        onPress={redirectToWhatsApp}
        styleWrapper={styles.buttonWrapper}
        lineColor={theme.colors.navy}
      />
    </View>
  );
};

export default memo(RefundHistories);

const styles = StyleSheet.create({
  timelineBox: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIconWrapper: {
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 40,
  },
  timelineTextWrapper: {
    marginLeft: 10,
  },
  timelineText: {
    fontSize: 14,
    color: theme.colors.black,
    fontFamily: 'Inter-Regular',
  },
  timelineDate: {
    fontSize: 12,
    color: theme.colors.grey3,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.black,
    fontFamily: 'Inter-Bold',
  },
  buttonWrapper: {
    marginTop: 70,
    marginBottom: 10,
  },
});
