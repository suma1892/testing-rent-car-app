import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import FastImage from 'react-native-fast-image';
import React, {useCallback, useEffect} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getAboutUsImage} from 'redux/features/appData/appDataAPI';
import {ImageSourcePropType, StyleSheet, View} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {WINDOW_WIDTH} from 'utils/mixins';

type DataRender = {
  id: number;
  img: ImageSourcePropType;
};

const _width = WINDOW_WIDTH / 1.2;

const GetRideCarousel = () => {
  const dispatch = useAppDispatch();
  const aboutUsImage = useAppSelector(appDataState).aboutUsImages;
  const aboutUsImageLoading = useAppSelector(appDataState).isLoading;

  useEffect(() => {
    dispatch(getAboutUsImage());
  }, [dispatch]);

  const renderItem = useCallback(({item}: {item: DataRender}) => {
    return (
      <View style={styles.renderWrapper}>
        <FastImage
          source={{
            uri: item.img as any,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  }, []);

  if (aboutUsImageLoading) {
    return null;
  }
  return (
    <CustomCarousel
      data={aboutUsImage}
      renderItem={renderItem}
      showButtonNavigator={false}
      scrollAnimationDuration={500}
      height={_width}
      paginationSize={7}
      paginationColor="#F1A33A"
      paginationPosition={15}
      containerStyle={styles.contentWrapper}
    />
  );
};

export default GetRideCarousel;

const styles = StyleSheet.create({
  image: {width: _width, height: _width, borderRadius: 5},
  renderWrapper: {flex: 1, alignItems: 'center'},
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 10,
  },
});
