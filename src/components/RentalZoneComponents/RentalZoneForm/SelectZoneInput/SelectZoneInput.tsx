import React, {memo} from 'react';
import SelectZoneModalContent from './SelectZoneModalContent';
import {colorSelecting, iconSize, rowCenter} from 'utils/mixins';
import {h1, h5} from 'utils/styles';
import {ic_pinpoin} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SelectZoneInputProps} from '../../rentalZoneComponent.interface';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';

const SelectZoneInput = ({
  label,
  placeholder,
  modalHeaderTitle,
  onChange,
  data = [],
}: SelectZoneInputProps) => {
  const handleOpenModal = () => {
    showBSheet({
      content: (
        <SelectZoneModalContent
          headerTitle={modalHeaderTitle}
          data={data}
          onPress={val => {
            onChange(val);
            handleOpenModal();
          }}
        />
      ),
      snapPoint: ['40%', '80%'],
    });
  };
  return (
    <View>
      <Text style={styles.title}>{label}</Text>
      <TouchableOpacity onPress={handleOpenModal}>
        <View style={[rowCenter, styles.borderBottom]}>
          <Image source={ic_pinpoin} style={iconSize} />

          <View style={rowCenter}>
            <Text style={[h5, colorSelecting(placeholder), {marginLeft: 5}]}>
              {placeholder}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SelectZoneInput);

const styles = StyleSheet.create({
  title: {
    ...h1,
    marginTop: 10,
  },
  borderBottom: {
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cost: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
});
