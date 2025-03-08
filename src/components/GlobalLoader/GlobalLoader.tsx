import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {theme} from 'utils';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';

const EASING_FACTORY = Easing.bezier(0.7, 0, 0.25, 1).factory();

const GlobalLoader= ({isShow}: {isShow: boolean})=> {

  const heightValue = useSharedValue(0);
  const widthValue = useSharedValue(0);
  const bottomValue = useSharedValue(-20);
  const borderValue = useSharedValue(0);
  const bgValue = useSharedValue('white');
  const opacityValue = useSharedValue(0);

  const rView = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
      width: widthValue.value,
      bottom: bottomValue.value,
      borderRadius: borderValue.value,
      backgroundColor: bgValue.value,
      opacity: opacityValue.value,
    };
  });

  useEffect(() => {
    const option = {
      duration: 700,
      easing: EASING_FACTORY,
    };
    if(isShow) {
    heightValue.value = withTiming(WINDOW_HEIGHT, option);
    widthValue.value = withTiming(WINDOW_WIDTH, option);
    bottomValue.value = withTiming(20, option);
    borderValue.value = withTiming(50, option);
    bgValue.value = withTiming(theme.colors.grey9, option);
    opacityValue.value = withTiming(0.8, option);
    }
    if(!isShow) {
      heightValue.value = withTiming(0, option);
      widthValue.value = withTiming(0, option);
      bottomValue.value = withTiming(-50, option);
      borderValue.value = withTiming(0, option);
      bgValue.value = withTiming(theme.colors.grey9, option);
      opacityValue.value = withTiming(0.8, option);
    }
  }, [isShow]);

  return (
    <Animated.View style={[styles.wrapper, rView]}>
      <ActivityIndicator size={'small'} color={theme.colors.navy} />
    </Animated.View>
  );
};

export default GlobalLoader;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    // top: 0,
    // left: 0,
    bottom: -50,
    alignSelf: 'center',
    // right: 0,
    zIndex: 99,
    backgroundColor: theme.colors.grey9,
    // opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
