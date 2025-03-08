import React from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {ic_close, ic_pinpoin} from 'assets/icons';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {IFormLocation} from 'types/location.types';
import {Image} from 'react-native';
import {orderState} from 'redux/features/order/orderSlice';
import {StyleSheet} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {
  FONT_SIZE_10,
  FONT_SIZE_12,
  FONT_SIZE_14,
  FONT_SIZE_18,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';

type PaymentDetailsModalContentProps = {
  pickupForm: IFormLocation;
  dropoffForm: IFormLocation;
  distance: string;
  currency_prefix: string;
};

const PaymentDetailsModalContent = ({
  pickupForm,
  dropoffForm,
  distance,
  currency_prefix,
}: PaymentDetailsModalContentProps) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const summaryOrder = useAppSelector(orderState).summaryOrder;

  const closeModal = () => {
    dispatch(toggleBSheet(false));
  };

  return (
    <View style={styles.detailContainer}>
      <BottomSheetScrollView>
        <View style={styles.detailHeader}>
          <Text style={styles.detailHeaderText}>
            {t('detail_order.summary.title')}
          </Text>

          <TouchableOpacity onPress={closeModal}>
            <Image source={ic_close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>
          {t('detail_order.tripDetail.title')}
        </Text>

        <View style={styles.locationContainer}>
          <Image
            source={ic_pinpoin}
            style={[styles.locationIcon, {tintColor: theme.colors.navy}]}
          />

          <View>
            <Text style={styles.locationSubtitle}>
              {t('one_way.pickup_location')}
            </Text>
            <Text style={styles.locationTitle}>
              {pickupForm?.location?.display_name?.split(',')?.[0]}
            </Text>
            <Text style={styles.locationDetail}>
              {pickupForm?.location?.display_name
                ?.split(',')
                ?.slice(1)
                ?.join(',')
                ?.trim()}
            </Text>

            <Text style={styles.detailSectionTitle}>
              {t('one_way.pickup_placeholder')}
            </Text>
            <Text style={styles.detailSectionContent}>
              {pickupForm?.detail || '-'}
            </Text>
          </View>
        </View>

        <View style={[styles.locationContainer, styles.destinationContainer]}>
          <Image
            source={ic_pinpoin}
            style={[styles.locationIcon, {tintColor: theme.colors.orange}]}
          />

          <View>
            <Text style={styles.locationSubtitle}>
              {t('one_way.dropoff_location')} - {distance}
            </Text>
            <Text style={styles.locationTitle}>
              {dropoffForm?.location?.display_name?.split(',')?.[0]}
            </Text>
            <Text style={styles.locationDetail}>
              {dropoffForm?.location?.display_name
                ?.split(',')
                ?.slice(1)
                ?.join(',')
                ?.trim()}
            </Text>

            <Text style={styles.detailSectionTitle}>
              {t('one_way.dropoff_placeholder_description')}
            </Text>
            <Text style={styles.detailSectionContent}>
              {dropoffForm?.detail || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>{t('one_way.cost_detail')}</Text>

        <View style={styles.costDetailContainer}>
          <Text style={styles.costDetailText}>{t('one_way.cost_travel')}</Text>
          <Text style={styles.costDetailText}>
            {currencyFormat(summaryOrder?.booking_price || 0, currency_prefix)}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.totalCostContainer}>
          <Text style={styles.totalCostText}>{t('one_way.total_payment')}</Text>
          <Text style={styles.totalCostText}>
            {currencyFormat(summaryOrder?.total_payment, currency_prefix)}
          </Text>
        </View>
      </BottomSheetScrollView>
    </View>
  );
};

export default PaymentDetailsModalContent;

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: WINDOW_WIDTH,
    padding: 20,
  },
  detailHeader: {
    ...rowCenter,
    justifyContent: 'space-between',
    width: '100%',
  },
  detailHeaderText: {
    fontSize: FONT_SIZE_18,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  closeIcon: {
    ...iconCustomSize(14),
  },
  sectionTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
    marginTop: 26,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  destinationContainer: {
    marginTop: 16,
  },
  locationIcon: {
    ...iconCustomSize(18),
    marginRight: 10,
  },
  locationSubtitle: {
    fontSize: FONT_SIZE_10,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  locationTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  locationDetail: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  detailSectionTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
    marginTop: 12,
  },
  detailSectionContent: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    width: '100%',
    marginVertical: 16,
  },
  costDetailContainer: {
    ...rowCenter,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  costDetailText: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  totalCostContainer: {
    ...rowCenter,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalCostText: {
    fontSize: FONT_SIZE_14,
    fontWeight: FONT_WEIGHT_BOLD,
  },
});
