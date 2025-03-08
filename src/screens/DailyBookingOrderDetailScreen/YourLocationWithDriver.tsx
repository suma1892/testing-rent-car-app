import Accordion from 'react-native-collapsible/Accordion';
import React, {useEffect, useState} from 'react';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {getSelectedBookingZone, getZone} from 'redux/effects';
import {rowCenter} from 'utils/mixins';
import {colors} from 'utils/styles';
import moment from 'moment';

const YourLocationWithDriver = ({transactionKey}: {transactionKey: string}) => {
  const {t} = useTranslation();
  const [activeSections, setActiveSections] = useState([]);
  const [bookingZone, setBookingZone] = useState([]);
  const arrowRotation = useSharedValue(0);

  const SECTIONS = [
    {
      title: t('myBooking.your_location'),
    },
  ];

  const getBookingZone = async () => {
    try {
      const res = await getSelectedBookingZone(transactionKey);
      const resZone = await getZone();

      const _mappingBookingZone = res?.map((x: any) => ({
        ...x,
        pickup_zone_id: resZone?.find((y: any) => y?.id === x?.pickup_zone_id),
        drop_off_zone_id: resZone?.find(
          (y: any) => y?.id === x?.drop_off_zone_id,
        ),
        driving_zone_id: resZone?.find(
          (y: any) => y?.id === x?.driving_zone_id,
        ),
      }));
      setBookingZone(_mappingBookingZone);
    } catch (error) {}
  };

  useEffect(() => {
    getBookingZone();
    return () => {};
  }, [transactionKey]);

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
        {[...bookingZone]?.map((zone: any, i) => (
          <View key={i}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 14,
                color: colors.facebook,
              }}>
              {t('myBooking.day')} - {i + 1}
            </Text>
            <View
              style={[
                rowCenter,
                {justifyContent: 'space-between', flexWrap: 'wrap'},
              ]}>
              <View style={{flexBasis: '50%'}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.pickup')}
                </Text>
                <Text style={styles.highlightedText}>
                  {zone?.detail_pickup_location || '-'}
                </Text>
              </View>

              <View style={{flexBasis: '50%'}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.dropoff')}
                </Text>
                <Text style={styles.highlightedText}>
                  {zone?.detail_drop_off_location || '-'}
                </Text>
              </View>

              <View style={{flexBasis: '50%'}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.zone')}
                </Text>
                <Text style={styles.highlightedText}>
                  {zone?.driving_zone_id?.name || '-'}
                </Text>
              </View>

              <View style={{flexBasis: '50%'}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.endTime')}
                </Text>
                <Text style={styles.highlightedText}>
                  {zone?.booking_end_time
                    ? moment(zone?.booking_end_time, 'HH:mm').format('hh:mm A')
                    : '-'}
                </Text>
              </View>

              <View style={{flexBasis: '50%'}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.overtime')}
                </Text>
                <Text style={styles.highlightedText}>
                  {zone?.overtime_duration > 0
                    ? `${zone?.overtime_duration} ${
                        zone?.overtime_duration > 1
                          ? t('carDetail.hours')
                          : t('carDetail.hour')
                      }`
                    : t('myBooking.no_overtime')}
                </Text>
              </View>
            </View>
          </View>
        ))}
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

export default YourLocationWithDriver;

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
    // flexBasis: '50%',
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
});
