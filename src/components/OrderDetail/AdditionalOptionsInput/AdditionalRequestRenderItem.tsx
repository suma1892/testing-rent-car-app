import Counter from './Counter';
import React, {useEffect, useState} from 'react';
import {h5} from 'utils/styles';
import {ic_blue_check, ic_uncheck} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {idrFormatter} from 'utils/functions';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import { currencyFormat } from 'utils/currencyFormat';

type Item = {
  id: number;
  is_available: boolean;
  name: string;
  price: number;
  stock: number;
};

type Value = {id: number; checked: boolean; price: number; quantity?: number};

type Props = {
  item: Item;
  onSelect: ({id, checked}: Value) => void;
  defaultValue?: Value;
};

const AdditionalRequestRenderItem = ({item, onSelect, defaultValue}: Props) => {
  const [checkInfo, setCheckInfo] = useState(false);

  useEffect(() => {
    if (!!defaultValue) {
      setCheckInfo(defaultValue.checked);
    }
  }, [defaultValue]);

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          onSelect({
            id: item.id,
            price: item.price,
            checked: !checkInfo,
            quantity: !checkInfo ? 1 : 0,
          });
          setCheckInfo(prev => !prev);
        }}>
        <Image
          source={checkInfo ? ic_blue_check : ic_uncheck}
          style={iconSize}
        />
      </TouchableOpacity>

      <View style={styles.label}>
        <Text style={[h5, {marginLeft: 10}]}>{item.name}</Text>
        <View style={styles.cost}>
          <Text
            style={[
              h5,
              {
                color: '#299B0A',
              },
            ]}>
            {currencyFormat(item.price) || 'See Details'}
          </Text>
        </View>
      </View>

      <Counter
        defaultValue={defaultValue?.quantity || 1}
        selected={checkInfo}
        onChange={count => {
          setCheckInfo(count > 0);
          onSelect({
            id: item.id,
            price: item.price,
            checked: count > 0,
            quantity: count,
          });
        }}
      />
    </View>
  );
};

export default AdditionalRequestRenderItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  label: {
    flexBasis: '70%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cost: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: '#DBFFDE',
  },
});
