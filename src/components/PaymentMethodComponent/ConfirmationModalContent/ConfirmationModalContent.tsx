import Button from 'components/Button';
import React from 'react';
import {h1} from 'utils/styles';
import {ic_confirmation} from 'assets/icons';
import {iconCustomSize, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

type ConfirmationModalContentProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

const ConfirmationModalContent = ({
  onSubmit,
  onCancel,
}: ConfirmationModalContentProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={ic_confirmation}
        style={iconCustomSize(200)}
        resizeMode={'contain'}
      />
      <Text style={[h1, {marginVertical: 20}]}>
        {t('global.alert.payment_confirm')}
      </Text>
      <View style={{width: '95%', margin: 16}}>
        <Button
          _theme="navy"
          title={t('global.button.yesNext')}
          onPress={onSubmit}
          styleWrapper={{marginBottom: 20}}
        />
        <Button
          _theme="white"
          title={t('global.button.back')}
          onPress={onCancel}
        />
      </View>
    </View>
  );
};

export default ConfirmationModalContent;

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    flex: 1,
    alignItems: 'center',
    margin: 16,
  },
});
