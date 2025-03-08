import React from 'react';
import {ic_glasses} from 'assets/icons';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {t} from 'i18next';
import {theme} from 'utils';

const SearchBar = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: any;
}) => {
  return (
    <View style={styles.searchWrapper}>
      <TextInput
        style={{width: '90%', padding: 10, color: theme.colors.black}}
        value={value}
        placeholder={t('detail_order.summary.search_zone') as string}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.grey5}
      />
      <Image source={ic_glasses} style={{width: 15, height: 15}} />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.grey8,
  },
});
