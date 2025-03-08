import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1, h4} from 'utils/styles';
import {ic_glasses, ic_pinpoin, ic_pinpoin2} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {IGarages, ShuttleData} from 'types/global.types';
import {theme} from 'utils';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  data: IGarages[] | ShuttleData[];
  onPress: (val: ShuttleData) => void;
};

const ReturnLocationModalContent: React.FC<Props> = ({data, onPress}) => {
  const {t} = useTranslation();

  const [searchValue, setSearchValue] = useState('');
  const [listData, setListData] = useState([...data]);

  const filteredList = listData.filter(
    (item: any) =>
      item?.name?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
  );

  const renderItem = ({item}: {item: ShuttleData}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
        <Image source={ic_pinpoin} style={iconSize} />
        <View>
          <Text style={[h1, {marginLeft: 5}]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 18}]}>
        {t('detail_order.tripDetail.returnLocation')}
      </Text>
      <View style={[rowCenter, styles.searchWrapper]}>
        <TextInput
          style={{
            width: '95%',
            padding: 0,
            margin: 0,
            color: theme.colors.black,
          }}
          placeholder={`${t('detail_order.search_by_address')}`}
          value={searchValue}
          onChangeText={text => setSearchValue(text)}
        />
        <Image source={ic_glasses} style={iconSize} />
      </View>
      <View style={[rowCenter, {marginTop: 20}]}>
        <Image source={ic_pinpoin2} style={iconSize} />
        <Text style={[h4]}> {t('detail_order.return_to_the_same_place')}</Text>
      </View>
      <View style={{width: '100%', flex: 1}}>
        <View style={styles.listContainer}>
          <BottomSheetFlatList
            data={filteredList as any}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default ReturnLocationModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
  searchWrapper: {
    width: '100%',
    backgroundColor: theme.colors.grey7,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  listContainer: {width: '100%', flex: 1},
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 10,
  },
});
