import React from 'react';
import {h1} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const LoadingNextPage = ({loading}: {loading: boolean}) => {
  const {t} = useTranslation();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[h1, styles.loading]}>{t('global.loading')}...</Text>
      </View>
    );
  }

  return null;
};

export default LoadingNextPage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {fontSize: 16, color: theme.colors.navy, marginBottom: 10},
});
