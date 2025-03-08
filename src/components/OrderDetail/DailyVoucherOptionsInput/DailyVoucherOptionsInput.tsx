import moment from 'moment';
import React, {useEffect, useState} from 'react';
import DailyVoucherOptionsModalContent from './DailyVoucherOptionsModalContent';
import {
  appDataState,
  setSelectedVoucher,
} from 'redux/features/appData/appDataSlice';
import {getClaimedVoucherEffect} from 'redux/effects';
import {h1, h3, h5} from 'utils/styles';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  setErrorVoucher,
  Voucher,
  voucherState,
} from 'redux/features/voucher/voucherSlice';
import {ic_active_voucher, ic_close_rounded} from 'assets/icons';
import {getUnclaimedVoucherList} from 'redux/features/voucher/voucherAPI';

export type SelectedAdditionalRequest = {
  id: number;
  price: number;
  checked: boolean;
  quantity?: number;
};

type Props = {
  onChange: (val: Voucher) => void;
};

const DailyVoucherOptionsInput: React.FC<Props> = ({}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {formDaily, voucher_ids} = useAppSelector(appDataState);
  const voucherData = useAppSelector(voucherState);
  const [claimedVoucher, setClaimedVoucher] = useState<any[]>([]);

  useEffect(() => {
    dispatch(
      getUnclaimedVoucherList({
        is_reedemed: 1,
        order_type: formDaily?.with_driver ? 'with_driver' : 'without_driver',
        start_date: moment(formDaily?.start_booking_date).format('YYYY-MM-DD'),
        end_date: moment(formDaily?.end_booking_date).format('YYYY-MM-DD'),
      }),
    );
    getClaimedVoucher();
  }, [voucher_ids]);

  const getClaimedVoucher = async () => {
    try {
      const res = await getClaimedVoucherEffect({
        is_reedemed: 1,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      });
      setClaimedVoucher(res);
    } catch (error) {}
  };

  const handleAdditionalOptions = () => {
    showBSheet({
      snapPoint: ['75%', '90%'],
      content: <DailyVoucherOptionsModalContent />,
    });
  };

  const getVoucherName = () => {
    if (voucher_ids?.length <= 0 || claimedVoucher?.length <= 0) {
      return;
    }
    let _v: (string | undefined)[] = [];
    voucher_ids?.map(_ => {
      const res = claimedVoucher?.find(x => x?.id === _);
      _v.push(res?.name);
    });

    return _v.join(', ') || '';
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 14}]}>{t('detail_order.voucher')}</Text>
      <TouchableOpacity
        style={[rowCenter, styles.borderBottom]}
        onPress={handleAdditionalOptions}>
        <Image source={ic_active_voucher} style={iconCustomSize(20)} />
        <Text
          style={[
            h5,
            {
              marginLeft: 12,
              fontSize: 13,
              color:
                voucher_ids?.length > 0
                  ? theme.colors.dark
                  : theme.colors.grey3,
            },
          ]}>
          {voucher_ids?.length > 0
            ? getVoucherName()
            : t('detail_order.voucher_placeholder')}
        </Text>
        {voucher_ids?.length > 0 && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
            }}
            onPress={() => {
              dispatch(setSelectedVoucher([]));
              dispatch(setErrorVoucher(''));
            }}>
            <Image
              source={ic_close_rounded}
              style={[iconSize, {tintColor: theme.colors.orange}]}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {voucherData?.error_voucher_message && (
        <Text
          style={[h3, {color: theme.colors.red, fontSize: 11, marginTop: 5}]}>
          {voucherData?.error_voucher_message}
        </Text>
      )}
    </View>
  );
};

export default DailyVoucherOptionsInput;

const styles = StyleSheet.create({
  container: {marginTop: 20, marginBottom: 0},
  borderBottom: {
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 12,
    borderRadius: 5,
    marginTop: 14,
  },
});
