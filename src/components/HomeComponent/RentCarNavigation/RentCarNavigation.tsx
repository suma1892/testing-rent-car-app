/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import AirportLayout from '../AirportLayout';
import DailyLayout from '../DailyLayout';
import TourLayout from '../TourLayout';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1} from 'utils/styles';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ITopTabs} from 'types/top-tab.types';
import {memo, ReactElement, useEffect, useMemo, useState} from 'react';
import {SubService} from 'types/rental-location.types';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  ic_daily_car_active,
  ic_daily_driver_airport,
  ic_daily_driver_tour,
} from 'assets/icons';
import {
  rentalLocationState,
  setRentalLocationParams,
} from 'redux/features/rentalLocation/rentalLocationSlice';

type IDataTab = {
  title: string;
  active_icon: any;
  inactive_icon: any;
  id: number;
  comp: ReactElement;
  key: ITopTabs;
};

interface IProps {
  reset?: boolean;
  subServices?: SubService[];
}

const RentCarNavigation: React.FC<IProps> = ({reset = true, subServices}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {sub_service_type} = useAppSelector(appDataState);
  const {services} = useAppSelector(rentalLocationState);
  const [activeTab, setActiveTab] = useState<ITopTabs>('Daily');

  const DataTab: IDataTab[] = [
    {
      title: t('Home.daily.title'),
      active_icon: ic_daily_car_active,
      inactive_icon: ic_daily_car_active,
      id: 1,
      comp: (
        <DailyLayout
          reset={reset}
          // facilities={services?.[0]?.sub_services?.[0]?.facilities}
          facilities={
            services?.find(x => x?.name === 'Sewa Mobil')?.sub_services?.[0]
              ?.facilities
          }
        />
      ),
      key: 'Daily',
    },
    {
      title: t('Home.airportTransfer.title'),
      active_icon: ic_daily_driver_airport,
      inactive_icon: ic_daily_driver_airport,
      id: 2,
      comp: <AirportLayout reset={reset} />,
      key: 'Airport Transfer',
    },
    {
      title: t('Home.tour.title'),
      active_icon: ic_daily_driver_tour,
      inactive_icon: ic_daily_driver_tour,
      id: 3,
      comp: <TourLayout />,
      key: 'Tour',
    },
  ];

  const finalServices: any = useMemo(() => {
    if (subServices?.length) {
      return subServices?.map(service => {
        const selectedTab = DataTab?.find(tab => tab?.key === service?.name);
        return {
          ...service,
          ...selectedTab,
          sub_service_id: service?.id,
        };
      });
    }

    return DataTab;
  }, [subServices?.length, t]);

  const methods = {
    topTabTextStyle: (active: boolean) =>
      active ? styles.activeTabText : styles.inActiveTabText,
    isActiveTab: (key: string) => activeTab === key,
  };

  useEffect(() => {
    if (sub_service_type) {
      setActiveTab(sub_service_type);
    }
  }, [sub_service_type]);

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper]}>
        {finalServices
          ?.filter((x: any) => x?.comp)
          ?.map((x: any, i: number) => (
            <TouchableOpacity
              onPress={() => {
                const facId =
                  x?.facilities?.length > 0 &&
                  x?.facilities?.find(
                    (x: {name: string}) => x?.name === 'Without Driver',
                  )?.id;
                setActiveTab(x.key);
                dispatch(
                  setRentalLocationParams({
                    sub_service_id: x?.sub_service_id,
                    facility_id: facId,
                  }),
                );
              }}
              // style={{backgroundColor: 'green'}}
              key={i}>
              <View style={rowCenter}>
                <Image
                  source={
                    methods.isActiveTab(x.key) ? x.active_icon : x.inactive_icon
                  }
                  style={iconSize}
                />
                <Text
                  style={[
                    h1,
                    methods.topTabTextStyle(methods.isActiveTab(x.key)),
                  ]}>
                  {x.title}
                </Text>
              </View>
              {methods.isActiveTab(x.key) && <View style={styles.lineMenu} />}
            </TouchableOpacity>
          ))}
      </View>

      {DataTab.find(x => x.key === activeTab)?.comp}
    </View>
  );
};

export default memo(RentCarNavigation);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -10,
    backgroundColor: 'white',
    padding: 16,
    paddingHorizontal: 25,
  },
  lineMenu: {
    borderBottomColor: theme.colors.navy,
    borderBottomWidth: 2.5,
    marginTop: 5,
  },
  activeTabText: {
    color: theme.colors.navy,
    fontWeight: '700',
  },
  inActiveTabText: {
    color: theme.colors.navy,
    fontWeight: '500',
  },
});
