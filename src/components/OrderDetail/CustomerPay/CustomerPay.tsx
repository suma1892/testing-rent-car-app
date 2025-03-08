import React, {useCallback, useMemo, useState} from 'react';
import {h1} from 'utils/styles';
import {ic_radio_button_active, ic_radio_button_inactive} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {orderState} from 'redux/features/order/orderSlice';
import {slugify} from 'utils/functions';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type PickerType = 'FULL' | 'HALF';

interface IProps {
  picker: PickerType;
  setPicker: (type: PickerType) => void;
}

const CustomerPay: React.FC<IProps> = ({picker, setPicker}) => {
  const {t} = useTranslation();
  const {summaryOrder} = useAppSelector(orderState);

  const [selectedButton, setSelectedButton] = useState<PickerType>(picker);
  const selected = useCallback(
    (type: PickerType) => selectedButton === type,
    [selectedButton],
  );

  const dpScopes = useMemo(() => {
    if (summaryOrder?.total_dp > 0) {
      return summaryOrder?.formula_variable
        .map(formula => t(`detail_order.${slugify(formula?.name, '_')}`))
        .join(', ')
        .toLowerCase();
    }
    return '';
  }, [summaryOrder?.total_dp, summaryOrder?.formula_variable]);

  const handlePickerChange = useCallback(
    (type: PickerType) => {
      setSelectedButton(type);
      setPicker(type);
    },
    [setPicker],
  );

  return (
    <View style={{marginTop: 20}}>
      <Text style={[h1, {fontSize: 15, marginBottom: 10}]}>
        {t('global.button.titlePaymentPicker')}
      </Text>

      <TouchableOpacity
        style={[
          rowCenter,
          selected('FULL') ? styles.activePicker : styles.inactivePicker,
        ]}
        onPress={() => handlePickerChange('FULL')}>
        <Image
          source={
            selected('FULL') ? ic_radio_button_active : ic_radio_button_inactive
          }
          style={iconSize}
        />
        <View>
          <Text
            style={selected('FULL') ? styles.activeText : styles.inactiveText}>
            {t('global.button.fullPayment')}
          </Text>
          <Text
            style={[
              selected('FULL') ? styles.activeText : styles.inactiveText,
              {fontSize: 10},
            ]}>
            {t('global.button.fullPaymentDesc')}
          </Text>
        </View>
      </TouchableOpacity>

      {summaryOrder?.total_dp > 0 && summaryOrder?.is_available_dp && (
        <TouchableOpacity
          style={[
            rowCenter,
            selected('HALF') ? styles.activePicker : styles.inactivePicker,
          ]}
          onPress={() => handlePickerChange('HALF')}>
          <Image
            source={
              selected('HALF')
                ? ic_radio_button_active
                : ic_radio_button_inactive
            }
            style={iconSize}
          />
          <View>
            <Text
              style={
                selected('HALF') ? styles.activeText : styles.inactiveText
              }>
              {t('global.button.downPayment', {
                value: `${summaryOrder?.formula_percentage?.value}%`,
              })}
            </Text>
            <Text
              style={[
                selected('HALF') ? styles.activeText : styles.inactiveText,
                {fontSize: 10},
              ]}>
              {t('global.button.downPaymentDesc', {
                value: `${summaryOrder?.formula_percentage?.value}%`,
                scope: dpScopes,
              })}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomerPay;

const styles = StyleSheet.create({
  activePicker: {
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 30,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: theme.colors.navy,
    borderWidth: 1,
    backgroundColor: '#E7F3FF',
  },
  activeText: {
    fontWeight: '700',
    color: theme.colors.navy,
    marginLeft: 10,
  },
  inactivePicker: {
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 30,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: theme.colors.grey3,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  inactiveText: {
    fontWeight: '700',
    color: theme.colors.grey4,
    marginLeft: 10,
  },
});
