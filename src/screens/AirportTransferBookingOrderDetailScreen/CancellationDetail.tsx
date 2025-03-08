import Accordion from 'react-native-collapsible/Accordion';
import React, {useState} from 'react';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';

const CancellationDetail = () => {
  const {t} = useTranslation();
  const {selected} = useAppSelector(bookingState);

  const [activeSections, setActiveSections] = useState([]);
  const arrowRotation = useSharedValue(0);

  const SECTIONS = [
    {
      title: t('myBooking.cancellation_detail'),
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
        <View
          style={[
            rowCenter,
            {justifyContent: 'space-between', flexWrap: 'wrap'},
          ]}>
          <View style={{flexBasis: '50%'}}>
            <Text style={styles.unhighlightedText}>
              {t('user_information.account_name')}
            </Text>
            <Text style={styles.highlightedText}>
              {selected?.order_cancelation?.name || '-'}
            </Text>
          </View>

          <View style={{flexBasis: '50%'}}>
            <Text style={styles.unhighlightedText}>
              {t('global.bank_name')}
            </Text>
            <Text style={styles.highlightedText}>
              {selected?.order_cancelation?.bank || '-'}
            </Text>
          </View>

          <View style={{flexBasis: '50%'}}>
            <Text style={styles.unhighlightedText}>
              {t('detail_order.reason_cancellation')}
            </Text>
            <Text style={styles.highlightedText}>
              {selected?.order_cancelation?.cancelation_reason || '-'}
            </Text>
          </View>

          <View style={{flexBasis: '50%'}}>
            <Text style={styles.unhighlightedText}>
              {t('detail_order.refund_status')}
            </Text>
            <Text style={styles.highlightedText}>
              {selected?.order_cancelation?.status || '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _updateSections = (activeSections: any) => {
    arrowRotation.value = withTiming(arrowRotation.value === 0 ? 180 : 0);
    setActiveSections(activeSections);
  };

  if (!selected?.order_cancelation) {
    return null;
  }

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

export default CancellationDetail;

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
    fontSize: 14,
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
