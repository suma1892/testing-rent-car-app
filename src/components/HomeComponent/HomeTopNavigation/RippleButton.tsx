import React, { Children, ReactElement, useState } from "react";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { StyleSheet, View, ViewProps } from "react-native";

interface RippleButtonProps {
  children: ReactElement<ViewProps>;
  color: string;
  onPress?: () => void;
  style?: any;
}

const RippleButton = ({ children, color, onPress, style }: RippleButtonProps) => {
  const [radius, setRadius] = useState(-1);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const handleTap = (event: any) => {
    positionX.value = event.nativeEvent.x;
    positionY.value = event.nativeEvent.y;
    scale.value = 0;
    opacity.value = 1;

    scale.value = withSpring(1, { damping: 55, stiffness: 100 }, () => {
      opacity.value = withTiming(0, { duration: 1000 });
    });

    if (onPress) runOnJS(onPress)();
  };

  const animatedRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    width: radius * 2,
    height: radius * 2,
    backgroundColor: color,
    borderRadius: radius,
    position: "absolute",
    top: positionY.value - radius,
    left: positionX.value - radius,
  }));

  return (
    <TapGestureHandler onHandlerStateChange={(event) => {
      if (event.nativeEvent.state === State.BEGAN) {
        handleTap(event);
      }
    }}>
      <Animated.View style={[style, { overflow: "hidden" }]}>
        <View
          style={styles.container}
          onLayout={({ nativeEvent: { layout } }) =>
            setRadius(Math.sqrt(layout.width ** 2 + layout.height ** 2))
          }
        >
          {radius > 0 && <Animated.View style={animatedRippleStyle} />}
        </View>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    overflow: "hidden",
  },
});

export default RippleButton;
