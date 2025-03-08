import Button from 'components/Button';
import DatePickerComponent from 'components/DatePicker/DatePicker';
import DropdownLocation from 'components/DropdownLocation/DropdwonLocation';
import i18next from 'i18next';
import moment from 'moment';
import React, {FC, memo, useCallback} from 'react';
import ReactNativeModernDatepicker from 'react-native-modern-datepicker';
import RentalDurationInput from 'components/HomeComponent/CarSearchForm/partials/RentalDurationInput';
import RentalStartTimeInput from 'components/HomeComponent/CarSearchForm/partials/RentalStartTimeInput';
import useDailyCarSearchForm from 'screens/DailyListCarScreen/hooks/useDailyCarSearchForm';
import {getIndonesianTimeZoneName} from 'utils';
import {h1, h3} from 'utils/styles';
import {IRentalLocationResult} from 'types/rental-location.types';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {StyleSheet, Text, View} from 'react-native';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';

const WithDriverForm: FC<{reset?: boolean}> = () => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const {data: rentalLocationData} = useAppSelector(rentalLocationState);

  const {form, setForm, formError, setFormError, handleSearch} =
    useDailyCarSearchForm({withDriver: true});

  const handleSelectLocation = useCallback(
    (v: IRentalLocationResult) => {
      setForm(prev => ({...prev, location: v}));
      setFormError(prev => ({...prev, error_location: ''}));
    },
    [setForm, setFormError],
  );

  const handleDateChange = useCallback(
    (v: string) => {
      setTimeout(() => {
        dispatch(toggleBSheet(false));
      }, 200);
      setForm(prev => ({...prev, tanggal_sewa: v, jam_sewa: ''}));
      setFormError(prev => ({...prev, error_tanggal_sewa: ''}));
    },
    [dispatch, setForm, setFormError],
  );

  return (
    <View>
      <View style={styles.row}>
        <DropdownLocation
          containerStyle={styles.halfWidth}
          onSelect={handleSelectLocation}
          selected={form.location}
          errorMessage={formError.error_location}
          placeholder={`${t('Home.daily.placeholder_location')}`}
          data={rentalLocationData}
        />
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
              <Text style={[h1, styles.datePickerTitle]}>
                {t('Home.daily.rent_start_date')}
              </Text>
              <ReactNativeModernDatepicker
                style={styles.datePicker}
                isMandarin={i18next.language === 'cn'}
                minimumDate={moment().add(5, 'days').format('YYYY-MM-DD')}
                selected={form?.tanggal_sewa?.replace(/\//g, '-')}
                current={form?.tanggal_sewa?.replace(/\//g, '-')}
                onDateChange={handleDateChange}
                mode={'calendar'}
              />
            </View>
          }
          errorMessage={formError.error_tanggal_sewa}
        />
      </View>
      <Text style={[h3, styles.textInfo]}>{t('Home.daily.date_info_12')}</Text>
      <View style={styles.timeContainer}>
        <RentalDurationInput
          form={form}
          formError={formError}
          setForm={setForm}
          setFormError={setFormError}
        />
        <RentalStartTimeInput
          form={form}
          setForm={setForm}
          formError={formError}
          setFormError={setFormError}
          onClear={() =>
            setForm(prev => ({
              ...prev,
              jam_sewa: '',
              jam_pengembalian: '',
            }))
          }
        />
      </View>
      <Text style={[h3, styles.textInfo]}>
        {t('Home.daily.end_time_24_hours', {
          value: form?.location?.time_zone
            ? `- ${getIndonesianTimeZoneName({
                timezone: form?.location?.time_zone,
                lang: i18next.language,
              } as any)}`
            : '',
        })}
      </Text>
      <Button
        _theme="orange"
        title={t('Home.daily.btn_search')}
        onPress={handleSearch}
        styleWrapper={styles.buttonWrapper}
      />
    </View>
  );
};

export default memo(WithDriverForm);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  datePickerTitle: {
    marginLeft: 16,
    fontSize: 18,
  },
  datePicker: {
    width: WINDOW_WIDTH,
  },
  timeContainer: {
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
  buttonWrapper: {
    marginTop: 40,
  },
});
