import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {boxShadow, iconSize, rowCenter, WINDOW_HEIGHT} from 'utils/mixins';
import {ic_check, ic_close, ic_error, ic_warning} from 'assets/icons';
import {theme} from 'utils';

type IType = 'success' | 'warning' | 'error';
interface IDataTiast {
  id: IType;
  icon: any;
  primary_color: string;
  secondary_color: string;
}

const DATA_TOAST: IDataTiast[] = [
  {
    id: 'success',
    icon: ic_check,
    primary_color: '#61c9a8',
    secondary_color: '#eff9f6',
  },
  {
    id: 'warning',
    icon: ic_warning,
    primary_color: '#ed9b41',
    secondary_color: '#fdf5ec',
  },
  {
    id: 'error',
    icon: ic_error,
    primary_color: '#d6454f',
    secondary_color: '#fbeced',
  },
];

const Toast = ({
  type = 'success',
  title,
  message,
  show,
}: {
  type: IType;
  title: string;
  message: string;
  show: boolean;
}) => {
  const topValue = useSharedValue(-WINDOW_HEIGHT);

  const rView = useAnimatedStyle(() => {
    return {
      top: topValue.value,
    };
  });

  useEffect(() => {
    if (!message) return;
    const option = {
      duration: 700,
    };
    topValue.value = withSpring(50);

    setTimeout(() => {
      topValue.value = withTiming(-WINDOW_HEIGHT, option);
    }, 10000);
  }, [show]);

  const selectedType = DATA_TOAST.find(x => x.id === type);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        boxShadow('#000', {height: 1, width: 2}, 3.27, 0.24),
        rView,
        {
          borderColor: selectedType?.primary_color,
          backgroundColor: selectedType?.secondary_color,
        },
      ]}>
      <TouchableOpacity
        onPress={() =>
          (topValue.value = withTiming(-WINDOW_HEIGHT, {duration: 500}))
        }
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={rowCenter}>
          <Image source={selectedType?.icon} style={iconSize} />
          <View style={{marginLeft: 10, width: '85%'}}>
            <Text style={styles.textTitle}>{title}</Text>
            <Text style={styles.textMessage}>{message}</Text>
          </View>
        </View>
        <Image
          source={ic_close}
          style={{
            width: 10,
            height: 10,
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -WINDOW_HEIGHT,
    // alignItems: 'center',
    width: '90%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    zIndex: 9,
    borderWidth: 3,
    borderColor: 'red',
  },
  textTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.black,
  },
  textMessage: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    color: theme.colors.black,
  },
});
