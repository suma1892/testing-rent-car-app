import Config from 'react-native-config';
import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {airportVehiclesState} from 'redux/features/airportVehicles/airportVehiclesSlice';
import {img_car_empty} from 'assets/images';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

interface CarImagePreviewRenderItemProps {
  item: {name: string};
  index: number;
}

const CarImagePreviewRenderItem = memo(
  ({item}: CarImagePreviewRenderItemProps) => {
    const [imageSource, setImageSource] = useState<FastImageProps['source']>({
      uri: `${Config.URL_IMAGE}${item?.name}`,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable,
    });

    const [loading, setLoading] = useState(true);

    const handleError = useCallback(() => {
      setImageSource(img_car_empty);
      setLoading(false);
    }, []);

    const handleLoadStart = () => {
      setLoading(true);
    };

    const handleLoadEnd = () => {
      setLoading(false);
    };

    return (
      <View style={styles.imageContainer}>
        {loading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={theme.colors.navy}
          />
        )}
        <FastImage
          source={imageSource}
          style={styles.image}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      </View>
    );
  },
);

const CarImagePreview = () => {
  const {airportVehicleById} = useAppSelector(airportVehiclesState);

  const images = useMemo(() => {
    return (
      airportVehicleById?.images?.map(image => ({
        name: image,
      })) || []
    );
  }, [airportVehicleById?.images]);

  return (
    <CustomCarousel
      data={images.slice(0, 10)}
      paginationSize={7}
      renderCarouselTitle={
        <View style={styles.carouselTitleContainer}>
          <Text style={styles.carouselTitleText}>
            {airportVehicleById?.title}
          </Text>
        </View>
      }
      renderItem={({item, index}) => (
        <CarImagePreviewRenderItem key={index} item={item} index={index} />
      )}
      containerStyle={styles.carouselContainer}
    />
  );
};

export default CarImagePreview;

const styles = StyleSheet.create({
  carouselTitleContainer: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 20,
    top: 20,
  },
  carouselTitleText: {
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    height: 250,
    width: WINDOW_WIDTH,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
  },
});
