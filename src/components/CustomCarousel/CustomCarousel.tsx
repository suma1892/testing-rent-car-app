import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import CarouselButton from './CarouselButton';
import Pagination from './PaginationItem';
import {CarouselRenderItem} from 'react-native-reanimated-carousel/lib/typescript/types';
import {ImageSourcePropType, StyleProp, View, ViewStyle} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import React, {
  Fragment,
  memo,
  ReactNode,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';

interface IProps {
  data: any[];
  renderItem: CarouselRenderItem<any>;
  renderCarouselTitle?: ReactNode;
  autoPlay?: boolean;
  showButtonNavigator?: boolean;
  scrollAnimationDuration?: number;
  height?: number;
  paginationSize?: number;
  paginationColor?: string;
  paginationPosition?: number;
  containerStyle?: StyleProp<ViewStyle>;
  carouselWidth?: number;
  showScrollDot?: boolean;
  loop?: boolean;
  arrowLeftImage?: ImageSourcePropType;
  arrowRightImage?: ImageSourcePropType;
  arrowLeftPosition?: StyleProp<ViewStyle>;
  arrowRightPosition?: StyleProp<ViewStyle>;
}

const CustomCarousel = forwardRef<ICarouselInstance, IProps>(
  (
    {
      data,
      renderItem,
      renderCarouselTitle,
      autoPlay = false,
      showButtonNavigator = true,
      scrollAnimationDuration = 1000,
      height = WINDOW_HEIGHT / 3,
      paginationSize,
      paginationColor = '#344F67',
      paginationPosition,
      containerStyle = {width: '100%'},
      carouselWidth = WINDOW_WIDTH,
      showScrollDot = true,
      loop = true,
      arrowLeftImage,
      arrowRightImage,
      arrowLeftPosition,
      arrowRightPosition,
    },
    ref,
  ) => {
    const progressValue = useSharedValue<number>(0);
    const carouselRef = useRef<ICarouselInstance>(null);

    useImperativeHandle(ref, () => carouselRef.current!);

    const handleProgressChange = (_: number, absoluteProgress: number) => {
      progressValue.value = absoluteProgress;
    };

    const handleLeftButtonPress = () => {
      carouselRef.current?.scrollTo({count: -1, animated: true});
    };

    const handleRightButtonPress = () => {
      carouselRef.current?.scrollTo({count: 1, animated: true});
    };

    // Memoize rendered items to avoid re-renders
    const memoizedRenderItem = useMemo(() => renderItem, [renderItem]);

    return (
      <View style={containerStyle}>
        <Carousel
          loop={loop}
          ref={carouselRef}
          width={carouselWidth}
          height={height}
          autoPlay={autoPlay}
          data={data}
          scrollAnimationDuration={Math.min(scrollAnimationDuration, 300)} // Limit scroll animation for smoother experience
          onProgressChange={handleProgressChange}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          windowSize={3}
          renderItem={memoizedRenderItem} // Use memoized render item
          // keyExtractor={(item, index) => `${item.id || index}`} // Ensure unique keys
        />
        <Pagination
          data={data}
          show={showScrollDot && !!progressValue}
          backgroundColor={paginationColor}
          animValue={progressValue}
          length={data.length}
          size={paginationSize}
          marginTop={paginationPosition}
        />

        {showButtonNavigator && (
          <Fragment>
            <CarouselButton
              iconName="arrowleft"
              onPress={handleLeftButtonPress}
              arrowLeftImage={arrowLeftImage}
              arrowLeftPosition={arrowLeftPosition}
            />
            <CarouselButton
              iconName="arrowright"
              onPress={handleRightButtonPress}
              arrowRightImage={arrowRightImage}
              arrowRightPosition={arrowRightPosition}
            />
          </Fragment>
        )}

        {renderCarouselTitle}
      </View>
    );
  },
);

export default memo(CustomCarousel);
