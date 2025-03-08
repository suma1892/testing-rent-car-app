import React, {useCallback} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {h1} from 'utils/styles';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {ic_arrow_left, ic_car_package, ic_pinpoin} from 'assets/icons';
import {
  FONT_SIZE_14,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';

interface IData {
  description?: string;
  id?: number;
  is_active?: boolean;
  name?: string;
  price?: number;
  total_price?: number;
  data: any;
  setSelectedPackage: any;
  selectedPackage: IData;
  goBack: any;
  currency_prefix?: string;
}

const SelectPackageForm = ({
  data,
  setSelectedPackage,
  selectedPackage,
  currency_prefix,
  goBack,
}: IData) => {
  const {t} = useTranslation();
  console.log('data pckg ', data);

  const renderItem = useCallback(
    ({item, index}: {item: IData; index: number}) => (
      <TouchableOpacity
        style={[
          styles.packageItem,
          {
            borderWidth: selectedPackage?.id === item?.id ? 1 : 0,
            borderColor:
              selectedPackage?.id === item?.id
                ? theme.colors.blue
                : theme.colors.white,
          },
        ]}
        onPress={() => setSelectedPackage(item)}>
        <View style={styles.packageDetails}>
          <Image source={ic_car_package} style={styles.packageIcon} />
          <View>
            <Text style={styles.packageTitle}>{item?.name}</Text>
            <Text style={styles.packageSubtitle}>{item?.description}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.packagePrice}>
            {currencyFormat(
              Math.floor(item?.total_price || 0),
              currency_prefix,
            )}
          </Text>
          {/* <Text style={styles.packagePriceStrikethrough}>
            {currencyFormat(item?.total_price)}
          </Text> */}
        </View>
      </TouchableOpacity>
    ),
    [selectedPackage],
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image source={ic_arrow_left} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('one_way.select_package')}</Text>
        <View style={{width: '5%'}} />
      </View>

      <BottomSheetFlatList
        data={data}
        keyExtractor={(item: IData) => (item?.id || '')?.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              source={ic_pinpoin}
              style={[iconCustomSize(70), {tintColor: theme.colors.grey5}]}
            />
            <Text style={[h1, {marginTop: 10, color: theme.colors.grey3}]}>
              Data not found
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SelectPackageForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    fontSize: FONT_SIZE_14,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  packageItem: {
    ...rowCenter,
    justifyContent: 'space-between',
    elevation: 4,
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  packageDetails: {
    ...rowCenter,
  },
  packageIcon: {
    width: 41,
    height: 28,
    marginRight: 10,
  },
  packageTitle: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  packageSubtitle: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  packagePrice: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  packagePriceStrikethrough: {
    textDecorationLine: 'line-through',
    fontSize: 8,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
});
