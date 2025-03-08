import Button from 'components/Button';
import React from 'react';
import {h1, h5} from 'utils/styles';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_failed_delete_account} from 'assets/images';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

const FailedDeleteAccountModalContent = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Image
        source={img_failed_delete_account}
        style={iconCustomSize(200)}
        resizeMode={'contain'}
      />
      <Text style={[h1, {marginVertical: 20}]}>
        {t('delete_account.failed_title')}
      </Text>
      <Text style={[h5, {textAlign: 'center'}]}>
        {t('delete_account.failed_desc')}
      </Text>
      <View style={{width: '95%', margin: 16}}>
        <Button
          _theme="navy"
          title={t('global.button.yes_understand')}
          onPress={() => dispatch(toggleBSheet(false))}
          styleWrapper={{marginBottom: 20}}
        />
      </View>
    </View>
  );
};

export default FailedDeleteAccountModalContent;

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    flex: 1,
    alignItems: 'center',
    margin: 16,
  },
});
