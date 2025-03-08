import React from 'react';
import {h1, h5} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';

type RefundRejectedReasonModalContentProps = {
  reason: string;
};

const RefundRejectedReasonModalContent = ({
  reason,
}: RefundRejectedReasonModalContentProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('detail_order.refund_notification')}
      </Text>
      <Text style={h5}>{reason}</Text>
    </View>
  );
};

export default RefundRejectedReasonModalContent;

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    flex: 1,
    padding: 20,
  },
  title: {
    ...h1,
    fontSize: 20,
    marginBottom: 20,
  }
});
