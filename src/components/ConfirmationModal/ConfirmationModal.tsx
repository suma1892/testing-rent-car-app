import Button from 'components/Button';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {h1} from 'utils/styles';

type ConfirmationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  headerTitle: string;
  description?: string;
  isConfirmationLoading?: boolean;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  headerTitle,
  description,
  isConfirmationLoading,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={[h1, styles.headerTitle]}>{headerTitle}</Text>

          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Button
              _theme="white"
              onPress={onClose}
              styleWrapper={{flexBasis: '40%'}}
              title={t('global.button.back')}
            />
            <Button
              _theme="navy"
              onPress={onConfirm}
              styleWrapper={{flexBasis: '40%'}}
              title={t('global.button.yesNext')}
              isLoading={isConfirmationLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 20,
  },
  description: {
    color: theme.colors.black,
    textAlign: 'center',
    lineHeight: 23,
  },
});
