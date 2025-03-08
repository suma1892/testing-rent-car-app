import {ReactNode} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {h2} from 'utils/styles';

type Props = {
  trigger: boolean;
  onClose: () => void;
  children: ReactNode;
  headerTitle?: string;
};

const CustomModal: React.FC<Props> = ({
  trigger,
  onClose,
  children,
  headerTitle = 'Pilih Opsi',
}) => {
  return (
    <Modal
      visible={trigger}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      {/* <Modal
        visible={trigger}
        animationType="fade"
        transparent
        style={{zIndex: -99}}
        statusBarTranslucent
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[styles.modalContainer, styles.modalBackground]} />
        </TouchableWithoutFeedback>
      </Modal> */}

      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text
                textBreakStrategy="simple"
                style={[h2, styles.modalHeaderTitle]}>
                {headerTitle}
              </Text>
            </View>
          </View>

          <View style={styles.lineBreak} />

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalHeaderTitle: {
    // fontFamily: 'Neo Sans Regular',
    marginBottom: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  modalBackground: {backgroundColor: 'rgba(120, 120, 120, 0.5)'},
  header: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingTop: 10,
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'column',
    height: 50,
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  lineBreak: {
    borderBottomColor: 'rgba(173, 162, 162, 0.5)',
    borderBottomWidth: 1,
  },
});
