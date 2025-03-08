import AirportLayout from '../AirportLayout';
import DailyLayout from '../DailyLayout';
import React, {ReactElement, useEffect, useState} from 'react';
import ReuploadIdentityAlert from './ReuploadIdentityAlert';
import {FC} from 'react';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1} from 'utils/styles';
import {ic_daily_car_active, ic_one_way2} from 'assets/icons';
import {iconSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ITopTabs} from 'types/top-tab.types';
import {resetUser, userState} from 'redux/features/user/userSlice';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import OneWayLayout from '../OneWayLayout';

interface IDataTab {
  title: string;
  active_icon: any;
  inactive_icon: any;
  id: ITopTabs;
  comp: ReactElement;
}

const BookingTopNavigation: FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(userState);

  const [activeTab, setActiveTab] = useState<ITopTabs>('Daily');

  const DataTab: IDataTab[] = [
    {
      title: t('Home.daily.title'),
      active_icon: ic_daily_car_active,
      inactive_icon: ic_daily_car_active,
      id: 'Daily',
      comp: <DailyLayout />,
    },
    {
      title: t('Home.airportTransfer.title'),
      active_icon: ic_daily_car_active,
      inactive_icon: ic_daily_car_active,
      id: 'Airport Transfer',
      comp: <AirportLayout />,
    },
    // {
    //   title: t('one_way.title'),
    //   active_icon: ic_one_way2,
    //   inactive_icon: ic_one_way2,
    //   id: 'Tour',
    //   comp: <OneWayLayout />,
    // },
  ];

  const methods = {
    topTabTextStyle: (active: boolean) =>
      active ? styles.activeTabText : styles.inActiveTabText,
    isActiveTab: (text: ITopTabs) => activeTab === text,
  };

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (user.isUpdateSuccess) {
      dispatch(resetUser());
    }
  }, [user.isUpdateSuccess]);

  return (
    <View style={{flex: 1}}>
      <View style={[styles.wrapper, {justifyContent: 'space-between'}]}>
        {DataTab.map((x: IDataTab, i: number) => (
          <TouchableOpacity
            onPress={() => setActiveTab(x.id)}
            key={i}
            style={{
              paddingTop: 10,
              paddingBottom: 5,
              width: WINDOW_WIDTH / 2 - 10,
              alignItems: 'center',
            }}>
            <View style={rowCenter}>
              <Image
                source={
                  methods.isActiveTab(x.id) ? x.active_icon : x.inactive_icon
                }
                style={iconSize}
              />
              <Text
                style={[
                  h1,
                  methods.topTabTextStyle(methods.isActiveTab(x.id)),
                ]}>
                {x.title}
              </Text>
            </View>
            {methods.isActiveTab(x.id) && <View style={styles.lineMenu} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* <View
        style={{
          borderBottomColor: theme.colors.grey6,
          borderBottomWidth: 1,
          marginBottom: 10
        }}
      /> */}

      <ReuploadIdentityAlert />
      {DataTab.find(x => x.id === activeTab)?.comp}
    </View>
  );
};

export default BookingTopNavigation;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -10,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 16,
    // paddingHorizontal: 25,
  },
  lineMenu: {
    borderBottomColor: theme.colors.navy,
    borderBottomWidth: 2.5,
    paddingTop: 15,
    width: '100%',
  },
  activeTabText: {
    color: theme.colors.navy,
    fontWeight: '700',
  },
  inActiveTabText: {
    color: theme.colors.grey2,
    fontWeight: '500',
  },
});
