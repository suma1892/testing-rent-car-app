import Button from 'components/Button';
import DailyLayoutCard from './DailyLayoutCard';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import Loading from 'components/Loading/Loading';
import LoadingNextPage from 'components/LoadingNextPage/LoadingNextPage';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {setPage} from 'redux/features/myBooking/myBookingSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  getOrders,
  getVehicleOrder,
} from 'redux/features/myBooking/myBookingAPI';

const DailyLayout: FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const myBooking = useAppSelector(state => state.myBooking);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [vehicleIds, setVehicleIds] = useState<number[]>([]);

  const handleRefresh = () => {
    setRefresh(true);
    dispatch(setPage(1));
  };

  const handleMore = () => {
    if (myBooking.page < myBooking.data.pagination.total_page) {
      dispatch(setPage(myBooking.data.pagination.next_page));
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getOrders(1));
    }, [myBooking.page, navigation]),
  );

  useEffect(() => {
    if (refresh) {
      dispatch(getOrders(1));
      setRefresh(false);
    }
  }, [refresh]);

  const renderItem = ({item}: {item: any}) => {
    return <DailyLayoutCard item={item} />;
  };

  useEffect(() => {
    if (myBooking.data?.data?.length) {
      const store: number[] = [];

      myBooking.data.data.forEach(booking => {
        if (!store.includes(booking.order_detail.vehicle_id)) {
          store.push(booking.order_detail.vehicle_id);
        }
      });

      setVehicleIds(store);
    }
  }, [myBooking.data?.data?.length]);

  useEffect(() => {
    vehicleIds.forEach(id => {
      if (!myBooking.vehicleData.find(vehicle => vehicle.id === id)) {
        dispatch(getVehicleOrder({id}));
      }
    });
  }, [vehicleIds, myBooking.vehicleData?.length]);

  if (myBooking.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myBooking.data.data}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
        refreshing={refresh}
        onRefresh={handleRefresh}
        onEndReached={handleMore}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        ListFooterComponent={
          <LoadingNextPage loading={myBooking.isLoadingNextPage} />
        }
        ListEmptyComponent={
          <DataNotFound
            buttonComponent={
              <Button
                _theme="navy"
                title={t('global.button.orderNow')}
                onPress={() => navigation.goBack()}
                styleWrapper={{marginBottom: 10}}
              />
            }
          />
        }
      />
    </View>
  );
};

export default DailyLayout;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  list: {paddingHorizontal: '5%', paddingTop: 10},
});
