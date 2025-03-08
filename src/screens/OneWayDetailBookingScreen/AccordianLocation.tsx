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
import {IOrder} from 'types/my-booking.types';
import {currencyFormat} from 'utils/currencyFormat';

const AccordianLocation = ({data}: {data: IOrder}) => {
  const {t} = useTranslation();
  const [activeSections, setActiveSections] = useState([]);
  const arrowRotation = useSharedValue(0);

  const SECTIONS = [
    {
      title: t('one_way.location_data'),
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
          {t('one_way.pickup_location')}
        </Text>
        <Text style={styles.highlightedText}>
          {data?.order_detail?.rental_delivery_location?.split(',')?.[0]}
        </Text>
        <Text style={styles.unhighlightedText}>
          {data?.order_detail?.rental_delivery_location
            ?.split(',')
            ?.slice(1)
            ?.join(',')
            ?.trim() || '-'}
        </Text>
        <Text style={styles.unhighlightedText}>
          {t('one_way.detail_pickup')}
        </Text>
        <View
          style={{
            backgroundColor: '#DBDBDB',
            justifyContent: 'center',
            padding: 5,
          }}>
          <Text style={[styles.unhighlightedText, {marginBottom: 0}]}>
            {data?.order_detail?.rental_delivery_notes ||
              data?.order_detail?.rental_delivery_location_detail ||
              '-'}
          </Text>
        </View>

        <Text style={styles.unhighlightedText}>
          {t('one_way.dropoff_location')}
        </Text>
        <Text style={styles.highlightedText}>
          {data?.order_detail?.rental_return_location?.split(',')?.[0]}
        </Text>
        <Text style={styles.unhighlightedText}>
          {data?.order_detail?.rental_return_location
            ?.split(',')
            ?.slice(1)
            ?.join(',')
            ?.trim() || '-'}
        </Text>
        <Text style={styles.unhighlightedText}>
          {t('one_way.detail_dropoff')}
        </Text>
        <View
          style={{
            backgroundColor: '#DBDBDB',
            justifyContent: 'center',
            padding: 5,
            marginBottom: 20,
          }}>
          <Text style={[styles.unhighlightedText, {marginBottom: 0}]}>
            {data?.order_detail?.rental_return_notes ||
              data?.order_detail?.rental_return_location_detail ||
              '-'}
          </Text>
        </View>
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

export default AccordianLocation;

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
    marginBottom: 20,
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
