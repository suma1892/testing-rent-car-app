import AreaZoneRenderItem from './AreaZoneRenderItem';
import React, {memo} from 'react';
import SearchBar from 'components/SearchBar/SearchBar';
import useSearch from 'components/RentalZoneComponents/hooks/useSearch';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1, h4, h5} from 'utils/styles';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {IListZone} from 'types/order';
import {orderState} from 'redux/features/order/orderSlice';
import {SelectZoneModalContentProps} from 'components/RentalZoneComponents/rentalZoneComponent.interface';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

const SelectZoneModalContent: React.FC<SelectZoneModalContentProps> = ({
  headerTitle,
  onPress,
  data = [],
}) => {
  const {listZone} = useAppSelector(orderState);
  const {t} = useTranslation();
  const {searchText, handleSearch, searchResults} = useSearch(
    data?.length > 0
      ? data?.map(x => ({
          ...x,
        }))
      : listZone.list_zones
          ?.slice()
          ?.sort((a, b) => a?.name_zone?.localeCompare(b?.name_zone))
          ?.map(x => ({
            ...x,
            name_search: `${x.name} (${x?.name_zone})`,
          })),
    data?.length > 0 ? 'name' : 'name_search',
  );

  const renderItem = ({item}: {item: IListZone}) => {
    return <AreaZoneRenderItem item={item} onPress={onPress} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{headerTitle}</Text>
      <SearchBar value={searchText} onChangeText={handleSearch} />
      <BottomSheetFlatList
        data={searchResults || []}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(_, i) => `location_${i}`}
        ListEmptyComponent={() => (
          <View
            style={{alignItems: 'center', marginTop: 10, marginLeft: '30%'}}>
            <Text style={[h4, {color: theme.colors.black}]}>
              {t('detail_order.rentalZone.empty_location')}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default memo(SelectZoneModalContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: '5%',
  },
  listContainer: {width: '100%', flexGrow: 1},
  title: {
    ...h1,
    fontSize: 18,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 10,
  },
  button: {
    ...rowCenter,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  pinPoinIcon: {
    ...iconCustomSize(21),
    tintColor: 'rgba(241, 163, 58, 1)',
    marginRight: 12,
  },
  zoneList: {
    ...h4,
    lineHeight: 24,
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 239, 217, 1)',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  warningLabel: {
    ...h5,
    fontSize: 11,
    color: 'rgba(221, 127, 0, 1)',
  },
});
