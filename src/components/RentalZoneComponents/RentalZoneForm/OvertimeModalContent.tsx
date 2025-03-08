import Button from 'components/Button';
import React from 'react';
import {ic_car_rent} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

type OvertimeModalContentProps = {
  onOk: () => void;
  onCancel: () => void;
};

const OvertimeModalContent = ({onOk, onCancel}: OvertimeModalContentProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Image source={ic_car_rent} style={styles.image} resizeMode="cover" />
      <Text style={styles.headerText}>
        {t('detail_order.overtime_confirmation_header')}
      </Text>
      <Text style={styles.descriptionText}>
        {t('detail_order.overtime_confirmation_desc1')}{' '}
        <Text style={styles.highlightText}>
          {t('detail_order.overtime_confirmation_desc2')}
        </Text>{' '}
        {t('detail_order.overtime_confirmation_desc3')}
      </Text>

      <Button
        _theme="orange"
        onPress={onOk}
        title={t('global.button.yesNext')}
        styleWrapper={styles.buttonPrimary}
      />
      <Button
        _theme="white"
        onPress={onCancel}
        title={t('global.button.cancel')}
        styleWrapper={styles.buttonSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 20,
    width: '90%',
  },
  image: {
    width: 170,
    height: 170,
    marginBottom: 50,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 20,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  highlightText: {
    color: theme.colors.orange,
    textDecorationLine: 'underline',
  },
  buttonPrimary: {
    width: '90%',
    marginTop: 20,
  },
  buttonSecondary: {
    width: '90%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#666',
  },
});

export default OvertimeModalContent;
