import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {ic_pinpoin} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize} from 'utils/mixins';
import {FONT_SIZE_10, FONT_WEIGHT_REGULAR} from 'utils/typography';

interface IProps {
  pickupName: string;
  dropoffName: string;
  onPress: () => void;
}
const FloatingLocName = ({dropoffName, pickupName, onPress}: IProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.rowCenter}>
        <Image
          source={ic_pinpoin}
          style={[styles.icon, {tintColor: theme.colors.navy}]}
        />
        <Text style={styles.text} numberOfLines={1}>
          {pickupName}
        </Text>
      </View>

      <View style={[styles.rowCenter, styles.marginTop]}>
        <Image
          source={ic_pinpoin}
          style={[styles.icon, {tintColor: theme.colors.orange}]}
        />
        <Text style={styles.text} numberOfLines={1}>
          {dropoffName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FloatingLocName;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 9999,
    backgroundColor: theme.colors.white,
    width: WINDOW_WIDTH - 60,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
  },
  rowCenter: {
    ...rowCenter,
  },
  icon: {
    ...iconCustomSize(18),
    marginRight: 5,
  },
  text: {
    fontSize: FONT_SIZE_10,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  marginTop: {
    marginTop: 10,
  },
});
