import Button from 'components/Button';
import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import hoc from 'components/hoc';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {toggleOnboarding} from 'redux/features/appData/appDataSlice';
import {useAppDispatch} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {WINDOW_HEIGHT} from 'utils/mixins';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {
  img_onboard1,
  img_onboard2,
  img_onboard3,
  img_onboard4,
} from 'assets/images';

const carouselItems = [
  {
    id: 1,
    img: img_onboard1,
    text: 'Selamat datang di aplikasi Get&Ride! Temukan fleksibilitas dan kebebasan dalam menjelajahi destinasi wisata dengan menyewa mobil yang sesuai dengan kebutuhan Anda.',
  },
  {
    id: 2,
    img: img_onboard2,
    text: 'Dapatkan rekomendasi destinasi wisata terbaik di Bali. Jelajahi keindahan pulau dengan mobil yang Anda sewa dan nikmati kemudahan sewa mobil di aplikasi kami',
  },
  {
    id: 3,
    img: img_onboard3,
    text: 'Sesuaikan periode sewa mobil sesuai kebutuhan Anda. Kami menyediakan opsi sewa harian, mingguan, dan bulanan untuk memberikan pilihan yang sesuai dengan jadwal dan rencana perjalanan Anda.',
  },
  {
    id: 4,
    img: img_onboard4,
    text: 'Pilih kendaraan yang ingin Anda sewa dari berbagai pilihan mobil berkualitas yang tersedia. Kami menyediakan berbagai macam jenis mobil sesuai dengan kebutuhan dan preferensi Anda.',
  },
];

const OnBoardingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            width: '100%',

            overflow: 'hidden',
            borderRadius: 10,
          }}>
          <Image source={item.img} resizeMode="contain" style={styles.image} />
        </View>
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            fontSize: 12,
            lineHeight: 25,
          }}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{marginBottom: WINDOW_HEIGHT / 3}} />
      <CustomCarousel
        containerStyle={{
          width: '100%',
          alignItems: 'center',
          //   position: 'absolute',
        }}
        carouselWidth={WINDOW_WIDTH * (90 / 100)}
        data={carouselItems}
        // data={carouselItems}
        renderItem={renderItem}
        // autoPlay
        showButtonNavigator={false}
        scrollAnimationDuration={2000}
        height={360}
        paginationSize={7}
        paginationColor="#F1A33A"
        paginationPosition={51}
      />

      <Button
        _theme="navy"
        title="Lanjut"
        onPress={() => {
          dispatch(toggleOnboarding(true));
          (navigation as any).replace('MainTab');
        }}
        styleWrapper={{
          position: 'absolute',
          bottom: 20,
          width: '95%',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default hoc(OnBoardingScreen);

const styles = StyleSheet.create({
  itemContainer: {
    // flexDirection: 'row',
    width: '100%',
    height: 360,
    // backgroundColor: 'red',
    // height: 'auto',
    // height: WINDOW_HEIGHT/2,
    marginTop: 20,
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
    width: '100%',
    height: '70%',
    borderRadius: 10,
  },
});
