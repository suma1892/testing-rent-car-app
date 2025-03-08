import appBar from 'components/AppBar/AppBar';
import CarCard from 'components/CarCard/CarCard';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import Filters from './components/Filters/Filters';
import hoc from 'components/hoc';
import InputPreview from './components/InputPreview/InputPreview';
import Loading from 'components/Loading/Loading';
import ModalMinOrder from 'components/ModalMinOrder/ModalMinOrder';
import PenaltiesWarningModal from 'components/PenaltiesWarningModal/PenaltiesWarningModal';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';
import {getBrands, getVehicles} from 'redux/features/vehicles/vehiclesAPI';
import {getIsOutsideOperationalHours} from 'utils/functions';
import {getUnclaimedVoucherList} from 'redux/features/voucher/voucherAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white, ic_car_not_available} from 'assets/icons';
import {IVehicles} from 'types/vehicles';
import {rowCenter} from 'utils/mixins';
import {setPage, vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Filter = {
  passanger: number;
  name: string;
  price: number;
  priceSort: 'asc' | 'desc';
  brands: number[];
};

const DailyListCarScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const formDaily = useAppSelector(appDataState).formDaily;
  const vehiclesData = useAppSelector(vehiclesState);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IVehicles>();
  const [form, setForm] = useState<Filter>({
    passanger: 4,
    name: '',
    price: 0,
    priceSort: 'asc',
    brands: [],
  });

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image source={ic_arrow_left_white} style={styles.backIcon} />
            <Text style={[h1, styles.headerText]}>{t('list_car.header')}</Text>
          </TouchableOpacity>
        ),
      }),
    );
    dispatch(setPage(1));
  }, [navigation]);

  const paramsFilter = useMemo(() => {
    const {with_driver, ...rest} = formDaily;
    const filter: any = {
      ...rest,
      passanger: form.passanger,
      support_driver: with_driver,
      price_sort: form.priceSort,
      min_price: 0,
      max_price: form.price,
      page: '1',
      sub_service_id: rest?.facility_id,
    };

    if (form.name) {
      filter['name'] = form.name;
    }

    return filter;
  }, [form, formDaily.with_driver, formDaily?.refresh_data]);

  const brandQueryString = useMemo(() => {
    if (!form.brands.length) return '';

    return form.brands.map(id => `brand=${id}`).join('&');
  }, [form.brands]);

  useEffect(() => {
    if (isFocused) {
      const params = `&${new URLSearchParams(
        paramsFilter as any,
      ).toString()}&${brandQueryString}`;
      dispatch(getVehicles(params));
      dispatch(getBrands());
    }
  }, [paramsFilter, brandQueryString, isFocused, formDaily?.refresh_data]);

  const handleOpenPenaltiesWarningModal = useCallback(
    (item: IVehicles) => {
      showBSheet({
        content: (
          <PenaltiesWarningModal
            onOk={() => {
              handleOpenPenaltiesWarningModal(item);
              navigation.navigate('DetailCar', {vehicle_id: item.id});
              dispatch(
                saveFormDaily({
                  ...formDaily,
                  vehicle_id: item.id,
                  vehicle_category_id: item.category.id,
                }),
              );
              dispatch(
                getUnclaimedVoucherList({
                  is_reedemed: 1,
                  order_type: formDaily.with_driver
                    ? 'with_driver'
                    : 'without_driver',
                  start_date: formDaily.start_booking_date,
                  end_date: formDaily.end_booking_date,
                }),
              );
            }}
            onCancel={() => handleOpenPenaltiesWarningModal(item)}
          />
        ),
        snapPoint: ['60%', '60%'],
      });
    },
    [formDaily],
  );

  const renderItem = useCallback(
    ({item}: {item: IVehicles}) => (
      <CarCard
        item={item}
        containerWidth="100%"
        onPress={() => {
          const condition = !formDaily.with_driver
            ? 'without_driver'
            : 'with_driver';
          const operational = item?.garage_data?.operational?.find(
            x => x?.service === condition,
          );

          const isOutsideOperationalHours = getIsOutsideOperationalHours({
            bookingStartTime: formDaily?.start_booking_time,
            bookingEndTime: formDaily?.end_booking_time,
            garageOpenTime: operational?.start_time!,
            garageCloseTime: operational?.end_time!,
          });

          if (
            !formDaily.with_driver &&
            operational?.outside_operational_status &&
            operational?.service.includes('without_driver') &&
            operational?.outside_operational_fee > 0 &&
            isOutsideOperationalHours
          ) {
            handleOpenPenaltiesWarningModal(item);
            return;
          }

          if (!item?.is_valid_for_order) {
            setSelectedItem(item);
            setModalVisible(true);
            return;
          }
          navigation.navigate('DetailCar', {vehicle_id: item.id});
          dispatch(
            saveFormDaily({
              ...formDaily,
              vehicle_id: item.id,
              vehicle_category_id: item.category.id,
            }),
          );
          dispatch(
            getUnclaimedVoucherList({
              is_reedemed: 1,
              order_type: formDaily.with_driver
                ? 'with_driver'
                : 'without_driver',
              start_date: formDaily.start_booking_date,
              end_date: formDaily.end_booking_date,
            }),
          );
        }}
      />
    ),
    [formDaily],
  );

  const handleRefresh = useCallback(() => {
    setRefresh(true);
    dispatch(setPage(1));
    setRefresh(false);
  }, [dispatch]);

  const [modalVisible, setModalVisible] = useState(false);
  if (vehiclesData.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <InputPreview />
      <Filters
        value={form}
        onSubmit={val => {
          dispatch(setPage(1));
          setForm(prev => ({...prev, ...val}));
        }}
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={
          vehiclesData?.data?.vehicles?.filter(
            data => data?.status !== 'locked',
          ) || []
        }
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshing={refresh}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <DataNotFound
            title={`${t('global.not_yet_available')}`}
            description={`${t('global.car_not_yet_available')}`}
            imageComponent={
              <Image
                source={ic_car_not_available}
                style={styles.notAvailableImage}
                resizeMode="contain"
              />
            }
          />
        }
      />
      {modalVisible && (
        <ModalMinOrder
          day={selectedItem?.minimal_rental_day || 0}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

export default hoc(
  DailyListCarScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: '5%',
    marginTop: 5,
    paddingTop: 5,
    backgroundColor: theme.colors.white,
    flexGrow: 1,
  },
  backIcon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  headerText: {
    color: 'white',
    marginLeft: 10,
  },
  notAvailableImage: {
    width: 270,
    height: 308,
    marginTop: -30,
  },
});
