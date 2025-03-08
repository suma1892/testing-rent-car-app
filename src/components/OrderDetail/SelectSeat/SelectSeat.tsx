import InfoContent from './InfoContent';
import React, {Dispatch, SetStateAction, useState} from 'react';
import SelectSeatModalContent from './SelectSeatModalContent';
import {h4, h5} from 'utils/styles';
import {ic_car_chair, ic_exclamation, ic_info_blue} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';

type SelectSeatProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
};

const SelectSeat = ({form, setForm}: SelectSeatProps) => {
  const {t} = useTranslation();

  const handleInfo = () => {
    showBSheet({
      content: <InfoContent onClose={handleInfo} />,
      snapPoint: ['35%', '65%'],
    });
  };

  const handleSelectSeatOptions = () => {
    showBSheet({
      content: (
        <SelectSeatModalContent
          onClose={handleSelectSeatOptions}
          onSelect={val => {
            setForm(prev => ({
              ...prev,
              pasengger_number: val,
            }));
            handleSelectSeatOptions();
          }}
        />
      ),
      snapPoint: ['35%', '65%'],
    });
  };

  return (
    <View>
      <TouchableOpacity
        style={[rowCenter, {marginTop: 20}]}
        onPress={handleInfo}>
        <Text style={[h4]}>{t('detail_order.tripDetail.totalPassenger')} </Text>
        <Image source={ic_exclamation} style={iconCustomSize(12)} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSelectSeatOptions}>
        <View style={[rowCenter, styles.borderBottom]}>
          <Image source={ic_car_chair} style={iconSize} />

          <View style={rowCenter}>
            <Text style={[h5, {marginLeft: 5}]}>
              {form.pasengger_number
                ? t('detail_order.tripDetail.n_people', {
                    n: form.pasengger_number,
                  })
                : t('detail_order.tripDetail.totalPassengerPlaceholder')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectSeat;

const styles = StyleSheet.create({
  borderBottom: {
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.grey5,
    paddingVertical: 14.5,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 5,
    borderRadius: 5,
    marginTop: 7,
  },
});
