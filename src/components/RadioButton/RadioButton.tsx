import React from 'react';
import {FONT_SIZE_14, FONT_WEIGHT_BOLD} from 'utils/typography';
import {ic_active_radio, ic_inactive_radio} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type RadioButtonProps = {
  title?: string;
  items: {name: string; value: any}[];
  value: any;
  onChange: (x: any) => void;
  type?: 1 | 2;
};

const RadioButton = ({
  title,
  items = [],
  value,
  onChange,
  type = 1,
}: RadioButtonProps) => {
  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}

      {items.map((x, i) => (
        <TouchableOpacity
          key={i}
          style={{
            ...styles.itemWrapper,
            justifyContent: type === 1 ? 'space-between' : 'flex-start',
          }}
          onPress={() => onChange(x?.value)}>
          {type === 1 ? (
            <>
              <Text>{x?.name}</Text>
              <Image
                source={
                  value === x?.value ? ic_active_radio : ic_inactive_radio
                }
                style={iconSize}
              />
            </>
          ) : (
            <>
              <Image
                source={
                  value === x?.value ? ic_active_radio : ic_inactive_radio
                }
                style={iconSize}
              />
              <Text style={{marginLeft: 10}}>{x?.name}</Text>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE_14,
    fontWeight: FONT_WEIGHT_BOLD,
    marginBottom: 15,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
});
