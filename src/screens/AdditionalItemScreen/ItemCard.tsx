import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';

import {iconCustomSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {ic_minus_circle_filled, ic_plus_circle_filled} from 'assets/icons';
import {showBSheet} from 'utils/BSheet';
import ImageCard from './ImageCard';
import {AdditonalProduct} from 'types/additional-items.types';
import {currencyFormat} from 'utils/currencyFormat';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';
import {useTranslation} from 'react-i18next';

interface Image {
  id: number;
  file_name: string;
}

const ItemCard = ({item}: {item: AdditonalProduct}) => {
  const {formDaily} = useAppSelector(appDataState);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const showImageList = () => {
    showBSheet({
      content: <ImageCard data={allImages} />,
      snapPoint: ['60%', '60%'],
    });
  };

  const totalStock = item?.varieties.reduce(
    (sum, variety) => sum + variety.available_stock,
    0,
  );

  const allImages: Image[] = item?.varieties.reduce(
    (acc, variety) => acc.concat(variety?.images as any),
    [],
  );
  const activeImages: Image[] = item?.varieties.map(x => x?.images[0]);

  const findVariety = (x: any) =>
    formDaily?.additional_item
      ?.find(y => y?.id === item?.id)
      ?.varieties?.find(z => x?.id === z?.id);

  const selectedVariety = formDaily?.additional_item?.find(
    _item => _item?.id === item?.id,
  )?.varieties?.[0];

  const maxOrder = () => {
    if (selectedVariety?.available_stock < selectedVariety?.max_order) {
      return selectedVariety?.available_stock;
    }
    return selectedVariety?.max_order;
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.container}>
        <TouchableOpacity onPress={showImageList}>
          <Image
            // source={{uri: allImages?.[0]?.file_name}}
            source={{
              uri:
                selectedVariety?.images?.[0]?.file_name ||
                activeImages?.[0]?.file_name,
            }}
            style={[iconCustomSize(104)]}
          />
        </TouchableOpacity>
        <View style={styles.itemWrapper}>
          <View>
            <Text style={styles.textName}>{item?.name}</Text>
            <Text style={styles.textPrice}>
              {t('detail_order.add_item.price')}{' '}
              {currencyFormat(item?.unit_price)}
            </Text>
            <Text style={styles.textStock}>
              {t('detail_order.add_item.stock')}:{' '}
              {selectedVariety?.available_stock || totalStock}
            </Text>
          </View>

          <View style={[rowCenter]}>
            <Text style={styles.textName}>
              {t('detail_order.add_item.total')}:{' '}
            </Text>
            <View style={[rowCenter]}>
              <TouchableOpacity
                disabled={selectedVariety?.input_order === 1}
                onPress={() => {
                  if (selectedVariety?.input_order === 1) {
                    return;
                  }
                  let _order = {...selectedVariety};
                  _order.input_order -= 1;
                  let additional_item = [...formDaily?.additional_item];
                  let activeData = formDaily?.additional_item?.findIndex(
                    x => x?.id === item?.id,
                  );
                  additional_item[activeData] = {...item, varieties: [_order]};

                  dispatch(
                    saveFormDaily({
                      ...formDaily,
                      additional_item: [...additional_item],
                    }),
                  );
                }}>
                <Image
                  source={ic_minus_circle_filled}
                  style={[
                    iconCustomSize(20),
                    selectedVariety?.input_order === 1 && {
                      tintColor: theme.colors.grey5,
                    },
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.textTotal}>
                {selectedVariety?.input_order}
              </Text>
              <TouchableOpacity
                disabled={selectedVariety?.input_order === maxOrder()}
                onPress={() => {
                  if (selectedVariety?.input_order === maxOrder()) {
                    return;
                  }
                  let _order = {...selectedVariety};
                  _order.input_order += 1;
                  let additional_item = [...formDaily?.additional_item];
                  let activeData = formDaily?.additional_item?.findIndex(
                    x => x?.id === item?.id,
                  );
                  additional_item[activeData] = {...item, varieties: [_order]};

                  dispatch(
                    saveFormDaily({
                      ...formDaily,
                      additional_item: [...additional_item],
                    }),
                  );
                }}>
                <Image
                  source={ic_plus_circle_filled}
                  style={[
                    iconCustomSize(20),
                    selectedVariety?.input_order === maxOrder() && {
                      tintColor: theme.colors.grey5,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Text style={[styles.textName, {marginBottom: 10}]}>
        {t('detail_order.add_item.detail')} :{' '}
      </Text>

      <Text style={[styles.textStock, {lineHeight: 16}]}>
        {item?.description}
      </Text>

      <Text style={[styles.textName, {marginTop: 18, marginBottom: 10}]}>
        {t('detail_order.add_item.choose_color')} :{' '}
      </Text>

      <View style={[rowCenter, {flexWrap: 'wrap'}]}>
        <ScrollView horizontal>
          {item?.varieties.map((x, i) => (
            <TouchableOpacity
              disabled={x?.available_stock === 0}
              onPress={() => {
                let variety = formDaily?.additional_item
                  ? [...formDaily?.additional_item]
                  : [];

                const selectedItemIndex = variety?.findIndex(
                  _item => _item?.id === item?.id,
                );

                if (
                  selectedItemIndex !== -1 &&
                  selectedItemIndex !== undefined
                ) {
                  let selectedItem = {...variety[selectedItemIndex]};

                  const isVarietySelected = selectedItem.varieties?.some(
                    _item => _item?.id === x?.id,
                  );

                  if (isVarietySelected) {
                    selectedItem.varieties = [];
                    variety[selectedItemIndex] = selectedItem;

                    if (selectedItem.varieties.length === 0) {
                      variety.splice(selectedItemIndex, 1);
                    }
                  } else {
                    selectedItem.varieties = [{...x, input_order: 1}];
                    variety[selectedItemIndex] = selectedItem;
                  }
                } else {
                  variety.push({
                    ...item,
                    varieties: [{...x, input_order: 1}],
                  });
                }

                // console.log('variety = ', JSON.stringify(variety));
                dispatch(
                  saveFormDaily({
                    ...formDaily,
                    additional_item: variety,
                  }),
                );
              }}
              key={i.toString()}
              style={[
                styles.colorWrapper,
                {
                  backgroundColor:
                    x?.available_stock === 0
                      ? '#EAEAEA'
                      : findVariety(x)?.id
                      ? '#F1A33A'
                      : '#ffffff',
                },
              ]}>
              <Text
                style={[
                  styles.textStock,
                  {color: findVariety(x)?.id ? 'white' : '#000'},
                ]}>
                {x?.color}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 20,
    borderBottomColor: '#DBDBDB',
    borderBottomWidth: 1,
  },
  container: {flexDirection: 'row', marginBottom: 20},
  textName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.black,
  },
  textPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.black,
    marginVertical: 6,
  },
  textStock: {
    fontSize: 10,
    fontWeight: '400',
    color: theme.colors.black,
  },
  textTotal: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.black,
    marginHorizontal: 5,
  },
  itemWrapper: {justifyContent: 'space-between', marginLeft: 10},
  colorWrapper: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    paddingVertical: 6,
    paddingHorizontal: 27,
    borderRadius: 5,
    marginBottom: 8,
  },
});
