import Accordion from 'react-native-collapsible/Accordion';
import React, {useState} from 'react';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {orderState} from 'redux/features/order/orderSlice';

const Deposit = () => {
  const {t} = useTranslation();
  const [activeSections, setActiveSections] = useState([]);
  const arrowRotation = useSharedValue(0);

  const orderDeposit = useAppSelector(orderState).orderDeposit;

  const SECTIONS = [
    {
      title: t('detail_order.deposit'),
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
        <Text style={styles.unhighlightedText}>{t('detail_order.name')}</Text>
        <Text style={styles.highlightedText}>
          {orderDeposit?.recipient_name || '-'}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('myBooking.deposit_status')}
        </Text>
        <Text style={styles.highlightedText}>
          {orderDeposit?.recipient_name
            ? !!orderDeposit?.deposit_confirmation
              ? t('detail_order.return_deposit.processed')
              : t('detail_order.return_deposit.in_process')
            : '-'}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('detail_order.return_deposit.bank_name')}
        </Text>
        <Text style={styles.highlightedText}>
          {orderDeposit?.account_bank || '-'}
        </Text>

        <Text style={styles.unhighlightedText}>
          {t('detail_order.return_deposit.account_number')}
        </Text>
        <Text style={styles.highlightedText}>
          {orderDeposit?.account_number || '-'}
        </Text>
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

export default Deposit;

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
    marginVertical: 16,
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
    fontSize: 14,
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
