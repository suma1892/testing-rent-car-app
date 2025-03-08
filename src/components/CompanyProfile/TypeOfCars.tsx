import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_slider} from 'assets/images';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';

const TypeOfCars = () => {
  const {t} = useTranslation();

  const carouselItems = [
    {
      id: 1,
      img: img_slider,
    },
    {
      id: 2,
      img: img_slider,
    },
    {
      id: 2,
      img: img_slider,
    },
  ];

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={item.img} resizeMode="cover" style={styles.image} />
        </View>
      </View>
    );
  };

  return (
    <View style={{paddingTop: 24}}>
      <Text style={styles.title}>
        {t('company_profile.type_of')}{' '}
        <Text style={{color: '#F1A33A'}}>{t('company_profile.cars')}</Text>
      </Text>

      <CustomCarousel
        containerStyle={{
          width: '100%',
          alignItems: 'center',
        }}
        carouselWidth={WINDOW_WIDTH * (90 / 100)}
        data={carouselItems}
        renderItem={renderItem}
        autoPlay
        showButtonNavigator={false}
        scrollAnimationDuration={2000}
        height={WINDOW_HEIGHT / 1.3}
        paginationSize={7}
        paginationColor="#F1A33A"
        paginationPosition={10}
      />
    </View>
  );
};

export default TypeOfCars;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '800',
    color: theme.colors.navy,
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
