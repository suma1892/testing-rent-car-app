import {StyleSheet} from 'react-native';
import React from 'react';
import {theme} from 'utils';
import {h1} from 'utils/styles';
import Button from 'components/Button';
import {IOrder} from 'types/my-booking.types';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const RefundProcess = ({item}: {item: IOrder}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <Button
      _theme="orange"
      onPress={() => {
        navigation.navigate('RefundProcess', {
          item: item,
        });
      }}
      title={t('myBooking.refund_process.refund_process')}
      styleWrapper={{marginBottom: 10}}
    />
  );
};

export default RefundProcess;

const styles = StyleSheet.create({
  buttonText: {
    ...h1,
    color: theme.colors.white,
  },
});
