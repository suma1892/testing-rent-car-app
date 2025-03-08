import Button from 'components/Button';
import React from 'react';
import {h1, h5} from 'utils/styles';
import {ic_confirmation} from 'assets/icons';
import {iconCustomSize, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

type OvertimeModalContentProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

const OvertimeModalContent = ({
  onSubmit,
  onCancel,
}: OvertimeModalContentProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={ic_confirmation}
        style={iconCustomSize(200)}
        resizeMode={'contain'}
      />
      <Text style={[h1, {marginVertical: 20}]}>
        {t('Home.daily.overtime_confirmation_title')}
      </Text>
      <Text style={[h5, {marginVertical: 20, textAlign: 'center'}]}>
        {t('Home.daily.overtime_confirmation_description.first')}{' '}
        <Text style={{color: '#F1A33A', textDecorationLine: 'underline'}}>
          {t('Home.daily.overtime_confirmation_description.second')}
        </Text>{' '}
        {t('Home.daily.overtime_confirmation_description.third')}
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

export default OvertimeModalContent;

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});
