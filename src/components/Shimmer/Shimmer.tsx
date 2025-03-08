import LinearGradient from 'react-native-linear-gradient';
import React, {FC, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

type ShimmerProps = {
  height?: number;
  width?: number;
  borderRadius?: number;
};

const Shimmer: FC<ShimmerProps> = ({
  height = 200,
  width = '100%',
  borderRadius = 0,
}) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={{...styles.container, height, width, borderRadius}}>
      <Animated.View style={{...styles.shimmer, transform: [{translateX}]}}>
        <LinearGradient
          colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  shimmer: {
    width: '200%',
    height: '100%',
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
  gradient: {
    flex: 1,
    width: '50%',
  },
});

export default Shimmer;
