import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import Button from 'components/Button';
import {theme} from 'utils';
import {h1, h4} from 'utils/styles';

type RemoveIdentityWarningModalContentProps = {
  onCancel: () => void;
  onOk: () => void;
};

const RemoveIdentityWarningModalContent = ({
  onCancel,
  onOk,
}: RemoveIdentityWarningModalContentProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{t('profile.warning')}</Text>
        <Text style={styles.description}>
          {t('profile.warning_description')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          _theme="red"
          onPress={onCancel}
          styleWrapper={styles.button}
          title={t('global.button.cancel')}
          lineColor={theme.colors.red}
        />
        <Button
          _theme="navy"
          onPress={onOk}
          styleWrapper={styles.button}
          title={t('global.button.yesNext')}
        />
      </View>
    </View>
  );
};

export default RemoveIdentityWarningModalContent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
    padding: '5%',
    justifyContent: 'space-between',
    height: '100%',
  },
  modalContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...h1,
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
  description: {
    ...h4,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  button: {
    flexBasis: '49%',
  },
});
