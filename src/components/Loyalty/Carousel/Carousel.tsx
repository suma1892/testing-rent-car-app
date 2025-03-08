import React from 'react';
import Config from 'react-native-config';
import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {ic_bronze, ic_gold, ic_platinum} from 'assets/icons';
import {idrFormatter} from 'utils/functions';
import {rowCenter} from 'utils/mixins';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import LeftAlign from './left-align';
import { currencyFormat } from 'utils/currencyFormat';

interface IData {
  level: 'Bronze' | 'Gold' | 'Platinum';
  price: number;
  icon: any;
  color: `#${string}`;
}
const DATA: IData[] = [
  {
    level: 'Bronze',
    price: 100000,
    icon: ic_bronze,
    color: '#D6540B',
  },
  {
    level: 'Gold',
    price: 100000,
    icon: ic_gold,
    color: '#F1A33A',
  },
  {
    level: 'Platinum',
    price: 100000,
    icon: ic_platinum,
    color: '#1E708B',
  },
];

const CarouselLoyalty: React.FC = () => {
  const renderItem = ({item}: {item: IData}) => {
    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            height: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            // width: '100%',
            backgroundColor: item?.color,
          }}></View>
        {/* </LinearGradient> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={item?.icon} resizeMode="cover" style={styles.image} />
          <View style={{width: '80%', marginLeft: 10}}>
            <View style={[rowCenter, {justifyContent: 'space-between'}]}>
              <Text>{item?.level}</Text>
              <Text>{currencyFormat(item?.price)}</Text>
            </View>
            <View
              style={{
                backgroundColor: theme.colors.grey6,
                height: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}
            />
            <Text>{'Transaksi Rp 5.000.000 mencapai gold'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    // <Carousel
    //   width={WINDOW_WIDTH}
    //   height={WINDOW_WIDTH / 2}
    //   // autoPlay={true}
    //   data={[...new Array(6).keys()]}
    //   scrollAnimationDuration={1000}
    //   onSnapToItem={index => console.log('current index:', index)}
    //   renderItem={({index}) => (
    //     <View
    //       style={{
    //         flex: 1,
    //         borderWidth: 1,
    //         justifyContent: 'center',
    //         marginLeft: '2.5%',
    //       }}>
    //       <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
    //     </View>
    //   )}
    // />
    <LeftAlign/>
    // <CustomCarousel
    //   containerStyle={{
    //     width: WINDOW_WIDTH,
    //     alignItems: 'center',
    //     position: 'absolute',
    //   }}
    //   // carouselWidth={WINDOW_WIDTH * (90 / 100)}
    //   carouselWidth={WINDOW_WIDTH * (90 / 100)}
    //   data={DATA}
    //   renderItem={renderItem}
    //   // autoPlay
    //   showButtonNavigator={false}
    //   scrollAnimationDuration={2000}
    //   height={120}
    //   paginationSize={7}
    //   paginationColor="#F1A33A"
    //   paginationPosition={10}
    // />
  );
};

export default CarouselLoyalty;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: 'auto',
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
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
    width: 48,
    height: 48,
    borderRadius: 10,
  },
});
