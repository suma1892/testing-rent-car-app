import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import {ic_camera} from 'assets/icons';

import FastImage from 'react-native-fast-image';
import {theme} from 'utils';
import {WINDOW_WIDTH, iconCustomSize} from 'utils/mixins';

const RenderItemImage = ({
  item,
  index,
  onOpenCamera,
  selectedImages,
  toggleImageSelection,
}: {
  item: string;
  index: number;
  onOpenCamera: () => void;
  selectedImages: string[];
  toggleImageSelection: (x: string) => void;
}) => {
  return (
    <View style={styles.itemWrapper}>
      {index === 0 ? (
        <View style={styles.cameraImages}>
          <TouchableOpacity onPress={onOpenCamera}>
            <Image
              source={ic_camera}
              style={[iconCustomSize(45), {tintColor: theme.colors.navy}]}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => toggleImageSelection(item)}>
          {Platform.OS === 'android' ? (
            <FastImage
              source={{uri: item, priority: FastImage.priority.high}}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{uri: item}}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <View
            style={[
              styles.selectedWrapper,
              {
                borderColor: selectedImages?.includes(item)
                  ? 'transparent'
                  : theme.colors.white,
                backgroundColor: selectedImages?.includes(item)
                  ? theme.colors.blue
                  : 'transparent',
              },
            ]}>
            {selectedImages?.includes(item) ? (
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {selectedImages.indexOf(item) + 1}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(RenderItemImage);

const styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: theme.colors.white,
    height: WINDOW_WIDTH / 3.2,
    width: WINDOW_WIDTH / 3.2,
    margin: 2,
  },
  selectedWrapper: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraImages: {
    borderWidth: 4,
    borderColor: theme.colors.navy,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: '100%', height: '100%', borderRadius: 10},
});
