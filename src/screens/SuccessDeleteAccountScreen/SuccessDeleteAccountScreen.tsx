import Button from 'components/Button';
import hoc from 'components/hoc';
import React from 'react';
import {h1} from 'utils/styles';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_delete_account} from 'assets/images';
import {theme} from 'utils';
import {toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const SuccessDeleteAccountScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const handleRedirectToHome = () => {
    dispatch(toggleLoader(false));
    navigation.navigate('MainTab', {screen: 'Home'} as any);
  };

  return (
    <View style={styles.container}>
      <Image
        source={img_delete_account}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[h1, {marginBottom: 10}]}>
        {t('delete_account.success_title')}
      </Text>
      <Text style={{color: theme.colors.grey3, marginBottom: 20}}>
        {t('delete_account.success_desc')}
      </Text>
      <Button
        _theme="white"
        lineColor={theme.colors.navy}
        title={t('global.button.back_to_homepage')}
        onPress={handleRedirectToHome}
      />
    </View>
  );
};

export default hoc(
  SuccessDeleteAccountScreen,
  theme.colors.white,
  false,
  'dark-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  image: {
    width: 190,
    height: 240,
    marginBottom: 20,
  },
});
