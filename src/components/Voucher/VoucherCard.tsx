import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ic_voucher_image, ic_empty_voucher} from 'assets/icons';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import {theme} from 'utils';
import {h1, h5, h4} from 'utils/styles';
import {useNavigation} from '@react-navigation/native';
import {Voucher} from 'redux/features/voucher/voucherSlice';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {t} from 'i18next';
import {useAppDispatch} from 'redux/hooks';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';

const VoucherCard = ({
  item,
  status,
  onPress,
  onPressCard,
}: {
  item: Voucher;
  status: 'claimed' | 'unclaimed';
  onPress: () => void;
  onPressCard?: () => void;
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  return (
    <TouchableOpacity
      onPress={
        !onPressCard
          ? () => {
              navigation.navigate('DetailVoucher', {
                voucherId: item?.id,
                status: status,
              });
              dispatch(toggleBSheet(false));
            }
          : onPressCard
      }
      style={{
        marginBottom: 20,
      }}>
      <FastImage
        source={
          item?.image
            ? {
                uri: Config.URL_IMAGE + item?.image,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }
            : ic_voucher_image
        }
        fallback={ic_empty_voucher}
        style={styles.cardImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.cardFooter}>
        <View style={[rowCenter, {justifyContent: 'space-between'}]}>
          <View style={{width: WINDOW_WIDTH / 2}}>
            <Text style={[h1, {fontSize: 14}]}>{item?.name}</Text>
          </View>
          <TouchableOpacity onPress={onPress} style={styles.btnUse}>
            <Text style={[h4, {color: '#fff', fontSize: 12}]}>
              {status === 'claimed'
                ? t('voucher.btn_use_voucher')
                : t('voucher.btn_claim')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[h5, styles.textDesc]} numberOfLines={3}>
          {item?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default VoucherCard;

const styles = StyleSheet.create({
  cardFooter: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // alignItems: 'flex-end',
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
    // padding: 5,
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderRadius: 7,
    width: '30%',
    // marginTop: 10,
  },
  textDesc: {
    color: theme.colors.grey2,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 18,
  },
});
