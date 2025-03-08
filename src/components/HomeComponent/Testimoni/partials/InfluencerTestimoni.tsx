import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import FastImage from 'react-native-fast-image';
import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTestimoniInfluencerMockData} from '../Testimoni.mock';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';
import {img_bg_influencer_testimoni} from 'assets/images';
import {
  ic_rounded_arrow_left_white,
  ic_rounded_arrow_right_white,
} from 'assets/icons';

const InfluencerTestimoni = () => {
  const {t} = useTranslation();
  const influencerTestimoniMockData = useTestimoniInfluencerMockData();

  const renderItem = useCallback(
    ({item}: any) => (
      <View style={styles.cardContainer}>
        <FastImage
          source={img_bg_influencer_testimoni}
          style={styles.imageBgInfluencerTestimoni}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <View style={styles.bgOrange} />
            <FastImage
              source={item.image}
              style={styles.imageInfluencerTestimoni}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>

          <View style={styles.descContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.aliasName}>{item.aliasName}</Text>
            <Text style={styles.review}>{item.review}</Text>
          </View>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Home.testimoni.influencer_title')}</Text>
      <CustomCarousel
        containerStyle={styles.carouselContainer}
        carouselWidth={WINDOW_WIDTH * 0.9}
        data={influencerTestimoniMockData}
        renderItem={renderItem}
        autoPlay
        showButtonNavigator
        scrollAnimationDuration={2000}
        height={471}
        paginationSize={7}
        paginationColor="#F1A33A"
        paginationPosition={10}
        arrowLeftImage={ic_rounded_arrow_left_white}
        arrowRightImage={ic_rounded_arrow_right_white}
        arrowLeftPosition={[styles.arrowButton, {left: '7%'}]}
        arrowRightPosition={[styles.arrowButton, {right: '7%'}]}
      />
    </View>
  );
};

export default memo(InfluencerTestimoni);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  background: {
    flex: 1,
    zIndex: 99,
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 16,
  },
  cardContainer: {
    // backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    height: 471,
    overflow: 'hidden',
  },
  imageBgInfluencerTestimoni: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: '10%',
  },
  imageInfluencerTestimoni: {width: 162, height: 162, borderRadius: 10},
  descContainer: {marginTop: 20, width: '100%'},
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: theme.colors.white,
  },
  aliasName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.white,
    marginBottom: 15,
  },
  review: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.white,
  },
  arrowImage: {width: 30, height: 30},
  arrowButton: {
    backgroundColor: 'transparent',
    top: '18%',
    bottom: 0,
  },
  imageContainer: {
    width: 239,
    height: 162,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgOrange: {
    width: 239,
    height: 132,
    backgroundColor: '#F59A1E',
    position: 'absolute',
    borderRadius: 10,
  },
});
