import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import React, {memo, useState} from 'react';
import {h1, h5} from 'utils/styles';
import {ic_close, ic_empty_image} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

type RefundProofTransferProps = {
  imageUri?: string;
};

const RefundProofTransfer = ({imageUri}: RefundProofTransferProps) => {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setVisible(false);
    setError(false);
  }

  return (
    <>
      <View style={styles.refundTransferProofContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={ic_empty_image}
            style={iconCustomSize(17)}
            resizeMode="contain"
          />
          <Text style={styles.transferProof}>
            {t('detail_order.proof_of_transfer')}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text style={styles.seeImage}>{t('carDetail.learnMore')}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={visible}
        backdropOpacity={0.4}
        onBackdropPress={handleClose}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}>
            <Image source={ic_close} style={[iconCustomSize(15)]} />
          </TouchableOpacity>
          <FastImage
            source={
              error
                ? ic_empty_image
                : {
                    uri: `${Config.URL_IMAGE}${imageUri}`,
                    priority: FastImage.priority.high,
                  }
            }
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
            onError={() => setError(true)}
          />
        </View>
      </Modal>
    </>
  );
};

export default memo(RefundProofTransfer);

const styles = StyleSheet.create({
  refundTransferProofContainer: {
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transferProof: {
    ...h5,
    fontSize: 14,
    color: theme.colors.grey3,
    marginLeft: 5,
  },
  seeImage: {
    ...h1,
    fontSize: 14,
    color: theme.colors.navy,
    marginLeft: 5,
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
});
