/* eslint-disable react-hooks/exhaustive-deps */
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import {AIRPORT_LOCATION_DEFAULT} from 'utils/constants';
import {IAirportLocationResult} from 'types/rental-location.types';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  appDataState,
  reseFormAirportTransfer,
  resetFormDaily,
  saveFormAirportTransfer,
  setFacilityType,
  setServiceType,
  setSubServiceType,
} from 'redux/features/appData/appDataSlice';
import {
  getAirportLocation,
  getAirportLocationZone,
} from 'redux/features/rentalLocation/rentalLocationAPI';

export type IForm = {
  pickup_location: IAirportLocationResult;
  dropoff_location: IAirportLocationResult;
  pickup_date: string;
  pickup_time: string;
  is_switched: boolean;
  phone: string;
  wa: string;
  wa_code: string;
  code: string;
};

export type IFormError = {
  error_pickup_location: string;
  error_dropoff_location: string;
  error_pickup_date: string;
  error_pickup_time: string;
};

type UseAirportCarSearchFormProps = {
  reset: boolean;
};

const useAirportCarSearchForm = ({
  reset = true,
}: UseAirportCarSearchFormProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const {formAirportTransfer, sub_service_type} = useAppSelector(appDataState);
  const {rentalLocationParams} = useAppSelector(rentalLocationState);
const {userProfile, isLoading: userProfileLoading} =
    useAppSelector(appDataState);

  const [form, setForm] = useState<IForm>({
    pickup_location: AIRPORT_LOCATION_DEFAULT,
    dropoff_location: AIRPORT_LOCATION_DEFAULT,
    pickup_date: '',
    pickup_time: '',
    is_switched: true,
  });

  const [formError, setFormError] = useState<IFormError>({
    error_pickup_location: '',
    error_dropoff_location: '',
    error_pickup_date: '',
    error_pickup_time: '',
  });

  useEffect(() => {
    if (sub_service_type === 'Airport Transfer') {
      dispatch(getAirportLocation({}));
      dispatch(getAirportLocationZone({}));
    }
  }, [sub_service_type]);

  useEffect(() => {
    if (isFocused && reset) {
      console.log('is reset');
      setForm({
        pickup_location: AIRPORT_LOCATION_DEFAULT,
        dropoff_location: AIRPORT_LOCATION_DEFAULT,
        pickup_date: '',
        pickup_time: '',
        is_switched: true,
      });
      dispatch(reseFormAirportTransfer());
    }

    if (isFocused && !reset) {
      console.log('is filled ', userProfile);
      setForm({
        pickup_location: formAirportTransfer.pickup_location,
        dropoff_location: formAirportTransfer.dropoff_location,
        pickup_date: formAirportTransfer.pickup_date,
        pickup_time: formAirportTransfer.pickup_time,
        is_switched: formAirportTransfer.is_switched,
        phone: userProfile?.phone,
        wa: userProfile?.wa_number,
        wa_code: userProfile?.phone_code,
        code: userProfile?.phone_code
      });
    }
  }, [isFocused]);

  const handleSearch = () => {
    const _errorMessage: any = {};
    let status = true;
    if (!form?.pickup_location?.name) {
      _errorMessage['error_pickup_location'] = t('Home.daily.error_location');
      status = false;
    }

    if (!form?.dropoff_location?.name) {
      _errorMessage['error_dropoff_location'] = t('Home.daily.error_location');
      status = false;
    }

    if (!form?.pickup_date) {
      _errorMessage['error_pickup_date'] = t('Home.daily.error_rent_date');
      status = false;
    }

    if (!form?.pickup_time) {
      _errorMessage['error_pickup_time'] = t('Home.daily.error_rent_time');
      status = false;
    }

    setFormError({..._errorMessage});

    if (!status) return;
    searchAirportTransfer();
  };

  const searchAirportTransfer = async () => {
    try {
      console.log('form?.pickup_location ', form?.pickup_location);
      dispatch(
        saveFormAirportTransfer({
          ...formAirportTransfer,
          pickup_location: form?.pickup_location,
          dropoff_location: form?.dropoff_location,
          pickup_date: `${moment(form?.pickup_date, 'YYYY/MM/DD')
            .format('YYYY-MM-DD')
            .toString()}`,
          pickup_time: `${
            form.pickup_time.slice(0, form.pickup_time.length / 2) +
            ':' +
            form.pickup_time.slice(-form.pickup_time.length / 2)
          }`,
          price_sort: 'asc',
          page: 1,
          limit: 10,
          passanger: 4,
          sub_service_id: rentalLocationParams?.sub_service_id,
          is_switched: form.is_switched,
        }),
      );
      dispatch(setServiceType('Sewa Mobil'));
      dispatch(setSubServiceType('Airport Transfer'));
      dispatch(setFacilityType(''));

      // console.log(
      //   'form?.pickup_location?.location?.name = ',
      //   form?.pickup_location?.location?.name,
      // );
      if (form?.pickup_location?.location?.is_special_airport_transfer) {
        navigation.navigate('OrderDetailAirportTransfer');
      } else {
        navigation.navigate('AirportListCar');
      }

      await analytics().logEvent('search_airport_transfer', {
        id: new Date().toString(),
        item: 'Daily',
        description: ['airport transfer'],
        location: form?.pickup_location?.name,
        location_id: form?.pickup_location?.location_id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    form,
    setForm,
    formError,
    setFormError,
    handleSearch,
  };
};

export default useAirportCarSearchForm;
