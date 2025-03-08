import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  ic_arrow_left_white,
  ic_check,
  ic_close,
  ic_empty_image,
  ic_error2,
  ic_notif_red,
} from 'assets/icons';
import appBar from 'components/AppBar/AppBar';
import i18next from 'i18next';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {h1, h4} from 'utils/styles';
import {theme} from 'utils';
import {FONT_SIZE_14} from 'utils/typography';
import {currencyFormat} from 'utils/currencyFormat';
import {RootStackParamList} from 'types/navigator';
import {useAppSelector} from 'redux/hooks';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {getRefundOrderHistory} from 'redux/effects';
import {matrixTransform} from 'react-native-svg/lib/typescript/elements/Shape';
import {RefundOrder, RefundStatus} from 'types/refund.types';
import ModalImagePreview from 'screens/ChatRoomScreen/component/ModalImagePreview';
import Config from 'react-native-config';
import Button from 'components/Button';
import ModalFormBank from './ModalFormBank';
import {useTranslation} from 'react-i18next';
import ModalCancelInfo from './ModalCancelInfo';
import Timeline from 'react-native-timeline-flatlist';

type ScreenRouteProp = RouteProp<RootStackParamList, 'RefundProcess'>;

const statusData = [
  {id: 1, status: 'Created', date: 'Senin 06 Jan 09:00:00', completed: true},
  {
    id: 2,
    status: 'Processed',
    date: 'Selasa 07 Jan 09:00:00',
    completed: false,
  },
  {id: 3, status: 'Transfered', date: '', completed: false},
];

const STATUS_ORDER = ['CREATED', 'PROCESSED', 'TRANSFERED'];

const mapRefundHistory = (apiHistory: any[]) => {
  const statusMap = {
    CREATED: 'Created',
    PROCESSED: 'Processed',
    REQUEST_CHANGE: 'Processed',
    TRANSFERED: 'Transfered',
    REJECTED: 'Rejected',
  };

  let STATUS_ORDER = ['CREATED', 'PROCESSED', 'TRANSFERED'];

  const hasRejected = apiHistory.some(item => item.status === 'REJECTED');
  if (hasRejected) {
    STATUS_ORDER = ['CREATED', 'PROCESSED', 'REJECTED'];
  }

  const fullHistory = STATUS_ORDER.map((status, index) => {
    const found = apiHistory.find(
      item =>
        item.status === status ||
        (status === 'PROCESSED' && item.status === 'REQUEST_CHANGE'),
    );

    return {
      title: statusMap[status],
      description: found?.created_at
        ? new Date(found.created_at).toLocaleString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : '',
      circleColor: found
        ? status === 'REJECTED'
          ? 'white'
          : theme.colors.green
        : theme.colors.grey6,
      lineColor: found ? theme.colors.green : theme.colors.grey6,
      icon: found ? (status === 'REJECTED' ? ic_error2 : ic_check) : null,
    };
  });

  return fullHistory;
};

const RefundProcessScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const accountBank = useAppSelector(accountBankState);
  const [statusList, setStatusList] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getHistory();
  };

  const route = useRoute<ScreenRouteProp>();
  const {item} = route?.params;
  const [dataHistory, setDataHistory] = useState<RefundOrder>();

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image source={ic_arrow_left_white} style={styles.backIcon} />
            <Text style={[h1, styles.headerText]}>
              {t('myBooking.refund_process.refund_process')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  useEffect(() => {
    getHistory();

    return () => {};
  }, [item, item?.transaction_key]);

  const getHistory = async () => {
    try {
      setRefreshing(true);
      const res = await getRefundOrderHistory(item?.transaction_key);

      console.log('res = ', JSON.stringify(res?.data));
      setDataHistory(res?.data?.[0]);
      const dataList: any[] = mapRefundHistory(
        res?.data?.[0]?.refund_order_histories,
      );

      console.log('dataList ', dataList);
      setStatusList(dataList as any);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const colorStatus = (status: RefundStatus) => {
    if (status === 'CREATED') {
      return theme.colors.orange;
    }
    if (status === 'PROCESSED') {
      return theme.colors.orange;
    }
    if (status === 'TRANSFERED') {
      return theme.colors.green;
    }
    if (status === 'REJECTED') {
      return theme.colors.red;
    }
    return theme.colors.grey4;
  };

  const closeFullScreen = () => {
    setIsModalVisible(false);
  };

  const titleStatus = (status: RefundStatus) => {
    if (status === 'PROCESSED') {
      return {
        title: t('myBooking.refund_process.info_process_title'),
        desc: t('myBooking.refund_process.info_process_desc', {
          order_key: item?.order_key,
        }),
      };
    }
    if (status === 'REJECTED') {
      return {
        title: t('myBooking.refund_process.info_rejected_title'),
        desc: t('myBooking.refund_process.info_rejected_desc', {
          order_key: item?.order_key,
        }),
      };
    }
    if (status === 'REQUEST_CHANGE') {
      return {
        title: t('myBooking.refund_process.info_process_title'),
        desc: t('myBooking.refund_process.info_process_desc', {
          order_key: item?.order_key,
        }),
      };
    }
    if (status === 'CREATED') {
      return {
        title: t('myBooking.refund_process.info_process_title'),
        desc: t('myBooking.refund_process.info_process_desc', {
          order_key: item?.order_key,
        }),
      };
    }
    if (status === 'TRANSFERED') {
      return {
        title: t('myBooking.refund_process.info_success_title'),
        desc: t('myBooking.refund_process.info_success_desc', {
          order_key: item?.order_key,
        }),
      };
    }
  };

  const bgStatus = (status: RefundStatus) => {
    if (status === 'PROCESSED') {
      return theme.colors.low_orange;
    }
    if (status === 'REJECTED') {
      return theme.colors.low_red;
    }
    if (status === 'REQUEST_CHANGE') {
      return theme.colors.low_orange;
    }
    if (status === 'CREATED') {
      return theme.colors.low_orange;
    }
    if (status === 'TRANSFERED') {
      return theme.colors.low_green;
    }
    return theme.colors.grey6;
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.white, padding: 16}}>
      <ScrollView
        nestedScrollEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            backgroundColor: bgStatus(dataHistory?.status!),
            padding: 20,
            borderRadius: 6,
          }}>
          <Text style={[h1, {fontSize: FONT_SIZE_14, marginBottom: 10}]}>
            {titleStatus(dataHistory?.status!)?.title}
          </Text>
          <View style={[rowCenter]}>
            {dataHistory?.status! !== 'REJECTED' ? (
              <Text style={[h4, {lineHeight: 22}]}>
                {titleStatus(dataHistory?.status!)?.desc}
              </Text>
            ) : (
              <ModalCancelInfo
                reason={dataHistory?.rejected_reason || ''}
                desc={titleStatus(dataHistory?.status!)?.desc!}
                order_key={item?.order_key}
              />
            )}
          </View>
        </View>

        <Text style={[h1, {marginBottom: 8, marginTop: 30}]}>
          {t('myBooking.refund_process.req_sub')}
        </Text>
        <Text style={[h4]}>No. ID : {item?.order_key}</Text>

        <View
          style={[rowCenter, {marginTop: 18, justifyContent: 'space-between'}]}>
          <View style={{width: WINDOW_WIDTH / 2}}>
            <Text style={[h4, {marginBottom: 8}]}>
              {t('myBooking.refund_process.name')}
            </Text>
            <Text style={[h1]}>{dataHistory?.customer_bank_account_name}</Text>
          </View>

          <View style={{width: WINDOW_WIDTH / 2}}>
            <Text style={[h4, {marginBottom: 8}]}>
              {t('myBooking.refund_process.status')}
            </Text>
            <Text
              style={[
                h1,
                {
                  color: colorStatus(
                    dataHistory?.status === 'REQUEST_CHANGE'
                      ? 'PROCESSED'
                      : dataHistory?.status!,
                  ),
                },
              ]}>
              {dataHistory?.status === 'REQUEST_CHANGE'
                ? 'PROCESSED'
                : dataHistory?.status?.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        <View
          style={[rowCenter, {marginTop: 18, justifyContent: 'space-between'}]}>
          <View style={{width: WINDOW_WIDTH / 2}}>
            <Text style={[h4, {marginBottom: 8}]}>
              {t('myBooking.refund_process.bank_name')}
            </Text>
            <Text style={[h1]}>{dataHistory?.customer_bank_name}</Text>
          </View>

          <View style={{width: WINDOW_WIDTH / 2}}>
            <Text style={[h4, {marginBottom: 8}]}>
              {t('detail_order.account_number')}
            </Text>
            <Text style={[h1]}>{dataHistory?.customer_bank_number}</Text>
          </View>
        </View>

        <View
          style={[rowCenter, {marginTop: 18, justifyContent: 'space-between'}]}>
          <View style={{width: WINDOW_WIDTH / 2}}>
            <Text style={[h4, {marginBottom: 8}]}>
              {t('myBooking.refund_process.amount')}
            </Text>
            <Text style={[h1]}>
              {currencyFormat(
                dataHistory?.refund_amount!,
                dataHistory?.currency,
              )}
            </Text>
          </View>
        </View>

        {Boolean(dataHistory?.proof_of_transfer_refund) && (
          <View
            style={[
              rowCenter,
              {
                justifyContent: 'space-between',
                marginTop: 20,
                borderWidth: 1,
                borderColor: theme.colors.grey5,
                borderRadius: 5,
                padding: 12,
              },
            ]}>
            <View style={rowCenter}>
              <Image source={ic_empty_image} style={iconCustomSize(24)} />
              <Text style={[h4, {marginLeft: 10}]}>
                {t('myBooking.refund_process.proof_of_payment')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Text style={[h1, {color: theme.colors.navy}]}>
                {t('myBooking.refund_process.view')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey5,
            marginVertical: 20,
          }}
        />

        <Text style={[h1, {marginBottom: 20}]}>
          {t('myBooking.refund_process.refund_status')}
        </Text>

        {/* <FlatList
          data={statusList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <StatusItem item={item} isLast={index === statusData.length - 1} />
          )}
        /> */}

        {/* <FlatList
          data={statusList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <StatusItem item={item} isLast={index === statusData.length - 1} />
          )}
        /> */}
        <Timeline
          data={statusList}
          innerCircle={'icon'}
          renderDetail={(rowData, sectionID, rowID) => {
            let title = <Text style={[h1]}>{rowData.title}</Text>;
            var desc = <Text style={[h4]}>{rowData.description}</Text>;
            return (
              <View style={{flex: 1}}>
                {title}
                {desc}
              </View>
            );
          }}
          style={{marginLeft: -(WINDOW_WIDTH / 8), flex: 1}}
        />
        <ModalFormBank
          status={dataHistory?.status!}
          id={dataHistory?.id!}
          onRefresh={onRefresh}
        />
      </ScrollView>
      <ModalImagePreview
        closeFullScreen={closeFullScreen}
        isModalVisible={isModalVisible}
        selectedImage={
          Config.URL_IMAGE + dataHistory?.proof_of_transfer_refund!
        }
      />
    </View>
  );
};

export default RefundProcessScreen;

const data = [
  {
    title: 'Created',
    description: 'Thursday 20 February 13:48:53',
    icon: ic_notif_red,
  },
  {title: 'Processed', icon: require('../../assets/icons/ic_add_notes.png')},
  {title: 'Transfered', icon: ic_notif_red},
];
const styles = StyleSheet.create({
  backIcon: {height: 20, width: 20, marginLeft: 16},
  headerText: {color: 'white', marginLeft: 10},

  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  circleRejected: {
    backgroundColor: 'red',
    borderColor: 'darkred',
  },
  lineRejected: {
    backgroundColor: 'red',
  },
  textRejected: {
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
  },
  circleInactive: {
    backgroundColor: 'lightgray',
  },
  line: {
    width: 2,
    height: 40,
  },
  lineActive: {
    backgroundColor: theme.colors.green,
  },
  lineInactive: {
    backgroundColor: 'lightgray',
  },
  textContainer: {
    flex: 1,
  },
  status: {
    ...h4,
  },
  date: {
    ...h4,
    fontSize: 10,
    color: theme.colors.grey4,
  },
});
