import appBar from 'components/AppBar/AppBar';
import Loading from 'components/Loading/Loading';
import React, {useCallback, useEffect, useMemo} from 'react';
import {colors, h1, h5} from 'utils/styles';
import {enUS, id} from 'date-fns/locale';
import {format} from 'date-fns';
import {getInboxDetail, getInboxes} from 'redux/features/inbox/myInboxAPI';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {inboxState} from 'redux/features/inbox/myInboxSlice';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ic_active_voucher,
  ic_arrow_left_white,
  ic_check,
  ic_claimed_voucher,
  ic_error2,
  ic_warning,
} from 'assets/icons';

type InboxDetailRouteProp = RouteProp<RootStackParamList, 'InboxDetail'>;

const InboxDetailScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<InboxDetailRouteProp>();
  const dispatch = useAppDispatch();
  const {isLoading, detail} = useAppSelector(inboxState);

  const formatDate = useCallback(
    (date: string) => {
      return format(new Date(date), 'd MMMM, yyyy, hh:mm a', {
        locale: i18n.language === 'id-ID' ? id : enUS,
      });
    },
    [i18n.language],
  );

  const getDetail = useCallback(async () => {
    if (route.params.id) {
      await dispatch(getInboxDetail(route.params.id));
    }
  }, [route.params.id]);

  useEffect(() => {
    getDetail();
  }, [route.params.id]);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image source={ic_arrow_left_white} style={styles.backIcon} />
            <Text style={styles.headerText}>{t('myInbox.tabBarLabel')}</Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  const iconMapping: Record<string, any> = useMemo(
    () => ({
      'Pesanan Berhasil Dibuat': ic_check,
      'Order Rejected': ic_error2,
      'Pemberitahuan Pesanan': ic_warning,
      'Voucher Business Affiliate': ic_active_voucher,
      'Voucher berhasil digunakan': ic_claimed_voucher,
      'Verifikasi Ulang': ic_warning,
      'Order Need To Review': ic_warning,
      'Bank data does not match': ic_warning,
      'Pesanan berhasil dibatalkan': ic_check,
      'Pesanan dibatalkan': ic_check,
      'Pesanan Dikonfirmasi': ic_check,
      'Refund Successful': ic_check,
      'Supir sudah jalan': ic_check,
      'Refund Rejected': ic_error2,
    }),
    [],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailContainer}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            {iconMapping[detail?.title] && (
              <Image
                source={iconMapping[detail?.title]}
                style={[iconCustomSize(12), styles.iconStyle]}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{detail?.title}</Text>
              <Text style={styles.subtitle}>
                {detail?.created_at ? formatDate(detail?.created_at) : ''}
              </Text>
            </View>

            <Text style={styles.message}>{detail?.message?.replace(/[\n\t]/g, '') ?? ''}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default InboxDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    flexGrow: 1,
  },
  detailContainer: {
    flexDirection: 'row',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...h1,
    color: colors.black,
    fontSize: 16,
  },
  subtitle: {
    ...h5,
    fontSize: 12,
  },
  message: {
    ...h5,
    fontSize: 14,
    marginBottom: 15,
    marginTop: 20,
  },
  iconContainer: {
    flexBasis: '5%',
    marginTop: 5,
  },
  iconStyle: {
    marginRight: 5,
  },
  contentContainer: {
    flex: 1,
  },
  backIcon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  headerText: {
    ...h1,
    color: 'white',
    marginLeft: 10,
  },
});
