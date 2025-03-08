import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {ic_arrow_left_white, ic_empty_voucher, ic_file_filled} from 'assets/icons';
import appBar from 'components/AppBar/AppBar';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {theme} from 'utils';
import ItemCard from './ItemCard';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {additionalRequestState} from 'redux/features/additionalRequests/additionalRequestSlice';
import {AdditonalProduct} from 'types/additional-items.types';
import {getAdditionalRequests} from 'redux/features/additionalRequests/additionalRequestAPI';
import DataNotFound from 'components/DataNotFound/DataNotFound';

const AdditionalItemScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const data = useAppSelector(additionalRequestState)?.data;
  // const dispatch = useAppDispatch();
  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image source={ic_arrow_left_white} style={styles.icon} />
            <Text style={styles.headerText}>
              {t('detail_order.add_item.title')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  const renderItem = ({item}: {item: AdditonalProduct}) => (
    <ItemCard item={item} />
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={data || []}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <DataNotFound
            imageComponent={
              <Image
                source={ic_file_filled}
                style={[iconCustomSize(50), {marginBottom: 20}]}
                resizeMode="contain"
              />
            }
            title=""
            description={t('detail_order.add_item.empty_msg') as any}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default AdditionalItemScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  icon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  headerText: {
    color: 'white',
    marginLeft: 10,
  },
});
