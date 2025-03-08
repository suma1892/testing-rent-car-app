import React, {useCallback, useMemo} from 'react';
import {colors, h1, h5} from 'utils/styles';
import {enUS, id} from 'date-fns/locale';
import {format} from 'date-fns';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {t} from 'i18next';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  ic_active_voucher,
  ic_check,
  ic_claimed_voucher,
  ic_error2,
  ic_rounded_close,
  ic_warning,
} from 'assets/icons';
import {useAppDispatch} from 'redux/hooks';
import {getInboxDetail} from 'redux/features/inbox/myInboxAPI';

type InboxData = {
  created_at: string;
  custom_data: {
    email: string;
    url?: string;
    text?: string;
    fullname?: string;
    invoice?: string;
    to?: string;
  };
  id: number;
  is_read: boolean;
  message: string;
  title: string;
};

type Props = {
  item: InboxData;
};

const MyInboxCard: React.FC<Props> = React.memo(({item}) => {
  const {i18n} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const formatDate = useCallback(
    (date: string) =>
      format(new Date(date), 'd MMMM, yyyy, hh:mm a', {
        locale: i18n.language === 'id-ID' ? id : enUS,
      }),
    [i18n.language],
  );

  const iconMapping: any = useMemo(
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

  const handleNavigation = useCallback(() => {
    const {
      title,
      custom_data: {url},
      id,
    } = item;

    dispatch(getInboxDetail(id));
    if (title === 'Pemberitahuan Pesanan') {
      const transactionKey = url?.split('key')?.[1] || '';
      navigation.navigate('ApprovalUpdateOrder', {transactionKey});
    } else if (
      [
        'Verifikasi Ulang',
        'Order Need To Review',
        'Order Membutuhkan Review SIM atau KTP',
      ].includes(title)
    ) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('InboxDetail', {id});
    }
  }, [dispatch, item, navigation]);

  return (
    <>
      <TouchableOpacity
        onPress={handleNavigation}
        style={[
          styles.cardContainer,
          {backgroundColor: item.is_read ? '#fff' : '#F1FAFF'},
        ]}>
        <View style={styles.iconContainer}>
          {iconMapping[item.title] && (
            <Image
              source={iconMapping[item.title]}
              style={[iconCustomSize(12), styles.iconStyle]}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.dateText}>
              {item.created_at ? formatDate(item.created_at) : ''}
            </Text>
          </View>
          <Text style={styles.messageText} numberOfLines={3}>
            {item?.message?.replace(/[\n\t]/g, '')}
          </Text>
          <Text style={styles.readMoreText}>{t('myInbox.read_more')}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.lineBreak} />
    </>
  );
});

export default MyInboxCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: '5%',
    flexDirection: 'row',
  },
  iconContainer: {
    flexBasis: '5%',
  },
  iconStyle: {
    marginRight: 5,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    ...h1,
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    width: '60%',
  },
  dateText: {
    ...h5,
    fontSize: 10,
    lineHeight: 12,
  },
  messageText: {
    ...h5,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 0,
    marginTop: 10,
  },
  readMoreText: {
    ...h5,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 15,
  },
  lineBreak: {
    borderBottomColor: 'rgba(173, 162, 162, 0.5)',
    borderBottomWidth: 1,
  },
});
