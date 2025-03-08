import Accordion from 'react-native-collapsible/Accordion';
import React, {useState} from 'react';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {getIndonesianTimeZone, getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {getEndRentalDate, getStartRentalDate} from 'utils/functions';
import moment from 'moment';
import i18n from 'assets/lang/i18n';

const RentalDate = () => {
  const {t} = useTranslation();
  const [activeSections, setActiveSections] = useState([]);
  const arrowRotation = useSharedValue(0);

  const bookingDetail = useAppSelector(state => state.myBooking);
  const {selected} = bookingDetail;

  const SECTIONS = [
    {
      title: t('myBooking.rental_date'),
    },
  ];

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
          {t('Home.daily.rent_start_date')}
        </Text>
        <Text style={styles.highlightedText}>
          {getStartRentalDate({
            withDay: false,
            startBookingDate: selected?.order_detail?.start_booking_date,
          })}
        </Text>
        <Text style={styles.unhighlightedText}>
          {t('myBooking.date_completed')}
        </Text>
        <Text style={styles.highlightedText}>
          {getEndRentalDate(selected?.order_detail?.end_booking_date)}
        </Text>
        <Text style={styles.unhighlightedText}>{t('myBooking.startTime')}</Text>
        <Text style={styles.highlightedText}>
          {selected?.order_detail?.start_booking_time
            ? moment(
                selected?.order_detail?.start_booking_time,
                'HH:mm',
              ).format(i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A')
            : '-'}
        </Text>

        {selected?.order_detail?.without_driver && (
          <>
            <Text style={styles.unhighlightedText}>
              {t('myBooking.endTime')}
            </Text>
            <Text style={styles.highlightedText}>
              {selected?.order_detail?.end_booking_time
                ? moment(
                    selected?.order_detail?.end_booking_time,
                    'HH:mm',
                  ).format(i18n.language?.includes('cn') ? 'HH:mm' : 'hh:mm A')
                : '-'}
            </Text>
          </>
        )}

        <Text style={styles.unhighlightedText}>
          {t('detail_order.summary.timezone')}
        </Text>
        <Text style={styles.highlightedText}>
          {/* {getIndonesianTimeZone(selected?.order_detail?.loc_time_id)} */}
          {getIndonesianTimeZoneName({
            lang: i18n.language,
            timezone: getIndonesianTimeZone(
              selected?.order_detail?.loc_time_id,
            ),
          })}
        </Text>
        {selected?.order_detail?.without_driver && (
          <>
            <Text style={styles.unhighlightedText}>
              {t('myBooking.overtime')}
            </Text>
            <Text style={styles.highlightedText}>
              {Number(selected?.over_time) > 0
                ? Number(selected?.over_time) > 1
                  ? `${selected?.over_time} ${t('carDetail.hours')}`
                  : `${selected?.over_time} ${t('carDetail.hour')}`
                : t('myBooking.no_overtime')}
            </Text>
          </>
        )}
      </View>
    );
  };

  const _updateSections = (activeSections: any) => {
    arrowRotation.value = withTiming(arrowRotation.value === 0 ? 180 : 0);
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

export default RentalDate;

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
    // flexBasis: '50%',
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
