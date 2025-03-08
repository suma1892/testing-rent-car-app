import Button from 'components/Button';
import moment from 'moment';
import PaymentDetailsModalContent from './PaymentDetailsModalContent';
import React, {useCallback, useEffect, useState} from 'react';
import {currencyFormat} from 'utils/currencyFormat';
import {getDistanceMaps} from 'redux/effects';
import {ic_arrow_down} from 'assets/icons';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {IFormLocation} from 'types/location.types';
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
import {
  FONT_SIZE_10,
  FONT_SIZE_12,
  FONT_SIZE_14,
  FONT_SIZE_16,
  FONT_SIZE_18,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';

interface IProps {
  pickupForm: IFormLocation;
  dropoffForm: IFormLocation;
  onPress: () => void;
  dates: {
    date: string;
    time: string;
  };
  setShowSchedule: any;

  loader: boolean;
  disabled: boolean;
  currency_prefix: string;
}
const FooterNextBottom = ({
  dropoffForm,
  pickupForm,
  onPress,
  dates,
  setShowSchedule,
  currency_prefix,
  disabled,

  loader,
}: IProps) => {
  const summaryOrder = useAppSelector(orderState).summaryOrder;
  const isLoading = useAppSelector(orderState).isLoading;
  const {t} = useTranslation();

  const [distance, setDistance] = useState('');
  const [loadingDistrance, setLoadingDistrance] = useState(false);

  const formatDistance = (_distance: number) => {
    if (_distance >= 1000) {
      return `${(_distance / 1000).toFixed(2) || 0} km`;
    }
    return `${Math.round(_distance) || 0} m`;
  };

  useEffect(() => {
    getDetailDistance();

    return () => {
      setLoadingDistrance(false);
      setDistance('');
    };
  }, []);

  const getDetailDistance = async () => {
    setLoadingDistrance(true);
    const res = await getDistanceMaps({
      origin_latitude: pickupForm?.location?.lat!,
      origin_longitude: pickupForm?.location?.lon!,
      dest_latitude: dropoffForm?.location?.lat!,
      dest_longitude: dropoffForm?.location?.lon!,
    });

    const formattedDistance = 
      formatDistance(res?.routes?.[0]?.distance);
    setDistance(formattedDistance);

    setTimeout(() => {
      setLoadingDistrance(false);
    }, 200);
  };

  const showDetail = useCallback(async () => {
    showBSheet({
      snapPoint: ['80%', '80%'],
      content: (
        <PaymentDetailsModalContent
          pickupForm={pickupForm}
          dropoffForm={dropoffForm}
          distance={distance}
          currency_prefix={currency_prefix}
        />
      ),
    });
  }, [
    currency_prefix,
    distance,
    dropoffForm?.detail,
    dropoffForm?.location?.display_name,
    dropoffForm?.location?.name,
    pickupForm?.detail,
    pickupForm?.location?.display_name,
    pickupForm?.location?.name,
    summaryOrder?.booking_price,
    summaryOrder?.total_payment,
    t,
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>{t('myBooking.totalPrice')}</Text>
      <TouchableOpacity
        style={[rowCenter]}
        onPress={showDetail}
        disabled={isLoading && loadingDistrance}>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={theme.colors.navy} />
        ) : (
          <Text style={styles.amountText}>
            {currencyFormat(summaryOrder?.total_payment, currency_prefix)}
          </Text>
        )}
        <Image
          source={ic_arrow_down}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        {dates?.date && dates?.time && (
          <Button
            _theme="white"
            title={`${moment(dates?.date, 'YYYY/MM/DD').format(
              'DD MMM',
            )}, ${moment(dates.time, 'HHmm').format('HH:mm')}`}
            onPress={() => {
              setShowSchedule(true);
            }}
            styleWrapper={styles.scheduleButtonWhite}
            disabled={isLoading}
          />
        )}

        <Button
          _theme="navy"
          title={t('global.button.next')}
          onPress={onPress}
          disabled={isLoading || loader || disabled}
          styleWrapper={styles.scheduleButtonNavy}
        />
      </View>
    </View>
  );
};

export default FooterNextBottom;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 2,
    width: WINDOW_WIDTH,
    backgroundColor: theme.colors.white,
    zIndex: 999,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
  },
  totalText: {
    fontSize: FONT_SIZE_16,
    color: theme.colors.black,
  },
  amountText: {
    fontSize: FONT_SIZE_16,
    fontWeight: FONT_WEIGHT_BOLD,
    marginRight: 5,
    color: theme.colors.navy,
  },
  icon: {
    ...iconCustomSize(12),
    marginLeft: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 18,
  },
  scheduleButtonWhite: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.navy,
    width: WINDOW_WIDTH / 3.5,
    marginRight: 5,
  },
  scheduleButtonNavy: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 8,
    // borderColor: theme.colors.navy,
  },
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
