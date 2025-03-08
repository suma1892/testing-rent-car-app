import React, {useCallback, useMemo} from 'react';
import Config from 'react-native-config';
import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import FastImage from 'react-native-fast-image';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {WINDOW_HEIGHT} from 'utils/mixins';

type CarouselRenderItem = {
  id: number;
  image: string;
};

const CarouselHero: React.FC = () => {
  const banners = useAppSelector(appDataState).banners;

  const renderItem = useCallback(({item}: {item: CarouselRenderItem}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const imageSource = useMemo(
      () => ({
        uri: Config.URL_IMAGE + item.image,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }),
      [item.image],
    );

    return (
      // <View style={styles.imageWrapper}>
      //   <FastImage
      //     source={imageSource}
      //     resizeMode={FastImage.resizeMode.contain}
      //     style={styles.image}
      //   />
      // </View>
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#fff',
          width: WINDOW_WIDTH * 0.9,
          // height: 120,
          height: WINDOW_HEIGHT / 7.5,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={imageSource}
          style={{
            width: '100%', // Pastikan gambar memenuhi View
            height: '100%',
            resizeMode: 'contain', // Pastikan gambar tidak terpotong
            borderRadius: 10, // Tambahkan border radius langsung
          }}
        />
      </View>
    );
  }, []);

  return (
    <CustomCarousel
      containerStyle={styles.carouselContainer}
      // carouselWidth={WINDOW_WIDTH * 0.8}
      data={banners}
      renderItem={renderItem}
      autoPlay
      showButtonNavigator={false}
      scrollAnimationDuration={5000}
      // height={120}
      height={WINDOW_HEIGHT / 7}
      paginationSize={7}
      paginationColor="#F1A33A"
      paginationPosition={10}
    />
  );
};

export default memo(CarouselHero);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  title: {
    color: theme.colors.white,
    fontSize: 13,
  },
  description: {
    color: theme.colors.white,
    fontSize: 10,
  },
  image: {
    width: '55%',
    height: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  // image: {width: '100%', height: 162, borderRadius: 10},
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 13,
    borderRadius: 10,
    // height: 200,
    // backgroundColor: 'red',
  },
  imageWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
  },
  // image: {width: '100%', height: 162, borderRadius: 10},
});
