/* eslint-disable @typescript-eslint/no-shadow */
import appBar from 'components/AppBar/AppBar';
import Clipboard from '@react-native-clipboard/clipboard';
import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getHistoryPoint} from 'redux/effects';
import {getStartRentalDate} from 'utils/functions';
import {h1, h3, h4, h5} from 'utils/styles';
import {ic_arrow_left_white, ic_point, ic_share} from 'assets/icons';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {t} from 'i18next';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalShareReferralCode from 'components/ModalShareReferralCode/ModalShareReferralCode';

interface IHistoryPoint {
  date: string;
  ref: string;
  ref_id: number;
  user_type: string;
  user_id: string;
  user_name: string;
  point: number;
  description: string | null;
  metadata: Record<string, any> | null;
}
interface TransactionsByDate {
  [date: string]: IHistoryPoint[];
}
const HistoryPointScreen = () => {
  const navigation = useNavigation();
  const refferalPoint = useAppSelector(appDataState).refferal_point;
  const userProfile = useAppSelector(appDataState).userProfile;

  const [listHistoryPoint, setListHistoryPoint] = useState<TransactionsByDate>(
    {},
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleHistoryPoint = async () => {
    try {
      const res = await getHistoryPoint();
      const historyPoints: IHistoryPoint[] = res?.data?.reverse() ?? [];

      const uniqueArray = historyPoints.filter(
        (item, index, self) =>
          index === self.findIndex(t => t.date === item.date),
      );

      const _data: {[key: string]: IHistoryPoint[]} = {};

      uniqueArray.forEach(x => {
        _data[x?.date] = historyPoints.filter(y => y.date === x.date);
      });

      setListHistoryPoint(_data);
    } catch (error) {
      showToast({
        message: 'global.alert.error_occurred',
        title: 'global.alert.error',
        type: 'error',
      });
    }
  };

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
              {t('history_point.title')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    handleHistoryPoint();
  }, [navigation]);

  const getDesc = (item: IHistoryPoint) => {
    if (
      item?.ref === 'orders' &&
      item?.user_type === 'customer' &&
      item?.point >= 0
    ) {
      return {
        title: t('history_point.do_transaction'),
        desc: t('history_point.do_transaction_desc'),
      };
    }
    if (
      item?.ref === 'orders' &&
      item?.user_type === 'referrer' &&
      item?.point >= 0
    ) {
      return {
        title: t('history_point.invite_referral'),
        desc: t('history_point.invite_referral_desc'),
      };
    }
    if (
      item?.ref === 'orders' &&
      item?.user_type === 'customer' &&
      item?.point < 0
    ) {
      return {
        title: t('history_point.use_point'),
        desc: t('history_point.use_point_desc'),
      };
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={[rowCenter, styles.cardPoint]}>
        <View>
          <Text style={[h1]}>{t('history_point.my_point')}</Text>
          <View style={[rowCenter, {marginTop: 7}]}>
            <Text style={[h1, styles.textPoint]}>{refferalPoint?.point}</Text>
            <Image source={ic_point} style={{width: 15, height: 15}} />
          </View>
        </View>

        <View style={{alignItems: 'flex-end'}}>
          <Text style={[h1]}>{t('history_point.share_referral')}</Text>
          {userProfile?.refferal && (
            <TouchableOpacity
              style={[rowCenter]}
              onPress={() => {
                setModalVisible(true);
                // Clipboard.setString(
                //   `${Config.APP_URL}/referral/${userProfile?.refferal}`,
                // );
                // showToast({
                //   title: t('global.alert.success'),
                //   message: t('global.alert.copy_referral_code'),
                //   type: 'success',
                // });
              }}>
              <Text style={[h1]}> {userProfile?.refferal}</Text>
              <Image source={ic_share} style={{width: 15, height: 15, marginLeft: 5}} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{paddingHorizontal: 20, flexGrow: 1}}>
        {Object.keys(listHistoryPoint)?.map((x, i) => (
          <View
            style={{
              padding: 10,
              borderBottomColor: theme.colors.grey6,
              borderBottomWidth: 1,
            }}
            key={i}>
            <Text style={[h3, {marginBottom: 10}]}>
              {getStartRentalDate({
                withDay: true,
                startBookingDate: x,
              })}
            </Text>
            {listHistoryPoint[x]?.map((y, iy) => (
              <View
                style={[
                  rowCenter,
                  {
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    alignItems: 'flex-start',
                  },
                ]}
                key={iy + i}>
                <View
                  style={{
                    width: '70%',
                  }}>
                  <Text style={[h4]}>{getDesc(y)?.title}</Text>
                  <Text style={[h5, {fontSize: 11}]}>{getDesc(y)?.desc}</Text>
                </View>

                <View
                  style={[
                    rowCenter,
                    {
                      marginTop: 7,
                      // width: '20%',
                      alignItems: 'flex-end',
                    },
                  ]}>
                  <Text
                    style={[
                      h1,
                      styles.textPoint,
                      {color: y.point >= 0 ? '#E9B522' : 'red', marginRight: 4},
                    ]}>
                    {y?.point}
                  </Text>
                  <Image source={ic_point} style={{width: 15, height: 15}} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <ModalShareReferralCode
        referral={userProfile?.refferal}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default HistoryPointScreen;

const styles = StyleSheet.create({
  textPoint: {color: '#E9B522', marginLeft: 7, fontSize: 12},
  cardPoint: {
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    borderTopColor: theme.colors.navy,
    borderTopWidth: 4,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 20,
    margin: 20,
  },
});
