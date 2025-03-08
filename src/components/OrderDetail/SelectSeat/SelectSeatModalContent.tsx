import React, {useMemo} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1, h4} from 'utils/styles';
import {ic_close} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';

type SelectSeatModalContentProps = {
  onSelect: (val: number) => void;
  onClose: () => void;
};

const SelectSeatModalContent = ({onSelect, onClose}: SelectSeatModalContentProps) => {
  const {t} = useTranslation();
  const vehicle = useAppSelector(vehiclesState).vehicleById;

  const data = useMemo(() => {
    if (vehicle?.max_passanger) {
      return Array.from(
        {length: vehicle?.max_passanger + 1},
        (_, i) => i + 1,
      ).map(val => ({
        name: t('detail_order.tripDetail.n_people', {n: val}),
        value: val,
      }));
    }

    return [];
  }, [vehicle?.max_passanger]);

  const renderItem = ({item}: {item: {name: string; value: number}}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelect(item.value);
        }}>
        <View style={styles.item}>
          <Text style={[h4, {marginLeft: 5}]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('detail_order.tripDetail.totalPassengerPlaceholder')}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Image source={ic_close} style={iconCustomSize(12)} />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <BottomSheetFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default SelectSeatModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
  header: {
    ...rowCenter,
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    ...h1,
    fontSize: 20,
  },
  listContainer: {width: '100%', flex: 1},
  item: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 20,
  },
});
