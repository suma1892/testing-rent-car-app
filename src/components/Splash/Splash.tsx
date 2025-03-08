import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {ic_getride, ic_get_ride} from 'assets/icons';
import {theme} from 'utils';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Splash = () => {
  const opacityValue = useSharedValue(1);
  const zIndexValue = useSharedValue(0);
  const rView = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
      zIndex: zIndexValue.value,
    };
  });

  useEffect(() => {
    const option = {
      duration: 700,
    };
    setTimeout(() => {
      opacityValue.value = withTiming(0, option);
    }, 1000);
    setTimeout(() => {
      zIndexValue.value = -99;
    }, 1500);
  }, []);

  return (
    <Animated.View style={[styles.container, rView]}>
      {/* <Image
        source={ic_getride}
        style={{
          height: 126,
          width: 126,
        }}
      /> */}
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
