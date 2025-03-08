import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {theme} from 'utils';

type ModalLoadingProps = {
  visible: boolean;
};

const ModalLoading = ({visible}: ModalLoadingProps) => (
  <Modal transparent={true} animationType="fade" visible={visible}>
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.navy} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ModalLoading;
