import AirportTransferLayoutCard from './AirportTransferLayoutCard';
import Button from 'components/Button';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import Loading from 'components/Loading/Loading';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import {setPage} from 'redux/features/myBooking/myBookingSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  getOrders,
  getVehicleOrder,
} from 'redux/features/myBooking/myBookingAPI';
import AirportTransferLayoutCardSg from './AirportTransferLayoutCardSg';

const AirportLayout: FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const myBooking = useAppSelector(state => state.myBooking);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [vehicleIds, setVehicleIds] = useState<any[]>([]);
  const {t} = useTranslation();

  const handleRefresh = () => {
    setRefresh(true);
    // dispatch(setPage(1));
    dispatch(getOrders(2));
    setRefresh(false);
  };

  const handleMore = () => {
    if (myBooking.page < myBooking.data.pagination.total_page) {
      setRefresh(true);
      dispatch(setPage(myBooking.data.pagination.next_page));
      setRefresh(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getOrders(2));
    }, [myBooking.page, navigation]),
  );

  useEffect(() => {
    if (refresh) {
      dispatch(getOrders(2));
      setRefresh(false);
    }
  }, [refresh]);

  const renderItem = ({item}: any) => {
    if (item?.order_type_id === 7)
      return <AirportTransferLayoutCardSg item={item} />;
    if (item?.order_type_id === 2)
      return <AirportTransferLayoutCard item={item} />;
  };

  useEffect(() => {
    if (myBooking.data.data.length == 0) return;
    const store: any[] = [];

    myBooking.data.data.map(booking => {
      const isFound = store.find(id => id == booking.order_detail.vehicle_id);

      if (isFound) return;
      store.push(booking.order_detail.vehicle_id);
    });

    setVehicleIds(store);
  }, [myBooking.data]);

  useEffect(() => {
    if (vehicleIds.length == 0) return;
    vehicleIds.forEach(id => {
      if (myBooking.vehicleData.find(vehicle => vehicle.id == id)) return;
      if (!id) return;
      dispatch(getVehicleOrder({id}));
    });
  }, [vehicleIds]);

  if (myBooking.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myBooking.data.data?.filter(
          x => x?.order_type_id === 2 || x?.order_type_id === 7,
        )}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
        refreshing={refresh}
        onRefresh={() => {
          return handleRefresh();
        }}
        onEndReached={() => {
          return handleMore();
        }}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        ListEmptyComponent={
          <DataNotFound
            buttonComponent={
              <Button
                _theme="navy"
                title={t('global.button.orderNow')}
                onPress={() => {
                  navigation.goBack();
                }}
                styleWrapper={{
                  marginBottom: 10,
                }}
              />
            }
          />
        }
      />
    </View>
  );
};

export default AirportLayout;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  list: {
    paddingHorizontal: '5%',
    paddingTop: 10,
  },
});
