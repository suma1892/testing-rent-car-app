import AirportCarCard from 'components/AirportCarCard/AirportCarCard';
import appBar from 'components/AppBar/AppBar';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import Filters from 'components/ListCarComponents/Filters/Filters';
import hoc from 'components/hoc';
import InputPreview from 'components/AirportListCarComponent/InputPreview/InputPreview';
import PenaltiesWarningModal from 'components/PenaltiesWarningModal/PenaltiesWarningModal';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {airportVehiclesState} from 'redux/features/airportVehicles/airportVehiclesSlice';
import {format} from 'date-fns';
import {getAirportVehicles} from 'redux/features/airportVehicles/airportVehiclesAPI';
import {getBrands} from 'redux/features/vehicles/vehiclesAPI';
import {getIsOutsideOperationalHours} from 'utils/functions';
import {getUnclaimedVoucherList} from 'redux/features/voucher/voucherAPI';
import {h1} from 'utils/styles';
import {IAirportVehicles} from 'types/airport-vehicles';
import {ic_arrow_left_white, ic_car_not_available} from 'assets/icons';
import {setPage} from 'redux/features/vehicles/vehiclesSlice';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  appDataState,
  saveFormAirportTransfer,
} from 'redux/features/appData/appDataSlice';
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
  price_sort: 'asc' | 'desc';
  brands: number[];
};

const buildParamsFilter = (form: Filter, formAirportTransfer: any) => ({
  passenger: form.passanger,
  support_driver: true,
  price_sort: form.price_sort,
  min_price: 0,
  max_price: form.price,
  page: '1',
  pickup_trip: `${formAirportTransfer?.pickup_date} ${formAirportTransfer.pickup_time}`,
  pickup_location_id: formAirportTransfer?.pickup_location?.id,
  dropoff_location_id: formAirportTransfer?.dropoff_location?.id,
  location_id: formAirportTransfer?.pickup_location?.location_id,
});

const buildBrandQueryString = (brands: number[]) =>
  brands.length > 0 ? `&${brands.map(id => `brand=${id}`).join('&')}` : '';

const AirportListCarScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {formAirportTransfer, sub_service_type} = useAppSelector(appDataState);
  const airportVehiclesData = useAppSelector(airportVehiclesState);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [form, setForm] = useState<Filter>({
    passanger: 0,
    name: '',
    price: 0,
    price_sort: 'asc',
    brands: [],
  });

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={styles.rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{height: 20, width: 20, marginLeft: 16}}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('list_car.header')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    dispatch(setPage(1));
  }, [navigation]);

  const paramsFilter = useMemo(
    () => buildParamsFilter(form, formAirportTransfer),
    [form, formAirportTransfer],
  );
  const brandQueryString = useMemo(
    () => buildBrandQueryString(form.brands),
    [form.brands],
  );

  const fetchVehiclesData = useCallback(() => {
    if (!isFocused || !formAirportTransfer.pickup_location?.id) return;

    console.log('paramsFilter ', paramsFilter);
    const params = `&${new URLSearchParams(
      paramsFilter as any,
    ).toString()}${brandQueryString}`;
    dispatch(getAirportVehicles(params));
    dispatch(getBrands());
  }, [isFocused, paramsFilter, brandQueryString, formAirportTransfer]);

  useEffect(() => {
    fetchVehiclesData();
  }, [fetchVehiclesData]);

  const handleOpenPenaltiesWarningModal = useCallback(
    (item: IAirportVehicles) => {
      showBSheet({
        content: (
          <PenaltiesWarningModal
            onOk={() => {
              handleOpenPenaltiesWarningModal(item);
              navigation.navigate('AirportDetailCar', {vehicle_id: item.id});
              dispatch(
                saveFormAirportTransfer({
                  ...formAirportTransfer,
                  vehicle_id: item.id,
                  vehicle_category_id: item.vehicle_id,
                  airport_transfer_package_id: item?.id,
                }),
              );
              dispatch(
                getUnclaimedVoucherList({
                  is_reedemed: 1,
                  order_type: 'airport_transfer',
                  start_date: format(
                    new Date(formAirportTransfer?.pickup_date),
                    'yyyy-MM-dd',
                  ),
                  end_date: format(
                    new Date(formAirportTransfer?.pickup_date),
                    'yyyy-MM-dd',
                  ),
                }),
              );
            }}
            onCancel={() => handleOpenPenaltiesWarningModal(item)}
          />
        ),
        snapPoint: ['60%', '60%'],
      });
    },
    [formAirportTransfer],
  );

  const renderItem = useCallback(
    ({item}: {item: IAirportVehicles}) => (
      <AirportCarCard
        item={item}
        containerWidth="100%"
        onPress={() => {
          const condition = 'airport_transfer';
          const operational = item?.garage_data?.operational?.find(
            x => x?.service === condition,
          );
          const isOutsideOperationalHours = getIsOutsideOperationalHours({
            bookingStartTime: formAirportTransfer?.pickup_time,
            bookingEndTime: formAirportTransfer?.pickup_time,
            garageOpenTime: operational!.start_time,
            garageCloseTime: operational!.end_time,
          });

          if (
            operational?.outside_operational_status &&
            operational?.service?.includes('airport_transfer') &&
            operational?.outside_operational_fee > 0 &&
            isOutsideOperationalHours
          ) {
            handleOpenPenaltiesWarningModal(item);
            return;
          }

          navigation.navigate('AirportDetailCar', {vehicle_id: item.id});
          dispatch(
            saveFormAirportTransfer({
              ...formAirportTransfer,
              vehicle_id: item.id,
              vehicle_category_id: item.vehicle_id,
              airport_transfer_package_id: item?.id,
            }),
          );
          dispatch(
            getUnclaimedVoucherList({
              is_reedemed: 1,
              order_type: 'airport_transfer',
              start_date: format(
                new Date(formAirportTransfer?.pickup_date),
                'yyyy-MM-dd',
              ),
              end_date: format(
                new Date(formAirportTransfer?.pickup_date),
                'yyyy-MM-dd',
              ),
            }),
          );
        }}
      />
    ),
    [formAirportTransfer],
  );

  const handleRefresh = () => {
    setRefresh(true);
    dispatch(setPage(1));
    setRefresh(false);
  };

  return (
    <View style={styles.container}>
      <InputPreview />
      <Filters
        value={{
          name: form.name,
          price: form.price,
          passanger: form.passanger,
          priceSort: form.price_sort,
          brands: form.brands,
        }}
        onSubmit={val => {
          dispatch(setPage(1));
          setForm(prev => ({
            ...prev,
            name: val.name,
            passanger: val.passanger,
            price: val.price,
            price_sort: val.priceSort,
            brands: val.brands,
          }));
        }}
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={airportVehiclesData?.data?.packages || []}
        renderItem={renderItem}
        keyExtractor={item => `car_${item.id}`}
        refreshing={refresh}
        onRefresh={handleRefresh}
        initialNumToRender={10}
        ListEmptyComponent={
          <DataNotFound
            title={`${t('global.not_yet_available')}`}
            description={`${t('global.car_not_yet_available')}`}
            imageComponent={
              <Image source={ic_car_not_available} style={styles.imageStyle} />
            }
          />
        }
      />
    </View>
  );
};

export default hoc(
  AirportListCarScreen,
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 270,
    height: 308,
    marginTop: -30,
    resizeMode: 'contain',
  },
});
