import Button from 'components/Button';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import {theme} from 'utils';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {h1, h4} from 'utils/styles';

const ModalBack = ({visible, setVisible, onConfirm}: any) => {
  const {t} = useTranslation();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Tampilkan Alert" onPress={() => setVisible(true)} />
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: WINDOW_WIDTH / 1.2,
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text style={{...h1, fontSize: 16}}>
              {t('global.alert.warning')}
            </Text>
            <Text style={{marginTop: 14, ...h4, textAlign: 'center'}}>{`${t(
              'global.alert.rental_zone_exit',
            )}`}</Text>

            <View
              style={[
                rowCenter,
                {marginTop: 20, justifyContent: 'space-between', width: '100%'},
              ]}>
              <Button
                _theme="white"
                onPress={() => {
                  setVisible(false);
                }}
                title={t('global.button.cancel')}
                styleWrapper={{
                  borderWidth: 1,
                  borderColor: theme.colors.grey5,
                  width: '47%',
                }}
              />

              <Button
                _theme="navy"
                onPress={onConfirm}
                title={t('global.button.confirm')}
                styleWrapper={{
                  width: '47%',
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalBack;
