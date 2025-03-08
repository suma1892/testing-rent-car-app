import DataNotFound from 'components/DataNotFound/DataNotFound';
import Loading from 'components/Loading/Loading';
import LoadingNextPage from 'components/LoadingNextPage/LoadingNextPage';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import VoucherCard from './VoucherCard';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {getClaimedVoucherList} from 'redux/features/voucher/voucherAPI';
import {ic_empty_voucher} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {setSelectedVoucher} from 'redux/features/appData/appDataSlice';
import {showToast} from 'utils/Toast';
import {t} from 'i18next';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {
  setErrorVoucher,
  Voucher,
  voucherState,
} from 'redux/features/voucher/voucherSlice';

const ClaimedMenu = () => {
  const voucherData = useAppSelector(voucherState);
  const [refresh, setRefresh] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const fetchClaimedVouchers = useCallback(async () => {
    await dispatch(
      getClaimedVoucherList({
        is_reedemed: 1,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      }),
    );
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchClaimedVouchers();
    setRefresh(false);
  }, [fetchClaimedVouchers]);

  useEffect(() => {
    fetchClaimedVouchers();
  }, [fetchClaimedVouchers, navigation]);

  // const handleClaimVoucher = useCallback(
  //   async (idVoucher: number) => {
  //     try {
  //       await claimVoucher(idVoucher);
  //       showToast({
  //         title: 'Success',
  //         message: t('voucher.msg_success'),
  //         type: 'success',
  //       });
  //       handleRefresh();
  //     } catch (error) {
  //       showToast({
  //         title: 'Error',
  //         message: t('voucher.msg_error'),
  //         type: 'error',
  //       });
  //     }
  //   },
  //   [handleRefresh],
  // );

  const renderItem = useCallback(
    ({item}: {item: Voucher}) => (
      <VoucherCard
        item={item}
        status="claimed"
        onPress={() => {
          navigation.navigate('MainTab', {screen: 'Home'} as any);
          dispatch(setSelectedVoucher([item?.id]));
          dispatch(setErrorVoucher(''));
          showToast({
            message: t('voucher.attached_voucher'),
            title: t('global.alert.success'),
            type: 'success',
          });
        }}
      />
    ),
    [dispatch, navigation],
  );

  if (voucherData.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={voucherData.claimed_voucher || []}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
        refreshing={refresh}
        onRefresh={handleRefresh}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        ListFooterComponent={
          <LoadingNextPage loading={voucherData.isLoadingNextPage} />
        }
        ListEmptyComponent={
          <DataNotFound
            imageComponent={
              <Image
                source={ic_empty_voucher}
                style={[iconCustomSize(220), {marginBottom: 80}]}
                resizeMode="contain"
              />
            }
            title=""
            description={t('voucher.empty_claimed_voucher') as any}
          />
        }
      />
    </View>
  );
};

export default ClaimedMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: '5%',
    paddingTop: 10,
    gap: 20,
  },
});
