import React, {memo, useCallback} from 'react';
import {colors} from 'utils/styles';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {iconCustomSize} from 'utils/mixins';
import {servicesList} from './GetRideDescription.datasource';
import {useTranslation} from 'react-i18next';

type DataRender = {
  id: number;
  image: ImageSourcePropType;
  title: string;
  desc: string;
};

const GetRideServices = () => {
  const {t} = useTranslation();

  const renderItem = useCallback(
    ({item}: {item: DataRender}) => {
      return (
        <View style={styles.serviceContainer}>
          <View style={styles.serviceImageContainer}>
            <Image source={item.image} style={iconCustomSize(74)} />
          </View>
          <View style={styles.serviceDescContainer}>
            <Text style={styles.serviceTitle}>{t(item.title)}</Text>
            <Text style={styles.serviceDesc}>{t(item.desc)}</Text>
          </View>
        </View>
      );
    },
    [t],
  );

  return (
    <FlatList
      data={servicesList}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.title}_${index}`}
    />
  );
};

export default memo(GetRideServices);

const styles = StyleSheet.create({
  serviceContainer: {marginTop: 30, flexDirection: 'row'},
  serviceImageContainer: {
    backgroundColor: colors.white,
    width: 74,
    height: 74,
    borderRadius: 5,
    marginRight: 18,
  },
  serviceDescContainer: {flexBasis: '70%', justifyContent: 'space-between'},
  serviceTitle: {
    fontSize: 12,
    color: '#F1A33A',
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginTop: 5,
  },
  serviceDesc: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },
});
