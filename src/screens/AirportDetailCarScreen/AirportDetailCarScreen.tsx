import appBar from 'components/AppBar/AppBar';
import BottomPriceButtonAction from 'components/AirportDetailCarComponent/BottomPriceButtonAction';
import CarConditions from 'components/AirportDetailCar/CarConditions';
import CarImagePreview from 'components/AirportDetailCarComponent/CarImagePreview';
import CarInfo from 'components/AirportDetailCarComponent/CarInfo';
import CarRentalTermAndConditionSection from 'components/AirportDetailCarComponent/RentalTermAndCondition/CarRentalTermAndConditionSection';
import Checkbox from 'components/Checkbox/Checkbox';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import OtherInfo from 'components/AirportDetailCarComponent/OtherInfo';
import PriceInclude from 'components/AirportDetailCarComponent/PriceInclude';
import React, {FC, useEffect, useState} from 'react';
import {airportVehiclesState} from 'redux/features/airportVehicles/airportVehiclesSlice';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getAirportVehiclesById} from 'redux/features/airportVehicles/airportVehiclesAPI';
import {h1, h4} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
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

type AirportDetailCarScreenRouteProp = RouteProp<
  RootStackParamList,
  'AirportDetailCar'
>;
const AirportDetailCarScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<AirportDetailCarScreenRouteProp>();
  const dispatch = useAppDispatch();
  const airportVehicle = useAppSelector(airportVehiclesState);
  const {formAirportTransfer} = useAppSelector(appDataState);

  const {airportVehicleById, isLoadingVehicle} = airportVehicle;

  const [checkInfo, setCheckInfo] = useState(false);

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
              {t('carDetail.carDetail')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  useEffect(() => {
    if (route.params?.vehicle_id)
      dispatch(
        getAirportVehiclesById({
          id: route.params.vehicle_id,
          pickup_trip: `${formAirportTransfer.pickup_date} ${formAirportTransfer.pickup_time}`,
          pickup_location_id: formAirportTransfer.pickup_location?.id,
          dropoff_location_id: formAirportTransfer.dropoff_location?.id,
          location_id: formAirportTransfer.pickup_location?.id,
        }),
      );
  }, [route.params?.vehicle_id]);

  const random_car = [
    ...new Set([
      ...airportVehicleById?.description?.split(',')?.map(car => car.trim()),
    ]),
  ]
    .flatMap(x => x)
    ?.join(', ');

  if (isLoadingVehicle) {
    return <Loading />;
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView>
        <CarImagePreview />
        <CarInfo />
        <Text style={[h4, {marginLeft: '5%', fontSize: 12}]}>
          {t('carDetail.random_car')} ({random_car})
        </Text>
        <Text style={[h4, styles.warningPrice]}>
          {t('carDetail.warning_price')}
        </Text>
        <CarConditions />
        <PriceInclude />
        <CarRentalTermAndConditionSection />
        {/* <PickupInfo /> */}
        <OtherInfo />
        <Checkbox
          label={t('carDetail.agreeState')}
          onChange={val => setCheckInfo(val)}
          checked={checkInfo}
          customLabelStyle={{marginLeft: 5}}
        />
      </ScrollView>

      <BottomPriceButtonAction disabled={checkInfo} />
    </View>
  );
};

export default hoc(
  AirportDetailCarScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
  carouselTitleContainer: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 20,
    top: 20,
  },
  warningPrice: {
    fontSize: 12,
    color: theme.colors.red,
    fontStyle: 'italic',
    marginHorizontal: 16,
    marginTop: 10,
  },
});
