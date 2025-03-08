import moment from 'moment';
import React from 'react';
import VoucherCard from 'components/Voucher/VoucherCard';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {showToast} from 'utils/Toast';

import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {Voucher} from 'redux/features/voucher/voucherSlice';

import {
  claimVoucher,
  getUnclaimedVoucherList,
} from 'redux/features/voucher/voucherAPI';
import {useTranslation} from 'react-i18next';

type Value = {id: number; checked: boolean; price: number; quantity?: number};

type Props = {
  item: Voucher;
  onSelect: ({id, checked}: Value) => void;
  defaultValue?: Value;
};

const AirportVoucherRenderItem = ({item, onSelect}: Props) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {formAirportTransfer} = useAppSelector(appDataState);
  const {t} = useTranslation();
  const handleClaimVoucher = async (idVoucher: number) => {
    try {
      await claimVoucher(idVoucher);
      showToast({
        title: t('global.alert.success'),
        message: t('voucher.msg_success'),
        type: 'success',
      });
      // handleRefresh();
      await dispatch(
        getUnclaimedVoucherList({
          is_reedemed: 1,
          order_type: 'airport_transfer',
          start_date: moment(formAirportTransfer?.pickup_date).format(
            'YYYY-MM-DD',
          ),
          end_date: moment(formAirportTransfer?.pickup_date).format(
            'YYYY-MM-DD',
          ),
        }),
      );
    } catch (error) {
      showToast({
        title: t('global.alert.error'),
        message: t('voucher.msg_error'),
        type: 'error',
      });
    }
  };

  return (
    <VoucherCard
      item={item}
      status={item?.is_reedemed ? 'claimed' : 'unclaimed'}
      onPress={() => {
        if (item.is_reedemed) {
          onSelect([item?.id] as any);
          return;
        }
        handleClaimVoucher(item?.id);
      }}
      onPressCard={() => {
        dispatch(toggleBSheet(false));
        navigation.navigate('DetailVoucher', {
          voucherId: item?.id,
          status: item?.is_reedemed ? 'claimed' : 'unclaimed',
          _funcClaim: () => {
            handleClaimVoucher(item?.id);
            // navigation.goBack();
          },
          _funcUse: () => {
            onSelect([item?.id] as any);
            navigation.goBack();
          },
        });
      }}
    />
  );
};

export default AirportVoucherRenderItem;
