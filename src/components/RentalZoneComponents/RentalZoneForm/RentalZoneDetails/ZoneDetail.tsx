import AdditionalFeeModalContent from './AdditionalFeeModalContent';
import React, {FC, memo, useCallback, useMemo} from 'react';
import {colors, h1, h4, h5} from 'utils/styles';
import {ic_info_blue} from 'assets/icons';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  CostLabelProps,
  ZoneDetailProps,
} from 'components/DetailCarComponent/detailCarComponent.interface';

const CostLabel: FC<CostLabelProps> = memo(({free, data}) => {
  const {t} = useTranslation();

  const handleOpenModal = useCallback(() => {
    showBSheet({
      snapPoint: ['40%', '40%'],
      content: (
        <AdditionalFeeModalContent
          data={data?.category}
          name={data?.name ?? ''}
        />
      ),
    });
  }, [data?.category, data?.name]);

  return free ? (
    <View style={styles.freeWrapper}>
      <Text style={styles.freeLabel}>{t('detail_order.formDetail.free')}</Text>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.buttonAdditionalFee}
      onPress={handleOpenModal}>
      <Image source={ic_info_blue} style={iconCustomSize(12)} />
      <Text style={styles.additionalCostLabel}>
        {t('detail_order.rentalZone.additionalFee')}
      </Text>
    </TouchableOpacity>
  );
});

const ZoneDetail: FC<ZoneDetailProps> = ({label, pinpoinImage, data, free}) => {
  const markedList = useMemo(() => {
    return (
      data?.list
        ?.filter(item => item?.name?.includes('Zona'))
        ?.map(item => item?.name)
        ?.join(', ') ?? ''
    );
  }, [data?.list]);

  const finalList = useMemo(() => {
    return (
      data?.list
        ?.filter(item => !item?.name?.includes('Zona'))
        ?.map(item => item?.name)
        ?.join(', ') ?? ''
    );
  }, [data?.list]);

  return (
    <View style={styles.container}>
      {pinpoinImage}
      <View style={styles.detailsWrapper}>
        <View style={rowCenter}>
          <Text style={h1}>{label}</Text>
          <CostLabel free={free} data={data} />
        </View>
        <View style={styles.finalListWrapper}>
          <Text style={[h4, styles.finalListText]}>
            {!!markedList && (
              <Text style={[h4, styles.finalListText]}>
                {markedList} {finalList ? '+' : ''}{' '}
              </Text>
            )}
            {finalList}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(ZoneDetail);

const styles = StyleSheet.create({
  container: {
    ...rowCenter,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  detailsWrapper: {
    marginLeft: 12,
  },
  finalListWrapper: {
    flexDirection: 'row',
    width: WINDOW_WIDTH / 1.15,
  },
  finalListText: {
    lineHeight: 24,
  },
  freeWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 20,
    borderColor: theme.colors.navy,
    borderWidth: 1,
    marginLeft: 10,
  },
  freeLabel: {
    ...h5,
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  additionalCostLabel: {
    ...h5,
    marginLeft: 5,
    color: theme.colors.blue,
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  buttonAdditionalFee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  zone2Text: {
    color: colors.black,
    fontWeight: 'bold',
  },
});
