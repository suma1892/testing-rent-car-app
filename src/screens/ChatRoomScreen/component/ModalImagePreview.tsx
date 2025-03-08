import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ic_close2} from 'assets/icons';
import {theme} from 'utils';
import {iconCustomSize} from 'utils/mixins';

const ModalImagePreview = ({
  selectedImage,
  isModalVisible,
  closeFullScreen,
}: {
  selectedImage: string;
  isModalVisible: boolean;
  closeFullScreen: () => void;
}) => {
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeFullScreen}>
      <View style={styles.modalBackground}>
        <TouchableOpacity style={styles.closeButton} onPress={closeFullScreen}>
          <Image
            source={ic_close2}
            style={[iconCustomSize(30), {tintColor: theme.colors.grey4}]}
          />
        </TouchableOpacity>
        {selectedImage && (
          <Image
            source={{uri: selectedImage}}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        )}
      </View>
    </Modal>
  );
};

export default ModalImagePreview;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '80%',
    height: '80%',
  },
});
