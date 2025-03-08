import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import Config from 'react-native-config';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import RenderHtml from 'react-native-render-html';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';
import {getDetailVoucher} from 'redux/effects';
import {h1, h4, h5} from 'utils/styles';
import {ic_arrow_left_white, ic_voucher_image} from 'assets/icons';
import {RootStackParamList} from 'types/navigator';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  claimVoucher,
  getUnclaimedVoucherList,
} from 'redux/features/voucher/voucherAPI';
import GlobalLoader from 'components/GlobalLoader/GlobalLoader';
import {setErrorVoucher} from 'redux/features/voucher/voucherSlice';
import {format} from 'date-fns';
import i18n from 'assets/lang/i18n';
import {enUS, id, zhCN} from 'date-fns/locale';
import {useTranslation} from 'react-i18next';

interface Voucher {
  airport_transfer: boolean;
  code: string;
  description: string;
  end_date: string; // using string to represent dates in ISO format
  how_to_use: string;
  id: number;
  image: string;
  is_redeemed: boolean; // corrected typo from "is_reedemed"
  name: string;
  quota: number;
  start_date: string; // using string to represent dates in ISO format
  status: string;
  type: string;
  value: number;
  value_type: string;
  with_driver: boolean;
  without_driver: boolean;
  term?: string;
  benefit?: string;
  usage_limitation?: string;
}

type DetailVoucherScreenRouteProp = RouteProp<
  RootStackParamList,
  'DetailVoucher'
>;

const DetailVoucherScreen = () => {
  const route = useRoute<DetailVoucherScreenRouteProp>();
  const dispatch = useAppDispatch();
  const formDaily = useAppSelector(appDataState).formDaily;
  const status = route.params?.status;
  const [detailVoucher, setDetailVoucher] = useState<Voucher>();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [loaderClaim, setLoaderClaim] = useState(false);
  const {t} = useTranslation();
  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('voucher.title')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      _getDetailVoucher();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const _getDetailVoucher = async () => {
    setLoader(true);
    const res = await getDetailVoucher(Number(route?.params?.voucherId));
    setLoader(false);
    setDetailVoucher({...res, is_redeemed: status === 'unclaimed'});
  };

  const handleClaimVoucher = async (idVoucher: number) => {
    try {
      setLoaderClaim(true);
      await claimVoucher(idVoucher);
      showToast({
        title: t('global.alert.success'),
        message: t('voucher.msg_success'),
        type: 'success',
      });
      navigation.goBack();
      await dispatch(
        getUnclaimedVoucherList({
          is_reedemed: 1,
          start_date: moment().format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
        }),
      );
      setLoaderClaim(false);
    } catch (error) {
      setLoaderClaim(false);
      showToast({
        title: t('global.alert.error'),
        message: t('voucher.msg_error'),
        type: 'error',
      });
    }
  };
  if (loader) {
    return <GlobalLoader isShow={true} />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ScrollView>
        <Image
          source={
            detailVoucher?.image
              ? {uri: Config.URL_IMAGE + detailVoucher?.image!}
              : ic_voucher_image
          }
          style={{
            width: WINDOW_WIDTH,
            height: 250,
            resizeMode: 'contain',
          }}
        />
        <View style={{margin: 20}}>
          <Text style={[h1, {fontSize: 14}]}>{detailVoucher?.name}</Text>
          <Text style={[h5, {fontSize: 13, marginTop: 10}]}>
            {t('voucher.created_by')}
          </Text>
          <Text style={[h1, {marginTop: 20, marginBottom: 10, fontSize: 14}]}>
            {t('voucher.desc')}
          </Text>
          <Text style={[h4, {lineHeight: 20}]}>
            {detailVoucher?.description}
          </Text>

          <Text style={[h1, {marginTop: 20, marginBottom: 0, fontSize: 14}]}>
            {t('voucher.benefit')}
          </Text>
          {detailVoucher?.benefit ? (
            <RenderHtml
              contentWidth={WINDOW_WIDTH}
              source={{html: detailVoucher?.benefit}}
            />
          ) : (
            <Text style={[h4]}>-</Text>
          )}

          <Text style={[h1, {marginTop: 20, marginBottom: 10, fontSize: 14}]}>
            {t('voucher.date_limit')}
          </Text>
          {detailVoucher?.start_date && detailVoucher?.end_date && (
            <Text style={[h4, {lineHeight: 20}]}>
              {format(new Date(detailVoucher?.start_date), 'dd MMMM yyyy', {
                locale:
                  i18n.language === 'id-ID'
                    ? id
                    : i18n.language?.includes('cn')
                    ? zhCN
                    : enUS,
              })}{' '}
              {' - '}
              {format(new Date(detailVoucher?.end_date), 'dd MMMM yyyy', {
                locale:
                  i18n.language === 'id-ID'
                    ? id
                    : i18n.language?.includes('cn')
                    ? zhCN
                    : enUS,
              })}
            </Text>
          )}

          <Text style={[h1, {marginTop: 20, fontSize: 14}]}>
            {t('voucher.term')}
          </Text>
          {detailVoucher?.term ? (
            <RenderHtml
              contentWidth={WINDOW_WIDTH}
              source={{html: `<ul>${detailVoucher?.term}</ul>`}}
            />
          ) : (
            <Text style={[h4]}>-</Text>
          )}

          <Text style={[h1, {marginTop: 20, fontSize: 14}]}>
            {t('voucher.how_to_use')}
          </Text>
          {detailVoucher?.how_to_use ? (
            <RenderHtml
              contentWidth={WINDOW_WIDTH}
              source={{html: `<ul>${detailVoucher?.how_to_use}</ul>`}}
            />
          ) : (
            <Text style={[h4]}>-</Text>
          )}

          <Text style={[h1, {marginTop: 20, fontSize: 14}]}>
            {t('voucher.limit')}
          </Text>

          {detailVoucher?.usage_limitation ? (
            <RenderHtml
              contentWidth={WINDOW_WIDTH}
              source={{html: `<ul>${detailVoucher?.usage_limitation}</ul>`}}
            />
          ) : (
            <Text style={[h4]}>-</Text>
          )}

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.grey6,
              marginVertical: 20,
            }}
          />

          <Button
            _theme="white"
            onPress={() => navigation.goBack()}
            title={t('global.button.back')}
            styleWrapper={{
              borderWidth: 1,
              borderColor: theme.colors.navy,
              marginBottom: 10,
            }}
          />

          {detailVoucher?.is_redeemed ? (
            <Button
              _theme="orange"
              onPress={async () => {
                if (route?.params?._funcClaim) {
                  setLoaderClaim(true);
                  await route?.params?._funcClaim();
                  setLoaderClaim(false);
                  setDetailVoucher({
                    ...detailVoucher,
                    is_redeemed: false,
                  });
                  return;
                }
                await handleClaimVoucher(Number(route?.params?.voucherId));
              }}
              title={t('voucher.btn_claim')}
            />
          ) : (
            <Button
              _theme="orange"
              onPress={async () => {
                if (route?.params?._funcUse) {
                  await route?.params?._funcUse();
                  return;
                }
                navigation.navigate('MainTab', {screen: 'Home'} as any);
                dispatch(
                  saveFormDaily({
                    ...formDaily,
                    voucher_ids: [detailVoucher?.id],
                  }),
                );
                dispatch(setErrorVoucher(''));
                showToast({
                  message: t('voucher.attached_voucher'),
                  title: t('global.alert.success'),
                  type: 'success',
                });
              }}
              title={t('voucher.btn_use_voucher')}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailVoucherScreen;
