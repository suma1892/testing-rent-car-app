import DataNotFound from 'components/DataNotFound/DataNotFound';
import React from 'react';
import DailyVoucherRenderItem from './DailyVoucherRenderItem';
import {setSelectedVoucher} from 'redux/features/appData/appDataSlice';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1} from 'utils/styles';
import {ic_empty_voucher} from 'assets/icons';
import {iconCustomSize, WINDOW_HEIGHT} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {Voucher, voucherState} from 'redux/features/voucher/voucherSlice';

type Props = {};

const DailyVoucherOptionsModalContent: React.FC<Props> = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const voucherData = useAppSelector(voucherState);

  const renderItem = ({item}: {item: Voucher}) => {
    return (
      <DailyVoucherRenderItem
        item={item}
        onSelect={val => {
          dispatch(setSelectedVoucher(val));
          dispatch(toggleBSheet(false));
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 18}]}>{t('detail_order.my_voucher')}</Text>

      <View
        style={{
          flex: 1,
          width: '100%',
          marginTop: 30,
        }}>
        <BottomSheetFlatList
          data={voucherData?.data || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <View style={{marginBottom: 20}} />}
          ListEmptyComponent={
            <DataNotFound
              imageComponent={
                <Image
                  source={ic_empty_voucher}
                  style={[iconCustomSize(220), {marginBottom: 30}]}
                  resizeMode="contain"
                />
              }
              description={t('voucher.not_found_title') as any}
              title=""
            />
          }
        />
      </View>
    </View>
  );
};

export default DailyVoucherOptionsModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
  },
  listContainer: {width: '100%', height: WINDOW_HEIGHT / 1.5, marginTop: 20},
});
