import FilterModalContent from './FilterModalContent';
import React from 'react';
import {h1} from 'utils/styles';
import {ic_filter} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

type Value = {
  name: string;
  price: number;
  passanger: number;
  priceSort: 'asc' | 'desc';
  brands: number[];
};

type Props = {
  value: Value;
  onSubmit: (val: Value) => void;
};

const Filters: React.FC<Props> = ({value, onSubmit}) => {
  const {t} = useTranslation();

  const handleFilter = () => {
    showBSheet({
      snapPoint: ['90%', '90%'],
      content: <FilterModalContent value={value} onSubmit={onSubmit} />,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleFilter}>
        <View style={styles.filter}>
          <Text style={[h1, {color: theme.colors.navy, marginRight: 5}]}>
            {t('list_car.search_filter')}
          </Text>
          <Image source={ic_filter} style={iconCustomSize(15)} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
  },
  button: {
    width: 130,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  filter: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
});
