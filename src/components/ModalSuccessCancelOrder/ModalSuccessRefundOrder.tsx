import Button from 'components/Button';
import React from 'react';
import {Alert, Image, Modal, StyleSheet, Text, View} from 'react-native';
import {h1} from 'utils/styles';
import {iconCustomSize} from 'utils/mixins';
import {img_in_process} from 'assets/images';
import {useTranslation} from 'react-i18next';

const ModalSuccessRefundOrder = ({visible, setVisible, onFinish}: any) => {
  const {t} = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setVisible(!visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[h1, styles.modalText]}>
            {t('detail_order.refund_request_in_process')}
          </Text>
          <Text style={{fontSize: 12}}>
            {t('detail_order.refunds_will_be_made_in_7_days')}
          </Text>

          <Image
            source={img_in_process}
            style={[iconCustomSize(200), {marginVertical: 50}]}
          />
          <Button
            _theme="navy"
            title={t('global.button.done')}
            onPress={() => {
              setVisible(!visible);
              onFinish();
            }}
            styleWrapper={{
              width: '50%',
              marginTop: 20,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#00000099',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default ModalSuccessRefundOrder;
