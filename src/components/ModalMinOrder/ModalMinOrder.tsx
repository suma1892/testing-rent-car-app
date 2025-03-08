import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import Button from 'components/Button';

const ModalMinOrder = ({
  day = 0,
  modalVisible,
  setModalVisible,
}: {
  day: number;
  modalVisible: boolean;
  setModalVisible: any;
}) => {
  const {t} = useTranslation();
  return (
    // <View style={styles.centeredView}>
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.textTitle}>
            {t('list_car.modal_min_order_title')}
          </Text>
          <Text style={styles.textDesc}>
            {t('list_car.modal_min_order_desc', {
              value: day,
            })}
          </Text>

          <Button
            _theme="navy"
            styleWrapper={{
              width: WINDOW_WIDTH / 1.4,
              marginTop: 20,
            }}
            title={t('global.button.yes_understand')}
            onPress={() => setModalVisible((prev: any) => !prev)}
          />
        </View>
      </View>
    </Modal>
    // </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    backgroundColor: '#00000080',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
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
  textDesc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  textTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 20,
  },
  codeWrapper: {
    height: 36,
    marginTop: 10,
    width: WINDOW_WIDTH / 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textCodeWrapper: {
    width: '80%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F6FA',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  copasWrapper: {
    backgroundColor: '#F1A33A',
    height: '100%',
    width: 36,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalMinOrder;
