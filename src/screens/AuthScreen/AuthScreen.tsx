import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CodePush from 'react-native-code-push';
import hoc from 'components/hoc';
import React, {FC, useCallback, useRef} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {img_bg_auth} from 'assets/images';
import {main_logo} from 'assets/icons';
import {RootStackParamList} from 'types/navigator';
import {rowCenter, WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import {StackNavigationProp} from '@react-navigation/stack';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Video, {VideoRef} from 'react-native-video';

const AuthScreen: FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const onboarding = useAppSelector(appDataState).onboarding;
  const videoRef = useRef<VideoRef>(null);
  const background = require('../../assets/icons/splash-screen.mp4');

  const heightValue = useSharedValue(123);
  const widthValue = useSharedValue(123);
  const marginBottomValue = useSharedValue(0);

  const zIndexImgValue = useSharedValue(99);
  const zIndexImg2Value = useSharedValue(-100);
  const imgLeftValue = useSharedValue(20);

  const opacityBgValue = useSharedValue(1);
  const zIndexBgValue = useSharedValue(1);
  const bgValue = useSharedValue(theme.colors.white);
  const heightBgValue = useSharedValue(WINDOW_HEIGHT);

  const opacityTextValue = useSharedValue(0);

  const opacityBtnValue = useSharedValue(0);

  const rImage: any = useAnimatedStyle(() => {
    return {
      zIndex: zIndexImgValue.value,
      bottom: marginBottomValue.value,
    };
  });

  const rImageBg: any = useAnimatedStyle(() => {
    return {
      zIndex: zIndexImg2Value.value,
      bottom: marginBottomValue.value,
    };
  });

  const rBg: any = useAnimatedStyle(() => {
    return {
      opacity: opacityBgValue.value,
      zIndex: zIndexBgValue.value,
      backgroundColor: bgValue.value,
      height: heightBgValue.value,
    };
  });

  const rBtn: any = useAnimatedStyle(() => {
    return {
      opacity: opacityBtnValue.value,
      zIndex: zIndexBgValue.value,
    };
  });

  // const checkCodepushUpdate = () => {
  //   CodePush.checkForUpdate()
  //     .then(async update => {
  //       if (update) {
  //         if (update?.failedInstall) {
  //           await AsyncStorage.clear();
  //         } else {
  //           navigation.replace('CodepushUpdateManager', {
  //             failedInstall: !!update?.failedInstall,
  //           });
  //         }
  //       } else {
  //         if (!onboarding) {
  //           navigation.replace('OnBoarding');
  //         } else {
  //           navigation.replace('MainTab');
  //         }
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       if (!onboarding) {
  //         navigation.replace('OnBoarding');
  //       } else {
  //         navigation.replace('MainTab');
  //       }
  //     });
  // };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        const option = {
          duration: 700,
        };
        heightValue.value = withTiming(200, option);
        widthValue.value = withTiming(200, option);
        bgValue.value = withTiming('transparent', option);
        opacityTextValue.value = withTiming(1, option);
        imgLeftValue.value = withTiming(0, option);
        opacityBtnValue.value = 1;
        marginBottomValue.value = withTiming(50, option);

        // checkCodepushUpdate();
        if (!onboarding) {
          navigation.replace('OnBoarding');
        } else {
          navigation.replace('MainTab');
        }
      }, 3000);
      // videoRef.current.presentFullscreenPlayer();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* <Animated.View style={[styles.cBg, rBg]}>
        <View style={[rowCenter, styles.iconMainWrapper]}>
          
        </View>
      </Animated.View> */}
      {/* <Image
        source={require('../../assets/icons/splash-screen.gif')}
        resizeMode={'contain'}
        style={[styles.icMain]}
      /> */}
      <Video
        // Can be a URL or a local file.
        source={background}
        // Store reference
        ref={videoRef}
        // Callback when remote video is buffering
        // onBuffer={onBuffer}
        // Callback when video cannot be loaded
        // onError={onError}
        setFullScreen={true}
        style={styles.backgroundVideo}
      />

      {/* <Animated.Image
        source={img_bg_auth}
        resizeMode="cover"
        style={[styles.image, rImageBg]}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backgroundVideo: {
    position: 'absolute',
    alignSelf: 'center',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    width: WINDOW_WIDTH / 1.5,
    // backgroundColor: 'red',
    height: WINDOW_HEIGHT / 1.5,
    // width: '100%',
    // height: '100%',
    // resizeMode: 'contain',
  },
  image: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    position: 'absolute',
    bottom: 0,
    top: 0,
  },
  icMain: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    // alignSelf: 'center',
  },
  iconMainWrapper: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT / 2.5,
  },
  cBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.navy,
  },
});

export default hoc(AuthScreen, '#FFFFFF');
