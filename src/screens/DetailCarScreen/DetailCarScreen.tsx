import AllInCard from 'components/DetailCarComponent/AllInCard';
import appBar from 'components/AppBar/AppBar';
import BottomPriceButtonAction from 'components/DetailCarComponent/BottomPriceButtonAction';
import CarConditions from 'components/DetailCarComponent/CarConditions';
import CarImagePreview from 'components/DetailCarComponent/CarImagePreview';
import CarInfo from 'components/DetailCarComponent/CarInfo';
import CarRentalTermAndConditionSection from 'components/DetailCarComponent/RentalTermAndCondition/CarRentalTermAndConditionSection';
import Checkbox from 'components/Checkbox/Checkbox';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {FC, useEffect, useState} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getVehiclesById} from 'redux/features/vehicles/vehiclesAPI';
import {h1, h4} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'DetailCar'>;
const DetailCarScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProfileScreenRouteProp>();
  const dispatch = useAppDispatch();
  const vehicle = useAppSelector(vehiclesState);
  const formDaily = useAppSelector(appDataState).formDaily;
  const {t} = useTranslation();

  const {isLoadingVehicle} = vehicle;

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
    if (route.params)
      dispatch(
        getVehiclesById({
          id: route.params.vehicle_id,
          support_driver: formDaily.with_driver,
          start_trip: formDaily.start_trip,
          end_trip: formDaily.end_trip,
        }),
      );
  }, []);

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
        <Text style={[h4, styles.warningPrice]}>
          {t('carDetail.warning_price')}
        </Text>
        <AllInCard />
        <View style={styles.lineHorizontal} />
        <CarConditions />
        <CarRentalTermAndConditionSection
          location_id={route?.params?.location_id}
          sub_service_id={route?.params?.sub_service_id}
        />
        {/* {!formDaily?.with_driver && <CarRentalRequirement />} */}
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

export default hoc(DetailCarScreen, theme.colors.navy, false, 'light-content');

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
