import React, {FC, memo, useCallback} from 'react';
import SearchBar from 'components/SearchBar/SearchBar';
import useSearch from 'components/RentalZoneComponents/hooks/useSearch';
import {BottomSheetFlatList, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {h1, h4, h5} from 'utils/styles';
import {ic_pinpoin} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

type LocationModalContentProps = {
  data: any[];
  onItemPress: (item: any) => void;
};

const LocationModalContent: FC<LocationModalContentProps> = memo(
  ({data, onItemPress}) => {
    const {t} = useTranslation();
    const {searchText, handleSearch, searchResults} = useSearch(data, 'name');

    const renderItem = useCallback(
      ({item}: {item: {name: string}}) => (
        <TouchableOpacity onPress={() => onItemPress(item)}>
          <View style={styles.item}>
            <Image source={ic_pinpoin} style={iconSize} />
            <Text style={[h1, {marginLeft: 10}]}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      ),
      [onItemPress, data],
    );

    return (
      <View style={styles.bsheetWrapper}>
        <Text style={[h1, {fontSize: 18, marginBottom: 17}]}>
          {t('Home.daily.your_location')}
        </Text>

        <SearchBar value={searchText} onChangeText={handleSearch} />
        {searchResults?.length > 0 && (
          <Text style={h5}>{t('Home.daily.available_location')}</Text>
        )}
        <BottomSheetFlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          ListEmptyComponent={() => (
            <View style={styles.emptyWrapper}>
              <Text style={[h4, {color: theme.colors.black}]}>
                {t('detail_order.rentalZone.empty_location')}
              </Text>
            </View>
          )}
        />
      </View>
    );
  },
);

export default LocationModalContent;

const styles = StyleSheet.create({
  item: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bsheetWrapper: {
    width: WINDOW_WIDTH,
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingBottom: 30,
  },
  emptyWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
});
