import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {
  ic_user_placeholder,
  ic_message_inactive,
  ic_chat_active,
  ic_chat,
  ic_info,
  ic_info3,
} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize} from 'utils/mixins';
import {h1, h4, h5} from 'utils/styles';
import {API_MESSENGER} from '@env';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Room} from 'types/websocket.types';
import {useAppSelector} from 'redux/hooks';
import {showToast} from 'utils/Toast';
import Config from 'react-native-config';
import {useTranslation} from 'react-i18next';
import {setSeconds, setMinutes, setHours, subDays} from 'date-fns';

const DriverInfo = ({
  driverData,
  navigateToChat,
  activeRoom,
  isLoading,
}: {
  driverData: any;
  navigateToChat: () => void;
  activeRoom: Room;
  isLoading?: boolean;
}) => {
  const {t} = useTranslation();
  const bookingDetail = useAppSelector(state => state.myBooking);

  const {selected, isSelectedLoading: bookingDetailLoading} = bookingDetail;
  const order_driver_tasks = selected?.order_driver_tasks?.[0];

  console.log('selected?.order_status22 ', selected?.order_status);
  function getDriverStatus(status: string) {
    console.log('status = ', status);
    switch (status) {
      case 'SEARCHING_FOR_DRIVER':
        return {
          title: t('one_way.SEARCHING_FOR_DRIVER.title'),
          desc: t('one_way.SEARCHING_FOR_DRIVER.desc'),
        };
      case 'ON_PICK_UP_LOCATION':
        return {
          title: t('one_way.TRANSPORTING_PASSENGER.title'),
          desc: t('one_way.TRANSPORTING_PASSENGER.desc'),
        };
      case 'BOOKED': // sudah assign ke driver
        return {
          title: t('one_way.BOOKED.title'),
          desc: t('one_way.BOOKED.desc'),
        };
      case 'REJECTED': // sudah assign ke driver
        return {
          title: '',
          desc: '',
        };
      case 'CANCELLED':
        return {
          title: t('one_way.CANCELLED.title'),
          desc: t('one_way.CANCELLED.desc'),
        };
      case 'CANCEL':
        return {
          title: t('one_way.PAID.title'),
          desc: t('one_way.PAID.desc'),
        };
      case 'TRANSPORTING_PASSENGER':
        return {
          title: t('one_way.TRANSPORTING_PASSENGER.title'),
          desc: t('one_way.TRANSPORTING_PASSENGER.desc'),
        };
      case 'OPEN':
        return {
          title: t('one_way.PAID.title'),
          desc: t('one_way.PAID.desc'),
        };
      case 'CHECKOUT':
        return {
          title: t('one_way.CHECKOUT.title'),
          desc: t('one_way.CHECKOUT.desc'),
        };
      case 'RUNNING':
        return {
          title: t('one_way.TRANSPORTING_PASSENGER.title'),
          desc: t('one_way.TRANSPORTING_PASSENGER.desc'),
        };
      case 'COMPLETED':
        return {
          title: t('one_way.RUNNING.title'),
          desc: t('one_way.RUNNING.desc'),
        };
      case 'FINISH':
        return {
          title: t('one_way.FINISH.title'),
          desc: t('one_way.FINISH.desc'),
        };
      case 'FAILED':
        return {
          title: t('one_way.FAILED.title'),
          desc: t('one_way.FAILED.desc'),
        };

      case 'PENDING':
        return {
          title: t('one_way.PENDING.title'),
          desc: t('one_way.PENDING.desc'),
        };
      case 'PAID':
        return {
          title: t('one_way.PAID.title'),
          desc: t('one_way.PAID.desc'),
        };
    }
    return {
      title: status,
      desc: status,
    };
  }

  const isShowInfoDriver = useMemo(
    (is_chat: boolean) => {
      const start_booking_date = selected?.order_detail?.start_booking_date;
      if (!start_booking_date) return false;
      if (['CANCELLED', 'FAILED'].includes(selected?.order_status!))
        return false;

      const today = new Date();
      const startDate = new Date(`${start_booking_date}T00:00:00`);
      const accessTime = setSeconds(
        setMinutes(setHours(subDays(startDate, 1), 7), 0),
        0,
      );

      return today >= accessTime;
    },
    [selected?.order_detail?.start_booking_date],
  );

  const isShowChat = useMemo(
    (is_chat: boolean) => {
      const start_booking_date = selected?.order_detail?.start_booking_date;
      if (!start_booking_date) return false;
      if (['FINISHED', 'CANCELLED', 'FAILED'].includes(selected?.order_status!))
        return false;

      const today = new Date();
      const startDate = new Date(`${start_booking_date}T00:00:00`);
      const accessTime = setSeconds(
        setMinutes(setHours(subDays(startDate, 1), 7), 0),
        0,
      );

      return today >= accessTime;
    },
    [selected?.order_detail?.start_booking_date],
  );

  return (
    <>
      <View
        style={[
          rowCenter,
          {
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.grey5,
            padding: 20,
            borderRadius: 10,
            marginTop: 24,
          },
        ]}>
        {driverData?.name ? (
          <View style={[rowCenter, {justifyContent: 'space-between'}]}>
            <Image
              source={{
                uri: Config.URL_IMAGE + driverData?.PersonalInfos?.selfie,
              }}
              style={[iconCustomSize(50), {borderRadius: 8}]}
            />
            <View style={{marginHorizontal: 8}}>
              <Text style={[h1]}>{driverData?.name}</Text>
              <View style={{width: WINDOW_WIDTH - 200}}>
                <Text style={[h5]}>
                  {isLoading || !isShowInfoDriver ? '...' : driverData?.phone}
                </Text>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.grey6,
                  marginVertical: 5,
                }}
              />
              {isLoading || !isShowInfoDriver ? (
                <Text>...</Text>
              ) : (
                <Text style={[h4]}>
                  {driverData?.vehicle?.name} ·{' '}
                  {driverData?.vehicle?.license_number}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={[rowCenter, {justifyContent: 'space-between'}]}>
            <Image source={ic_user_placeholder} style={iconCustomSize(50)} />
            <View style={{marginHorizontal: 8}}>
              {/* <Text style={[h1]}>{t('myBooking.find_driver')}</Text> */}
              <Text style={[h1]}>
                {isLoading
                  ? '...'
                  : getDriverStatus(
                      selected?.order_status === 'CANCELLED'
                        ? selected?.order_status || ''
                        : order_driver_tasks?.status ||
                            selected?.order_status ||
                            '',
                    )?.title}
              </Text>
              <View style={{width: WINDOW_WIDTH - 200}}>
                <Text style={[h4]}>
                  {isLoading
                    ? '...'
                    : getDriverStatus(
                        selected?.order_status === 'CANCELLED'
                          ? selected?.order_status || ''
                          : order_driver_tasks?.status ||
                              selected?.order_status ||
                              '',
                      )?.desc}
                </Text>
              </View>
            </View>
          </View>
        )}
        <TouchableOpacity
          disabled={(!activeRoom?.name && !driverData?.id) || !isShowChat}
          onPress={() => {
            navigateToChat();
          }}>
          <Image
            source={
              (!activeRoom?.name && !driverData?.id) || !isShowChat
                ? ic_chat
                : ic_chat_active
            }
            style={iconCustomSize(28)}
          />
        </TouchableOpacity>
      </View>

      {/* {!isShowInfoDriver || driverData?.name ? (
        <View style={styles.chatInfoWrapper}>
          <Image
            source={ic_info3}
            style={[
              iconCustomSize(15),
              {tintColor: theme.colors.orange, marginRight: 10},
            ]}
          />
          <View style={{width: '90%'}}>
            <Text style={[h4, {fontSize: 10}]}>
              {t('myBooking.driver_info_chat')}
            </Text>
          </View>
        </View>
      ) : isAfterOrder ? (
        <View style={styles.chatInfoWrapper}>
          <Image
            source={ic_info3}
            style={[
              iconCustomSize(15),
              {tintColor: theme.colors.orange, marginRight: 10},
            ]}
          />
          <View style={{width: '90%'}}>
            <Text style={[h4, {fontSize: 10}]}>
              {t('myBooking.driver_info_belonging')}
            </Text>
          </View>
        </View>
      ) : (
        <></>
      )} */}

      {(selected?.order_status === 'PENDING' ||
        selected?.order_status === 'PAID' ||
        (selected?.order_status === 'COMPLETED' &&
          Boolean(!driverData?.name))) && (
        <View style={styles.chatInfoWrapper}>
          <Image
            source={ic_info3}
            style={[
              iconCustomSize(15),
              {tintColor: theme.colors.orange, marginRight: 10},
            ]}
          />
          <View style={{width: '90%'}}>
            <Text style={[h4, {fontSize: 10}]}>
              {t('myBooking.driver_info_chat')}
            </Text>
          </View>
        </View>
      )}

      {(selected?.order_status === 'FINISHED' ||
        (selected?.order_status === 'COMPLETED' &&
          Boolean(driverData?.name))) && (
        <View style={styles.chatInfoWrapper}>
          <Image
            source={ic_info3}
            style={[
              iconCustomSize(15),
              {tintColor: theme.colors.orange, marginRight: 10},
            ]}
          />
          <View style={{width: '90%'}}>
            <Text style={[h4, {fontSize: 10}]}>
              {t('myBooking.driver_info_belonging')}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default memo(DriverInfo);

const styles = StyleSheet.create({
  chatInfoWrapper: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: theme.colors.low_orange,
    borderRadius: 5,
    marginTop: 15,
  },
});
