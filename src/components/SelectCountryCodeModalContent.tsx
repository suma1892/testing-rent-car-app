import React, {memo} from 'react';
import SearchBar from 'components/SearchBar/SearchBar';
import useSearch from 'components/RentalZoneComponents/hooks/useSearch';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1, h4, h5} from 'utils/styles';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';

export type CountryCode = {
  name: string;
  dial_code: string;
  code: string;
  emoji: string;
};

type SelectCountryCodeModalContentProps = {
  headerTitle: string;
  onPress: (val: CountryCode) => void;
  data?: CountryCode[];
};

const SelectCountryCodeModalContent: React.FC<
  SelectCountryCodeModalContentProps
> = ({headerTitle, onPress, data = []}) => {
  const {searchText, handleSearch, searchResults} = useSearch(
    data || [],
    'name',
  );

  const renderItem = ({item}: {item: CountryCode}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onPress(item);
        }}>
        <View style={styles.button}>
          <View style={{width: '90%'}}>
            <Text style={h1}>{item?.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{headerTitle}</Text>
      <SearchBar value={searchText} onChangeText={handleSearch} />
      <BottomSheetFlatList
        data={searchResults || []}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default memo(SelectCountryCodeModalContent);

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
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 10,
  },
  button: {
    ...rowCenter,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 20,
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
