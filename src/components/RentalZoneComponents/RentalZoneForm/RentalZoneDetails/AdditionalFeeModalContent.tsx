import React, {useMemo} from 'react';
import {AdditionalFeeModalContentProps} from 'components/DetailCarComponent/detailCarComponent.interface';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {Category} from 'types/order';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h5} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';

const AdditionalFeeModalContent: React.FC<
  AdditionalFeeModalContentProps & {name: string}
> = ({data, name}) => {
  const {t} = useTranslation();
  const {vehicleById} = useAppSelector(vehiclesState);

  const filteredData = useMemo(
    () => data?.filter(val => val.category_name === vehicleById.category.name),
    [data, vehicleById.category.name],
  );

  const renderItem = ({item}: {item: Category}) => (
    <Text style={styles.description}>
      &#x2022; {item.category_name} (+{currencyFormat(item.price)})
    </Text>
  );

  return (
    <View style={styles.bsheetWrapper}>
      <Text style={styles.title}>
        {t('detail_order.rentalZone.area_title', {
          // value: t('detail_order.rentalZone.zone', {value: name}),
          value: name,
        })}
      </Text>
      <Text style={styles.description}>
        {t('detail_order.rentalZone.additional_fee_zone_desc', {
          zone: name,
        })}
      </Text>
      <BottomSheetFlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(_, i) => `car_${i}`}
      />
    </View>
  );
};

export default AdditionalFeeModalContent;

const styles = StyleSheet.create({
  bsheetWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: '5%',
    width: '100%',
  },
  title: {
    ...h1,
    marginBottom: 20,
  },
  description: {
    ...h5,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});
