import AirportLayout from '../AirportLayout';
import OneWayLayout from '../OneWayLayout/OneWayLayout';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import WithDriverForm from '../CarSearchForm/WithDriverForm';
import WithDriverRedirectToWhatsApp from '../CarSearchForm/WithDriverRedirectToWhatsApp';
import WithoutDriverForm from '../CarSearchForm/WithoutDriverForm';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {FC} from 'react';
import {getRentalLocation} from 'redux/features/rentalLocation/rentalLocationAPI';
import {IService} from 'types/rental-location.types';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ic_airport_transfer2,
  ic_airport_transfer2_active,
  ic_one_way,
  ic_with_driver2,
  ic_with_driver2_active,
  ic_without_driver2,
  ic_without_driver2_active,
} from 'assets/icons';
import {
  FONT_SIZE_10,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {
  rentalLocationState,
  setRentalLocationParams,
} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';
import RippleButton from './RippleButton';
import {theme} from 'utils';

type HomeTopNavigationProps = {
  selectedService: IService;
  reset?: boolean;
};

type Ids = 'With Driver' | 'Without Driver' | 'Airport Transfer' | 'One Way';

interface IMenu {
  title: string;
  icon_inactive: any;
  icon_active: any;
  func: () => void;
  id: Ids;
}
const HomeTopNavigation: FC<HomeTopNavigationProps> = ({
  selectedService,
  reset,
}) => {
  const navigation = useNavigation();
  const [selectedMenu, setSelectedMenu] = useState<Ids>('Without Driver');
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {services} = useAppSelector(rentalLocationState);
  const {globalConfig, formDaily} = useSelector(appDataState);
  const [withDriver, setWithDriver] = useState(formDaily.with_driver);
  const {t} = useTranslation();
  const MENU: IMenu[] = [
    {
      icon_inactive: ic_without_driver2,
      icon_active: ic_without_driver2_active,
      title: t('loyalty.without_driver'),
      id: 'Without Driver',
      func: () => {},
    },
    {
      icon_inactive: ic_with_driver2,
      icon_active: ic_with_driver2_active,
      title: t('loyalty.with_driver'),
      id: 'With Driver',
      func: () => {},
    },
    {
      icon_inactive: ic_airport_transfer2,
      icon_active: ic_airport_transfer2_active,
      title: t('loyalty.airport_transfer'),
      id: 'Airport Transfer',
      func: () => {},
    },
    // {
    //   icon: ic_one_way,
    //   title: t('loyalty.one_way'),
    //   id: 'One Way',
    //   func: () => {},
    // },
  ];

  useEffect(() => {
    if (selectedMenu === 'With Driver') {
      const service = services?.find(x => x?.name === 'Sewa Mobil');
      const subService = service?.sub_services?.find(x => x?.name === 'Daily');
      const facility = subService?.facilities?.find(
        x => x?.name === 'With Driver',
      );
      dispatch(
        getRentalLocation({
          service_id: service?.id!,
          sub_service_id: subService?.id!,
          facility_id: facility?.id!,
        }),
      );
      dispatch(
        setRentalLocationParams({
          service_id: service?.id,
          sub_service_id: subService?.id!,
          facility_id: facility?.id,
        }),
      );
    }
    if (selectedMenu === 'Without Driver') {
      const service = services?.find(x => x?.name === 'Sewa Mobil');
      const subService = service?.sub_services?.find(x => x?.name === 'Daily');
      const facility = subService?.facilities?.find(
        x => x?.name === 'Without Driver',
      );
      dispatch(
        getRentalLocation({
          service_id: service?.id!,
          sub_service_id: subService?.id!,
          facility_id: facility?.id!,
        }),
      );
      dispatch(
        setRentalLocationParams({
          service_id: service?.id,
          sub_service_id: subService?.id!,
          facility_id: facility?.id,
        }),
      );
    }
    if (selectedMenu === 'Airport Transfer') {
      const service = services?.find(x => x?.name === 'Sewa Mobil');
      const subService = service?.sub_services?.find(
        x => x?.name === 'Airport Transfer',
      );
      const facility = subService?.facilities?.find(
        x => x?.name === 'With Driver',
      );
      dispatch(
        getRentalLocation({
          service_id: service?.id!,
          sub_service_id: subService?.id!,
          facility_id: facility?.id!,
        }),
      );
      dispatch(
        setRentalLocationParams({
          service_id: service?.id,
          sub_service_id: subService?.id!,
          facility_id: facility?.id,
        }),
      );
    }
    if (selectedMenu === 'One Way') {
      const service = services?.find(x => x?.name === 'Sewa Mobil');
      const subService = service?.sub_services?.find(
        x => x?.name === 'One Way',
      );

      dispatch(
        getRentalLocation({
          service_id: service?.id!,
          sub_service_id: subService?.id!,
          facility_id: 0,
        }),
      );
      dispatch(
        setRentalLocationParams({
          service_id: service?.id,
          sub_service_id: subService?.id!,
          facility_id: 0,
        }),
      );
    }
  }, [dispatch, selectedMenu, services]);

  const rendeItem = useCallback(
    ({item}: {item: IMenu}) => (
      <RippleButton
        color={
          //selectedMenu === item?.id ? theme.colors.navy :
          theme.colors.low_blue
        }
        style={styles.item}
        onPress={() => {
          setSelectedMenu(item?.id);
          item.func();
        }}>
        <>
          <Image
            source={
              selectedMenu === item?.id ? item.icon_active : item.icon_inactive
            }
            style={{height: 40, width: 40}}
          />
          <Text
            style={{
              fontSize: FONT_SIZE_10,
              marginTop: 6,
              fontWeight:
                selectedMenu === item?.id
                  ? FONT_WEIGHT_BOLD
                  : FONT_WEIGHT_REGULAR,
            }}>
            {item.title}
          </Text>
        </>
      </RippleButton>
    ),
    [selectedMenu],
  );

  const withDriverFormConfigValue = useMemo(
    () =>
      globalConfig.find(config => config.key === 'with_driver_form')?.value ||
      false,
    [globalConfig],
  );

  const WithDriverFormComponent = useMemo(
    () =>
      withDriverFormConfigValue ? WithDriverForm : WithDriverRedirectToWhatsApp,
    [withDriverFormConfigValue],
  );

  return (
    <>
      <View style={styles.mainWrapper}>
        <FlatList
          data={MENU}
          horizontal
          renderItem={rendeItem}
          contentContainerStyle={styles.container}
          keyExtractor={(x, i) => `${x}-${i}`}
        />
      </View>
      {selectedMenu === 'With Driver' && (
        <WithDriverFormComponent reset={reset} />
      )}
      {selectedMenu === 'Without Driver' && <WithoutDriverForm reset={reset} />}
      {selectedMenu === 'Airport Transfer' && <AirportLayout reset={reset} />}

      {/* {selectedMenu === 'One Way' && <OneWayLayout />} */}
    </>
  );
};

export default memo(HomeTopNavigation);

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    marginHorizontal: 10,
    paddingVertical: 19,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    marginTop: -50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flex: 1,
  },
  item: {
    alignItems: 'center',
    width: WINDOW_WIDTH / 4,
  },
});
