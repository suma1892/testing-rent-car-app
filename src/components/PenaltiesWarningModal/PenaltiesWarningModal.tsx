import Button from 'components/Button';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {h1, h4} from 'utils/styles';
import {ic_penalties} from 'assets/icons';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

type PenaltiesWarningModalProps = {
  onOk: () => void;
  onCancel: () => void;
};

const PenaltiesWarningModal = ({
  onOk,
  onCancel,
}: PenaltiesWarningModalProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FastImage
        source={ic_penalties}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
      <View>
        <Text style={styles.title}>{t('global.penalties_midnight_warning_title')}</Text>
        <Text style={styles.description}>
          {t('global.penalties_midnight_warning_desc')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={t('global.button.yesNext')}
          onPress={onOk}
          _theme="navy"
          styleWrapper={styles.button}
        />
        <Button
          title={t('global.button.cancel')}
          onPress={onCancel}
          _theme="red"
          styleWrapper={styles.button}
          lineColor="red"
        />
      </View>
    </View>
  );
};

export default PenaltiesWarningModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: 40,
    width: '100%',
  },
  image: {
    width: 213,
    height: 160,
    marginBottom: 20,
  },
  title: {
    ...h1,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    ...h4,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: 10,
  },
});
