import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {orderState} from 'redux/features/order/orderSlice';
import {useAppSelector} from 'redux/hooks';
import {ZoneImage} from 'types/order';
import {theme} from 'utils';
import {WINDOW_WIDTH} from 'utils/mixins';

const RentalZoneImage: React.FC = () => {
  const {listZone, isLoading} = useAppSelector(orderState);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (listZone?.zone_images?.length) {
      setSelectedImage(`${Config.URL_IMAGE}${listZone.zone_images[0]?.url}`);
    }
  }, [listZone?.zone_images]);

  // console.log('listZone = ', listZone)

  const handleImageSelect = useCallback((url: string) => {
    setSelectedImage(url);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: ZoneImage}) => {
      const url = `${Config.URL_IMAGE}${item?.url}`;

      return (
        <TouchableOpacity onPress={() => handleImageSelect(url)}>
          <FastImage
            source={{
              uri: url,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={styles.zoneImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      );
    },
    [handleImageSelect],
  );

  const zoneImages = useMemo(
    () => listZone.zone_images || [],
    [listZone.zone_images],
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{marginTop: 10}}>
      {zoneImages?.length > 0 && (
        <FastImage
          source={{
            uri: selectedImage,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.imgRent}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      <FlatList
        data={zoneImages}
        renderItem={renderItem}
        keyExtractor={(_, i) => `zone-image-${i}`}
        horizontal
        ListEmptyComponent={() => (
          <View
            style={{
              backgroundColor: theme.colors.grey7,
              height: 200,
              width: WINDOW_WIDTH,
            }}></View>
        )}
      />
    </View>
  );
};

export default RentalZoneImage;

const styles = StyleSheet.create({
  imgRent: {
    width: '100%',
    height: 224,
    marginTop: 20,
    marginBottom: 10,
  },
  zoneImage: {
    width: 62,
    aspectRatio: 1,
    // height: 47,
    marginRight: 8,
    borderRadius: 4,
  },
});
