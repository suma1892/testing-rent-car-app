import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import React, {memo, useCallback} from 'react';
import {customerTestimoniMockData} from '../Testimoni.mock';
import {ic_arrow_left_3, ic_arrow_right_3} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_testimoni_2} from 'assets/images';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';

const CustomerTestimoni = () => {
  const {t} = useTranslation();

  const renderItem = useCallback(({item}: any) => {
    return (
      <View style={styles.cardContainer}>
        <Image
          source={item.image}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Home.testimoni.customer_title')}</Text>
      <Text style={styles.desc}>{t('Home.testimoni.customer_desc')}</Text>
      <CustomCarousel
        containerStyle={{
          width: '100%',
          alignItems: 'center',
        }}
        carouselWidth={WINDOW_WIDTH * (70 / 100)}
        data={customerTestimoniMockData}
        renderItem={renderItem}
        autoPlay
        showButtonNavigator
        scrollAnimationDuration={2000}
        height={248}
        paginationSize={7}
        paginationColor="#F1A33A"
        paginationPosition={10}
        arrowLeftImage={ic_arrow_left_3}
        arrowRightImage={ic_arrow_right_3}
        arrowLeftPosition={styles.arrowButton}
        arrowRightPosition={styles.arrowButton}
      />
    </View>
  );
};

export default memo(CustomerTestimoni);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 5,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  desc: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.grey2,
    marginBottom: 16,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    borderRadius: 10,
    height: 248,
    overflow: 'hidden',
  },
  arrowButton: {
    backgroundColor: 'transparent',
  },
});
