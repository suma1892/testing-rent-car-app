import Button from 'components/Button';
import DatePickerComponent from 'components/DatePicker/DatePicker';
import DropdwonLocation from 'components/DropdownLocation/DropdwonLocation';
import moment from 'moment';
import React, {memo, useCallback} from 'react';
import ReactNativeModernDatepicker from 'react-native-modern-datepicker';
import RentalEndTimeInput from 'components/HomeComponent/CarSearchForm/partials/RentalEndTimeInput';
import RentalStartTimeInput from 'components/HomeComponent/CarSearchForm/partials/RentalStartTimeInput';
import useDailyCarSearchForm from 'screens/DailyListCarScreen/hooks/useDailyCarSearchForm';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {calculateDateDifference} from 'utils/functions';
import {differenceInDays} from 'date-fns';
import {h1, h3, h5} from 'utils/styles';
import {IRentalLocationResult} from 'types/rental-location.types';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppSelector} from 'redux/hooks';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';
import {
  rentalLocationState,
  setRentalLocationParams,
} from 'redux/features/rentalLocation/rentalLocationSlice';
import i18next from 'i18next';

const WithoutDriverForm = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {data: rentalLocationData} = useAppSelector(rentalLocationState);
  const {form, setForm, formError, setFormError, handleSearch} =
    useDailyCarSearchForm({withDriver: false});
  const {services} = useAppSelector(rentalLocationState);

  const handleSelectLocation = useCallback(
    (v: IRentalLocationResult) => {
      setForm(prev => ({...prev, location: v}));

      setFormError(prev => ({...prev, error_location: ''}));
    },
    [setForm, setFormError],
  );

  const handleDateChange = (
    v: string,
    field: 'tanggal_sewa' | 'tanggal_pengembalian',
  ) => {
    setTimeout(() => {
      dispatch(toggleBSheet({content: <View />, show: false}));
    }, 200);

    if (field === 'tanggal_sewa') {
      const dateDiff = differenceInDays(
        new Date(v.replace(/\//g, '-')),
        new Date(form.tanggal_pengembalian?.replace(/\//g, '-')),
      );

      if (!isNaN(dateDiff) && dateDiff > 0) {
        setForm({
          ...form,
          tanggal_sewa: v,
          tanggal_pengembalian: '',
          jam_sewa: '',
          jam_pengembalian: '',
        });
      } else {
        setForm({...form, tanggal_sewa: v, jam_sewa: '', jam_pengembalian: ''});
      }
      setFormError(prev => ({...prev, error_tanggal_sewa: ''}));
    } else {
      setForm({...form, tanggal_pengembalian: v});
      setFormError(prev => ({...prev, error_tanggal_pengembalian: ''}));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const findData = services
        ?.find(x => x?.name === 'Sewa Mobil')
        ?.sub_services?.find(x => x?.name === 'Daily');
      dispatch(
        setRentalLocationParams({
          sub_service_id: findData?.id,
          facility_id: findData?.facilities?.find(
            x => x?.name === 'Without Driver',
          )?.id,
        }),
      );
    }, []),
  );

  return (
    <View>
      <DropdwonLocation
        onSelect={handleSelectLocation}
        selected={form.location}
        errorMessage={formError.error_location}
        placeholder={`${t('Home.daily.placeholder_location')}`}
        data={rentalLocationData}
      />
      <View style={styles.dateContainer}>
        <DatePickerComponent
          mode="date"
          placeholder={t('Home.daily.select_date')}
          title={t('Home.daily.rent_start_date')}
          containerStyle={styles.halfWidth}
          value={form.tanggal_sewa ?? ''}
          snapPoint={['60%', '60%']}
          onClear={() =>
            setForm(prev => ({
              ...prev,
              tanggal_sewa: '',
              tanggal_pengembalian: '',
            }))
          }
          content={
            <View>
              <Text style={[h1, styles.dateTitle]}>
                {t('Home.daily.rent_start_date')}
              </Text>
              <ReactNativeModernDatepicker
                style={{width: WINDOW_WIDTH}}
                isMandarin={i18next.language === 'cn'}
                minimumDate={moment().add(2, 'days').format('YYYY-MM-DD')}
                current={form?.tanggal_sewa?.replace(/\//g, '-')}
                selected={form?.tanggal_sewa?.replace(/\//g, '-')}
                onDateChange={v => handleDateChange(v, 'tanggal_sewa')}
                mode="calendar"
              />
            </View>
          }
          errorMessage={formError.error_tanggal_sewa}
        />
        <DatePickerComponent
          mode="date"
          placeholder={t('Home.daily.select_date')}
          title={t('Home.daily.rent_end_date')}
          containerStyle={styles.halfWidth}
          value={form.tanggal_pengembalian ?? ''}
          snapPoint={['60%', '60%']}
          onClear={() => setForm(prev => ({...prev, tanggal_pengembalian: ''}))}
          content={
            <View>
              <Text style={[h1, styles.dateTitle]}>
                {t('Home.daily.rent_end_date')}
              </Text>
              <ReactNativeModernDatepicker
                style={{width: WINDOW_WIDTH}}
                isMandarin={i18next.language === 'cn'}
                current={
                  form?.tanggal_pengembalian?.replace(/\//g, '-') ||
                  form?.tanggal_sewa?.replace(/\//g, '-')
                }
                minimumDate={
                  form.tanggal_sewa
                    ? moment(form.tanggal_sewa.replace(/\//g, '-'))
                        .add(1, 'day')
                        .format('YYYY-MM-DD')
                    : undefined
                }
                selected={form?.tanggal_pengembalian?.replace(/\//g, '-')}
                onDateChange={v => handleDateChange(v, 'tanggal_pengembalian')}
                mode="calendar"
              />
            </View>
          }
          errorMessage={formError.error_tanggal_pengembalian}
          disabled={!form.tanggal_sewa}
        />
        {form.tanggal_sewa && form.tanggal_pengembalian && (
          <View style={styles.dateDiffContainer}>
            <Text style={[h5, styles.dateDiff]}>
              {calculateDateDifference({
                firstDate: form.tanggal_sewa,
                secondDate: form.tanggal_pengembalian,
              })}
            </Text>
          </View>
        )}
      </View>
      <Text style={[h3, styles.textInfo]}>
        {t('Home.daily.format_time_24_hours', {
          value: form?.location?.time_zone
            ? `- ${form?.location?.time_zone}`
            : '',
        })}
      </Text>
      <View style={styles.timeContainer}>
        <RentalStartTimeInput
          title={t('Home.daily.rent_start_time') as any}
          form={form}
          setForm={setForm}
          formError={formError}
          setFormError={setFormError}
          onClear={() =>
            setForm(prev => ({...prev, jam_sewa: '', jam_pengembalian: ''}))
          }
          disabled={!form.tanggal_sewa || !form.tanggal_pengembalian}
        />
        <RentalEndTimeInput
          form={form}
          setForm={setForm}
          formError={formError}
          title={t('Home.daily.rent_end_time') as any}
          setFormError={setFormError}
          onClear={() => setForm(prev => ({...prev, jam_pengembalian: ''}))}
        />
      </View>
      <Text style={[h3, styles.textInfo]}>
        {t('Home.daily.end_time_24_hours', {
          value: form?.location?.time_zone
            ? `- ${form?.location?.time_zone}`
            : '',
        })}
      </Text>
      <Button
        _theme="orange"
        title={t('Home.daily.btn_search')}
        onPress={handleSearch}
        styleWrapper={styles.searchButton}
      />
    </View>
  );
};

export default memo(WithoutDriverForm);

const styles = StyleSheet.create({
  dateContainer: {
    justifyContent: 'space-between',
    marginTop: 30,
    flexDirection: 'row',
  },
  halfWidth: {
    width: '49%',
  },
  dateTitle: {
    marginLeft: 16,
    fontSize: 18,
  },
  dateDiffContainer: {
    position: 'absolute',
    width: 72,
    height: 17,
    backgroundColor: '#F1A33A',
    borderRadius: 16,
    top: 70,
    left: '40%',
  },
  dateDiff: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.white,
  },
  timeContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 30,
    flexDirection: 'row',
  },
  textInfo: {
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  searchButton: {
    marginTop: 40,
  },
});
