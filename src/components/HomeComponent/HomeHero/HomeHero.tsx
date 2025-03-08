import React, {memo, useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  rentalLocationState,
  setRentalLocationParams,
} from 'redux/features/rentalLocation/rentalLocationSlice';
import CarouselHero from '../CarouselHero/CarouselHero';
import {buttonList} from './HomeHero.datasource';
import {h1} from 'utils/styles';
import {iconSize, rowCenter, WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import {img_bg_hero_default} from 'assets/images';
import {IService} from 'types/rental-location.types';
import FastImage from 'react-native-fast-image';

type HomeHeroProps = {
  onSelectionChange: (val: IService) => void;
};

const HomeHero: React.FC<HomeHeroProps> = ({onSelectionChange}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {services} = useAppSelector(rentalLocationState);

  const [selected, setSelected] = useState<number | null>(null);

  const finalMenu = useMemo(() => {
    if (services.length) {
      return services
        .map(service => {
          const selectedButton = buttonList.find(
            button => button.key === service.name,
          );
          return {
            ...service,
            img: selectedButton?.img,
            imgActive: selectedButton?.imgActive,
            title: selectedButton?.title,
            sequence: selectedButton?.sequence,
          };
        })
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    }
    return buttonList;
  }, [services]);

  useEffect(() => {
    if (finalMenu.length) {
      setSelected(finalMenu[0]?.id || null);
    }
  }, [finalMenu]);

  const handlePress = (menu: any) => {
    setSelected(menu.id);
    onSelectionChange(menu);
    dispatch(setRentalLocationParams({service_id: menu.id}));
  };

  return (
    <View>
      <View style={styles.imageHeroContainer}>
        <FastImage
          source={img_bg_hero_default}
          style={styles.bgHero}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <CarouselHero />
    </View>
  );
};

export default memo(HomeHero);

const styles = StyleSheet.create({
  imageHeroContainer: {
    width: WINDOW_WIDTH,
    height: 'auto',
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    overflow: 'hidden',
  },
  bgHero: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT / 4,
  },
  buttonMenu: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  buttonContainer: {
    flexBasis: '33%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    height: 50,
  },
  buttonBorderLeft: {
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
  },
  buttonBorderRight: {
    // borderTopRightRadius: 10,
    // borderBottomRightRadius: 10,
  },
  buttonName: {
    fontSize: 13,
    width: '70%',
    textAlign: 'center',
  },
});
