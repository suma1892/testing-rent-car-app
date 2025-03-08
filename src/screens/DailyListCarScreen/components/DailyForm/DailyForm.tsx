import DriverSelection from './DriverSelection';
import WithDriverForm from './WithDriverForm';
import WithDriverRedirectToWhatsApp from './WithDriverRedirectToWhatsApp';
import WithoutDriverForm from './WithoutDriverForm';
import {Facility} from 'types/rental-location.types';
import {getRentalLocation} from 'redux/features/rentalLocation/rentalLocationAPI';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';

type DailyLayoutProps = {
  facilities?: Facility[];
};

const DailyForm: FC<DailyLayoutProps> = ({facilities}) => {
  const dispatch = useAppDispatch();
  const {globalConfig, formDaily} = useSelector(appDataState);
  const {rentalLocationParams} = useAppSelector(rentalLocationState);

  const [withDriver, setWithDriver] = useState(formDaily.with_driver);

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

  useEffect(() => {
    setWithDriver(formDaily.with_driver);
  }, [formDaily.with_driver]);

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(
  //       getRentalLocation({
  //         service_id: rentalLocationParams.service_id,
  //         sub_service_id: rentalLocationParams.sub_service_id,
  //         facility_id: rentalLocationParams.facility_id,
  //       }),
  //     );
  //   }, [
  //     dispatch,
  //     rentalLocationParams.service_id,
  //     rentalLocationParams.sub_service_id,
  //     rentalLocationParams.facility_id,
  //   ]),
  // );

  return (
    <View style={{flex: 1, marginHorizontal: 16, marginTop: 16}}>
      <DriverSelection
        onSelect={setWithDriver}
        selected={withDriver ? 2 : 1}
        facilities={facilities}
      />
      {withDriver ? <WithDriverFormComponent /> : <WithoutDriverForm />}
    </View>
  );
};

export default memo(DailyForm);
