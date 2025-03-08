import React from 'react';
import {h1, h4} from 'utils/styles';
import {ic_close} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

const InfoContent = ({onClose}: {onClose: () => void}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('detail_order.tripDetail.infoTitle')}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Image source={ic_close} style={iconCustomSize(12)} />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>
        {t('detail_order.tripDetail.infoDesc')}
      </Text>
    </View>
  );
};

export default InfoContent;

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  header: {
    ...rowCenter,
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...h1,
    fontSize: 20,
  },
  description: {
    ...h4,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
  },
});
