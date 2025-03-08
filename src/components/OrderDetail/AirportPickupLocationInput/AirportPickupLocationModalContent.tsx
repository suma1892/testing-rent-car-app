import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h5} from 'utils/styles';
import {ic_glasses, ic_pinpoin} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {ShuttleData} from 'types/global.types';
import {theme} from 'utils';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppSelector} from 'redux/hooks';

type DeliveryLocationModalContentProps = {
  data: any[];
  onPress: (val: ShuttleData) => void;
  headerTitle?: string;
  showFee?: boolean;
};

type RenderItemProps = {
  item: ShuttleData;
  showFee?: boolean;
  onPress: (val: ShuttleData) => void;
  t: any;
};

const RenderItem = ({item, onPress, showFee, t}: RenderItemProps) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onPress(item);
      }}>
      <Image source={ic_pinpoin} style={iconSize} />
      <Text style={[h5, {marginLeft: 5}]}>{item.name}</Text>
      {showFee && (
        <View
          style={[
            styles.cost,
            {
              backgroundColor: item.fee === 0 ? '#DBEEFF' : '#DBFFDE',
            },
          ]}>
          <Text
            style={[
              h5,
              {
                color: item.fee === 0 ? '#0A789B' : '#299B0A',
              },
            ]}>
            {item.fee === 0
              ? t('detail_order.formDetail.free')
              : currencyFormat(item.fee)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const DeliveryLocationModalContent: React.FC<
  DeliveryLocationModalContentProps
> = ({data, onPress, headerTitle, showFee}) => {
  const {t} = useTranslation();
  const aiportLocationData = useAppSelector(rentalLocationState).airportData;

  const [searchValue, setSearchValue] = useState('');

  const filteredList = aiportLocationData?.filter(
    (item: any) =>
      item?.name?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
  );

  const renderItem = ({item}: {item: ShuttleData}) => {
    return <RenderItem item={item} onPress={onPress} showFee={showFee} t={t} />;
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 18}]}>
        {headerTitle
          ? headerTitle
          : t('detail_order.tripDetail.deliveryLocation')}
      </Text>
      <View style={[rowCenter, styles.searchWrapper]}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('global.search') as any}
          value={searchValue}
          onChangeText={text => setSearchValue(text)}
          placeholderTextColor={theme.colors.grey5}
        />
        <Image source={ic_glasses} style={iconSize} />
      </View>
      <View style={styles.listContainer}>
        <BottomSheetFlatList
          data={filteredList as any}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default DeliveryLocationModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
  searchInput: {width: '95%', padding: 0, margin: 0, color: theme.colors.black},
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
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 20,
    alignItems: 'center',
  },
  cost: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
});
