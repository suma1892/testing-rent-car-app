import {appDataState} from 'redux/features/appData/appDataSlice';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1} from 'utils/styles';
import {ic_glasses, ic_pinpoin} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {IGarages} from 'types/global.types';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
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
  onPress: (val: IGarages) => void;
};

const TakingLocationModalContent: React.FC<Props> = ({onPress}) => {
  const {t} = useTranslation();
  const garages = useAppSelector(appDataState).garages;

  const renderItem = ({item}: {item: IGarages}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
        <Image source={ic_pinpoin} style={iconSize} />
        <View>
          <Text style={[h1, {marginLeft: 5}]}>{item.name}</Text>
          {/* <Text style={[h5, {marginLeft: 5}]}>{item.address_details}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 18}]}>{t('myBooking.pickupLocation')}</Text>
      <View style={[rowCenter, styles.searchWrapper]}>
        <TextInput
          style={{
            width: '95%',
            padding: 0,
            margin: 0,
            color: theme.colors.black,
          }}
          placeholder={`${t('detail_order.search_by_address')}`}
        />
        <Image source={ic_glasses} style={iconSize} />
      </View>
      <View style={{width: '100%', flex: 1}}>
        <View style={styles.listContainer}>
          <BottomSheetFlatList
            data={garages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default TakingLocationModalContent;

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
