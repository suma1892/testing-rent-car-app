import DataNotFound from 'components/DataNotFound/DataNotFound';

import Loading from 'components/Loading/Loading';
import LoadingNextPage from 'components/LoadingNextPage/LoadingNextPage';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

import {ic_empty_voucher} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {t} from 'i18next';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {Voucher, voucherState} from 'redux/features/voucher/voucherSlice';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {
  claimVoucher,
  getUnclaimedVoucherList,
} from 'redux/features/voucher/voucherAPI';
import VoucherCard from './VoucherCard';

const UnclaimedMenu = () => {
  const voucherData = useAppSelector(voucherState);
  const [refresh, setRefresh] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleRefresh = async () => {
    setRefresh(true);
    await dispatch(
      getUnclaimedVoucherList({
        is_reedemed: 1,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      }),
    );
    setRefresh(false);
  };

  useEffect(() => {
    dispatch(
      getUnclaimedVoucherList({
        is_reedemed: 1,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleClaimVoucher = async (idVoucher: number) => {
    try {
      await claimVoucher(idVoucher);
      showToast({
        title: t('global.alert.success'),
        message: t('voucher.msg_success'),
        type: 'success',
      });
      handleRefresh();
    } catch (error) {
      showToast({
        title: t('global.alert.error'),
        message: t('voucher.msg_error'),
        type: 'error',
      });
    }
  };

  const renderItem = ({item}: {item: Voucher}) => {
    return (
      <VoucherCard
        item={item}
        status="unclaimed"
        onPress={() => handleClaimVoucher(item?.id)}
      />
    );
  };

  if (voucherData.isLoading) {
    return <Loading />;
  }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={voucherData.data?.filter(x => !x.is_reedemed) || []}
        // data={voucherData.data}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        keyExtractor={(item, i) => {
          return i.toString();
        }}
        refreshing={refresh}
        onRefresh={() => {
          return handleRefresh();
        }}
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
            description={t('voucher.empty_unclaimed_voucher') as any}
          />
        }
      />
    </View>
  );
};

export default UnclaimedMenu;

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
  cardFooter: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'flex-end',
  },
  cardImage: {
    width: '100%',
    height: 105,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.grey5,
  },
  btnUse: {
    backgroundColor: theme.colors.orange,
    alignItems: 'center',
    padding: 5,
    borderRadius: 7,
    width: '30%',
    marginTop: 10,
  },
  activeMenu: {
    width: '50%',
    backgroundColor: theme.colors.navy,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  inactiveMenu: {
    width: '50%',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.navy,
    padding: 10,
    alignItems: 'center',
  },
  textActive: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textInactive: {
    color: theme.colors.navy,
    fontSize: 12,
    fontWeight: '400',
  },
});
