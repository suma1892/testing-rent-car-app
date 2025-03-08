import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {ic_close2} from 'assets/icons';
import {theme} from 'utils';
import {iconCustomSize} from 'utils/mixins';

const RenderItemImageList = ({
  openImageInFullScreen,
  item,
  toggleImageSelection,
}: {
  item: string;
  toggleImageSelection: (x: string) => void;
  openImageInFullScreen: (x: string) => void;
}) => {

  return (
    <TouchableOpacity
      style={{
        padding: 5,
      }}
      onPress={() => openImageInFullScreen(item)}>
      <Image
        source={{uri: item}}
        style={[iconCustomSize(60), {borderRadius: 10, marginRight: 0}]}
      />
      <TouchableOpacity
        style={styles.closeImg}
        onPress={() => toggleImageSelection(item)}>
        <Image
          source={ic_close2}
          style={[iconCustomSize(20), {tintColor: theme.colors.grey4}]}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default RenderItemImageList;

const styles = StyleSheet.create({
  closeImg: {
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    zIndex: 99,
    right: 0,
  },
});
