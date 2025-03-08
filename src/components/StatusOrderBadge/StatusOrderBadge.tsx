import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {FONT_SIZE_10} from 'utils/typography';

const StatusOrderBadge = ({status}: {status: 'available' | 'booked'}) => {
  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: status === 'available' ? '#DBFFDE' : '#FFE4E4'},
      ]}>
      <Text
        style={[
          styles.label,
          {color: status === 'available' ? '#299B0A' : '#FF0000'},
        ]}>
        {status === 'available'
          ? t('list_car.available')
          : t('list_car.booked')}
      </Text>
    </View>
  );
};

export default StatusOrderBadge;

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom: 25,
    // right: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 40,
    borderRadius: 100,
  },
  label: {
    fontSize: FONT_SIZE_10,
    fontWeight: '500',
  },
});
