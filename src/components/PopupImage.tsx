import {ic_close} from 'assets/icons';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {iconCustomSize, iconSize} from 'utils/mixins';
import Modal from 'react-native-modal';
import Button from './Button';
import {useTranslation} from 'react-i18next';

const PopupImage = ({value}: {value: string}) => {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(false);
  const {t} = useTranslation();
  return (
    <View style={{flex: 1}}>
      <Button
        _theme="orange"
        onPress={() => {
          setVisible(prev => !prev);
        }}
        title={t('myBooking.open_proof')}
        styleWrapper={{
          marginTop: 26,
        }}
      />

      <Modal
        isVisible={visible}
        // backdropStyle={styles.backdrop}
        backdropOpacity={0.4}
        onBackdropPress={() => setVisible(!visible)}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setVisible(false)}>
            <Image source={ic_close} style={[iconCustomSize(15)]} />
          </TouchableOpacity>
          <Image
            source={{uri: value}}
            style={styles.image}
            onError={() => {
              setError(true);
            }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export default PopupImage;

const styles = StyleSheet.create({
  closeBtn: {
    height: 15,
    width: 15,
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 99,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textWrapper: {
    width: '100%',
    // backgroundColor: theme.colors('color-basic-300'),
    padding: 20,
    borderRadius: 10,
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  image: {
    height: 400,
    width: '100%',
    resizeMode: 'cover',
  },
});
