/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import OvertimeModalContent from 'components/OvertimeModalContent/OvertimeModalContent';
import {calculateDateDifference} from 'utils/functions';
import {IRentalLocationResult} from 'types/rental-location.types';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  appDataState,
  saveFormDaily,
  setFacilityType,
  setServiceType,
  setSubServiceType,
} from 'redux/features/appData/appDataSlice';

export type IForm = {
  location: IRentalLocationResult;
  tanggal_sewa: string;
  tanggal_pengembalian: string;
  jam_sewa: string;
  jam_pengembalian: string;
};

export type IFormError = {
  error_location: string;
  error_tanggal_sewa: string;
  error_tanggal_pengembalian: string;
  error_jam_sewa: string;
  error_jam_pengembalian: string;
};

type UseDailyCarSearchFormProps = {
  withDriver: boolean;
};

const useDailyCarSearchForm = ({withDriver}: UseDailyCarSearchFormProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {formDaily, sub_service_type} = useAppSelector(appDataState);
  const {
    data: rentalLocationData,
    isLoading: loadingRentalLocation,
    rentalLocationParams,
  } = useAppSelector(rentalLocationState);

  const [form, setForm] = useState<IForm>({
    location: {
      id: 0,
      name: '',
      time_zone: '',
      time_zone_identifier: '',
      // currency: null,
    },
    tanggal_sewa: '',
    tanggal_pengembalian: '',
    jam_sewa: '',
    jam_pengembalian: '',
  });

  const [formError, setFormError] = useState<IFormError>({
    error_location: '',
    error_tanggal_sewa: '',
    error_tanggal_pengembalian: '',
    error_jam_sewa: '',
    error_jam_pengembalian: '',
  });

  useEffect(() => {
    if (!loadingRentalLocation) {
      const tanggalPengembalian =
        sub_service_type === 'Daily' &&
        !withDriver &&
        formDaily.start_booking_date === formDaily.end_booking_date
          ? moment(formDaily.end_booking_date.replace(/\//g, '-'))
              .add(1, 'day')
              .format('YYYY-MM-DD')
          : formDaily.end_booking_date;

      let jamPengembalian = formDaily.end_booking_time;
      if (formDaily.with_driver && !withDriver) {
        jamPengembalian = formDaily.start_booking_time;
      }

      const selectedLocation = rentalLocationData.find(
        rentalLocation => rentalLocation.id === formDaily.selected_location?.id,
      );

      setForm(prev => ({
        ...prev,
        location: {
          id: selectedLocation?.id || 0,
          name: selectedLocation?.name || '',
          time_zone: selectedLocation?.time_zone || '',
          time_zone_identifier: selectedLocation?.time_zone_identifier || '',
          // currency: selectedLocation?.currency || null,
        },
        tanggal_sewa: formDaily.start_booking_date,
        tanggal_pengembalian: tanggalPengembalian,
        jam_sewa: formDaily.start_booking_time,
        jam_pengembalian: jamPengembalian,
      }));
    }
  }, [loadingRentalLocation]);

  const handleSearch = () => {
    const _errorMessage: any = {};
    let status = true;

    if (!form?.location?.name) {
      _errorMessage['error_location'] = t('Home.daily.error_location');
      showToast({
        message: _errorMessage['error_location'],
        type: 'warning',
        title: t('global.alert.warning'),
      });
      status = false;
    }
    if (!form?.tanggal_sewa) {
      _errorMessage['error_tanggal_sewa'] = t('Home.daily.error_rent_date');
      showToast({
        message: _errorMessage['error_tanggal_sewa'],
        type: 'warning',
        title: t('global.alert.warning'),
      });
      status = false;
    }
    if (!form?.tanggal_pengembalian) {
      _errorMessage['error_tanggal_pengembalian'] = t(
        'Home.daily.error_rent_date',
      );
      showToast({
        message: _errorMessage['error_tanggal_pengembalian'],
        type: 'warning',
        title: t('global.alert.warning'),
      });
      status = false;
    }

    if (!form?.jam_pengembalian) {
      _errorMessage['error_jam_pengembalian'] = t('Home.daily.error_rent_time');
      showToast({
        message: _errorMessage['error_jam_pengembalian'],
        type: 'warning',
        title: t('global.alert.warning'),
      });
      status = false;
    }
    if (!form?.jam_sewa) {
      _errorMessage['error_jam_sewa'] = t('Home.daily.error_rent_time');
      showToast({
        message: _errorMessage['error_jam_sewa'],
        type: 'warning',
        title: t('global.alert.warning'),
      });
      status = false;
    }

    if (formError?.error_jam_pengembalian && !withDriver) {
      status = false;
      return;
    }
    setFormError({..._errorMessage});

    if (!status) {
      return;
    }

    if (withDriver) {
      searchWithDriver();
      return;
    }

    if (!withDriver) {
      const jamSewa = moment(form.jam_sewa, 'HH:mm');
      const jamPengembalian = moment(form.jam_pengembalian, 'HH:mm');
      const overtime = jamPengembalian.diff(jamSewa, 'minute');

      if (overtime > 0) {
        showBSheet({
          content: (
            <OvertimeModalContent
              onSubmit={() => {
                searchWithoutDriver();
                dispatch(toggleBSheet(false));
              }}
              onCancel={() => {
                dispatch(toggleBSheet(false));
              }}
            />
          ),
          snapPoint: ['70%', '70%'],
        });
      } else {
        searchWithoutDriver();
      }
    }
  };

  const searchWithDriver = () => {
    let endTime: string | any = moment(form?.jam_sewa, 'HHmm')
      .add(12, 'hour')
      .format('HH:mm')
      .toString(); // '22:00';

    if (
      parseInt(
        moment(form?.jam_sewa, 'HHmm').format('HH:mm')?.split(':')?.[0],
      ) >= 10
    ) {
      endTime = '22:00';
    }

    endTime = moment(endTime, 'HH:mm').format('HH:mm');

    const actualTime = parseInt(
      form.jam_sewa.slice(0, form.jam_sewa.length / 2),
    );
    const endDate = moment(form.tanggal_sewa, 'YYYY-MM-DD')
      .add(actualTime, 'h')
      .add(formDaily?.duration - 1, 'd')
      .format('YYYY-MM-DD');

    const dateDiff = calculateDateDifference({
      firstDate: form.tanggal_sewa,
      secondDate: form.tanggal_pengembalian,
      withDriver: true,
    });
    const dateDiffSplit = dateDiff?.split(' ')?.[0];
    const duration =
      Number(dateDiffSplit?.split(' ')?.[0]) === 0 ? 1 : dateDiffSplit;
    // const duration = formDaily?.duration;

    dispatch(
      saveFormDaily({
        ...formDaily,
        limit: 10,
        location: form?.location?.name,
        location_id: form?.location?.id,
        start_booking_date: `${moment(form?.tanggal_sewa, 'YYYY/MM/DD')
          .format('YYYY-MM-DD')
          .toString()}`,
        end_booking_date: endDate,
        start_trip: `${form?.tanggal_sewa?.replace(/\//g, '-')} ${
          form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
          ':' +
          form.jam_sewa.slice(-form.jam_sewa.length / 2)
        }`,
        end_trip: `${endDate?.replace(/\//g, '-')} ${endTime}`,
        passanger: 4,
        price_sort: 'asc',
        page: 1,
        start_booking_time: `${
          form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
          ':' +
          form.jam_sewa.slice(-form.jam_sewa.length / 2)
        }`,
        end_booking_time: endTime,
        with_driver: withDriver,
        need_update: !formDaily?.need_update,
        selected_location: form?.location,
        duration,
        sub_service_id: rentalLocationParams?.sub_service_id,
        facility_id: rentalLocationParams?.facility_id,
        refresh_data: !formDaily?.refresh_data,
      }),
    );
    dispatch(setServiceType('Sewa Mobil'));
    dispatch(setSubServiceType('Daily'));
    dispatch(setFacilityType('With Driver'));

    navigation.navigate('DailyListCar');
  };

  const searchWithoutDriver = () => {
    dispatch(
      saveFormDaily({
        ...formDaily,
        limit: 10,
        location: form?.location?.name,
        location_id: form?.location?.id,
        start_booking_date: `${moment(form?.tanggal_sewa, 'YYYY/MM/DD')
          .format('YYYY-MM-DD')
          .toString()}`,
        end_booking_date: `${moment(form?.tanggal_pengembalian, 'YYYY/MM/DD')
          .format('YYYY-MM-DD')
          .toString()}`,
        start_trip: `${form?.tanggal_sewa?.replace(/\//g, '-')} ${
          form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
          ':' +
          form.jam_sewa.slice(-form.jam_sewa.length / 2)
        }`,
        end_trip: `${form?.tanggal_pengembalian?.replace(/\//g, '-')} ${
          form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
          ':' +
          form.jam_sewa.slice(-form.jam_sewa.length / 2)
        }`,
        passanger: 4,
        price_sort: 'asc',
        page: 1,
        start_booking_time: `${
          form.jam_sewa.slice(0, form.jam_sewa.length / 2) +
          ':' +
          form.jam_sewa.slice(-form.jam_sewa.length / 2)
        }`,
        end_booking_time: `${
          form.jam_pengembalian.slice(0, form.jam_pengembalian.length / 2) +
          ':' +
          form.jam_pengembalian.slice(-form.jam_pengembalian.length / 2)
        }`,
        with_driver: withDriver,
        need_update: !formDaily?.need_update,
        selected_location: form?.location,
        sub_service_id: rentalLocationParams?.sub_service_id,
        facility_id: rentalLocationParams?.facility_id,
        refresh_data: !formDaily?.refresh_data,
        duration: 0,
      }),
    );
    dispatch(setServiceType('Sewa Mobil'));
    dispatch(setSubServiceType('Daily'));
    dispatch(setFacilityType('Without Driver'));

    navigation.navigate('DailyListCar');
  };

  return {
    form,
    setForm,
    formError,
    setFormError,
    handleSearch,
  };
};

export default useDailyCarSearchForm;
