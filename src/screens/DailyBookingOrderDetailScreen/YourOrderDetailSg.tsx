import Accordion from 'react-native-collapsible/Accordion';
import React, {useEffect, useState} from 'react';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {isFuture} from 'date-fns';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {
  getOrderStatus,
  getPaymentLabel,
  getStartRentalDate,
  idrFormatter,
} from 'utils/functions';
import {currencyFormat} from 'utils/currencyFormat';
import i18n from 'assets/lang/i18n';

const YourOrderDetailSg = ({
  vehicleName,
  isAirportTransfer,
}: {
  vehicleName: string;
  isAirportTransfer?: boolean;
}) => {
  const {t} = useTranslation();
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [orderState, setOrderState] = useState('');
  const arrowRotation = useSharedValue(0);

  const bookingDetail = useAppSelector(state => state.myBooking);
  const {selected} = bookingDetail;

  const SECTIONS = [
    {
      title: t('myBooking.your_order_data'),
    },
  ];

  useEffect(() => {
    setOrderState(selected?.order_status!);

    if (
      (selected?.order_status?.toLowerCase() == 'pending' &&
        !isFuture(new Date(selected?.expired_time))) ||
      (selected?.order_status?.toLowerCase() == 'reconfirmation' &&
        !isFuture(new Date(selected?.expired_time)))
    ) {
      setOrderState('FAILED');
    }
  }, [selected?.order_status, selected?.expired_time]);

  const _renderHeader = (section: any, i: any, isActive: any) => {
    return (
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.headerText}>
          {section.title}
        </Text>

        <Image
          source={isActive ? ic_arrow_up : ic_arrow_down}
          style={{
            height: 15,
            width: 15,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };
  const _renderContent = () => {
    return (
      <View style={styles.content}>
        <Text style={styles.unhighlightedText}>
          {t('detail_order.order_no')}
        </Text>
        <Text style={styles.highlightedText}>{selected?.order_key || '-'}</Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.pickup_date')}
        </Text>
        <Text style={styles.highlightedText}>
          {getStartRentalDate({
            withDay: true,
            startBookingDate:
              bookingDetail?.selected?.order_detail?.start_booking_date,
          })}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.pickup_time')}
        </Text>
        <Text style={styles.highlightedText}>
          {bookingDetail?.selected?.order_detail?.start_booking_time}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.booking_date')}
        </Text>
        <Text style={styles.highlightedText}>
          {getStartRentalDate({
            withDay: true,
            startBookingDate: bookingDetail?.selected?.created_at,
          })}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.totalPrice')}
        </Text>
        <Text style={styles.highlightedText}>
          {currencyFormat(selected?.total_payment || 0, selected?.currency)}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.paymentMethod')}
        </Text>
        <Text style={styles.highlightedText}>
          {getPaymentLabel(selected?.disbursement)}
        </Text>

        {selected?.order_detail?.without_driver && !isAirportTransfer && (
          <>
            <Text style={styles.unhighlightedText}>
              {t('detail_order.summary.deposit_etoll')}
            </Text>
            <Text style={styles.highlightedText}>
              {currencyFormat(selected?.deposit_e_toll)}
            </Text>
          </>
        )}

        <Text style={styles.unhighlightedText}>
          {t('myBooking.paymentStatus')}
        </Text>
        <Text style={styles.highlightedText}>
          {getOrderStatus({
            _order_status: orderState,
            lang: i18n.language,
          })}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.pessengers_suitcase')}
        </Text>
        <Text style={styles.highlightedText}>
          {t('myBooking.pessenger_desc', {
            adult: selected?.order_detail?.adult_passenger,
            child: selected?.order_detail?.child_passenger,
            suitcase:
              selected?.order_detail?.large_suitcase +
              selected?.order_detail?.regular_suitcase,
          })}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.flight_number')}
        </Text>
        <Text style={styles.highlightedText}>
          {`${selected?.order_detail?.flight_number}`}
        </Text>

        {Boolean(selected?.customer_name_meet_and_greet) && (
          <>
            <Text style={styles.unhighlightedText}>
              {t('detail_order.formDetail.meet_greet_name')}
            </Text>
            <Text style={styles.highlightedText}>
              {`${selected?.customer_name_meet_and_greet}`}
            </Text>
          </>
        )}
      </View>
    );
  };

  const _updateSections = (activeSections: any) => {
    console.log('activeSections = ', activeSections);
    // arrowRotation.value = withTiming(arrowRotation.value === 0 ? 180 : 0);
    setActiveSections(activeSections);
  };

  return (
    <View style={styles.container}>
      <Accordion
        underlayColor={'#FFF'}
        sections={SECTIONS}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        expandMultiple={true}
      />
    </View>
  );
};

export default YourOrderDetailSg;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: theme.colors.grey6,
    elevation: 4,
    paddingHorizontal: '5%',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
    marginTop: 16,
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 18,
  },
  headerText: {
    fontSize: 14,
    color: '#000',
    width: '80%',
    fontWeight: '700',
    fontFamily: 'Inter-Medium',
  },
  content: {
    backgroundColor: '#fff',
  },
  highlightedText: {
    flexBasis: '50%',
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '700',
    marginBottom: 18,
  },
  unhighlightedText: {
    flexBasis: '50%',
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
});
